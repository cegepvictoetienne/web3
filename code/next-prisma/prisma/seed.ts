import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Créer les catégories
  const electronique = await prisma.categorie.create({
    data: { nom: "Électronique" },
  });

  const accessoires = await prisma.categorie.create({
    data: { nom: "Accessoires" },
  });

  // Créer les produits
  await prisma.produit.createMany({
    data: [
      {
        nom: "Clavier mécanique",
        description: "Clavier mécanique RGB",
        prix: 129.99,
        categorieId: electronique.id,
      },
      {
        nom: "Souris ergonomique",
        description: "Souris sans fil ergonomique",
        prix: 79.99,
        categorieId: accessoires.id,
      },
      {
        nom: "Écran 27 pouces",
        description: "Écran 4K IPS",
        prix: 449.99,
        categorieId: electronique.id,
      },
    ],
  });

  console.log("Données de seed insérées avec succès!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
