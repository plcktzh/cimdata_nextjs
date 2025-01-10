import EventTeaser from "@/components/Events/EventTeaser";
import prisma from "@/prisma/db";
import type { Metadata } from "next";
import slug from "slug";

type Props = {
  params: Promise<{ slugId: string }>;
};

export default async function EventPage({ params }: Props) {
  const { slugId } = await params;
  const slugIdSplit = slugId.split("-").toReversed();
  const id = parseInt(slugIdSplit[0]);

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      venue: true,
      category: true,
    },
  });

  if (!event) return;

  const otherEventsInVenue = await prisma.event.findMany({
    where: { venueId: event.venueId, id: { not: event.id } },
    include: { venue: true, category: true },
  });

  return (
    <div>
      <header>
        <h1>{event.name}</h1>
      </header>
      {event.description && <p>{event.description}</p>}

      <dl>
        <dt>Datum</dt>
        <dd>
          <time dateTime={event.date.toISOString().substring(0, 10)}>
            {event.date.toLocaleDateString("de")}
          </time>
        </dd>

        <dt>Veranstaltungsort</dt>
        <dd>{event.venue.name}</dd>
        {event.category.length > 0 && (
          <>
            <dt>{event.category.length < 2 ? "Kategorie" : "Kategorien"}</dt>
            <dd>{event.category.map((cat) => cat.name).join(", ")}</dd>
          </>
        )}
      </dl>
      {otherEventsInVenue.length > 0 && (
        <>
          <h3>Programm für {event.venue.name}</h3>
          {otherEventsInVenue.map((otherEvent) => (
            <EventTeaser key={otherEvent.id} {...otherEvent} />
          ))}
          w{" "}
        </>
      )}
    </div>
  );
}

/* Dynamisch den Titel in Metadaten einfügen */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugId } = await params;
  const slugIdSplit = slugId.split("-").toReversed();
  const id = parseInt(slugIdSplit[0]);

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      venue: true,
      category: true,
    },
  });

  if (!event) return { title: "Event" };

  return {
    title: event.name,
  };
}

export async function generateStaticParams() {
  const events = await prisma.event.findMany({
    include: {
      venue: true,
      category: true,
    },
  });

  return events.map(({ id, name }) => ({
    slugId: `${slug(name)}-${id}`,
  }));
}
