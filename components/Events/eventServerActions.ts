"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";
import slug from "slug";

export async function addNewEvent(prevState: unknown, formData: FormData) {
  /* Schema erstellen und validieren */
  // Hier n:m-Beziehung nachschauen
  // https://www.prisma.io/docs/orm/reference/prisma-client-reference#create

  const schema = zfd.formData({
    name: zfd.text(z.string().min(2).max(100)),
    date: zfd.text(z.coerce.date()),
    description: zfd.text(z.string().max(1000).optional()),
    venue: zfd.text(z.coerce.number().positive().int()),
    category: zfd.repeatableOfType(z.coerce.number().positive().int()),
  });

  const { success, data } = schema.safeParse(formData);

  const errorMessage = {
    message: "Ungültige Eingaben!",
    status: "error",
    inputs: formData,
    eventId: "",
  };

  if (!success) {
    return errorMessage;
  }

  const venue = await prisma.venue.findUnique({
    where: { id: data.venue },
  });

  const categoriesCount = await prisma.category.count({
    where: { id: { in: data.category } },
  });

  if (!venue || categoriesCount < 1) {
    return errorMessage;
  }

  const newEvent = await prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      venueId: data.venue,
      date: new Date(data.date),
      category: {
        connect: data.category.map((category) => {
          return { id: category };
        }),
      },
    },
    include: {
      category: true,
    },
  });

  const successMessage = {
    message: "Event erfolgreich erstellt!",
    status: "success",
    inputs: null,
    eventId: `${slug(newEvent.name)}-${newEvent.id}`,
  };

  revalidatePath("/events/new");

  return successMessage;
}
