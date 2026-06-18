import React, { useEffect, useState } from "react";
import { RoleView } from "./spyglass/room.jsx";
import { PortfolioView } from "./spyglass/portfolio.jsx";
import { CandidateDossier } from "./spyglass/dossier.jsx";

/* The three client-facing surfaces of the Dossier Specs preview.
   (Placeability Gauge intentionally omitted.) */
const VIEWS = [
  { id: "portfolio", label: "Client Home" },
  { id: "role", label: "Search Room" },
  { id: "dossier", label: "Candidate Dossier" },
];

export default function App() {
  const [view, setView] = useState("portfolio");

  const go = (v) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  // The view components navigate between surfaces by dispatching window events.
  useEffect(() => {
    const onDossier = () => go("dossier");
    const onRoom = () => go("role");
    const onPortfolio = () => go("portfolio");
    window.addEventListener("spg-open-dossier", onDossier);
    window.addEventListener("spg-open-room", onRoom);
    window.addEventListener("spg-open-portfolio", onPortfolio);
    return () => {
      window.removeEventListener("spg-open-dossier", onDossier);
      window.removeEventListener("spg-open-room", onRoom);
      window.removeEventListener("spg-open-portfolio", onPortfolio);
    };
  }, []);

  const Active =
    view === "portfolio" ? PortfolioView : view === "role" ? RoleView : CandidateDossier;

  return (
    <>
      <div id="toolbar">
        <span className="label">Spyglass · spec preview</span>
        <div className="seg">
          {VIEWS.map((v) => (
            <button key={v.id} data-on={String(view === v.id)} onClick={() => go(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <Active />
    </>
  );
}
