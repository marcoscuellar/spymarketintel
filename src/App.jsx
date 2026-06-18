import React, { useEffect, useState } from "react";
import { RoleView } from "./spyglass/room.jsx";
import { PortfolioView } from "./spyglass/portfolio.jsx";
import { CandidateDossier } from "./spyglass/dossier.jsx";

/* Client-facing portal. The default surface is the Client Home; the other
   surfaces are reached through the page's own in-context navigation
   (clicking a role row, "Open full dossier", "All searches", etc.) which the
   views dispatch as window events. The internal spec-preview toolbar has been
   removed. */
const VALID_VIEWS = ["portfolio", "role", "dossier"];
function initialView() {
  if (typeof window === "undefined") return "portfolio";
  const v = new URLSearchParams(window.location.search).get("view");
  return VALID_VIEWS.includes(v) ? v : "portfolio";
}

export default function App() {
  const [view, setView] = useState(initialView);

  const go = (v) => {
    setView(v);
    window.scrollTo(0, 0);
  };

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

  return <Active />;
}
