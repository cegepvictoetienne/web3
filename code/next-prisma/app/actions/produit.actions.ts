"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function creerProduit(formData: FormData) {
  const nom = formData.get("nom") as string;
  const description = formData.get("description") as string;
  const prix = parseFloat(formData.get("prix") as string);
  const categorieId = parseInt(formData.get("categorieId") as string);

  // Validation
  if (!nom || !prix || !categorieId) {
    return { erreur: "Tous les champs obligatoires doivent être remplis." };
  }

  await prisma.produit.create({
    data: { nom, description, prix, categorieId },
  });

  revalidatePath("/produits");
}

export async function supprimerProduit(id: number) {
  await prisma.produit.delete({
    where: { id },
  });

  revalidatePath("/produits");
}
