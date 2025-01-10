import PendingSignatures from "@/components/Petition/PendingSignatures";
import PetitionForm from "@/components/Petition/PetitionForm";
import saveTheWhales from "@/img/save-the-whales.jpg";
import prisma from "@/prisma/db";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/* Pages erhalten automatisch ein Objekt searchParams als Prop */
type Props = {
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
};

const defaultPerPage = 1;

export const metadata: Metadata = {
  title: "🐳 Rettet die Wale - Jetzt unterschreiben!",
};

export default async function PetitionPage({ searchParams }: Props) {
  /* Setzt eine Pagination um. Standardmäßig sollen z.B. nur die ersten 2
	Unterschriften angezeigt werden. Aber über den Search-Parameter page
	soll die Seite konfigurierbar sein, mit dem Parameter perPage soll man
	angeben können, dass mehr Unterschriften pro Seite sichtbar sind.
	Versucht möglichst, ungültige oder extreme Werte für page und perPage
	zu vermeiden. 
	*/
  const { page, perPage } = await searchParams;

  /* Nutzt die Methode count von prisma, um die Anzahl der approved
	Unterschriften in die Variable totalSignatures zu speichern. */
  const totalSignatures = await prisma.signature.count({
    where: { approved: true },
  });

  const currentPerPage =
    Math.min(Math.max(parseInt(perPage), defaultPerPage), 100) ||
    defaultPerPage;
  const totalPages = Math.ceil(totalSignatures / currentPerPage);
  const currentPage = Math.min(Math.max(parseInt(page), 1), totalPages) || 1;

  /* Die Ergebnisse sollen in anderer Reihenfolge aus der Datenbank kommen, älteste
Unterschriften zuerst. Zuerst alle genehmigten Unterschriften anzeigen, danach
die Argumente für Pagination ergänzen. */
  const signatures = await prisma.signature.findMany({
    where: { approved: true },
    orderBy: { date: "asc" },
    skip: (currentPage - 1) * currentPerPage,
    take: currentPerPage,
  });

  return (
    <>
      <h1 className='petition__heading'>Rettet die Wale!</h1>
      {/* Das Bild mit Hilfe der Next Image-Komponente hier erstellen, mit den korrekten
Attributen, z.B. korrekte sizes-Angabe. Klassenname ist petition__image */}
      <Image
        src={saveTheWhales}
        alt='Rettet die Wale!'
        className='petition__image'
        sizes='(width < 32rem) 90vw, 30rem'
        placeholder='blur'
      />
      <p className='petition__intro'>
        {/* Bittet eine KI, euch einen Text mit 100 Wörtern zu generieren, der zum Thema
passt. */}
        Rettet die Wale und stürzt das System und trennt euren Müll, denn viel
        Mist ist nicht schön. Vergeudet eure Jugend und sagt nicht Neger und
        nicht Tschusch und seid ihr eures Lebens müde legt Hand an euch und
        macht Schluss.
        <br />
        Bittet selten um Verzeihung und füttert Tauben im Park. Und lasst den
        Kindern ihre Meinung oder treibt sie früher ab.
        <br />
        Und nehmt euch an den Händen und macht Liebe jeden Tag. Und rettet die
        Wale
      </p>
      <strong>Schon {totalSignatures} haben unterschrieben!</strong>
      {/* Nutzt das start-Attribut von ol, um die korrekten Nummern anzuzeigen.
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
*/}
      <ol
        className='petition__list'
        start={(currentPage - 1) * currentPerPage + 1}
      >
        {signatures.map(({ id, name, date }) => {
          return (
            <li key={id}>
              {name || "Freund*in der Wale"} (
              <time
                // dateTime={`${date.getFullYear()}-${
                //   date.getMonth() < 9
                //     ? `0${date.getMonth() + 1}`
                //     : date.getMonth() + 1
                // }-${
                //   date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
                // }`}
                dateTime={date.toISOString().substring(0, 10)}
              >
                {date.toLocaleDateString("de")}
              </time>
              )
            </li>
          );
        })}
        {/* <li>
          {
            // Hier echter Name oder als Ersatz 'Freund*in der Wale' ausgeben 
            "Freund*in der Wale"
          }{" "}
          (<time dateTime='2025-01-01'>25.1.2025</time>)
        </li> */}
      </ol>
      {/* 
			Fügt hier zwei Next-Link-Komponenten ein, mit denen man auf die jeweils nächste
			Seite navigieren kann. Der Link "Weitere" bzw. "Vorige Unterschriften" soll nur
			sichtbar sein, wenn es weitere bzw. vorige Unterschriten gibt. Die Links sollen
      auf die Petitionsseite verweisen, aber mit den passenden page und
      (falls vom Standardwert abweichend) perPage-Parametern.
			*/}
      {totalPages > 1 && (
        <nav className='petition__pagination' aria-label='Pagination'>
          {currentPage > 1 && (
            <Link
              href={`/petition/?page=${
                currentPage - 1
              }&perPage=${currentPerPage}`}
              scroll={false}
            >
              Vorige Unterschriften
            </Link>
          )}
          {currentPage < totalPages && (
            <Link
              href={`/petition/?page=${
                currentPage + 1
              }&perPage=${currentPerPage}`}
              scroll={false}
            >
              Weitere Unterschriften
            </Link>
          )}
        </nav>
      )}
      <PetitionForm />
      <PendingSignatures />
    </>
  );
}
