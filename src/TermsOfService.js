import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './LegalPages.css';

function TermsOfService({ onBack }) {
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
            <FaFileContract />
          </div>
          <h1>Vilkår for bruk</h1>
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
              <FaCheckCircle />
            </div>
            <h2>1. Aksept av vilkår</h2>
            <p>
              Velkommen til Trenly ("Tjenesten"). Ved å bruke vår tjeneste, godtar du å være 
              bundet av disse vilkårene for bruk ("Vilkårene"). Les dem nøye før du bruker tjenesten.
            </p>
            <p>
              Hvis du ikke godtar disse vilkårene, vennligst ikke bruk tjenesten.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Beskrivelse av tjenesten</h2>
            <p>
              Trenly er en nettbasert plattform som bruker kunstig intelligens til å 
              generere personlige treningsplaner, kostholdsplaner og progresjonssporing basert på 
              brukerens mål, nivå og preferanser.
            </p>
            <p>Tjenesten inkluderer:</p>
            <ul>
              <li>AI-genererte treningsplaner</li>
              <li>Personlige kostholdsplaner</li>
              <li>Progresjonssporing og analyse</li>
              <li>BMI-kalkulator</li>
              <li>Bevegelsesanalyse med computer vision</li>
            </ul>
          </section>

          <section className="legal-section">
            <div className="section-icon">
              <FaExclamationTriangle />
            </div>
            <h2>3. Medisinske ansvarsfraskrivelser</h2>
            <div className="warning-box">
              <strong>VIKTIG MEDISINSK ANSVARSFRASKRIVELSE:</strong>
              <p>
                Informasjonen og rådene som gis av Trenly er kun ment som generell veiledning 
                og skal IKKE erstatte profesjonell medisinsk, ernæringsmessig eller treningsrelatert rådgivning.
              </p>
            </div>
            <ul>
              <li>Tjenesten er ikke ment å diagnostisere, behandle, kurere eller forebygge noen sykdom</li>
              <li>Rådfør deg alltid med lege før du starter et nytt treningsprogram</li>
              <li>Hvis du har eksisterende helseplager eller skader, søk profesjonell medisinsk rådgivning</li>
              <li>Stopp umiddelbart hvis du opplever smerte, ubehag eller uvanlige symptomer</li>
              <li>Vi er ikke ansvarlige for skader som oppstår fra bruk av tjenesten</li>
            </ul>
            <div className="info-box">
              <strong>Konsulter en profesjonell hvis:</strong>
              <ul>
                <li>Du har kroniske helseplager</li>
                <li>Du er gravid eller ammer</li>
                <li>Du tar reseptbelagte medisiner</li>
                <li>Du har hjerteproblemer eller høyt blodtrykk</li>
                <li>Du har diabetes eller andre metabolske lidelser</li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Brukerkontoer og ansvar</h2>
            <h3>4.1 Kontoooprettelse</h3>
            <ul>
              <li>Du må være minst 16 år for å bruke tjenesten</li>
              <li>Du må gi nøyaktig og fullstendig informasjon</li>
              <li>Du er ansvarlig for å holde passordet ditt sikkert</li>
              <li>Du er ansvarlig for all aktivitet på din konto</li>
            </ul>

            <h3>4.2 Forbudt bruk</h3>
            <p>Du samtykker i å IKKE:</p>
            <ul>
              <li>Bruke tjenesten til ulovlige formål</li>
              <li>Dele eller videredistribuere innhold uten tillatelse</li>
              <li>Forsøke å få uautorisert tilgang til systemene våre</li>
              <li>Laste opp virus, skadelig kode eller lignende</li>
              <li>Trakassere, misbruke eller skade andre brukere</li>
              <li>Gi falsk eller villedende informasjon</li>
              <li>Bruke automatiserte systemer for å få tilgang til tjenesten</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Immaterielle rettigheter</h2>
            <p>
              Alt innhold i tjenesten, inkludert tekst, grafikk, logoer, ikoner, bilder, lydklipp, 
              videoklipp og programvare, er eid av AI Treningsplanlegger eller våre lisensgivere og 
              er beskyttet av norske og internasjonale opphavsrettslover.
            </p>
            <h3>5.1 Ditt innhold</h3>
            <ul>
              <li>Du beholder opphavsrett til innholdet du laster opp</li>
              <li>Ved å laste opp innhold, gir du oss en ikke-eksklusiv lisens til å bruke det</li>
              <li>Du garanterer at du har rett til å dele innholdet</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. AI-generert innhold</h2>
            <p>
              Trenings- og kostholdsplanene generert av vår AI-teknologi er basert på informasjonen 
              du gir og generelle treningsprinsipper. Merk at:
            </p>
            <ul>
              <li>AI-generert innhold kan inneholde feil eller unøyaktigheter</li>
              <li>Planene er generelle og kanskje ikke optimale for alle individer</li>
              <li>Vi garanterer ikke spesifikke resultater fra å følge planene</li>
              <li>Du bør tilpasse planene til dine egne behov og begrensninger</li>
            </ul>
          </section>

          <section className="legal-section">
            <div className="section-icon">
              <FaTimesCircle />
            </div>
            <h2>7. Ansvarsbegrensning</h2>
            <div className="warning-box">
              <strong>VIKTIG:</strong> Les dette nøye.
            </div>
            <p>
              I den utstrekning loven tillater, skal Trenly ikke holdes ansvarlig for:
            </p>
            <ul>
              <li>Skader eller tap som følge av bruk av tjenesten</li>
              <li>Tap av data eller innhold</li>
              <li>Forretningsavbrudd eller tap av inntekter</li>
              <li>Indirekte, tilfeldige eller følgeskader</li>
              <li>Feil eller mangler i AI-generert innhold</li>
              <li>Utilgjengelighet av tjenesten</li>
            </ul>
            <p>
              Ditt eneste og eksklusive rettsmiddel for utilfredshet med tjenesten er å slutte å bruke den.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Tjenestens tilgjengelighet</h2>
            <p>Vi streber etter å holde tjenesten tilgjengelig 24/7, men vi garanterer ikke:</p>
            <ul>
              <li>Kontinuerlig, uavbrutt tilgang</li>
              <li>At tjenesten er fri for feil eller bugs</li>
              <li>At defekter vil bli rettet</li>
            </ul>
            <p>
              Vi forbeholder oss retten til å modifisere, suspendere eller avslutte tjenesten når som helst 
              uten forvarsel.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Priser og betalinger</h2>
            <p>Tjenesten kan inneholde:</p>
            <ul>
              <li><strong>Gratis funksjoner:</strong> Tilgjengelig for alle brukere</li>
              <li><strong>Premium funksjoner:</strong> Krever betaling (hvis implementert)</li>
            </ul>
            <p>
              Alle priser er i norske kroner (NOK) og inkluderer MVA. Vi forbeholder oss retten til å 
              endre priser når som helst.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Oppsigelse</h2>
            <h3>10.1 Din oppsigelse</h3>
            <p>Du kan når som helst avslutte kontoen din ved å:</p>
            <ul>
              <li>Kontakte support@trenly.no</li>
              <li>Slette kontoen din gjennom innstillinger (hvis tilgjengelig)</li>
            </ul>

            <h3>10.2 Vår oppsigelse</h3>
            <p>Vi kan suspendere eller avslutte din konto hvis:</p>
            <ul>
              <li>Du bryter disse vilkårene</li>
              <li>Vi mistenker misbruk eller ulovlig aktivitet</li>
              <li>Det er nødvendig for å beskytte tjenesten eller andre brukere</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>11. Endringer i vilkårene</h2>
            <p>
              Vi kan oppdatere disse vilkårene fra tid til annen. Vi vil varsle deg om vesentlige endringer 
              ved å publisere de nye vilkårene på denne siden. Din fortsatte bruk av tjenesten etter 
              endringer betyr at du aksepterer de nye vilkårene.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Gjeldende lov og jurisdiksjon</h2>
            <p>
              Disse vilkårene reguleres av norsk lov. Eventuelle tvister skal løses i norske domstoler.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Kontakt</h2>
            <p>Hvis du har spørsmål om disse vilkårene, kan du kontakte oss:</p>
            <div className="contact-info">
              <p><strong>E-post:</strong> support@trenly.no</p>
              <p><strong>Adresse:</strong> Trenly AS, Oslo, Norge</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>14. Diverse</h2>
            <ul>
              <li><strong>Fullstendig avtale:</strong> Disse vilkårene utgjør den fullstendige avtalen mellom deg og oss</li>
              <li><strong>Delbarhet:</strong> Hvis noen del av vilkårene er ugyldige, forblir resten gyldig</li>
              <li><strong>Ikke-fraskrivelse:</strong> Vår manglende håndhevelse av en bestemmelse betyr ikke at vi fraskriver oss den</li>
              <li><strong>Overdragelse:</strong> Du kan ikke overføre disse vilkårene til andre uten vårt samtykke</li>
            </ul>
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

export default TermsOfService;

