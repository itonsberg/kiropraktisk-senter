import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import knowledgeBase from '@/lib/knowledge-base.json';

// RAG: Find relevant content from knowledge base
function findRelevantContent(query: string): string {
  const queryLower = query.toLowerCase();
  const relevantDocs: Array<{ score: number; doc: any }> = [];

  knowledgeBase.forEach((doc: any) => {
    let score = 0;
    const docContent = `${doc.title} ${doc.content}`.toLowerCase();

    // Keyword matching
    const keywords = [
      'rygg', 'nakke', 'skulder', 'kne', 'ankel', 'fot', 'håndledd',
      'albue', 'kjeve', 'hodepine', 'smerter', 'vondt', 'plager',
      'myalgi', 'muskelsmerter', 'stiv', 'spenning'
    ];

    keywords.forEach(keyword => {
      if (queryLower.includes(keyword) && docContent.includes(keyword)) {
        score += 10;
      }
    });

    // Symptom matches
    if (doc.metadata?.symptoms) {
      doc.metadata.symptoms.forEach((symptom: string) => {
        if (queryLower.includes(symptom.toLowerCase().slice(0, 15))) {
          score += 5;
        }
      });
    }

    if (score > 0) {
      relevantDocs.push({ score, doc });
    }
  });

  // Return top 2 most relevant docs
  const topDocs = relevantDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(item => `Tittel: ${item.doc.title}\n\nInnhold:\n${item.doc.content.slice(0, 800)}\n\nURL: ${item.doc.url}`)
    .join('\n\n---\n\n');

  return topDocs || 'Ingen spesifikk informasjon funnet i databasen.';
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response('Invalid message', { status: 400 });
    }

    // Find relevant context using RAG
    const context = findRelevantContent(message);

    // Build conversation history for AI
    const messages = [
      {
        role: 'system',
        content: `Du er Kiro KI, en løsningsorientert digital assistent for Kiropraktisk Senter i Tønsberg.

SVARSTRUKTUR (følg alltid denne rekkefølgen):

1. AKUTT SELVHJELP (30-50 ord)
   - Start med øyeblikkelig hjelp pasienten kan gjøre NÅ
   - Praktiske råd basert på kunnskapsbasen
   - F.eks: hvile, is/varme, tøyninger, stillinger, aktiviteter å unngå
   - Gi konkrete "quick wins" for lindring

2. FORSTÅELSE & ÅRSAK (40-60 ord)
   - Forklar kort HVA som kan være årsaken
   - Bruk forskningsbasert kunnskap fra kunnskapsbasen
   - Beskriv mekanismen/sammenhengen
   - Gi pasienten innsikt i egen kropp

3. ANBEFALT BEHANDLER (30-40 ord)
   - Basert på symptomer, anbefal riktig person fra teamet:
     * Lars Petter Ekeland → Korsrygg, idrettsskader, langvarige smerter, holdning
     * Øyvind Martinsen → Nakke, hodepine, migrene, whiplash, kjeve (TMJ)
     * Ane Kristiansen → Myalgi, fibromyalgi, triggerpunkt, spenningshodepine, muskelterapi
     * Martin Johansen → Ekstremiteter (skulder, albue, håndledd, hofte, kne, ankel, fot)
   - Nevn spesifikke behandlingsmetoder de kan tilby
   - Oppgi booking: 📞 +47 400 95 900

TEAM-SPESIALITETER:
- Lars Petter (40+ år): Korsryggplager, idrettsskader, Shock Wave, PEMF
- Øyvind (15+ år): Nakkesmerter, hodepine/migrene, whiplash, TMJ, Low-level Laser
- Ane (10+ år): Myalgi, fibromyalgi, triggerpunkt, massasje, manuellterapi
- Martin (8+ år): Skulder, kne, ankel, fot, albue, håndledd, idrettsrehabilitering

Kunnskapsbase:
${context}

REGLER:
- Maksimalt 150 ord totalt
- Norsk språk
- Bruk emoji sparsomt (✨💡🎯)
- Gi ALDRI medisinske diagnoser
- Prioriter løsning først, deretter forståelse, til slutt booking
- Vær konkret og praktisk`,
      },
      ...(history || []).slice(-6), // Last 3 exchanges for context
      {
        role: 'user',
        content: message,
      },
    ];

    // Stream response using Vercel AI SDK
    const result = streamText({
      model: openai(process.env.AI_MODEL || 'gpt-4o-mini'),
      messages: messages as any,
      temperature: 0.7,
      maxTokens: 500,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Kiro KI error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
