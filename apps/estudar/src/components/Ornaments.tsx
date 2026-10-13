// Ornamentos tipográficos do acervo — gravuras sépia sobre papel.
// Vocabulário de incunábulo: divisória com flor, canto floral, selo de cera,
// florão miúdo e floreio simétrico. Para fundos escuros, os cantos de filete
// (Ticks) substituem a gravura, que foi feita para assentar sobre o papel.

import type { CSSProperties } from 'react';
import { assetPath } from '../lib/paths';

const BASE: CSSProperties = {
  pointerEvents: 'none',
  userSelect: 'none',
};

/** Divisória horizontal com flor central — entre cabeçalho e conteúdo. */
export function Divider({
  width = 420,
  opacity = 0.88,
  style,
}: {
  width?: number | string;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <img
      src={assetPath('/images/orn-divider.webp')}
      alt=""
      aria-hidden
      draggable={false}
      style={{ ...BASE, display: 'block', width, maxWidth: '74vw', height: 'auto', margin: '0 auto', opacity, ...style }}
    />
  );
}

/** Floreio simétrico — fim de capítulo, fim de lista, rodapé. */
export function Flourish({
  width = 380,
  opacity = 0.88,
  style,
}: {
  width?: number | string;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <img
      src={assetPath('/images/orn-flourish.webp')}
      alt=""
      aria-hidden
      draggable={false}
      style={{ ...BASE, display: 'block', width, maxWidth: '74vw', height: 'auto', margin: '0 auto', opacity, ...style }}
    />
  );
}

/** Selo de cera com flor — colofões e assinaturas. */
export function Seal({
  size = 72,
  opacity = 0.95,
  style,
}: {
  size?: number;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <img
      src={assetPath('/images/orn-seal.webp')}
      alt=""
      aria-hidden
      draggable={false}
      style={{ ...BASE, display: 'block', width: size, height: size, objectFit: 'contain', opacity, ...style }}
    />
  );
}

/** Florão miúdo — marcador inline junto ao texto corrido. */
export function Fleuron({
  size = 14,
  opacity = 0.9,
  style,
}: {
  size?: number;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <img
      src={assetPath('/images/orn-fleuron.webp')}
      alt=""
      aria-hidden
      draggable={false}
      style={{
        ...BASE,
        display: 'inline-block',
        width: size,
        height: size,
        objectFit: 'contain',
        verticalAlign: '-0.16em',
        opacity,
        ...style,
      }}
    />
  );
}

/** Cantos florais de página — moldura viva sobre as bordas de tinta.
 *  O pai precisa de position: relative e fundo claro. */
export function Corners({
  size = 96,
  inset = -16,
  opacity = 0.9,
}: {
  size?: number;
  inset?: number;
  opacity?: number;
}) {
  const corners: CSSProperties[] = [
    { top: inset, left: inset },
    { top: inset, right: inset, transform: 'rotate(90deg)' },
    { bottom: inset, right: inset, transform: 'rotate(180deg)' },
    { bottom: inset, left: inset, transform: 'rotate(270deg)' },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <img
          key={i}
          src={assetPath('/images/orn-corner.webp')}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            ...BASE,
            position: 'absolute',
            width: size,
            height: size,
            objectFit: 'contain',
            opacity,
            zIndex: 3,
            ...c,
          }}
        />
      ))}
    </>
  );
}

/** Cantos de filete em CSS puro — para as seções escuras, onde a gravura
 *  sépia não assenta. Mesma geometria do canto floral, reduzida ao filete. */
export function Ticks({
  color = 'rgba(242, 236, 220, 0.5)',
  size = 18,
  inset = 8,
  thickness = 1,
}: {
  color?: string;
  size?: number;
  inset?: number;
  thickness?: number;
}) {
  const line = `${thickness}px solid ${color}`;
  const corners: CSSProperties[] = [
    { top: inset, left: inset, borderTop: line, borderLeft: line },
    { top: inset, right: inset, borderTop: line, borderRight: line },
    { bottom: inset, right: inset, borderBottom: line, borderRight: line },
    { bottom: inset, left: inset, borderBottom: line, borderLeft: line },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            ...BASE,
            position: 'absolute',
            width: size,
            height: size,
            zIndex: 3,
            ...c,
          }}
        />
      ))}
    </>
  );
}
