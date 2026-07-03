import PixelLoader from '@/components/PixelLoader';

// Page preloader — full-screen pixel tile field with a kawaii stop-motion
// smiley in the center (matches the header's pixel-G logo style).
// The hidden .loader__count keeps AppInitializer's startLoader/hideLoader
// selectors valid; the wrapper slide-away animation hides everything.
export default function Loader() {
  return (
    <div id="loader" className="loader">
      <div className="loader__wrapper">
        <PixelLoader />
        <div className="loader__count" style={{ display: 'none' }}>
          <span className="count__text">0</span>
          <span className="count__percent">%</span>
        </div>
      </div>
    </div>
  );
}
