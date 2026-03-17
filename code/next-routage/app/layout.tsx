import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <nav>
          <Link href="/">Accueil</Link> |{" "}
          <Link href="/produits">Produits</Link> |{" "}
          <Link href="/a-propos">À propos</Link>
        </nav>
        <hr />
        {children}
      </body>
    </html>
  );
}
