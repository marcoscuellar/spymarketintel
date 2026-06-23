import React, { useEffect, useState } from "react";
import { RoleView } from "./spyglass/room.jsx";
import { PortfolioView } from "./spyglass/portfolio.jsx";
import { CandidateDossier } from "./spyglass/dossier.jsx";
import { firstRoomSearch } from "./spyglass/searches.js";

/* Client-facing portal — a drill-down: Client Home → Search Room → Candidate
   Dossier. Navigation carries the selected searchId / candidateId so each
   screen renders the thing that was clicked. The views dispatch window events
   (with detail); App holds the selection state. */
const VALID_VIEWS = ["portfolio", "role", "dossier"];
function initialView() {
  if (typeof window === "undefined") return "portfolio";
  const v = new URLSearchParams(window.location.search).get("view");
  return VALID_VIEWS.includes(v) ? v : "portfolio";
}

export default function App() {
  const [view, setView] = useState(initialView);
  const [searchId, setSearchId] = useState(() => firstRoomSearch().id);
  const [candidateId, setCandidateId] = useState(null);

  const go = (v) => {
    setView(v);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onDossier = (e) => {
      const d = e.detail || {};
      if (d.searchId) setSearchId(d.searchId);
      if (d.candidateId) setCandidateId(d.candidateId);
      go("dossier");
    };
    const onRoom = (e) => {
      const d = e.detail || {};
      if (d.searchId) setSearchId(d.searchId);
      go("role");
    };
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

  if (view === "portfolio") return <PortfolioView />;
  if (view === "role") return <RoleView searchId={searchId} />;
  return <CandidateDossier searchId={searchId} candidateId={candidateId} />;
}
