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

  // CRITICAL: Add paragraph breaks FIRST (before adding spaces)
  // Simple strategy: ANY sentence ending (. ? !) followed directly by capital letter = new paragraph

  // Catch ALL cases: period/question/exclamation + capital letter + any lowercase
  // This catches ".Hvor", "?Du", "!Vi", ".Lars" etc.
  // Changed from {2,} to + to catch even short words like "Du"
  cleaned = cleaned.replace(/([.?!])([A-ZÆØÅ][a-zæøå]+)/g, '$1\n\n$2');

  // NOW add spaces after punctuation (for any remaining cases that didn't get paragraph breaks)
  cleaned = cleaned.replace(/\.(?!\n)\s*([A-ZÆØÅ])/g, '. $1');
  cleaned = cleaned.replace(/\?(?!\n)\s*([A-ZÆØÅ])/g, '? $1');
  cleaned = cleaned.replace(/!(?!\n)\s*([A-ZÆØÅ])/g, '! $1');

  // Add space after period/question/exclamation if followed by lowercase
  cleaned = cleaned.replace(/\.([a-zæøå])/g, '. $1');
  cleaned = cleaned.replace(/\?([a-zæøå])/g, '? $1');
  cleaned = cleaned.replace(/!([a-zæøå])/g, '! $1');

  // Fix number spacing - but preserve phone numbers
  // First, protect phone numbers temporarily
  const phonePattern = /\+47\s*\d{3}\s*\d{2}\s*\d{3}/g;
  const phones: string[] = [];
  cleaned = cleaned.replace(phonePattern, (match) => {
    phones.push(match);
    return `__PHONE_${phones.length - 1}__`;
  });

  // Now fix number spacing for ranges like "i 15-20"
  cleaned = cleaned.replace(/\b([a-zæøå])\s*(\d)/gi, '$1 $2'); // letter+number
  cleaned = cleaned.replace(/(\d)\s*([a-zæøå])\b/gi, '$1 $2'); // number+letter (but not in phone)

  // Restore phone numbers
  phones.forEach((phone, i) => {
    cleaned = cleaned.replace(`__PHONE_${i}__`, phone);
  });

  // Fix phone numbers - ensure spacing around emoji and format
  cleaned = cleaned.replace(/📞\s*\+?(\d+)/g, '📞 +$1');
  cleaned = cleaned.replace(/\+(\d{2})\s*(\d{3})\s*(\d{2})\s*(\d{3})/g, '+$1 $2 $3 $4');

  // Add space after comma if missing
  cleaned = cleaned.replace(/,([^\s])/g, ', $1');

  // Clean up extra whitespace (but keep double newlines for paragraphs)
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
- ALLTID ALLTID ha MELLOMROM etter punktum før ny setning
- ALLTID ha mellomrom etter komma
- Eksempel RIKTIG: "hodet. Ryggsmerter kan" (MELLOMROM etter punktum)
- Eksempel FEIL: "hodet.Ryggsmerter kan" (mangler mellomrom)
- Eksempel RIKTIG: "i 15-20 minutter. Det" (MELLOMROM etter punktum)
- Eksempel FEIL: "i15-20 minutter.Det" (mangler mellomrom)
- Eksempel RIKTIG: "på 📞 +47 400 95 900" (mellomrom rundt emoji)
- Bruk alltid linjeskift mellom de 3 avsnittene
- KRITISK: Punktum må ALLTID følges av mellomrom før neste ord

DU KAN HJELPE MED:
- Spørsmål om smerter og plager (rygg, nakke, skulder, kne, etc.)
- Informasjon om behandlingsmetoder (kiropraktikk, massasje, laser, PEMF, etc.)
- Generelle helsespørsmål relatert til muskel- og skjelettplager
- Råd om trening, øvelser og forebygging
- Booking og praktisk informasjon om klinikken
- Forklare forskningsbasert kunnskap på en forståelig måte

SVARSTRUKTUR - TILPASS TIL SITUASJONEN:

1. HVIS spørsmålet er VAGT eller mangler detaljer (f.eks. bare "ryggsmerter", "vondt i nakken"):

   OBLIGATORISK STRUKTUR (2 avsnitt):

   Første avsnitt: "Jeg forstår at du har [problem]. Hos Kiropraktisk Senter kan vi hjelpe deg med [behandling]. [Spesialist-navn] har spesialkompetanse på akkurat dette."
   Eksempel: "Jeg forstår at du har ryggsmerter. Hos Kiropraktisk Senter kan vi hjelpe deg med kiropraktisk behandling, massasje og avansert utstyr som laser og PEMF. Lars Martin Holthe har over 7 års erfaring med ryggplager og idrettsskader."

   Andre avsnitt: Still 2-3 oppfølgingsspørsmål
   - Hvor lenge har du hatt dette?
   - Hva utløser smertene?
   - Hvor vondt er det på en skala fra 1 til 10?
   - Hva gjør det bedre eller verre?

   VIKTIG: ALLTID avslutt med relevant artikkellenke i formatet [ARTICLE:id:title:url]
   Eksempel for rygg: [ARTICLE:rygg:Ryggsmerter:/behandlinger/rygg]
   Eksempel for nakke: [ARTICLE:nakke:Nakkesmerter:/behandlinger/nakke]
   Eksempel for skulder: [ARTICLE:skulder:Skuldersmerter:/behandlinger/skulder]

2. HVIS spørsmålet er SPESIFIKT med detaljer (f.eks. "akutt ryggsmerter etter løft, stråler ned i benet"):
   - Gi 3 avsnitt med konkret hjelp:

   Første avsnitt: Praktiske råd pasienten kan gjøre NÅ (2-3 setninger om øyeblikkelig selvhjelp). Husk MELLOMROM etter punktum.

   Andre avsnitt: Forklar årsak og mekanisme (2-3 setninger med forskningsbasert kunnskap). Husk MELLOMROM etter punktum.

   Tredje avsnitt: Anbefaling om profesjonell hjelp og kontaktinfo 📞 +47 400 95 900 (1-2 setninger). Husk MELLOMROM etter punktum.

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
        // Log cleaned response for monitoring
        console.log('AI Response:', cleanResponse(text).substring(0, 150) + '...');
      }
    });

    // Transform the stream to clean the text
    const stream = result.toTextStreamResponse();

    // Read the full response first, clean it, then send
    const response = await stream;
    const reader = response.body?.getReader();
    let fullText = '';

    if (reader) {
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }
    }

    // Clean the complete response
    const cleanedText = cleanResponse(fullText);

    // Return as plain text
    return new Response(cleanedText, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Kiro KI error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
