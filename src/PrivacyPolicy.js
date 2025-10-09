import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserSecret, FaCookie, FaDatabase, FaEnvelope } from 'react-icons/fa';
import './LegalPages.css';

function PrivacyPolicy({ onBack }) {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <motion.div
          className="legal-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="legal-icon">
            <FaShieldAlt />
          </div>
          <h1>Personvernerklæring</h1>
          <p className="legal-updated">Sist oppdatert: {new Date().toLocaleDateString('no-NO')}</p>
        </motion.div>

        <motion.div
          className="legal-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <section className="legal-section">
            <div className="section-icon">
              <FaLock />
            </div>
            <h2>1. Innledning</h2>
            <p>
              Velkommen til Trenly. Vi tar ditt personvern på alvor og er forpliktet til å beskytte dine personopplysninger. 
              Denne personvernerklæringen forklarer hvordan vi samler inn, bruker, deler og beskytter informasjonen din.
            </p>
            <p>
              Ved å bruke vår tjeneste, samtykker du til innsamling og bruk av informasjon i henhold til denne policyen.
            </p>
          </section>

          <section className="legal-section">
            <div className="section-icon">
              <FaDatabase />
            </div>
            <h2>2. Informasjon vi samler inn</h2>
            <h3>2.1 Informasjon du gir oss</h3>
            <ul>
              <li><strong>Personlig informasjon:</strong> Navn, e-postadresse, alder, kjønn</li>
              <li><strong>Helseinformasjon:</strong> Vekt, høyde, fitnessnivå, treningsmål, skader og begrensninger</li>
              <li><strong>Treningsdata:</strong> Treningsplaner, kostholdsplaner, progresjonsdata</li>
              <li><strong>Brukerinnhold:</strong> Kommentarer, tilbakemeldinger og annen informasjon du deler</li>
            </ul>

            <h3>2.2 Informasjon vi samler automatisk</h3>
            <ul>
              <li><strong>Bruksdata:</strong> Hvordan du bruker tjenesten vår, funksjoner du benytter</li>
              <li><strong>Enhetsdata:</strong> Enhetsinformasjon, nettlesertype, IP-adresse</li>
              <li><strong>Cookies og sporingsteknikker:</strong> Vi bruker cookies for å forbedre din opplevelse</li>
            </ul>
          </section>

          <section className="legal-section">
            <div className="section-icon">
              <FaUserSecret />
            </div>
            <h2>3. Hvordan vi bruker informasjonen din</h2>
            <p>Vi bruker informasjonen din til følgende formål:</p>
            <ul>
              <li><strong>Tjenesteleveranse:</strong> For å generere personlige trenings- og kostholdsplaner</li>
              <li><strong>Kommunikasjon:</strong> For å svare på dine henvendelser og gi support</li>
              <li><strong>Forbedringer:</strong> For å forbedre og utvikle våre tjenester</li>
              <li><strong>Sikkerhet:</strong> For å beskytte mot svindel og misbruk</li>
              <li><strong>AI-trening:</strong> For å forbedre våre AI-modeller (anonymisert data)</li>
              <li><strong>Analyse:</strong> For å forstå hvordan tjenesten brukes</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Deling av informasjon</h2>
            <p>Vi selger eller leier ikke ut dine personopplysninger. Vi kan dele informasjon med:</p>
            <ul>
              <li><strong>Tjenesteleverandører:</strong> OpenAI for AI-generering (behandles konfidensielt)</li>
              <li><strong>Juridiske krav:</strong> Når loven krever det</li>
              <li><strong>Forretningsoverføringer:</strong> Ved fusjon eller oppkjøp</li>
            </ul>
            <div className="info-box">
              <strong>Viktig:</strong> Vi bruker OpenAI's API for å generere treningsplaner. OpenAI behandler data 
              i henhold til deres personvernpolicy, og data brukes ikke til å trene deres modeller.
            </div>
          </section>

          <section className="legal-section">
            <div className="section-icon">
              <FaCookie />
            </div>
            <h2>5. Cookies og sporingsteknologier</h2>
            <p>Vi bruker cookies og lignende teknologier for å:</p>
            <ul>
              <li>Holde deg innlogget</li>
              <li>Huske dine preferanser</li>
              <li>Analysere bruk av tjenesten</li>
              <li>Forbedre brukeropplevelsen</li>
            </ul>
            <p>
              Du kan kontrollere cookies gjennom nettleserinnstillingene dine, men vær oppmerksom på at 
              noen funksjoner kanskje ikke fungerer uten cookies.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Datasikkerhet</h2>
            <p>Vi tar datasikkerhet på alvor og implementerer følgende tiltak:</p>
            <ul>
              <li>Kryptert dataoverføring (SSL/TLS)</li>
              <li>Sikker lagring av data</li>
              <li>Regelmessige sikkerhetsvurderinger</li>
              <li>Begrenset tilgang til personopplysninger</li>
              <li>Sikkerhetskopier og redundans</li>
            </ul>
            <div className="warning-box">
              <strong>Merk:</strong> Ingen overføring over internett er 100% sikker. Vi kan ikke garantere 
              absolutt sikkerhet, men vi gjør vårt beste for å beskytte dine data.
            </div>
          </section>

          <section className="legal-section">
            <h2>7. Dine rettigheter (GDPR)</h2>
            <p>I henhold til GDPR har du følgende rettigheter:</p>
            <ul>
              <li><strong>Rett til innsyn:</strong> Du kan be om en kopi av dine personopplysninger</li>
              <li><strong>Rett til retting:</strong> Du kan be om at uriktig informasjon rettes</li>
              <li><strong>Rett til sletting:</strong> Du kan be om at dine data slettes</li>
              <li><strong>Rett til begrensning:</strong> Du kan be om begrensning av behandling</li>
              <li><strong>Rett til dataportabilitet:</strong> Du kan få dine data i et strukturert format</li>
              <li><strong>Rett til å protestere:</strong> Du kan protestere mot behandling av dine data</li>
              <li><strong>Rett til å trekke tilbake samtykke:</strong> Du kan når som helst trekke tilbake samtykke</li>
            </ul>
            <p>
              For å utøve disse rettighetene, kontakt oss på: <strong>support@trenly.no</strong>
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Datalagring</h2>
            <p>
              Vi lagrer dine personopplysninger så lenge det er nødvendig for å levere tjenesten og oppfylle 
              juridiske forpliktelser. Når du sletter kontoen din, vil vi slette eller anonymisere dine data 
              innen 30 dager, med mindre vi er lovpålagt å beholde dem lengre.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Barn</h2>
            <p>
              Vår tjeneste er ikke rettet mot personer under 16 år. Vi samler ikke bevisst inn personopplysninger 
              fra barn under 16 år. Hvis du er forelder eller verge og oppdager at ditt barn har gitt oss 
              personopplysninger, vennligst kontakt oss.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Internasjonale overføringer</h2>
            <p>
              Dine data kan overføres til og lagres på servere utenfor Norge/EU, inkludert USA (OpenAI). 
              Vi sikrer at slike overføringer skjer i samsvar med gjeldende personvernlovgivning og at 
              mottakere har tilstrekkelige sikkerhetstiltak.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Endringer i personvernerklæringen</h2>
            <p>
              Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vi vil varsle deg om 
              vesentlige endringer ved å publisere den nye erklæringen på denne siden og oppdatere 
              datoen øverst. Vi oppfordrer deg til å gjennomgå denne erklæringen regelmessig.
            </p>
          </section>

          <section className="legal-section">
            <div className="section-icon">
              <FaEnvelope />
            </div>
            <h2>12. Kontakt oss</h2>
            <p>Hvis du har spørsmål om denne personvernerklæringen, kan du kontakte oss:</p>
            <div className="contact-info">
              <p><strong>E-post:</strong> support@trenly.no</p>
              <p><strong>Adresse:</strong> Trenly AS, Oslo, Norge</p>
            </div>
          </section>
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

export default PrivacyPolicy;

