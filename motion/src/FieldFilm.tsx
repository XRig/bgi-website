import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, staticFile} from 'remotion';

export const FILM_FRAMES = 288;
const TAU = Math.PI * 2;
const scenes = [
  {file: 'pumpjack-sunset.jpg', position: '50% 12%', phase: 0, x: 17, y: 7, grade: 'saturate(0.84) contrast(1.06) brightness(0.94)'},
  {file: 'drilling-rig.jpg', position: '50% 73%', phase: 1.6, x: 15, y: 9, grade: 'saturate(0.70) contrast(1.07) brightness(0.92)'},
  {file: 'pumpjacks-prairie.jpg', position: '50% 49%', phase: 3.2, x: 21, y: 6, grade: 'saturate(0.68) contrast(1.06) brightness(0.91)'},
];

const smoothstep = (value: number) => value * value * (3 - 2 * value);

// All visual changes depend exclusively on the current frame. Each property is
// periodic over 288 frames; frame 288 is visually identical to frame 0.
const Photo: React.FC<{index: number; opacity: number; cycle: number}> = ({index, opacity, cycle}) => {
  const scene = scenes[index];
  const angle = cycle * TAU + scene.phase;
  const scale = 1.055 + Math.sin(angle) * 0.018;
  return <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
    <Img src={staticFile(scene.file)} style={{
      width: '100%', height: '100%', objectFit: 'cover', objectPosition: scene.position,
      transform: `translate(${Math.sin(angle + 0.7) * scene.x}px, ${Math.cos(angle) * scene.y}px) scale(${scale})`,
      filter: scene.grade,
    }}/>
  </AbsoluteFill>;
};

const SignalLines: React.FC<{cycle: number}> = ({cycle}) => {
  const pulse = 0.70 + 0.30 * Math.sin(cycle * TAU);
  const signalX = 1370 + Math.sin(cycle * TAU) * 118;
  return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="signal-stroke" x1="0" x2="1">
        <stop offset="0%" stopColor="#d9b677" stopOpacity="0"/>
        <stop offset="48%" stopColor="#d9b677" stopOpacity="0.48"/>
        <stop offset="100%" stopColor="#d9b677" stopOpacity="0.05"/>
      </linearGradient>
      <linearGradient id="line-stroke" x1="0" x2="1">
        <stop offset="0%" stopColor="#c5d1cd" stopOpacity="0"/>
        <stop offset="55%" stopColor="#c5d1cd" stopOpacity="0.15"/>
        <stop offset="100%" stopColor="#c5d1cd" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <g fill="none" strokeWidth="1">
      <path d="M1050 958 H1518 L1600 876 H1844" stroke="url(#signal-stroke)"/>
      <path d="M1118 982 H1540 L1624 900 H1890" stroke="url(#line-stroke)"/>
      <path d="M1266 1038 V964 L1360 870 H1634" stroke="url(#line-stroke)"/>
      <path d="M76 92 H320 L372 144 H506" stroke="url(#line-stroke)"/>
      <path d="M82 66 V118 M56 92 H108" stroke="#d6b478" opacity="0.27"/>
      <path d="M1819 845 V861 M1811 853 H1827" stroke="#d6b478" opacity="0.20"/>
    </g>
    <g fill="#d9b677" opacity={pulse * 0.55}>
      <circle cx={signalX} cy="958" r="2.7"/>
      <circle cx="1600" cy="876" r="2"/>
    </g>
    <g fill="#d0d6cf" opacity="0.18">
      {[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={1730 + i * 17} cy="1012" r="1"/>)}
    </g>
  </svg>;
};

export const FieldFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = frame / FILM_FRAMES;
  const phase = (frame + 16) % FILM_FRAMES;
  const current = Math.floor(phase / 96);
  const local = phase % 96;
  const fade = local < 64 ? 0 : smoothstep((local - 64) / 32);

  return <AbsoluteFill style={{backgroundColor: '#10292d', overflow: 'hidden'}}>
    <Photo index={current} opacity={1} cycle={cycle}/>
    <Photo index={(current + 1) % 3} opacity={fade} cycle={cycle}/>
    <AbsoluteFill style={{background: 'linear-gradient(135deg, rgba(11,42,47,0.12), rgba(7,27,35,0.03) 55%, rgba(7,27,35,0.18))'}}/>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,26,33,0.12), transparent 25%, transparent 64%, rgba(6,26,32,0.40))'}}/>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 51% 44%, transparent 40%, rgba(5,24,29,0.21) 100%)'}}/>
    <SignalLines cycle={cycle}/>
  </AbsoluteFill>;
};
