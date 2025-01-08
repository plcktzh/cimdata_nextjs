"use server";

import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

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
