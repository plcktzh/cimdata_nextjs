import EventTeaser from "@/components/Events/EventTeaser";
import prisma from "@/prisma/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veranstaltungen",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      venue: true,
      category: true,
    },
  });

  return (
    <>
      <h1>Veranstaltungen</h1>
      {events.map((event) => (
        <EventTeaser key={event.id} {...event} />
      ))}
    </>
  );
}

/* Bonus für Einzelansicht: Unter der Überschrift "Programm {Name des Veranstaltungsortes}" für jede
        	weiter Veranstaltung eine EventTeaser-Komponente darstellen, falls es
        	mindestens eine weitere Veranstaltung gibt. Die zur aktuellen Seite
        	gehörende Veranstaltung soll nicht angezeigt werden. */
