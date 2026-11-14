// The looping effects of the higher rarities (pixelart.css, "Card motion").
// Each is its own element so that it can move with `transform` or `opacity`
// alone, which the browser plays on the GPU without repainting the card.
// Only the tiers that move get any elements. Legend's embers are in the card
// body (LocationCard), since they rise through the text area only.
const PIECES = {
  epic: ['mist', 'star loc-card__fx--star1', 'star loc-card__fx--star2', 'star loc-card__fx--star3', 'star loc-card__fx--star4', 'star loc-card__fx--star5'],
  mythic: ['band', 'breathe', 'glint'],
  legend: ['foil', 'band', 'glint'],
  diamond: ['glint'],
};

export default function RarityFx({ rarity, gem }) {
  const pieces = PIECES[rarity] || (gem === 'diamond' ? PIECES.diamond : null);
  if (!pieces) return null;
  return pieces.map(p => <i key={p} className={`loc-card__fx loc-card__fx--${p}`} aria-hidden="true" />);
}
