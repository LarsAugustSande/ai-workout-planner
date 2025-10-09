import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestionCircle, FaChevronDown, FaBrain, FaUtensils, FaLock, FaDumbbell, FaChartLine, FaMobileAlt } from 'react-icons/fa';
import './FAQ.css';

function FAQ({ onBack }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: 'Generelt',
      icon: <FaQuestionCircle />,
      color: 'var(--primary)',
      questions: [
        {
          question: 'Hva er Trenly?',
          answer: 'Trenly er en avansert nettbasert plattform som bruker kunstig intelligens til å skape personlige trenings- og kostholdsplaner. Vi analyserer dine mål, nivå, tilgjengelig utstyr og eventuelle begrensninger for å generere skreddersydde planer som passer perfekt for deg.'
        },
        {
          question: 'Hvordan fungerer AI-en?',
          answer: 'Vår AI bruker OpenAI\'s GPT-4o-mini modell, som er trent på omfattende data om trening, ernæring og kroppsbygging. Den analyserer informasjonen du gir og genererer planer basert på beprøvde treningsprinsipper og ernæringsvitenskap. AI-en tar hensyn til din alder, vekt, høyde, fitnessnivå, mål og eventuelle skader.'
        },
        {
          question: 'Er tjenesten gratis?',
          answer: 'Ja! Trenly er for øyeblikket gratis å bruke. Du får tilgang til alle hovedfunksjonene inkludert treningsplangenerering, kostholdsplanlegging, progresjonssporing og BMI-kalkulator uten kostnad.'
        },
        {
          question: 'Må jeg registrere meg?',
          answer: 'For å bruke de grunnleggende funksjonene trenger du ikke å registrere deg. Du kan generere treningsplaner direkte. Men hvis du ønsker å lagre planene dine og spore fremgang over tid, anbefaler vi at du oppretter en konto.'
        }
      ]
    },
    {
      category: 'Treningsplaner',
      icon: <FaDumbbell />,
      color: 'var(--secondary)',
      questions: [
        {
          question: 'Hvor lang tid tar det å generere en treningsplan?',
          answer: 'Det tar vanligvis 10-30 sekunder å generere en komplett treningsplan. Tiden kan variere avhengig av kompleksiteten i planen og hvor mange dager du velger.'
        },
        {
          question: 'Kan jeg endre treningsplanen min?',
          answer: 'Ja! Du kan enkelt foreslå endringer til planen din ved å bruke "Foreslå endringer"-funksjonen. Beskriv hva du ønsker å endre, så vil AI-en oppdatere planen i henhold til dine ønsker. Du kan be om å bytte ut øvelser, justere volum, legge til mer fokus på spesifikke muskelgrupper osv.'
        },
        {
          question: 'Hvilke treningssplitter er tilgjengelige?',
          answer: 'Vi tilbyr flere populære treningssplitter: Push/Pull/Legs (PPL), Upper/Lower, Full Body, Bro Split, og tilpassede splits. AI-en kan også anbefale den beste splitten for deg basert på dine mål, erfaring og antall treningsdager per uke.'
        },
        {
          question: 'Kan jeg trene hjemme uten utstyr?',
          answer: 'Absolutt! Velg "Minimalt (kroppsvekt)" under utstyr, så vil AI-en generere en plan basert kun på kroppsvektøvelser. Dette er perfekt for hjemmetrening eller når du er på reise.'
        },
        {
          question: 'Hvordan håndterer AI-en skader?',
          answer: 'Når du beskriver skader eller begrensninger, vil AI-en unngå øvelser som kan forverre problemet og foreslå sikre alternativer. For eksempel, hvis du har kneproblemer, vil den unngå tunge squats og foreslå knevennlige alternativer. Konsulter alltid lege ved alvorlige skader.'
        },
        {
          question: 'Kan jeg laste ned treningsplanen min?',
          answer: 'Ja! Du kan laste ned planen din som en profesjonell PDF-fil ved å klikke på "Last ned PDF"-knappen. PDF-en inneholder hele planen med alle øvelser, sets, reps og tips.'
        }
      ]
    },
    {
      category: 'Kostholdsplaner',
      icon: <FaUtensils />,
      color: 'var(--accent)',
      questions: [
        {
          question: 'Hvordan beregnes kaloribehovet mitt?',
          answer: 'Vi bruker Harris-Benedict-formelen for å beregne din BMR (Basal Metabolic Rate), som deretter justeres basert på aktivitetsnivå for å finne din TDEE (Total Daily Energy Expenditure). Kaloriinntaket justeres deretter basert på målet ditt (vekttap, muskelvekst, vedlikehold).'
        },
        {
          question: 'Kan jeg få vegetariske eller veganske måltidsplaner?',
          answer: 'Ja! I kostholdsplanleggeren kan du spesifisere dine kostpreferanser, inkludert vegetarisk, vegansk, ketogen, lavkarbo, etc. AI-en vil generere måltider som passer dine preferanser.'
        },
        {
          question: 'Hva med matallergier?',
          answer: 'Du kan spesifisere allergier og matintoleranse (f.eks. laktose, gluten, nøtter), og AI-en vil unngå disse ingrediensene i måltidsplanen din. Sikkerhet og helse er vår høyeste prioritet.'
        },
        {
          question: 'Hvor mange måltider per dag får jeg?',
          answer: 'Kostholdsplanen inkluderer typisk 3 hovedmåltider (frokost, lunsj, middag) og 2-3 snacks per dag. Du kan tilpasse antall måltider basert på dine preferanser.'
        },
        {
          question: 'Kan jeg endre makrofordelingen?',
          answer: 'Ja! Selv om AI-en foreslår en optimal makrofordeling basert på målet ditt, kan du justere protein-, karbohydrat- og fettinntak etter eget ønske.'
        }
      ]
    },
    {
      category: 'Progresjon og Sporing',
      icon: <FaChartLine />,
      color: 'var(--tertiary)',
      questions: [
        {
          question: 'Hvordan sporer jeg fremgangen min?',
          answer: 'Progresjonsporingsfunksjonen lar deg logge treningsøkter, vekt, målinger og styrkenivåer. Du kan se detaljerte grafer og analyser av fremgangen din over tid.'
        },
        {
          question: 'Hvor ofte bør jeg oppdatere fremgangen min?',
          answer: 'Vi anbefaler å logge hver treningsøkt og veie deg 1-2 ganger per uke. For målinger (omkrets av armer, ben, midje, etc.), er en gang per måned tilstrekkelig for å spore endringer.'
        },
        {
          question: 'Kan AI-en gi meg råd basert på fremgangen min?',
          answer: 'Ja! Basert på dataene dine kan AI-en identifisere trender og gi personlige anbefalinger. For eksempel, hvis fremgangen stagnerer, kan den foreslå justeringer i trening eller kosthold.'
        }
      ]
    },
    {
      category: 'Sikkerhet og Personvern',
      icon: <FaLock />,
      color: 'var(--primary-dark)',
      questions: [
        {
          question: 'Er mine data sikre?',
          answer: 'Ja! Vi tar datasikkerhet svært alvorlig. All dataoverføring er kryptert med SSL/TLS, og vi følger GDPR-retningslinjer. Vi selger eller deler aldri dine personopplysninger med tredjeparter for markedsføringsformål.'
        },
        {
          question: 'Hva gjør dere med treningsdataene mine?',
          answer: 'Treningsdataene dine brukes kun til å generere personlige planer og forbedre tjenesten. Vi kan bruke anonymiserte og aggregerte data for å forbedre AI-modellene våre, men ingen personlig identifiserbar informasjon deles.'
        },
        {
          question: 'Kan jeg slette kontoen min?',
          answer: 'Ja, du kan når som helst slette kontoen din. Alle dine personopplysninger vil bli permanent slettet innen 30 dager i henhold til GDPR-regelverket.'
        },
        {
          question: 'Bruker dere informasjonen min til å trene AI-modellene?',
          answer: 'Vi bruker OpenAI\'s API, og i henhold til deres policy brukes ikke data sendt via API til å trene modellene deres. Dine data forblir private.'
        }
      ]
    },
    {
      category: 'Teknisk Support',
      icon: <FaMobileAlt />,
      color: 'var(--secondary-light)',
      questions: [
        {
          question: 'Hvilke nettlesere støttes?',
          answer: 'AI Treningsplanlegger fungerer best på moderne nettlesere som Chrome, Firefox, Safari og Edge. Vi anbefaler å bruke siste versjon for best ytelse.'
        },
        {
          question: 'Fungerer tjenesten på mobil?',
          answer: 'Ja! Vår tjeneste er fullt responsiv og fungerer utmerket på mobil, nettbrett og desktop. Du kan generere og se treningsplaner på farten.'
        },
        {
          question: 'Treningsplanen min genereres ikke, hva gjør jeg?',
          answer: 'Først, sjekk at backend-serveren kjører (vanligvis på localhost:5001). Hvis problemet vedvarer, prøv å oppdatere siden eller kontakt support på support@trenly.no.'
        },
        {
          question: 'Kan jeg bruke tjenesten offline?',
          answer: 'For øyeblikket krever generering av planer internettforbindelse siden vi bruker OpenAI\'s API. Men når en plan er generert, kan du laste den ned som PDF og se den offline.'
        },
        {
          question: 'Hvordan kontakter jeg support?',
          answer: 'Du kan kontakte oss via e-post på support@trenly.no eller bruke kontaktskjemaet på Kontakt-siden. Vi svarer vanligvis innen 24 timer.'
        }
      ]
    },
    {
      category: 'AI og Teknologi',
      icon: <FaBrain />,
      color: 'var(--primary-light)',
      questions: [
        {
          question: 'Hvilken AI-modell bruker dere?',
          answer: 'Vi bruker OpenAI\'s GPT-4o-mini, en av de mest avanserte språkmodellene tilgjengelig. Denne modellen er optimalisert for rask respons og høy kvalitet.'
        },
        {
          question: 'Kan AI-en erstatte en personlig trener?',
          answer: 'AI-en er et kraftig verktøy, men den erstatter ikke en kvalifisert personlig trener helt. Den gir utmerkede generelle planer basert på beprøvde prinsipper, men en menneskelig trener kan gi personlig veiledning, motivasjon og on-the-spot korreksjoner som AI ikke kan.'
        },
        {
          question: 'Hvordan sikrer dere kvaliteten på planene?',
          answer: 'Vi bruker nøye utformede prompts basert på treningsvitenskap og ernæringsprinsipper. Planene følger progressive overbelastningsprinsipper, balansert muskelutvikling og sikre treningsmetoder. Vi oppdaterer kontinuerlig systemet basert på tilbakemeldinger.'
        },
        {
          question: 'Blir AI-en bedre over tid?',
          answer: 'Ja! Vi analyserer tilbakemeldinger og justerer våre AI-prompts for å kontinuerlig forbedre kvaliteten på trenings- og kostholdsplanene. Jo mer vi lærer om brukerens behov, jo bedre blir systemet.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-container">
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="faq-header-icon">
            <FaQuestionCircle />
          </div>
          <h1>Ofte stilte spørsmål</h1>
          <p>Finn svar på vanlige spørsmål om Trenly</p>
        </motion.div>

        <div className="faq-content">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="faq-category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <div className="category-header" style={{ '--category-color': category.color }}>
                <div className="category-icon">
                  {category.icon}
                </div>
                <h2>{category.category}</h2>
              </div>

              <div className="questions-list">
                {category.questions.map((item, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <motion.div
                      key={questionIndex}
                      className={`faq-item ${isOpen ? 'open' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: questionIndex * 0.05 }}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      >
                        <span>{item.question}</span>
                        <motion.div
                          className="faq-icon"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaChevronDown />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className="faq-answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="answer-content">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="faq-contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3>Fant du ikke svaret du lette etter?</h3>
          <p>Vi hjelper deg gjerne! Ta kontakt med oss så svarer vi så raskt som mulig.</p>
          <motion.a
            href="mailto:support@trenly.no"
            className="contact-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Kontakt Support
          </motion.a>
        </motion.div>

        {onBack && (
          <motion.button
            className="back-button"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tilbake
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default FAQ;

