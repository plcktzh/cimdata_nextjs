"use client";
import type { Category, Venue } from "@prisma/client";
import { addNewEvent } from "./eventServerActions";
import SubmitButton from "../SubmitButton";
import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
type Props = {
  venues: Venue[];
  categories: Category[];
};

export default function AddEventForm({ venues, categories }: Props) {
  const [actionState, formAction] = useActionState(addNewEvent, {
    message: "",
    status: "",
    inputs: null,
    eventId: "",
  });

  const selectRef = useRef<HTMLSelectElement>(null!);

  useEffect(() => {
    if (!actionState.inputs) {
      return;
    }

    selectRef.current.value = (actionState.inputs.get("venue") as string) || "";
  }, [actionState]);

  return (
    <form className='event-form' action={formAction}>
      <div>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          name='name'
          id='name'
          minLength={2}
          maxLength={100}
          defaultValue={actionState.inputs?.get("name") as string}
        />
      </div>
      <div>
        <label htmlFor='date'>Datum</label>
        <input
          id='date'
          name='date'
          type='date'
          min={new Date(Date.now()).toISOString().substring(0, 10)}
          defaultValue={actionState.inputs?.get("date") as string}
        />
      </div>
      <div>
        <label htmlFor='description'>Beschreibung</label>
        <textarea
          id='description'
          name='description'
          maxLength={1000}
          defaultValue={actionState.inputs?.get("description") as string}
        />
      </div>
      <div>
        <label htmlFor='venue'>Veranstaltungsort</label>
        <select id='venue' name='venue' ref={selectRef}>
          {/* Hier alle Veranstaltungsorte aus der Datenbank in option-Elementen
    	anzeigen. */}
          <option value=''>Bitte Ort auswählen</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend>Kategorien</legend>
        {/* Hier alle Kategorien aus der Datenbank in Checkbox-Elementen mit label anzeigen.
            	Alle sollen das identische name-Attribut, aber unterschiedliche values haben.
            	*/}
        {categories.map((category) => (
          <span
            key={category.id}
            style={{
              display: "inline-flex",
              gap: "0.5rem",
              marginInlineEnd: "0.5rem",
            }}
          >
            <label htmlFor={`category_${category.id}?`}>
              {" "}
              <input
                type='checkbox'
                name='category'
                value={category.id}
                id={`category_${category.id}`}
                defaultChecked={actionState.inputs
                  ?.getAll("category")
                  .map((c) => Number(c))
                  .includes(category.id)}
              />{" "}
              {category.name}
            </label>
          </span>
        ))}
      </fieldset>

      <SubmitButton readyContent='Veranstaltung erstellen' />

      {actionState.message && (
        <strong className='message'>{actionState.message}</strong>
      )}

      {/* Wenn Eintragen erfolgreich war, hier einen Link zur neuen Veranstaltung anzeigen */}

      {actionState.status === "success" && actionState.eventId && (
        <strong className='message'>
          <Link href={`/events/${actionState.eventId || ""}`}>
            Zum Event ...
          </Link>
        </strong>
      )}
    </form>
  );
}
