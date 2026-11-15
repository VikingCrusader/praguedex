// The looping effects of the higher rarities (pixelart.css, "Card motion").
// Each is its own element so that it can move with `transform` or `opacity`
// alone, which the browser plays on the GPU without repainting the card.
// Only the tiers that move get any elements. Legend's embers are in the card
// body (LocationCard), since they rise through the text area only.
const PIECES = {
  epic: ['mist', 'star loc-card__fx--star1', 'star loc-card__fx--star2', 'star loc-card__fx--star3', 'star loc-card__fx--star4', 'star loc-card__fx--star5'],
  mythic: ['glow loc-card__fx--glow1', 'glow loc-card__fx--glow2'],
  legend: ['glow loc-card__fx--glow1', 'glow loc-card__fx--glow2', 'glow loc-card__fx--glow3'],
  // Secret (obsidian): mythic's two wandering clouds, in violet and teal.
  secret: ['glow loc-card__fx--glow1', 'glow loc-card__fx--glow2'],
  // Platinum (expedition 180+): the glint round the ornaments, a glow drifting
  // slowly across the card and back, and nine sparks.
  diamond: ['glint', 'band', ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `spark loc-card__fx--s${n}`)],
  // Plain platinum (expedition 120): only the drifting glow.
  ruby: ['band'],
};

// A number in [0, 1) from the card's slug, the same on every visit, so each
// card starts its loops at its own point (mythic's glow wanders differently
// on each card) without anything random at render time.
function seed(text = '', salt = 0) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

export default function RarityFx({ rarity, gem, slug }) {
  const pieces = PIECES[rarity] || (gem === 'diamond' || gem === 'ruby' ? PIECES[gem] : null);
  if (!pieces) return null;
  const style = rarity === 'mythic' || rarity === 'legend' || rarity === 'secret'
    ? { '--fx-a': seed(slug, 1).toFixed(3), '--fx-b': seed(slug, 2).toFixed(3), '--fx-c': seed(slug, 3).toFixed(3) }
    : undefined;
  return pieces.map(p => <i key={p} className={`loc-card__fx loc-card__fx--${p}`} style={style} aria-hidden="true" />);
}
