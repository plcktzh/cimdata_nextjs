import type { Event, Venue, Category } from "@prisma/client";
import Link from "next/link";
import slug from "slug";

type Props = Event & { venue: Venue } & { category: Category[] };
export default function EventTeaser({
  id,
  name,
  date,
  description,
  venue,
  category,
}: Props) {
  const eventSlug = slug(name);

  return (
    <article>
      <h2>
        <Link href={`/events/${eventSlug}-${id}`}>{name}</Link>
      </h2>

      {description && <p>{description}</p>}

      <dl>
        <dt>Datum</dt>
        <dd>
          <time dateTime={date.toISOString().substring(0, 10)}>
            {date.toLocaleDateString("de")}
          </time>
        </dd>

        <dt>Veranstaltungsort</dt>
        <dd>{venue.name}</dd>
        {category.length > 0 && (
          <>
            <dt>{category.length < 2 ? "Kategorie" : "Kategorien"}</dt>
            <dd>{category.map((cat) => cat.name).join(", ")}</dd>
          </>
        )}
      </dl>
    </article>
  );
}
