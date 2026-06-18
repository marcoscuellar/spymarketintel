import React, { useState } from "react";

/* Shared viewport hook — matches the prototype's per-file useIsMobile. */
export function useIsMobile(bp = 760) {
  const [m, setM] = useState(typeof window !== "undefined" && window.innerWidth <= bp);
  React.useEffect(() => {
    const on = () => setM(window.innerWidth <= bp);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return m;
}
