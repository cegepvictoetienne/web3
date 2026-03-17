import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/produits - Obtenir tous les produits
export async function GET() {
  const produits = await prisma.produit.findMany({
    include: { categorie: true },
  });
  return NextResponse.json(produits);
}

// POST /api/produits - Créer un produit
export async function POST(request: Request) {
  const body = await request.json();

  // Validation des données
  if (!body.nom || !body.prix || !body.categorieId) {
    return NextResponse.json(
      { erreur: "Les champs nom, prix et categorieId sont requis." },
      { status: 400 }
    );
  }

  const produit = await prisma.produit.create({
    data: {
      nom: body.nom,
      description: body.description,
      prix: body.prix,
      categorieId: body.categorieId,
    },
  });

  return NextResponse.json(produit, { status: 201 });
}
