import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/produits/:id - Obtenir un produit par son ID
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const produit = await prisma.produit.findUnique({
    where: { id: Number(id) },
    include: { categorie: true },
  });

  if (!produit) {
    return NextResponse.json(
      { erreur: "Produit non trouvé" },
      { status: 404 }
    );
  }

  return NextResponse.json(produit);
}

// PUT /api/produits/:id - Modifier un produit
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const produit = await prisma.produit.update({
    where: { id: Number(id) },
    data: {
      nom: body.nom,
      description: body.description,
      prix: body.prix,
      categorieId: body.categorieId,
    },
  });

  return NextResponse.json(produit);
}

// DELETE /api/produits/:id - Supprimer un produit
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  await prisma.produit.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Produit supprimé" });
}
