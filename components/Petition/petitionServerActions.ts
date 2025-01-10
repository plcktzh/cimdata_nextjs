"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function approveSignature(id: string, approve: boolean) {
  if (approve) {
    await prisma.signature.update({
      where: { id },
      data: { approved: approve },
    });
  } else {
    await prisma.signature.delete({
      where: {
        id,
      },
    });
  }

  revalidatePath("/petition");
}

export async function addSignature(prevState: unknown, formData: FormData) {
  console.log(formData);

  /* 1. Mit zfd ein Schema erstellen, dass zum Formular passt.
https://www.npmjs.com/package/zod-form-data
https://developer.mozilla.org/en-US/docs/Web/API/FormData
	2. Mit der Schema-Methode safeParse formData parsen.
	3. Die Daten in die Datenbank mit Hilfe von prisma eintragen
	4. Bonus: Vor dem Eintragen mit einer weiteren Datenbankanfrage
	prüfen, ob bereits ein Eintrag mit der Mailadresse existiert,
	und nur dann den neuen Eintrag machen, wenn die Mailadresse
	noch nicht in der Datenbank vorhanden ist.
	*/

  const schema = zfd.formData({
    name: zfd.text(z.string().max(100).optional()),
    email: zfd.text(z.string().email()),
    privacy: zfd.checkbox({ trueValue: "accept" }),
  });

  const { success, data, error } = schema.safeParse(formData);

  if (!success) {
    return {
      message: "Ungültige Eingaben!",
      status: "error",
      inputs: formData,
    };
  }

  const successMessage = {
    message: "Unterschrift hinzugefügt!",
    status: "success",
    inputs: null,
  };

  if (
    // oder .findUnique
    (await prisma.signature.count({
      where: { email: data.email },
    })) > 0
  )
    // Aus Datenschutzgründen nicht verraten, dass schon jemand mit dieser Email-Adresse unterschrieben hat
    return successMessage;

  await prisma.signature.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });

  revalidatePath("/petition");

  return successMessage;
}
