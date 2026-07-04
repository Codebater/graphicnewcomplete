// Tile-built pixel headline — renders text as a 5-tall pixel font using the
// same rounded tiles as the pixel-G logo / preloader, ending in a blinking
// accent block cursor. Server component, zero JS.
const GLYPHS: Record<string, string[]> = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  B: ['##.', '#.#', '##.', '#.#', '##.'],
  C: ['###', '#..', '#..', '#..', '###'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '###', '#..', '###'],
  F: ['###', '#..', '###', '#..', '#..'],
  G: ['###', '#..', '#.#', '#.#', '###'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'],
  K: ['#.#', '##.', '#..', '##.', '#.#'],
  L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  N: ['#..#', '##.#', '#.##', '#..#', '#..#'],
  O: ['###', '#.#', '#.#', '#.#', '###'],
  P: ['###', '#.#', '###', '#..', '#..'],
  Q: ['###', '#.#', '#.#', '###', '..#'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['###', '#..', '###', '..#', '###'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  W: ['#...#', '#...#', '#.#.#', '#.#.#', '.#.#.'],
  X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  Z: ['###', '..#', '.#.', '#..', '###'],
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '1': ['.#.', '##.', '.#.', '.#.', '###'],
  '2': ['###', '..#', '###', '#..', '###'],
  '3': ['###', '..#', '###', '..#', '###'],
  '4': ['#.#', '#.#', '###', '..#', '..#'],
  '5': ['###', '#..', '###', '..#', '###'],
  '6': ['###', '#..', '###', '#.#', '###'],
  '7': ['###', '..#', '..#', '..#', '..#'],
  '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '###'],
};

export default function PixelText({
  text,
  className,
  cursor = true,
}: {
  text: string;
  className?: string;
  cursor?: boolean;
}) {
  return (
    <span className={`pixel-text${className ? ` ${className}` : ''}`} role="img" aria-label={text}>
      {text.toUpperCase().split('').map((ch, li) => {
        if (ch === ' ') {
          return <span key={li} className="pixel-text__space" aria-hidden="true" />;
        }
        const g = GLYPHS[ch];
        if (!g) return null;
        const w = g[0].length;
        return (
          <span
            key={li}
            className="pixel-text__letter"
            aria-hidden="true"
            style={{ gridTemplateColumns: `repeat(${w}, var(--pxt))` }}
          >
            {g.flatMap((row, r) =>
              [...row].map((c, ci) => (
                <i
                  key={`${r}-${ci}`}
                  className={'pixel-text__cell' + (c === '#' ? ' pixel-text__cell--on' : '')}
                />
              ))
            )}
          </span>
        );
      })}
      {cursor && <span className="pixel-text__cursor" aria-hidden="true" />}
    </span>
  );
}
