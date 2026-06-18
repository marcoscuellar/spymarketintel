/**
 * GLVE Logo Component (React reference)
 * =====================================
 * Drop-in component implementing all 16 sanctioned logo variants
 * (the cufflink mark + housing combinations from logo-cufflink-colors.html).
 *
 * Usage:
 *   <GlveLogo />                                  // primary, 28px
 *   <GlveLogo variant="amber-cufflink" size={40} />
 *   <GlveLogo variant="forest" size={64} />       // deck covers / premium
 *   <GlveLogo variant="navy-housing" size={40} /> // standalone engines
 *   <GlveLogo variant="tuxedo" size={56} />       // special: split band
 *   <GlveLogo variant="outline" size={28} />      // special: hollow on white
 *
 *   <GlveLockup variant="primary" markSize={28} withTagline />
 *   <GlveWordmark size={64} />
 *
 * TYPESCRIPT: convert the prop definitions accordingly.
 *
 * RECOMMENDED ASSIGNMENT
 * ----------------------
 *   primary          → default everywhere
 *   amber-cufflink   → Engine 02 (Buying Signals) surfaces
 *   navy-cufflink    → Standalone engines (SA, ST) — subtle nod to their color
 *   navy-housing     → Standalone engine modals / deeper standalone surfaces
 *   forest           → deck covers, About page, founder section, "premium moment"
 *   light            → light backgrounds where dark housing is too heavy
 *
 * The other 10 variants ship as "vault" options — sanctioned but rarely used.
 * Pull them out when there's a specific design reason. Never invent new combos.
 */

import React from 'react';

// ============================================================
// All 16 variants — color specs
// ============================================================
export const VARIANTS = {
  // ===== SYSTEM ALIGNED =========================================
  'primary':        { housing: '#0a0a0a', band: '#ffffff', stitch: '#0a0a0a', cuf: ['#0a0a0a', '#ffffff', '#0a0a0a'] },
  'amber-cufflink': { housing: '#0a0a0a', band: '#ffffff', stitch: '#0a0a0a', cuf: ['#f59e0b', '#ffffff', '#f59e0b'] },
  'navy-cufflink':  { housing: '#0a0a0a', band: '#ffffff', stitch: '#0a0a0a', cuf: ['#0A1F3D', '#ffffff', '#0A1F3D'] },
  'light':          { housing: '#f5f5f4', housingStroke: '#e7e5e4', band: '#0a0a0a', stitch: '#ffffff', stitchOpacity: 0.55, cuf: ['#ffffff', '#0a0a0a', '#ffffff'] },

  // ===== ACCENT-LED · BAND CARRIES COLOR ========================
  'amber-band':     { housing: '#0a0a0a', band: '#f59e0b', stitch: '#0a0a0a', cuf: ['#0a0a0a', '#f59e0b', '#0a0a0a'] },
  'navy-band':      { housing: '#0a0a0a', band: '#0A1F3D', stitch: '#ffffff', stitchOpacity: 0.5, cuf: ['#f59e0b', '#0A1F3D', '#f59e0b'] },
  'cream-band':     { housing: '#0a0a0a', band: '#F5EFE0', stitch: '#0a0a0a', stitchOpacity: 0.6, cuf: ['#0a0a0a', '#F5EFE0', '#0a0a0a'] },
  'tuxedo':         { special: 'tuxedo' },

  // ===== COLOR HOUSING ==========================================
  'amber-housing':  { housing: '#f59e0b', band: '#0a0a0a', stitch: '#ffffff', stitchOpacity: 0.6, cuf: ['#ffffff', '#0a0a0a', '#ffffff'] },
  'navy-housing':   { housing: '#0A1F3D', band: '#ffffff', stitch: '#0A1F3D', cuf: ['#f59e0b', '#0A1F3D', '#f59e0b'] },
  'cream-housing':  { housing: '#F5EFE0', band: '#0a0a0a', stitch: '#ffffff', stitchOpacity: 0.55, cuf: ['#ffffff', '#0a0a0a', '#ffffff'] },
  'burgundy':       { housing: '#6B1F2A', band: '#ffffff', stitch: '#6B1F2A', cuf: ['#6B1F2A', '#ffffff', '#6B1F2A'] },

  // ===== BRAND WORLD ============================================
  'forest':         { housing: '#2F4D3A', band: '#F5EFE0', stitch: '#2F4D3A', cuf: ['#2F4D3A', '#F5EFE0', '#2F4D3A'] },
  'sand':           { housing: '#D4B896', band: '#0a0a0a', stitch: '#D4B896', cuf: ['#D4B896', '#0a0a0a', '#D4B896'] },
  'amber-pale':     { housing: '#fef3c7', band: '#0a0a0a', stitch: '#f59e0b', cuf: ['#f59e0b', '#0a0a0a', '#f59e0b'] },
  'outline':        { special: 'outline' },
};

// ============================================================
// GlveLogo — the cufflink mark
// ============================================================
export function GlveLogo({ variant = 'primary', size = 28, className, ariaLabel = 'GLVE' }) {
  const v = VARIANTS[variant] || VARIANTS.primary;

  // Special cases (unique geometry)
  if (v.special === 'tuxedo') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
           width={size} height={size} role="img" aria-label={ariaLabel} className={className}>
        <rect width="100" height="100" rx="28" fill="#0a0a0a" />
        <rect x="14" y="38" width="36" height="24" rx="3" fill="#ffffff" />
        <rect x="36" y="38" width="36" height="24" fill="#ffffff" />
        <rect x="36" y="38" width="36" height="24" fill="#525252" />
        <rect x="50" y="38" width="22" height="24" rx="3" fill="#525252" />
        <circle cx="72" cy="50" r="9" fill="#ffffff" />
        <circle cx="72" cy="50" r="5" fill="#0a0a0a" />
        <circle cx="72" cy="50" r="2" fill="#ffffff" />
      </svg>
    );
  }
  if (v.special === 'outline') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
           width={size} height={size} role="img" aria-label={ariaLabel} className={className}>
        <rect x="1" y="1" width="98" height="98" rx="27" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
        <rect x="14" y="38" width="72" height="24" rx="3" fill="none" stroke="#0a0a0a" strokeWidth="2" />
        <line x1="20" y1="50" x2="62" y2="50" stroke="#0a0a0a" strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx="72" cy="50" r="9" fill="#0a0a0a" />
        <circle cx="72" cy="50" r="5" fill="#ffffff" />
        <circle cx="72" cy="50" r="2" fill="#0a0a0a" />
      </svg>
    );
  }

  // Standard pattern
  const stitchVisible = size > 20; // stitch detail disappears at favicon sizes
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
         width={size} height={size} role="img" aria-label={ariaLabel} className={className}>
      <rect
        width="100" height="100" rx="28" fill={v.housing}
        stroke={v.housingStroke || 'none'}
        strokeWidth={v.housingStroke ? 1 : 0}
      />
      <rect x="14" y="38" width="72" height="24" rx="3" fill={v.band} />
      {stitchVisible && (
        <line
          x1="20" y1="50" x2="62" y2="50"
          stroke={v.stitch}
          strokeWidth="1.4"
          strokeDasharray="3 3"
          opacity={v.stitchOpacity ?? 1}
        />
      )}
      <circle cx="72" cy="50" r="9" fill={v.cuf[0]} />
      <circle cx="72" cy="50" r="5" fill={v.cuf[1]} />
      <circle cx="72" cy="50" r="2" fill={v.cuf[2]} />
    </svg>
  );
}

// ============================================================
// GlveWordmark — "GLVE" in Geist 900 with custom V chevron
// ============================================================
export function GlveWordmark({ size = 22, color = '#0a0a0a', className }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'Geist', sans-serif",
        fontWeight: 900,
        fontSize: size,
        letterSpacing: '-0.08em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        color,
      }}
      aria-label="GLVE"
    >
      <span>GL</span>
      <span style={{ display: 'inline-block', transform: 'translateY(0.04em)' }}>
        <svg width="0.62em" height="0.85em" viewBox="0 0 62 85" style={{ display: 'block' }} aria-hidden="true">
          <path d="M 4 4 L 31 78 L 58 4" fill="none" stroke="currentColor"
                strokeWidth="14" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      </span>
      <span>E</span>
    </span>
  );
}

// ============================================================
// GlveLockup — mark + wordmark, baseline-aligned
// ============================================================
export function GlveLockup({
  variant = 'primary',
  markSize = 28,
  wordmarkSize,
  wordmarkColor = '#0a0a0a',
  withTagline = false,
  taglineColor = '#a3a3a3',
  className,
}) {
  const wm = wordmarkSize || Math.round(markSize * 0.8);
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(markSize * 0.4) }}
    >
      <GlveLogo variant={variant} size={markSize} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <GlveWordmark size={wm} color={wordmarkColor} />
        {withTagline && (
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: Math.max(10, Math.round(wm * 0.32)),
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: taglineColor,
              fontWeight: 500,
            }}
          >
            Revenue Workflow
          </span>
        )}
      </span>
    </span>
  );
}

export default GlveLogo;

/* =============================================================
   ALL VARIANT NAMES — autocomplete reference
   =============================================================
     'primary'         · default
     'amber-cufflink'  · E02 surfaces
     'navy-cufflink'   · subtle Standalone nod
     'light'           · light backgrounds
     'amber-band'      · accent-led, E02 contexts
     'navy-band'       · accent-led, Standalone contexts
     'cream-band'      · warmer than white band
     'tuxedo'          · split band, special formal use
     'amber-housing'   · full E02 takeover
     'navy-housing'    · Standalone engine modals
     'cream-housing'   · editorial / print
     'burgundy'        · sommelier / private-club energy
     'forest'          · deck covers, premium, brand moment
     'sand'            · leather / Italian-tailoring
     'amber-pale'      · soft E02 surfaces
     'outline'         · watermark, faded use, big white space
   ============================================================= */
