"use client";

import { useState } from "react";

export default function Compteur() {
  const [compte, setCompte] = useState(0);

  return (
    <div>
      <p>Vous avez cliqué {compte} fois</p>
      <button onClick={() => setCompte(compte + 1)}>Cliquer</button>
    </div>
  );
}
