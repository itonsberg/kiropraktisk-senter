import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import knowledgeBase from '@/lib/knowledge-base.json';

// Clean up response to remove formatting headers and fix spacing
function cleanResponse(text: string): string {
  // Remove markdown headers with section names
  let cleaned = text.replace(/###\s*[A-ZÆØÅ\s&]+/g, '');

  // Remove bold numbered headers like "**1. AKUTT SELVHJELP**" or "1. **AKUTT SELVHJELP**"
  cleaned = cleaned.replace(/\*?\*?\d+\.\s*\*\*[A-ZÆØÅ\s&]+\*\*\s*/g, '');

  // Remove standalone numbered headers like "1. AKUTT SELVHJELP"
  cleaned = cleaned.replace(/^\d+\.\s*[A-ZÆØÅ\s&]+\n/gm, '');

  // Remove any remaining all-caps section headers (with or without markdown)
  cleaned = cleaned.replace(/^[\*#]*\s*[A-ZÆØÅ\s&]{10,}\s*[\*#]*\n/gm, '');

  // Fix spacing issues
  // Add space after period if missing
  cleaned = cleaned.replace(/\.([A-ZÆØÅ])/g, '. $1');

  // Add space before "i" when followed by numbers (like "i15-20" -> "i 15-20")
  cleaned = cleaned.replace(/\bi(\d)/g, 'i $1');

  // Fix phone numbers - ensure spacing around emoji and after country code
  cleaned = cleaned.replace(/📞\+?(\d+)/g, '📞 +$1');
  cleaned = cleaned.replace(/\+(\d{2})(\d{8})/g, '+$1 $2'); // +47 40095900 -> +47 400 95 900
  cleaned = cleaned.replace(/(\d{3})(\d{2})(\d{3})/g, '$1 $2 $3'); // Format: XXX XX XXX

  // Add space after comma if missing
  cleaned = cleaned.replace(/,([^\s])/g, ', $1');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

// Map old URLs to new site structure
function mapToNewSiteUrl(oldUrl: string, docId: string): string {
  // Map from old WordPress URLs to new Next.js routes
  const urlMap: Record<string, string> = {
    'rygg': '/behandlinger/rygg',
    'nakke': '/behandlinger/nakke',
    'skulder': '/behandlinger/skulder',
    'kne': '/behandlinger/kne',
    'myalgi': '/behandlinger/myalgi',
    'ankel-fot': '/behandlinger/ankel-fot',
    'handledd': '/behandlinger/handledd',
    'albue': '/behandlinger/albue',
    'kjeve': '/behandlinger/kjeve',
    'hodepine': '/behandlinger/hodepine'
  };

  return urlMap[docId] || '/';
}

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

  // Return top 2 most relevant docs with NEW site URLs
  const topDocs = relevantDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(item => {
      const newUrl = mapToNewSiteUrl(item.doc.url, item.doc.id);
      return `Tittel: ${item.doc.title}\n\nInnhold:\n${item.doc.content.slice(0, 800)}\n\nURL: ${newUrl}\n\nArtikelkode for lenke: [ARTICLE:${item.doc.id}:${item.doc.title}:${newUrl}]`;
    })
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
        content: `Du er Kiro KI, en kunnskapsrik og hjelpsom digital assistent for Kiropraktisk Senter i Tønsberg.

KRITISK VIKTIG - ABSOLUTT FORBUD:
❌ ALDRI bruk overskrifter som "### ØYEBLIKKELIG HJELP", "### FORSTÅELSE", "### PROFESJONELL HJELP"
❌ ALDRI bruk nummererte seksjoner med store bokstaver
❌ ALDRI bruk markdown overskrifter (###, ##, #)
❌ ALDRI skriv "1. ØYEBLIKKELIG HJELP" eller lignende

✅ Skriv DIREKTE tekst uten overskrifter eller strukturmarkører

VIKTIG FORMATTERING - LES NØYE:
- Alltid ha MELLOMROM etter punktum, komma, tall og før nye setninger
- Eksempel RIKTIG: "i 15-20 minutter" (med mellomrom før og etter tall)
- Eksempel FEIL: "i15-20 minutter" (mangler mellomrom)
- Eksempel RIKTIG: "smertene. Ryggsmerter" (mellomrom etter punktum)
- Eksempel FEIL: "smertene.Ryggsmerter" (mangler mellomrom)
- Eksempel RIKTIG: "på 📞 +47 400 95 900" (mellomrom rundt emoji og tall)
- Eksempel FEIL: "på📞+4740095900" (mangler mellomrom)
- Bruk alltid linjeskift mellom hver av de 3 avsnittene
- Skriv naturlig og korrekt norsk med perfekt spacing
- INGEN overskrifter eller seksjonsmarkører

DU KAN HJELPE MED:
- Spørsmål om smerter og plager (rygg, nakke, skulder, kne, etc.)
- Informasjon om behandlingsmetoder (kiropraktikk, massasje, laser, PEMF, etc.)
- Generelle helsespørsmål relatert til muskel- og skjelettplager
- Råd om trening, øvelser og forebygging
- Booking og praktisk informasjon om klinikken
- Forklare forskningsbasert kunnskap på en forståelig måte

SVARSTRUKTUR FOR SMERTESPØRSMÅL (uten å skrive overskriftene):

Svar alltid med 3 korte avsnitt i denne rekkefølgen:

Første avsnitt: Praktiske råd pasienten kan gjøre NÅ (2-3 setninger om øyeblikkelig selvhjelp)

Andre avsnitt: Forklar årsak og mekanisme (2-3 setninger med forskningsbasert kunnskap)

Tredje avsnitt: Anbefaling om profesjonell hjelp og kontaktinfo: 📞 +47 400 95 900 (1-2 setninger)

Hvis relevant, avslutt med artikkellenker:
[ARTICLE:id:title:url]
Eksempel: [ARTICLE:rygg:Ryggsmerter:/behandlinger/rygg]

TEAM-SPESIALITETER:
- Lars Martin Holthe (7+ år): Ryggplager, idrettsskader, kroniske smerter, nakkesmerter, Gonstead-systemet, Carrick institute, DNALife
- Yurii Vasylets (6+ år): Bindevevsmassasje, idrettsmassasje, triggerpunkt, kinesiologi, muskelsmerter
- Kristian Santiago Ankersen: Rygg-, muskel- og leddplager, idrettsskader, prestasjonsoptimalisering, PT og massør, Helse og Treningsfysiolog
- Anniken Nordby: Booking og timebestilling (resepsjon)

Kunnskapsbase:
${context}

REGLER:
- Maksimalt 200 ord for smertespørsmål, ubegrenset for generelle spørsmål
- Perfekt norsk med korrekt formattering og mellomrom
- Bruk emoji naturlig (💡 🎯 ✨ 🏃 💪)
- Gi ALDRI medisinske diagnoser
- Vær hjelpsom, vennlig og kunnskapsrik
- Inkluder relevante artikler med [ARTICLE:id:title:url] format
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
      onFinish: async ({ text }) => {
        // Log for debugging
        console.log('AI Response:', text);
      }
    });

    // Return the text stream response directly
    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Kiro KI error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
