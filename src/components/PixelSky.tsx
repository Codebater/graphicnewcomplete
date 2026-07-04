// Decorative pixel-art sky for the opened menu card — a twinkling tile sun,
// clouds drifting across in chunky stop-motion steps, and two flapping birds,
// all in the brand's tile language. Lives inside .hamburger__base so it
// morphs into the menu card with the GSAP Flip (hidden while the base is the
// small hamburger chip). Server component, zero JS — everything is CSS.
export default function PixelSky() {
  return (
    <span className="pixel-sky" aria-hidden="true">
      <i className="pixel-sky__sun" />
      <i className="pixel-sky__cloud pixel-sky__cloud--a" />
      <i className="pixel-sky__cloud pixel-sky__cloud--b" />
      <i className="pixel-sky__cloud pixel-sky__cloud--c" />
      <i className="pixel-sky__bird pixel-sky__bird--a" />
      <i className="pixel-sky__bird pixel-sky__bird--b" />
      {/* tile rocket — crosses the card diagonally every so often, with a
          flickering two-frame exhaust flame */}
      <span className="pixel-sky__rocket">
        <i className="pixel-sky__rocket-body" />
        <i className="pixel-sky__rocket-flame" />
      </span>
    </span>
  );
}
