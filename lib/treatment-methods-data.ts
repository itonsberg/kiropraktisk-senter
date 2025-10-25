/**
 * Treatment Methods Data - Comprehensive information about each service
 * Based on client documentation from FLYTTING/tjenester
 */

export interface TreatmentMethod {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  meta: string;
  hero: {
    image: string;
    badge: string;
  };
  sections: {
    intro: {
      title: string;
      content: string[];
    };
    whatIsIt: {
      title: string;
      content: string[];
      benefits: string[];
    };
    howItWorks: {
      title: string;
      content: string[];
      steps?: string[];
    };
    benefits: {
      title: string;
      items: {
        title: string;
        description: string;
        icon: string;
      }[];
    };
    conditions: {
      title: string;
      categories: {
        name: string;
        items: string[];
      }[];
    };
    whyChoose: {
      title: string;
      content: string[];
      highlights: string[];
    };
  };
}

export const treatmentMethods: TreatmentMethod[] = [
  {
    id: "kiropraktikk",
    slug: "kiropraktikk",
    title: "Kiropraktikk",
    subtitle: "For en kropp i balanse",
    meta: "Kiropraktikk handler om å forbedre kommunikasjonen mellom hjernen og kroppen gjennom vitenskapsbasert behandling av nervesystemet.",
    hero: {
      image: "/images/treatment-back-1.jpg",
      badge: "Evidensbasert behandling siden 1981"
    },
    sections: {
      intro: {
        title: "Mer enn bare å 'rette opp ryggen'",
        content: [
          "Kiropraktikk handler ikke bare om å 'rette opp ryggen' – det handler om å forbedre kommunikasjonen mellom hjernen og kroppen, slik at du fungerer optimalt.",
          "Gjennom presis og vitenskapsbasert behandling av nervesystemet hjelper kiropraktikken kroppen til å regulere seg selv, bevege seg bedre og fungere mer effektivt."
        ]
      },
      whatIsIt: {
        title: "Hva er kiropraktikk?",
        content: [
          "Kiropraktikk er en helsefaglig profesjon som fokuserer på funksjonen i nervesystemet og bevegelsesapparatet – spesielt rygg, nakke og bekken.",
          "Når leddene i kroppen ikke beveger seg slik de skal, kan det påvirke hvordan hjernen mottar og bearbeider informasjon fra kroppen. Dette kan føre til redusert koordinasjon, smerter, spenninger og nedsatt yteevne.",
          "Gjennom kiropraktiske justeringer (også kalt spesifikke manipulasjoner) gjenopprettes normal bevegelse i leddene, noe som igjen optimaliserer signalflyten i nervesystemet. Kroppen kan da lettere regulere muskelspenninger, smerter og bevegelser på en naturlig måte."
        ],
        benefits: []
      },
      howItWorks: {
        title: "Kiropraktikk og hjernen – forskning viser vei",
        content: [
          "Nyere forskning, blant annet fra Dr. Heidi Haavik, viser at kiropraktisk behandling påvirker hjernens måte å prosessere informasjon på.",
          "Når kiropraktoren justerer et område med nedsatt funksjon, skjer det målbare endringer i hjernens aktivitet – spesielt i områder som styrer balanse, bevegelse, koordinasjon og kroppsbevissthet (propriosepsjon).",
          "Dette betyr at kiropraktikk ikke bare påvirker smerte og stivhet, men også hvordan hjernen tolker og styrer kroppen. Mange opplever derfor forbedringer i alt fra reaksjonsevne og kroppskontroll til søvn og energinivå – i tillegg til mindre smerter."
        ]
      },
      benefits: {
        title: "Fordeler med kiropraktikk",
        items: [
          {
            title: "Optimal funksjon",
            description: "Ikke bare fravær av smerte, men bedre samspill mellom hjerne og kropp",
            icon: "brain"
          },
          {
            title: "Vitenskapsbasert",
            description: "Moderne forskning viser målbare effekter på hjernens aktivitet",
            icon: "microscope"
          },
          {
            title: "Helhetlig tilnærming",
            description: "Vi ser kroppen som et system der alt henger sammen",
            icon: "heart"
          },
          {
            title: "Skreddersydd behandling",
            description: "Presis justering kombinert med råd om livsstil og øvelser",
            icon: "user"
          }
        ]
      },
      conditions: {
        title: "Hvilke plager kan kiropraktikk hjelpe med?",
        categories: [
          {
            name: "Vanlige plager",
            items: [
              "Rygg- og nakkesmerter",
              "Hodepine og migrene",
              "Spenningsplager i skuldre og kjeve",
              "Isjias og strålesmerter",
              "Svimmelhet og balanseplager",
              "Bekken- og hoftesmerter",
              "Plager etter fall, belastning eller langvarig stillesitting"
            ]
          }
        ]
      },
      whyChoose: {
        title: "Hva kan du forvente hos kiropraktoren?",
        content: [
          "Hos Kiropraktisk Senter i Tønsberg kombinerer vi moderne forskning, erfaring og et helhetlig syn på helse – slik at du kan leve i bedre balanse."
        ],
        highlights: [
          "Grundig undersøkelse – Vi kartlegger din historikk, livsstil og aktuelle plager",
          "Funksjonell testing – Vi vurderer nerve-, muskel- og leddfunksjon for å finne underliggende årsaker",
          "Tilpasset behandling – Du får presis og trygg justering kombinert med råd om bevegelighet, øvelser og livsstil",
          "Oppfølging – Vi hjelper deg å bygge varig bedre funksjon og forebygge tilbakefall"
        ]
      }
    }
  },
  {
    id: "massasje",
    slug: "massasje",
    title: "Massasje",
    subtitle: "Terapeutisk massasje for kropp og sinn",
    meta: "Profesjonell terapeutisk massasje som lindrer spenninger, reduserer smerter og fremmer restitusjon.",
    hero: {
      image: "/images/rygg-massage.jpg",
      badge: "Erfarne massører"
    },
    sections: {
      intro: {
        title: "Mer enn avslapning",
        content: [
          "Massasje er en terapeutisk behandlingsform som kombinerer avslapping med målrettet behandling av muskel- og skjelettplager.",
          "Våre erfarne massører bruker ulike teknikker for å løse opp spenninger, redusere smerter og fremme kroppens naturlige helbredelsesprosesser."
        ]
      },
      whatIsIt: {
        title: "Hva er terapeutisk massasje?",
        content: [
          "Terapeutisk massasje er en behandlingsform som fokuserer på å lindre smerter, redusere muskelspenninger og forbedre sirkulasjon og bevegelighet.",
          "I motsetning til ren avslapningsmassasje, arbeider terapeutisk massasje målrettet med spesifikke problemområder og bidrar til å gjenopprette optimal muskelfunksjon.",
          "Behandlingen kan tilpasses dine individuelle behov, enten du har akutte smerter, kroniske plager eller ønsker forebyggende behandling."
        ],
        benefits: []
      },
      howItWorks: {
        title: "Hvordan fungerer massasje?",
        content: [
          "Massasje påvirker kroppen på flere måter – både fysisk og psykisk. Gjennom ulike grep og teknikker stimuleres blodgjennomstrømning, lymfesystemet aktiveres og nervesystemet roliggjøres.",
          "Behandlingen hjelper med å løse opp triggerpunkter (knutepunkter i musklene), redusere inflammasjon og fremme tilheling av skadet vev.",
          "Regelmessig massasje kan også bidra til bedre søvnkvalitet, redusert stressnivå og økt kroppsbevissthet."
        ]
      },
      benefits: {
        title: "Fordeler med massasje",
        items: [
          {
            title: "Smertelindring",
            description: "Reduserer muskel- og leddsmerter gjennom målrettet behandling",
            icon: "heart-pulse"
          },
          {
            title: "Bedre sirkulasjon",
            description: "Øker blodgjennomstrømning og oksygentilførsel til vevene",
            icon: "activity"
          },
          {
            title: "Stressreduksjon",
            description: "Senker kortisol og fremmer produksjon av endorfiner",
            icon: "smile"
          },
          {
            title: "Økt mobilitet",
            description: "Forbedrer fleksibilitet og bevegelsesområde i ledd og muskler",
            icon: "move"
          }
        ]
      },
      conditions: {
        title: "Hvilke plager kan massasje hjelpe med?",
        categories: [
          {
            name: "Muskelspenninger og smerter",
            items: [
              "Nakke- og skulderspenninger",
              "Ryggsmerter og lumbago",
              "Muskelømhet etter trening",
              "Triggerpunkter og knutepunkter",
              "Muskelspasmer"
            ]
          },
          {
            name: "Belastnings- og idrettsskader",
            items: [
              "Myalgi (muskelsmerter)",
              "Tennisalbue og golfalbue",
              "Hamstringskader",
              "Overbelastningsskader",
              "Restitusjon etter hard trening"
            ]
          },
          {
            name: "Generelt ubehag",
            items: [
              "Hodepine og migrene",
              "Tretthet og utmattelse",
              "Dårlig søvnkvalitet",
              "Stress og angst",
              "Generell stivhet"
            ]
          }
        ]
      },
      whyChoose: {
        title: "Hvorfor velge massasje hos oss?",
        content: [
          "Våre massører har lang erfaring og bruker en kombinasjon av klassisk massasje, triggerpunktbehandling, dyptevsmassasje og muskeltøyning for å gi deg best mulig resultat.",
          "Vi jobber tett sammen med våre kiropraktorer for å sikre at du får en helhetlig behandling tilpasset dine behov."
        ],
        highlights: [
          "Erfarne autoriserte massører",
          "Skreddersydd behandling basert på dine behov",
          "Kombineres gjerne med kiropraktikk for optimal effekt",
          "Rolige og profesjonelle behandlingsrom",
          "Fleksible timer og god tilgjengelighet"
        ]
      }
    }
  },
  {
    id: "laser",
    slug: "laser",
    title: "Lavnivå Laser",
    subtitle: "Kaldlaserterapi for smertelindring og heling",
    meta: "Lavnivå laserterapi bruker spesifikke lysbølgelengder for å redusere smerte, kontrollere betennelse og akselerere helingsprosessen.",
    hero: {
      image: "/images/equipment-red-light.jpg",
      badge: "FDA-godkjent teknologi"
    },
    sections: {
      intro: {
        title: "Moderne teknologi for naturlig heling",
        content: [
          "Mange mennesker som sliter med muskelskjelettlidelser søker etter effektive, ikke-invasive løsninger for smertebehandling og rehabilitering.",
          "Lavnivå laserterapi (LLLT), også kjent som kaldlaserterapi, har vist seg å være en lovende løsning som reduserer smerte, kontrollerer betennelse og akselererer helingsprosessen i en rekke muskelskjelettlidelser."
        ]
      },
      whatIsIt: {
        title: "Hva er lavnivå laserterapi (LLLT)?",
        content: [
          "Lavnivå laserterapi er en avansert behandlingsmetode som bruker spesifikke lysbølgelengder for å stimulere vevsreparasjon og kroppens naturlige helingsprosess.",
          "I motsetning til høyintensive kirurgiske lasere, er LLLT ikke-invasiv, smertefri og krever ingen nedetid – noe som gjør den til en ideell behandlingsmetode for dem som ønsker en naturlig tilnærming til helbredelse."
        ],
        benefits: [
          "Redusert smerte og betennelse",
          "Mindre hevelse og muskelspasmer",
          "Forbedret vevsregenerering og cellefunksjon",
          "Økt bevegelighet og muskulær helse"
        ]
      },
      howItWorks: {
        title: "Hvordan fungerer kaldlaserterapi?",
        content: [
          "Under behandlingen bruker terapeuten en håndholdt kaldlaser-enhet – omtrent på størrelse med en lommelykt – som plasseres direkte over det skadede området.",
          "Avhengig av skadens størrelse og alvorlighetsgrad, leverer enheten lavintensiv lysenergi til de dypere hudlagene, som når 2 til 5 cm under overflaten."
        ],
        steps: [
          "Stimulerer cellefunksjon – Lysenergien absorberes av cellene, på samme måte som planter absorberer sollys gjennom fotosyntese",
          "Øker ATP-produksjon – Behandlingen stimulerer produksjonen av adenosintrifosfat (ATP), cellenes energikilde",
          "Reduserer betennelse og smerte – LLLT forbedrer blodsirkulasjon og oksygentilførsel, fjerner betennelsesstoffer",
          "Fremmer regenerering – Aktiverer kroppens naturlige reparasjonsmekanismer for vev, ben, nerver og muskler"
        ]
      },
      benefits: {
        title: "Fordeler med lavnivå laserterapi",
        items: [
          {
            title: "Akselererer heling",
            description: "Stimulerer cellefornyelse og vevsreparasjon for raskere restitusjon",
            icon: "zap"
          },
          {
            title: "Lindrer smerte",
            description: "Effektiv smertebehandling uten medisiner eller invasive inngrep",
            icon: "heart-pulse"
          },
          {
            title: "Ikke-invasiv",
            description: "Helt smertefri behandling uten bivirkninger eller nedetid",
            icon: "shield-check"
          },
          {
            title: "Forbedrer funksjon",
            description: "Øker leddbevegelighet, fleksibilitet og nervefunksjon",
            icon: "activity"
          }
        ]
      },
      conditions: {
        title: "Vanlige tilstander behandlet med kaldlaserterapi",
        categories: [
          {
            name: "Akutte og kroniske smerter",
            items: [
              "Korsryggsmerter og skiveprolaps",
              "Isjias og nerveskader",
              "Nakkesmerter og whiplash"
            ]
          },
          {
            name: "Idretts- og belastningsskader",
            items: [
              "Forstuing, overbelastning og belastningsskader",
              "Senebetennelse (tennisalbue, golfalbue, akillessenebetennelse)",
              "Rotatorcuff-skader og impingement-syndrom"
            ]
          },
          {
            name: "Leddgikt og leddsykdommer",
            items: [
              "Artrose (kne, hofte, ankel, skulder)",
              "Revmatoid artritt og leddbetennelse",
              "Kjeveleddsdysfunksjon (TMD)"
            ]
          },
          {
            name: "Bløtvev- og sirkulasjonsproblemer",
            items: [
              "Plantar fasciitt (hælspore)",
              "Bursitt (hofte, skulder eller kne)",
              "Lymfødem (redusert smerte og hevelse)"
            ]
          },
          {
            name: "Postoperativ rehabilitering",
            items: [
              "Ben- og nervehelbredelse",
              "Postoperativ sårheling og arrreduksjon",
              "Forbedret restitusjon etter ortopediske inngrep"
            ]
          }
        ]
      },
      whyChoose: {
        title: "Hvorfor velge kaldlaserterapi?",
        content: [
          "LLLT er en banebrytende, ikke-invasiv behandling som gir langvarig lindring av muskelskjelettsmerter og skader.",
          "Enten den brukes alene eller i kombinasjon med kiropraktikk og muskelterapi, kan denne vitenskapelig dokumenterte metoden hjelpe deg med å helbrede raskere, redusere smerte og gjenvinne smertefri bevegelse."
        ],
        highlights: [
          "Helbrede raskere etter skader",
          "Smertelindring uten medisiner",
          "Forbedre bevegelighet og redusere betennelse",
          "Støtte langvarig muskelskjeletthelse",
          "Kombineres effektivt med andre behandlingsformer"
        ]
      }
    }
  },
  {
    id: "shock-wave",
    slug: "shock-wave",
    title: "Shock Wave",
    subtitle: "Sjokkbølgebehandling for kroniske plager",
    meta: "Sjokkbølgeterapi stimulerer kroppens naturlige helingsprosess og lindrer smerte i det skadede området.",
    hero: {
      image: "/images/treatment-neck-1.jpg",
      badge: "FDA-godkjent behandling"
    },
    sections: {
      intro: {
        title: "Trygg og effektiv behandling",
        content: [
          "Har du fått en skade i sener, albue eller hamstring? Da kan det være at behandleren din anbefaler sjokkbølgebehandling.",
          "Selv om navnet kan høres dramatisk ut, er dette en trygg, ikke-invasiv behandling som stimulerer kroppens naturlige helingsprosesser og lindrer smerte – helt uten behov for kirurgi eller medisiner."
        ]
      },
      whatIsIt: {
        title: "Hva er sjokkbølgeterapi?",
        content: [
          "Sjokkbølge – også kjent som extrakorporeal sjokkbølgeterapi (ESWT) – påføres direkte på det skadede området med en liten, håndholdt enhet, lignende en ultralydprobe.",
          "Behandlingen hjelper kroppen med å reparere seg selv, stimulere nytt vev og redusere smerte ved å påvirke nerveaktiviteten i det skadede området.",
          "Til tross for navnet er behandlingen kun mildt ubehagelig for de fleste pasienter, og krever ingen nedetid."
        ],
        benefits: [
          "Tennisalbue og golfalbue",
          "Hamstringskader",
          "Plantar fasciitt (hælspore)",
          "Bursitt og senebetennelse"
        ]
      },
      howItWorks: {
        title: "Hvordan fungerer sjokkbølgeterapi?",
        content: [
          "Sjokkbølge ble utviklet i Tyskland på 1960-tallet og ble først brukt til å knuse nyrestein (lithotripsi). På 1990-tallet begynte forskere å utforske hvordan teknologien kunne hjelpe ved seneskader og muskelplager."
        ],
        steps: [
          "Pulsbølger med energi sendes med høy hastighet inn i det skadede området via en håndholdt enhet",
          "Dette øker blodsirkulasjonen, som stimulerer vevsregenerering",
          "Behandlingen bryter ned forkalkninger og arrvev",
          "Den aktiverer celler som genererer nytt ben- og bindevev",
          "Sjokkbølge overstimulerer nerveender, noe som reduserer smertefølsomheten"
        ]
      },
      benefits: {
        title: "Fordeler med sjokkbølgeterapi",
        items: [
          {
            title: "Ikke-kirurgisk",
            description: "Ingen lang rehabiliteringsperiode – fortsett daglige aktiviteter rett etter",
            icon: "shield-check"
          },
          {
            title: "Raskere heling",
            description: "Stimulerer celleregenerering og øker blodsirkulasjonen",
            icon: "zap"
          },
          {
            title: "Kostnadseffektiv",
            description: "Rimeligere alternativ til kirurgi med god effekt",
            icon: "coins"
          },
          {
            title: "Kombineres med annet",
            description: "Fungerer godt sammen med manuell behandling og øvelser",
            icon: "layers"
          }
        ]
      },
      conditions: {
        title: "Hvem bør vurdere sjokkbølgeterapi?",
        categories: [
          {
            name: "Ideell for",
            items: [
              "Idrettsutøvere som ønsker raskere restitusjon",
              "Personer med kroniske senebetennelser",
              "Pasienter med plantar fasciitt, akillessenebetennelse eller bursitt",
              "De som ønsker å unngå kirurgi eller steroideinjeksjoner",
              "Kroniske senesmerter som ikke har respondert på konservativ behandling"
            ]
          }
        ]
      },
      whyChoose: {
        title: "Er sjokkbølgeterapi riktig for deg?",
        content: [
          "Hvis du sliter med langvarig smerte, en vedvarende skade eller senebetennelse, kan sjokkbølge være en trygg og effektiv løsning.",
          "Med FDA-godkjenning og flere tiår med forskning, gir behandlingen mange pasienter en smertefri hverdag og bedre mobilitet."
        ],
        highlights: [
          "Trygg, ikke-kirurgisk behandling",
          "Vitenskapelig dokumentert for smertelindring og raskere heling",
          "Ideell for idrettsutøvere og personer med kroniske skader",
          "FDA-godkjent for flere medisinske tilstander",
          "Behandlingen starter vanligvis med 2-3 økter"
        ]
      }
    }
  },
  {
    id: "pemf",
    slug: "pemf",
    title: "PEMF",
    subtitle: "Pulserende elektromagnetisk feltterapi",
    meta: "PEMF-terapi er en ikke-invasiv metode som bruker pulser av elektromagnetisme for å redusere smerte og fremme cellereparasjon.",
    hero: {
      image: "/images/treatment-back-3.jpg",
      badge: "FDA-godkjent siden 1979"
    },
    sections: {
      intro: {
        title: "Avansert teknologi for optimal helse",
        content: [
          "PEMF (Pulsed Electromagnetic Field-terapi) er en ikke-invasiv behandling som bruker elektromagnetiske pulser for å stimulere spesifikke områder av levende vev.",
          "Ved å påvirke cellenes elektriske aktivitet kan PEMF-terapi bidra til bedre helse ved å fremme cellereparasjon, redusere betennelse og lindre smerte."
        ]
      },
      whatIsIt: {
        title: "Hva er PEMF-terapi?",
        content: [
          "Pulserende elektromagnetisk felt-terapi (PEMF) er en behandlingsform basert på elektromagnetisme, som har økt i popularitet siden FDA godkjente den for medisinsk bruk i 1979.",
          "Med sitt potensial til å redusere smerte, fremskynde helbredelse og optimalisere kroppens funksjoner, kan PEMF-terapi være en verdifull del av en helhetlig behandlingsplan."
        ],
        benefits: []
      },
      howItWorks: {
        title: "Hvordan fungerer PEMF-terapi?",
        content: [
          "PEMF-terapi bruker elektroniske matter, pads, spoiler og bærbare enheter for å sende elektromagnetiske pulser til spesifikke deler av kroppen.",
          "Disse pulsene påvirker cellenes aktivitet, noe som bidrar til kroppens naturlige helbredelsesprosesser."
        ],
        steps: [
          "Stimulerer celleproliferasjon (vekst og reproduksjon)",
          "Endrer cellemembranens struktur",
          "Regulerer cellens funksjon",
          "Påvirker cellekjernens nukleinsyrer",
          "Utløser proteinfosforylering (viktig for cellesignalering)",
          "Øker ATP-produksjonen (adenosintrifosfat), som gir cellene energi"
        ]
      },
      benefits: {
        title: "Fordeler med PEMF-terapi",
        items: [
          {
            title: "Smertereduksjon",
            description: "Reduserer akutte og kroniske smerter ved å forbedre blodsirkulasjon",
            icon: "heart-pulse"
          },
          {
            title: "Bedre søvn",
            description: "Frigjør endorfiner og regulerer nevrotransmittere som fremmer søvn",
            icon: "moon"
          },
          {
            title: "Redusert betennelse",
            description: "Modifiserer cellesignalveier og fjerner betennelsesstoffer",
            icon: "activity"
          },
          {
            title: "Mental klarhet",
            description: "Balanserer nevrotransmittere for bedre fokus og konsentrasjon",
            icon: "brain"
          },
          {
            title: "Raskere heling",
            description: "Øker blodgjennomstrømning og stimulerer cellefornyelse",
            icon: "zap"
          }
        ]
      },
      conditions: {
        title: "Bruksområder for PEMF-terapi",
        categories: [
          {
            name: "Medisinske tilstander",
            items: [
              "Benbrudd – Støtter syntesen av ekstracellulær matrise (ECM)",
              "Artrose (slitasjegikt) – Mindre smerte og økt bevegelighet",
              "Depresjon – Transkraniell PEMF-terapi",
              "Postoperativ smerte – Fremmer vevsreparasjon og raskere restitusjon",
              "Muskelskjelettsmerter – Forbedrer blodstrøm og beindannelse"
            ]
          },
          {
            name: "Idrettsprestasjon",
            items: [
              "Forbedret muskelfunksjon – Øker oksygenopptak og næringstilførsel",
              "Skadeforebygging – Reduserer betennelse og stivhet",
              "Raskere restitusjon etter trening"
            ]
          },
          {
            name: "Generell helse",
            items: [
              "Avgifte kroppen – Støtter cellens oksygenopptak",
              "Forbedre søvn – Reduserer spenninger og stress",
              "Øke energi – Stimulerer cellenes energiproduksjon"
            ]
          }
        ]
      },
      whyChoose: {
        title: "Er PEMF-terapi trygt?",
        content: [
          "Ja, PEMF-terapi er godkjent av FDA og anses som lavrisiko når det utføres av kvalifiserte fagfolk.",
          "Noen brukere rapporterer milde bivirkninger som kvalme, svimmelhet eller hodepine, men disse er sjeldne."
        ],
        highlights: [
          "FDA-godkjent siden 1979",
          "Ikke-invasiv og smertefri behandling",
          "Vitenskapelig dokumentert effekt",
          "Kombineres effektivt med andre behandlinger",
          "Minimal risiko for bivirkninger"
        ]
      }
    }
  },
  {
    id: "pmst",
    slug: "pmst",
    title: "PMST",
    subtitle: "Pulserende magnetfeltterapi",
    meta: "PMST-terapi bruker pulserende magnetfelt for å stimulere cellereparasjon og redusere betennelse.",
    hero: {
      image: "/images/treatment-neck-2.jpg",
      badge: "Avansert behandlingsteknologi"
    },
    sections: {
      intro: {
        title: "Magnetfeltterapi for optimal helse",
        content: [
          "PMST (Pulsed Magnetic Stimulation Therapy) er en avansert behandlingsform som bruker pulserende magnetfelt for å stimulere kroppens naturlige helbredelsesprosesser.",
          "Behandlingen er ikke-invasiv, smertefri og kan være et verdifullt supplement til kiropraktikk og andre behandlingsformer."
        ]
      },
      whatIsIt: {
        title: "Hva er PMST-terapi?",
        content: [
          "PMST-terapi bruker høyintensive, pulserende magnetfelt for å penetrere dypt inn i vev og stimulere cellefunksjonen.",
          "I motsetning til statiske magneter, benytter PMST dynamiske pulser som aktiverer kroppens elektro-kjemiske prosesser på cellenivå.",
          "Dette kan føre til redusert smerte, mindre betennelse og raskere tilheling av skadede vev."
        ],
        benefits: []
      },
      howItWorks: {
        title: "Hvordan fungerer PMST-terapi?",
        content: [
          "PMST-terapi leverer høyfrekvente magnetiske pulser til de berørte områdene, noe som stimulerer cellenes elektriske aktivitet.",
          "Dette øker sirkulasjonen, forbedrer oksygentilførselen til cellene og aktiverer kroppens naturlige reparasjonsmekanismer."
        ],
        steps: [
          "Magnetiske pulser penetrerer dypt inn i vevet",
          "Stimulerer cellenes elektro-kjemiske prosesser",
          "Øker blodsirkulasjon og oksygentilførsel",
          "Aktiverer kroppens naturlige helingsprosesser",
          "Reduserer betennelse og smerter"
        ]
      },
      benefits: {
        title: "Fordeler med PMST-terapi",
        items: [
          {
            title: "Dyp vevspenetrering",
            description: "Når dypere enn vanlig magnetterapi",
            icon: "layers"
          },
          {
            title: "Ikke-invasiv",
            description: "Smertefri behandling uten bivirkninger",
            icon: "shield-check"
          },
          {
            title: "Forbedret sirkulasjon",
            description: "Øker blodgjennomstrømning og oksygentilførsel",
            icon: "activity"
          },
          {
            title: "Raskere heling",
            description: "Stimulerer cellereparasjon og vevsregenerering",
            icon: "zap"
          }
        ]
      },
      conditions: {
        title: "Hvilke tilstander kan PMST hjelpe med?",
        categories: [
          {
            name: "Vanlige plager",
            items: [
              "Kroniske muskel- og skjelettsmerter",
              "Betennelsestilstander",
              "Seneskader og senebetennelse",
              "Leddgikt og artrose",
              "Nervesmerter",
              "Hevelse og ødem",
              "Muskelspasmer og kramper"
            ]
          }
        ]
      },
      whyChoose: {
        title: "Hvorfor velge PMST-terapi?",
        content: [
          "PMST-terapi er en moderne, vitenskapelig fundert behandlingsmetode som kan gi lindring for mange typer plager.",
          "Behandlingen er trygg, effektiv og kan kombineres med andre behandlingsformer for optimal effekt."
        ],
        highlights: [
          "Dyp vevspenetrering for maksimal effekt",
          "Ikke-invasiv og smertefri",
          "Ingen kjente bivirkninger",
          "Kombineres effektivt med kiropraktikk og massasje",
          "Egnet for både akutte og kroniske tilstander"
        ]
      }
    }
  }
];

export function getTreatmentMethod(slug: string): TreatmentMethod | undefined {
  return treatmentMethods.find(method => method.slug === slug);
}

export function getAllTreatmentSlugs(): string[] {
  return treatmentMethods.map(method => method.slug);
}
