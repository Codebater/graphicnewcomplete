'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-webgl2';

// Embeds a looping .riv animation that fills its slot, with a poster image
// behind it as a graceful fallback (shown if the animation can't paint).
// Used in the home-page stacking cards to make the last card feel alive.
// To swap the animation, drop a new .riv into /public/animations and change `src`.
export default function RiveCard({
  src,
  poster,
  stateMachine,
  className,
  style,
  ariaLabel,
}: {
  src: string;
  poster?: string;
  stateMachine?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    ...(stateMachine ? { stateMachines: stateMachine } : {}),
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  return (
    // Rive sizes the canvas to this wrapper's measured box, so it needs an
    // explicit height (the surrounding flex parents collapse to 0).
    <div
      className={className}
      role="img"
      aria-label={ariaLabel || 'Animated graphic'}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(240px, 34vw, 540px)',
        overflow: 'hidden',
        backgroundImage: poster ? `url(${poster})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style,
      }}
    >
      <RiveComponent
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
