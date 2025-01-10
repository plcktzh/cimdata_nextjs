import AddEventForm from "@/components/Events/AddEventForm";
import prisma from "@/prisma/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veranstaltung eintragen",
};
export default async function NeueVeranstaltungPage() {
  // Fetch venues and categories from db
  const venues = await prisma.venue.findMany();
  const categories = await prisma.category.findMany();

  return (
    <div>
      <h1>Veranstaltung eintragen</h1>
      <AddEventForm venues={venues} categories={categories} />
    </div>
  );
}
