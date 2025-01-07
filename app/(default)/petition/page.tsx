import saveTheWhales from '@/img/save-the-whales.jpg';
import type { Metadata } from 'next';

/* Pages erhalten automatisch ein Objekt searchParams als Prop */
type Props = {};

const defaultPerPage = 1;

export const metadata: Metadata = {
  title: '🐳 Rettet die Wale - Jetzt unterschreiben!',
};

export default async function PetitionPage() {
  /* Setzt eine Pagination um. Standardmäßig sollen z.B. nur die ersten 2
	Unterschriften angezeigt werden. Aber über den Search-Parameter page
	soll die Seite konfigurierbar sein, mit dem Parameter perPage soll man
	angeben können, dass mehr Unterschriften pro Seite sichtbar sind.
	Versucht möglichst, ungültige oder extreme Werte für page und perPage
	zu vermeiden. 
	*/

  /* Nutzt die Methode count von prisma, um die Anzahl der approved
	Unterschriften in die Variable totalSignatures zu speichern. */
  const totalSignatures = 42;

  /* Die Ergebnisse sollen in anderer Reihenfolge aus der Datenbank kommen, älteste
Unterschriften zuerst. Zuerst alle genehmigten Unterschriften anzeigen, danach
die Argumente für Pagination ergänzen. */
  const signatures = [];

  return (
    <>
      <h1 className="petition__heading">Rettet die Wale!</h1>

      {/* Das Bild mit Hilfe der Next Image-Komponente hier erstellen, mit den korrekten
Attributen, z.B. korrekte sizes-Angabe. Klassenname ist paginatin__image */}

      <p className="petition__intro">
        {/* Bittet eine KI, euch einen Text mit 100 Wörtern zu generieren, der zum Thema
passt. */}
      </p>
      <strong>Schon {totalSignatures} haben unterschrieben!</strong>

      {/* Nutzt das start-Attribut von ol, um die korrekten Nummern anzuzeigen.
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
*/}
      <ol className="petition__list">
        <li>
          {
            /* Hier echter Name oder als Ersatz 'Freund*in der Wale' ausgeben  */ 'Freund*in der Wale'
          }{' '}
          (<time dateTime="2025-01-01">25.1.2025</time>)
        </li>
      </ol>
      {/* 
			Fügt hier zwei Next-Link-Komponenten ein, mit denen man auf die jeweils nächste
			Seite navigieren kann. Der Link "Weitere" bzw. "Vorige Unterschriften" soll nur
			sichtbar sein, wenn es weitere bzw. vorige Unterschriten gibt. Die Links sollen
      auf die Petitionsseite verweisen, aber mit den passenden page und
      (falls vom Standardwert abweichend) perPage-Parametern.
			*/}

      <nav className="petition__pagination" aria-label="Pagination"></nav>
    </>
  );
}
