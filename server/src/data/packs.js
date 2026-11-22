// Card packs (2026-11-09, user's design): the cards of one connected area, such
// as a hill or a walled complex. Static config like historyEras.js: there are
// few of them, and they change only with the code. A pack must be geographically
// connected and easy to walk; a merely cultural or historical grouping is not a
// pack (it may become a "theme" one day). A pack has no coordinates and no
// rarity. `labels` are the ordinary card labels, picked by hand for the pack as a
// whole, and filter it on Explore; its districts and quarters come from its cards.
//
// `members` are Location slugs, picked by hand: a new card doesn't join a pack
// on its own. A slug may be in several packs. A slug that no longer resolves
// is ignored. A pack's slug can stand wherever a Location slug goes in a
// History event's `relatedLandmarks`, and wins over a card of the same slug.
import PACK_DESCRIPTIONS from './packDescriptions.js';

export const PACK_UNLOCK_AT = 3;
export const PACK_UNLOCK_XP = 40;
// Set beside the achievement tiers: 800 is what a Diamond pays. 15 XP a card
// since 2026-11-21 (25 until then; user's call: with 50+ packs the bonus equalled
// the cards' own XP). It counts cards, not rarity, on purpose. XP already paid
// for completed packs is kept.
export const packCompleteXp = (cards) => Math.min(800, Math.max(100, cards * 15));

// `released` is when the pack went live (its commit), for the Newest sort on
// Explore: packs stand among the cards by that time (2026-11-11, user's call).
const pack = (entry) => ({ ...entry, description: PACK_DESCRIPTIONS[entry.slug] });

export const PACKS = [
  pack({
    slug: 'prague-castle',
    released: '2026-11-09T20:39:53+01:00',
    name: 'Prague Castle',
    localizedNames: { cz: 'Pražský hrad', zh: '布拉格城堡' },
    foil: '#7a1f2b',
    labels: ['castle and fortress', 'medieval', 'gothic', 'renaissance'],
    // Inside the walls plus the gardens on the southern ramparts; Hradčany Square
    // is outside the gate. The Deer Moat, the Powder Bridge and everything north of
    // them moved to the Royal Garden pack on 2026-11-21 (user's call).
    members: [
      'matyasova-brana', 'new-royal-palace', 'st-vitus-cathedral', 'velka-jizni-vez-katedraly', 'old-royal-palace',
      'vladislavsky-sal', 'st-georges-basilica', 'church-of-our-lady-prague-castle', 'kaple-sv-krize-prazsky-hrad',
      'obelisk-prague-castle', 'nove-probostvi', 'rozmbersky-palac-ustav-slechticen', 'lobkowicz-palace',
      'golden-lane', 'dalibor-tower', 'cerna-vez-prazsky-hrad', 'bila-vez-prazsky-hrad', 'prasna-vez-mihulka',
      'zahrada-na-valech', 'plecnikova-vyhlidka', 'slavatuv-obelisk',
    ],
  }),
  pack({
    slug: 'vysehrad',
    released: '2026-11-09T20:39:53+01:00',
    name: 'Vyšehrad',
    localizedNames: { cz: 'Vyšehrad', zh: '维谢赫拉德' },
    foil: '#155e63',
    labels: ['castle and fortress', 'prehistory', 'medieval', 'baroque'],
    // Took over the whole-complex card of the same slug (2026-11-09, user's call).
    members: [
      'basilika-sv-petra-pavla', 'rotunda-sv-martina', 'vysehrad-cemetery', 'sousosi-premysl-a-libuse', 'kaple-sv-ludmily',
      'kaple-panny-marie-sancovske', 'nove-dekanstvi-vysehrad', 'stare-purkrabstvi', 'romansky-most-vysehrad',
      'pracharna-goticky-sklep', 'libusina-lazen', 'vysehradsky-tunel', 'vysehrad-wall-walkway', 'vysehrad-leopold-gate',
      'taborska-brana', 'cihelna-brana', 'brana-spicka', 'v-pevnosti-street-in-the-fortness-1783208618265',
    ],
  }),
  pack({
    slug: 'pankrac',
    released: '2026-11-09T22:24:57+01:00',
    name: 'Pankrác',
    localizedNames: { cz: 'Pankrác', zh: '潘克拉茨' },
    foil: '#3b4a63',
    labels: ['contemporary', 'communism', 'world-wars', 'tower'],
    // The plateau's towers, prison and square; took over the one-point skyline card.
    members: [
      'city-empiria-1782389478834', 'city-tower-prague', 'v-tower', 'main-point-pankrc-1783457910577', 'gemini-pankrac',
      'pankrac-house-sixty-house', 'pankrac-prime-office-building', 'budova-enterprise', 'budova-centrotex', 'arkady-pankrac',
      'panorama-hotel', 'cervena-zirafa-pankrac', 'central-park-pankrc-1782864735680', 'pankrc-prison-1782564726175',
      'building-of-high-court-in-prague-1782564438624', 'namesti-hrdinu', 'stanice-metra-prazskeho-povstani',
      'pomnik-obetem-prazskeho-povstani-doudlebska', 'kostel-sv-pankrace',
    ],
  }),
  pack({
    slug: 'letna',
    released: '2026-11-09T22:24:57+01:00',
    name: 'Letná',
    localizedNames: { cz: 'Letná', zh: '莱特纳' },
    foil: '#2f5d3a',
    labels: ['park', 'communism'],
    members: [
      'letna-park', 'letn-plain-1782906159291', 'vyhlidka-na-letne', 'letenske-jezirko', 'letensky-zamecek',
      'the-letn-carousel--1783352292475', 'hanavsky-pavilon', 'kaple-sv-mari-magdaleny', 'pavilon-expo-58-vystaviste',
      'vodarenska-vez-letna', 'epet-arena', 'technical-museum', 'kramarova-vila', 'bio-oko', 'lavka-borka-sipka',
    ],
  }),
  pack({
    slug: 'old-town-square',
    released: '2026-11-09T22:24:57+01:00',
    name: 'Old Town Square',
    localizedNames: { cz: 'Staroměstské náměstí', zh: '老城广场' },
    foil: '#8a3f1d',
    labels: ['square', 'medieval', 'gothic', 'baroque'],
    // The square and the houses right on it, as in the Starter Pack achievement.
    // Took over the card of the same slug (and its cover). The House at the
    // Minute and the Golden Unicorn moved to the Malé náměstí pack on
    // 2026-11-19 (user's call; Starter Pack still counts the Minute), and the
    // new Týn School card joined the same day, as did the House at the White
    // Unicorn (603/15, slug trckovsky-dum), the old card of that name having
    // been renamed the Stone Ram (its real house, 551/17).
    members: [
      'tyn-church', 'mariansky-sloup', 'old-town-hall', 'astronomical-clock', 'pamatnik-jana-husa', '27-krizu-staromestske-namesti',
      'palac-goltz-kinskych', 'stone-bell-house', 'dum-u-bileho-jednorozce', 'storch-house', 'dum-u-lazara', 'schieruv-dum',
      'park-u-staromestskeho-namesti', 'prazska-mestska-pojistovna', 'dum-u-clovicku', 'dum-zlaty-kriz',
      'kostel-sv-mikulase-stare-mesto', 'dum-u-zlateho-slona', 'tynska-skola', 'trckovsky-dum',
    ],
  }),
  pack({
    slug: 'petrin',
    released: '2026-11-09T22:24:57+01:00',
    name: 'Petřín',
    localizedNames: { cz: 'Petřín', zh: '佩特任' },
    foil: '#5b3a6e',
    labels: ['nature', 'park', 'medieval', 'national-revival'],
    // The hill from the Seminary Garden over the top to the Kinský Garden.
    members: [
      'petrin-tower', 'mirror-maze-petrin', 'kaple-boziho-hrobu-petrin', 'kaple-kalvarie-petrin', 'st-lawrence-cathedral-1782590216064',
      'socha-jaroslava-vrchlickeho-petrin', 'kaple-jezulatka-petrin', 'seminarska-zahrada', 'socha-jana-nerudy-petrin', 'restaurace-nebozizek',
      'lanova-draha-petrin', 'socha-laska-petrin', 'socha-milana-rastislava-stefanika', 'stefanikova-hvezdarna',
      'hunger-wall-1782410203381', 'horni-bastion-hladova-zed', 'ruzovy-sad-petrin', 'zahrada-kvetnice', 'petrinske-skalky',
      'vyhlidkova-terasa-petrin', 'petrinske-jezirko', 'ruiny-restaurace-u-jezirka', 'st-michael-mystery-church', 'zahrada-kinskych',
      'platan-zahrada-kinskych', 'vodopady-zahrada-kinskych', 'socha-herkula-s-hydrou-zahrada-kinskych', 'letohradek-kinskych', 'magicka-jeskyne',
    ],
  }),
  pack({
    slug: 'wenceslas-square',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Wenceslas Square',
    localizedNames: { cz: 'Václavské náměstí', zh: '瓦茨拉夫广场' },
    foil: '#1f3f7a',
    labels: ['square', 'art-nouveau', 'functionalism', 'communism'],
    // The square from Můstek up to the two museum buildings, the houses right on
    // it, and Lucerna, Rokoko and the Světozor arcade off it (2026-11-10, user's call; Rokoko added 2026-11-12; the
    // Franciscan Garden and Our Lady of the Snows belong to Jungmannovo náměstí).
    // Took over the card of the same slug (and its cover).
    members: [
      'national-museum', 'nova-budova-narodniho-muzea', 'pomnik-sv-vaclava', 'pamatnik-palacha-zajice', 'kvetinovy-dum',
      'muzeum-studene-valky', 'palac-fenix', 'hotel-evropa-1783748217364', 'palac-knih-luxor', 'czech-bank-palace-ligna-palace-1783753023641',
      'melantrich', 'wiehluv-dum', 'palac-u-styblu', 'hotel-julis', 'adamova-lekarna', 'batuv-palac', 'palac-euro', 'darex',
      'palac-generali', 'obchodni-dum-ceskeho-svazu-vyrobnich-druzstev', 'diamant-house', 'palac-koruna', 'mustek',
      'kino-lucerna', 'palac-rokoko', 'vitraz-tesla-radio-svetozor',
    ],
  }),
  pack({
    slug: 'namesti-republiky',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Republic Square',
    localizedNames: { cz: 'Náměstí Republiky', zh: '共和国广场' },
    foil: '#6b5a1e',
    labels: ['square', 'gothic', 'art-nouveau', 'brutalism'],
    // The square and what stands right on it or just off it, the King's Court's
    // ground included; Na Příkopě is left for a pack of its own (2026-11-10,
    // user's call). Took over the card of the same slug (and its cover).
    members: [
      'municipal-house', 'powder-tower', 'divadlo-hybernia', 'kostel-sv-josefa-namesti-republiky', 'palladium-prague',
      'kotva-department-store', 'stara-celnice', 'ulicka-sv-huberta', 'hotel-kings-court-hilton-old-town',
    ],
  }),
  pack({
    slug: 'na-prikope',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Na Příkopě',
    localizedNames: { cz: 'Na Příkopě', zh: '护城河街' },
    foil: '#2c5a52',
    labels: ['street', 'medieval', 'art-nouveau', 'historicism'],
    // The old moat from Můstek to the Powder Tower and the buildings on it. The
    // four at its two ends are in the square packs too (2026-11-10, user's
    // call: the walk runs end to end). Took over the card of the same slug (and its cover).
    members: [
      'mustek', 'palac-koruna', 'palac-euro', 'haasuv-obchodni-dum', 'mango-building', 'cerna-ruze', 'palac-sylva-taroucca',
      'kostel-sv-krize', 'slovansky-dum', 'divadlo-broadway', 'ceska-eskomptni-banka', 'detsky-dum-praha', 'palac-myslbek',
      'videnska-bankovni-jednota', 'palac-zivnostenske-banky-nekazanka', 'czech-national-bank', 'powder-tower',
    ],
  }),
  pack({
    slug: 'kampa-island',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Kampa',
    localizedNames: { cz: 'Kampa', zh: '坎帕岛' },
    foil: '#3d6b2a',
    labels: ['nature', 'park', 'cultural'],
    // The island between the Čertovka and the Vltava, and the stream that makes
    // it one; the Werich Villa was added for it (2026-11-10, user's call). Took
    // over the card of the same slug (and its cover).
    members: [
      'museum-kampa-1782563427306', 'liechtenstein-palace-on-kampa-1782495483416', 'werichova-vila', 'miminka-kampa', 'certovka',
    ],
  }),
  pack({
    slug: 'malostranske-namesti',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Malostranské Square',
    localizedNames: { cz: 'Malostranské náměstí', zh: '小城广场' },
    foil: '#5e2f4a',
    labels: ['square', 'baroque', 'early-modern', 'palace'],
    // The square round St. Nicholas and what stands on it, plus St. Thomas on
    // the corner of Letenská (2026-11-10, user's call). The square had no card of its own.
    members: [
      'st-nicholas-mala-strana', 'svatomikulasska-zvonice', 'holy-trinity-column-of-lesser-town-1782494475173',
      'liechtenstein-palace-mala-strana-1782581902637', 'sternbersky-palac-mala-strana', 'palc-smiickch-czech-parliament-1782397003111',
      'malostranska-beseda', 'palac-gromlingovsky', 'kaiserstein-palace-1782406783694', 'st-thomas-church-1782394995826',
    ],
  }),
  pack({
    slug: 'prokopske-valley',
    released: '2026-11-10T15:16:00+01:00',
    name: 'Prokopské Valley',
    localizedNames: { cz: 'Prokopské údolí', zh: '普罗科普斯克峡谷' },
    foil: '#7a6a3c',
    labels: ['nature', 'geology', 'hidden-gem'],
    // The valley of the Dalejský stream from Hlubočepy at its mouth up through the
    // Prokopské and Dalejské valleys to Řeporyje, one walk of about 7 km (2026-11-10,
    // user's call). Took over the card of the same slug (and its cover).
    members: [
      'old-hluboepy-town-1783210594463', 'hlubocepsky-zamecek', 'hlubocepske-viadukty', 'hlubocepske-plotny',
      'skalnickova-zahrada-hlubocepy', 'prokopske-jezirko', 'tunel-prokopske-udoli', 'knihobudka-prokopske-udoli',
      'butovicke-hradiste', 'klukovice', 'holyne', 'dalejsky-profil', 'pozary', 'vapenka-biskup-kvis-kotrba',
      'zeleznicni-viadukt-reporyje', 'kostel-svateho-petra-a-pavla-reporyje',
    ],
  }),
  pack({
    slug: 'evropska-trida',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Evropská',
    localizedNames: { cz: 'Evropská', zh: '欧罗巴大街' },
    foil: '#4b5563',
    labels: ['street', 'contemporary', 'communism', 'brutalism'],
    // The buildings right on the avenue, from the west side of Vítězné náměstí out
    // to Vokovice, and Divoká Šárka where the trams end (2026-11-10, user's call; not
    // the square itself, which is in the Dejvice pack, or the homesteads up the slope). Took over the slug of the boulevard's
    // old card, which had become the CUBE (now `cube-vokovice`).
    members: [
      'pamatnik-ceskoslovenskym-vojakum-2-svetove-valky', 'ministry-of-defense-of-the-czech-republic-bubene-building-1782425858361',
      'the-blox', 'ppf-gate', 'diplomat-hotel-prague', 'borislavka-centrum', 'na-horu', 'sidliste-cerveny-vrch',
      'afi-vokovice', 'cube-vokovice', 'hotel-krystal', 'divoka-sarka',
    ],
  }),
  pack({
    slug: 'plzenska-ulice',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Plzeňská',
    localizedNames: { cz: 'Plzeňská', zh: '比尔森大街' },
    foil: '#9a5b1e',
    labels: ['street', 'baroque', 'classicism', 'contemporary'],
    // The buildings along the street from Anděl to Motol, plus Sacré Coeur Park,
    // which the footbridge over the street lands in (2026-11-10, user's call). Took
    // over the street's own card, slug and cover; the card was deleted. The
    // Ringhoffer works and the Nový Smíchov mall moved to the Anděl pack on
    // 2026-11-17 (user's call).
    members: [
      'lavka-novy-smichov-sacre-coeur', 'park-sacre-coeur', 'smichov-gate',
      'green-point-smichov', 'malostransky-hrbitov', 'kostel-nejsvetejsi-trojice-kosire', 'kaple-nanebevzeti-panny-marie-klamovka',
      'klamovka-1783291602610', 'kostel-sv-jana-nepomuckeho-kosire', 'zamek-motol', 'motolsky-pivovar', 'maltezsky-mlyn',
      'krucifix-motol', 'krematorium-motol',
    ],
  }),
  pack({
    slug: 'dejvice',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Dejvice',
    localizedNames: { cz: 'Dejvice', zh: '德伊维采' },
    foil: '#2f6f8f',
    labels: ['square', 'academy', 'municipal'],
    // Antonín Engel's planned Dejvice of the 1920s, not the whole quarter (Baba,
    // Hanspaulka and Šárka stay out): Vítězné náměstí, the avenues off it and the
    // technical campus (2026-11-10, user's call). The General Staff building and
    // the memorial are also the start of the Evropská pack. The square keeps its
    // own card.
    members: [
      'vitezne-namesti', 'ministry-of-defense-of-the-czech-republic-bubene-building-1782425858361',
      'pamatnik-ceskoslovenskym-vojakum-2-svetove-valky', 'victoria-palace', 'farmarske-trhy-na-kulataku',
      'jugoslavskych-partyzanu', 'park-lotysska', 'urad-mestske-casti-praha-6', 'vscht-praha', 'cvut',
      'narodni-technicka-knihovna', 'pomnik-nikoly-tesly', 'archbishops-seminary-1782602784310',
      'kostel-sv-vojtecha-dejvice', 'praha-dejvice-railway-station-1783290302038',
    ],
  }),
  pack({
    slug: 'karlin',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Karlín',
    localizedNames: { cz: 'Karlín', zh: '卡林' },
    foil: '#5a6b2a',
    labels: ['contemporary', 'historicism', 'factory', 'national-revival'],
    // The katastrální území without Rohan Island, flat and walkable from Florenc
    // to Invalidovna (2026-11-10, user's call). The slug was held by the Futurama
    // Business Park card, renamed `futurama-business-park` so the pack could take
    // it. The ten Rohan Island cards (River City and the rest) left on 2026-11-12,
    // user's call: they are in the Rohan and Libeň Islands pack, and the text says so.
    // The western tip by Těšnov (Těšnov Park, the Hilton, Diamond Point and the
    // retired Florenc card) left on 2026-11-13 for the Florenc pack, user's call;
    // the text says so.
    members: [
      'hudebni-divadlo-karlin', 'negrelliho-viadukt',
      'karlinska-kasarna', 'karlinska-synagoga', 'church-st-cyril-methodius-karlin', 'main-point-karlin',
      'corso-karln-1782667255750', 'palac-karlin', 'forum-karlin', 'afi-karlin-butterfly', 'lyckovo-namesti-inteligence',
      'zakladni-skola-lyckovo-namesti', 'cesky-rozhlas-stredni-cechy', 'invalidovna-1782562891060', 'futurama-business-park',
      'lilith-david-cerny', 'hotel-olympik',
    ],
  }),
  pack({
    slug: 'rohan-and-liben-islands',
    released: '2026-11-10T23:21:06+01:00',
    name: 'Rohan and Libeň Islands',
    localizedNames: { cz: 'Rohanský a Libeňský ostrov', zh: '罗汉岛和利本岛' },
    foil: '#3b6f8f',
    labels: ['waterbody', 'nature', 'contemporary', 'transport'],
    // The two former islands joined to the shore in the 1920s: River City and
    // everything else north of Rohanské nábřeží (the road runs on the filled-in
    // arm, cs.wikipedia), the meadow, and on Libeň Island the pub and the
    // harbour (2026-11-10, user's call). The Rohan Island cards are in the
    // Karlín pack too.
    members: [
      'celnice-severozapadni-drahy', 'danube-house', 'nile-house', 'amazon-court', 'river-diamond', 'river-city-praha',
      'rohan-business-center', 'river-garden-office', 'brana-na-rohansky-ostrov', 'rohansky-ostrov', 'hostinec-u-budyho',
      'libensky-pristav',
    ],
  }),
  pack({
    slug: 'narodni-trida',
    released: '2026-11-11T12:59:55+01:00',
    name: 'Národní třída',
    localizedNames: { cz: 'Národní třída', zh: '国家大道' },
    foil: '#7a5a1f',
    labels: ['street', 'national-revival', 'communism', 'cultural'],
    // The avenue on the filled-in moat, from the National Theatre on the river
    // to the Adria Palace at Jungmannovo náměstí, both sides (2026-11-11,
    // user's call). Took over the one-point card of the same slug (and its cover);
    // Café Slavia and Café Louvre became Lažanský Palace and Louvre Palace.
    members: [
      'national-theatre', 'laterna-magika', 'srdce-pro-vaclava-havla', 'palac-lazanskych', 'budova-akademie-ved',
      'palac-pojistovny-praha', 'topicuv-salon', 'kostel-svate-vorsily', 'klaster-vorsilek', 'palac-dunaj', 'budova-drn',
      'schirdingovsky-palac', 'pamatnik-sametove-revoluce', 'palac-louvre', 'palac-metro', 'obchodni-dum-maj',
      'galerie-vaclava-spaly', 'palac-chicago', 'palac-platyz', 'dum-umeleckeho-prumyslu', 'palac-porgesu-z-portheimu',
      'palac-adria',
    ],
  }),
  pack({
    slug: 'holesovice',
    released: '2026-11-12T22:00:00+01:00',
    name: 'Holešovice',
    localizedNames: { cz: 'Holešovice', zh: '霍莱绍维采' },
    foil: '#a63d2f',
    labels: ['factory', 'contemporary', 'cultural', 'art-nouveau'],
    // Only the old industrial Holešovice: the factories, the slaughterhouse halls, the
    // port, the power plant and what the artists and offices made of them (2026-11-12,
    // user's call). Letná and Bubny are in the Holešovice cadastral area but are not
    // in this pack (they have their own), and the text says so. The Hlávka Bridge is
    // here because it was built for the slaughterhouse; the hydroelectric station
    // stands on Štvanice island.
    members: [
      'holesovicky-pivovar', 'holesovicka-trznice', 'rockopera-praha', 'chemistry-gallery', 'artwise-the-wall',
      'trafo-gallery', 'art-gen-holesovice', 'visionary-holesovice', 'cross-club', 'la-fabrika', 'delnicka-ulice',
      'komunardu-xxxv', 'dox-centre', 'hasicska-stanice-holesovice', 'akciove-parni-mlyny', 'holesovice-docks',
      'lighthouse-tower-holesovice', 'teplarna-holesovice', 'vodni-elektrarna-stvanice', 'hlavkuv-most',
      'humanita-jan-stursa', 'stvanice', 'tokovo', 'masarykovy-skoly-holesovice', 'dum-maribor',
    ],
  }),
  pack({
    slug: 'bubny',
    released: '2026-11-12T22:00:00+01:00',
    name: 'Bubny',
    localizedNames: { cz: 'Bubny', zh: '布布尼' },
    foil: '#6a5d78',
    labels: ['world-wars', 'jewish', 'transport', 'functionalism'],
    // The old village and the rail yard (2026-11-12, user's call): from the church of
    // St. Clement and Strossmayerovo náměstí (the old Bubenské náměstí) across Bubenská
    // to Praha-Bubny station, the Gate of No Return and the yard's northern end.
    // Not in the Holešovice pack, which is the old industrial part only.
    members: [
      'kostel-sv-klimenta-bubny', 'anthony', 'euspa-praha', 'delnicka-urazova-pojistovna', 'wpp-praha-bubenska',
      'veletrzni-palace', 'mama-shelter-praha', 'policejni-prezidium-cr', 'maly-berlin', 'praha-bubny-station',
      'brana-nenavratna', 'praha-holesovice-nadrazi', 'ulice-nicholase-wintona',
    ],
  }),
  pack({
    slug: 'florenc',
    released: '2026-11-13T14:10:00+01:00',
    name: 'Florenc',
    localizedNames: { cz: 'Florenc', zh: '弗洛伦茨' },
    foil: '#2f5d8a',
    labels: ['transport', 'municipal', 'contemporary', 'communism'],
    // Florenc on both sides of the flyover (2026-11-13, user's call): Na Florenci
    // with Masaryk Station, the bus station and the museum on the New Town side,
    // the Těšnov embankment with its two interwar ministries, and Karlín's western
    // tip, which left the Karlín pack. The Musical Theatre and the Negrelli Viaduct
    // stay in Karlín. Took over the one-point Florenc card's slug and cover; a new card
    // for the metro station and its clock now stands at that card's spot.
    members: [
      'masarykovo-nadrazi', 'masarycka-building', 'city-of-prague-museum', 'florenc-bus-terminal', 'severojizni-magistrala',
      'park-tesnov', 'ministry-of-agriculture-building-1783752679810', 'building-of-ministry-of-transport-1782931759410',
      'hilton-prague', 'diamond-point-1783752450170', 'stanice-metra-florenc', 'florentinum', 'hotel-opera-tesnov',
      'pamatnik-obetem-kolektivizace',
    ],
  }),
  pack({
    slug: 'kunratice',
    released: '2026-11-13T23:18:00+01:00',
    name: 'Kunratice',
    localizedNames: { cz: 'Kunratice', zh: '昆拉蒂采' },
    foil: '#24503a',
    labels: ['castle and fortress', 'medieval', 'baroque', 'nature'],
    // The old village of Kunratice with its chateau, church and legionnaire memorial,
    // Šeberák pond and Kunratice Forest with Wenceslas IV's Nový hrad (2026-11-14,
    // user's call). The forest lies in the Chodov cadastral area but carries the
    // village's name, and the text says so. A new slug: Kunratice had no
    // one-point card to take over.
    members: [
      'st-james-apostle', 'kunratice-fortress-1783377528490', 'monument-to-the-legionnaires-fallen-in-the-world-war-1783377752694',
      'rybnik-seberak', 'kunraticky-forest', 'new-castle-ruins-near-kunratice-1783003399902', 'namesti-prezidenta-masaryka-kunratice',
      'kalvarie-u-tri-svatych', 'zamecky-park-kunratice',
    ],
  }),
  pack({
    slug: 'zbraslav',
    released: '2026-11-13T23:18:00+01:00',
    name: 'Zbraslav',
    localizedNames: { cz: 'Zbraslav', zh: '兹布拉斯拉夫' },
    foil: '#6e3a3a',
    labels: ['palace', 'baroque', 'villa', 'medieval'],
    // Only the historic town (2026-11-14, user's call): the monastery and château
    // with St James, the square and its memorial, Havlín hill with St Gall and
    // Charles's Pavilion, the villas, the Peace Race Bridge and the station across
    // the river (a new card). Left out, though in the cadastral area: the South
    // Pole of Prague, the quarry and the Chapel of Our Lady further south. Took
    // over the one-point Zbraslav card's slug and cover.
    members: [
      'zbraslavsky-zamek', 'kostel-svateho-jakuba-vetsiho-zbraslav', 'pomnik-obetem-1-svetove-valky-zbraslav',
      'kostel-svateho-havla-zbraslav', 'karluv-stanek', 'vila-vladislava-vancury', 'ottova-vila-zbraslav',
      'most-zavodu-miru', 'praha-zbraslav-nadrazi', 'zbraslavske-namesti', 'zvonarna-manousek-zbraslav',
      'storchova-vila', 'klasterni-pivovar-zbraslav', 'myslivna-zbraslav', 'vila-plana-ruze',
    ],
  }),
  pack({
    slug: 'podoli',
    released: '2026-11-14T00:02:00+01:00',
    name: 'Podolí',
    localizedNames: { cz: 'Podolí', zh: '波多利' },
    foil: '#1f6e6a',
    labels: ['municipal', 'factory', 'geology', 'communism'],
    // Podolí along the river from the maternity hospital below Vyšehrad to the
    // Yellow Baths, plus Kavčí hory on the plateau above (2026-11-14, user's call;
    // the Gemüse Corner kebab shop left out). New slug, no one-point card.
    members: [
      'porodnice-podoli', 'kostel-svateho-michaela-archandela-podoli', 'podolska-vodarna', 'podol-swimming-stadium-1783209825060',
      'podol-profile-1783209955360', 'zlute-lazne', 'dvorecky-most', 'dormitory-podol-vut-1784077386723', 'nedvedovo-namesti',
      'televizni-stredisko-kavci-hory', 'veslarsky-ostrov', 'podolske-nabrezi',
    ],
  }),
  pack({
    slug: 'barrandov',
    released: '2026-11-14T00:02:00+01:00',
    name: 'Barrandov',
    localizedNames: { cz: 'Barrandov', zh: '巴兰多夫' },
    foil: '#6b3f7a',
    labels: ['cultural', 'functionalism', 'geology', 'communism'],
    // The Barrandov hill (2026-11-14, user's call): the rocks and terraces, the film
    // studios and their backlot, the housing estate and its tram line. Left out:
    // Zlíchov, old Hlubočepy (the Prokop Valley pack), the Barrandov Bridge and the
    // Hippo Bath at its end. New slug, no one-point card.
    members: [
      'barrandovske-skaly', 'barrandovske-terasy', 'filmove-ateliery-barrandov', 'historical-town-backlot-1783281864604',
      'plastika-chaplin-nemy-film', 'barrandov-castle-1783283188320', 'hluboepy-sdlit-barrandov-tramline-1783281425152', 'tramvajova-zastavka-geologicka',
      'tramvajova-zastavka-k-barrandovu', 'barrandovska-vilova-ctvrt', 'kostel-krista-spasitele-barrandov',
      'pegas-barrandov', 'trnkovo-namesti',
    ],
  }),
  pack({
    slug: 'vrsovice',
    released: '2026-11-14T00:02:00+01:00',
    name: 'Vršovice',
    localizedNames: { cz: 'Vršovice', zh: '弗尔绍维采' },
    foil: '#2f6b3f',
    labels: ['church', 'functionalism', 'art-nouveau', 'factory'],
    // Only old Vršovice (2026-11-14, user's call): around Vršovické náměstí and
    // náměstí Svatopluka Čecha, with Ďolíček, KOH-I-NOOR and the station. Left out:
    // the Eden quarter (Slavia's stadium, the ministry, Eden, Vlasta, Kubánské
    // náměstí), the Míčánky courts and the rail depot. Took over the one-point
    // Vršovice card (vrovice-1784036943824) and its cover. The Chemapol building
    // (2026-11-17) is the one exception from the Eden side, user's call.
    members: [
      'kostel-sv-mikulase-vrsovice', 'vrovice-castle-1782567405263', 'vrsovicka-zalozna', 'husuv-sbor-vrsovice',
      'kostel-sv-vaclava-vrsovice', 'dolicek', 'koh-i-noor', 'praha-vrsovice-nadrazi', 'krymska-ulice',
      'heroldovy-sady', 'cukrovar-vrsovice', 'zed-street-artu-moskevska', 'budova-chemapolu',
    ],
  }),
  pack({
    slug: 'jizni-mesto',
    released: '2026-11-14T00:02:00+01:00',
    name: 'Jižní Město',
    localizedNames: { cz: 'Jižní Město', zh: '南城' },
    foil: '#4f6d7a',
    labels: ['communism', 'brutalism', 'contemporary', 'castle and fortress'],
    // Háje and Chodov (2026-11-14): the estate from the Chodov fortress and
    // Westfield to Háje metro and the edge of the Milíčov woods. The Háje card stays
    // a card (it is only part of the estate); Kunratice Forest is in the Kunratice
    // pack. New slug.
    members: [
      'haje', '-1783379166594', 'cosmonauts-monument-1783380746060', 'chodovska-tvrz',
      'westfield-chodov', 'the-park-chodov', 'narodni-archiv', 'komunitni-centrum-matky-terezy',
      'zoopark-milicov', 'hotel-opatov-a-sandra', 'centralni-park-jizniho-mesta', 'litochlebske-namesti',
    ],
  }),
  pack({
    slug: 'porici',
    released: '2026-11-16T20:00:00+01:00',
    name: 'Poříčí',
    localizedNames: { cz: 'Poříčí', zh: '波日奇' },
    foil: '#5c4a2e',
    labels: ['medieval', 'church', 'functionalism', 'historicism'],
    // The vanished settlement of Poříčí (2026-11-16, user's call): between
    // Revoluční and Těšnov, from Na Poříčí, both sides of it, up to the river.
    // The two ministries on the embankment, Hotel Opera and the Museum of the City
    // of Prague are shared with the Florenc pack. New slug, no one-point card.
    members: [
      'kostel-sv-petra-na-porici', 'petrska-vez', 'kostel-sv-klimenta', 'novomlysnska-water-tower',
      'bila-labut', 'cafe-imperial', 'czechoslovak-legion-bank-palace-archa-1782602584041', 'revolucni',
      'building-of-ministry-of-transport-1782931759410', 'ministry-of-agriculture-building-1783752679810',
      'hotel-opera-tesnov', 'city-of-prague-museum',
      'petrske-namesti', 'delnicka-urazova-pojistovna-na-porici', 'zriceni-domu-na-porici-1928', 'hotel-axa',
      'kindluv-dum', 'biskupsky-dvur', 'palac-ymca',
    ],
  }),
  pack({
    slug: 'karlovo-namesti',
    released: '2026-11-16T22:00:00+01:00',
    name: 'Charles Square',
    localizedNames: { cz: 'Karlovo náměstí', zh: '查理广场' },
    foil: '#2e4f6b',
    labels: ['square', 'gothic', 'baroque', 'world-wars'],
    // Charles Square, the old Cattle Market, and what stands right by it
    // (2026-11-16, user's call): the square from the New Town Hall to the Faust
    // House, the hospital and the old criminal court at its edges, Resslova down
    // to Cyril and Methodius and St Wenceslas at Zderaz, and St John on the Rock at
    // the south end. Emmaus is left out (it belongs with Palacký Square). Took over
    // the one-point Charles Square card's slug and cover.
    members: [
      'novomestska-radnice', 'brauniv-dum', 'kasna-se-sochou-svateho-josefa', 'pomnik-karoliny-svetle',
      'kostel-sv-ignace', 'budova-byvale-ceske-polytechniky', 'charles-square-center', 'faustuv-dum',
      'budova-byvaleho-ck-trestniho-soudu', 'vseobecna-fakultni-nemocnice', 'cathedral-cyril-methodius',
      'kostel-sv-vaclava-na-zderaze',
      'dvorakuv-dum-zitna', 'jezuitska-kolej-karlovo-namesti', 'pomnik-vitezslava-halka',
      'pomnik-jana-evangelisty-purkyne', 'park-karlovo-namesti',
    ],
  }),
  pack({
    slug: 'josefov',
    released: '2026-11-16T21:40:00+01:00',
    name: 'Josefov',
    localizedNames: { cz: 'Josefov', zh: '约瑟夫城' },
    foil: '#47406b',
    labels: ['jewish', 'medieval', 'historicism', 'art-nouveau'],
    // The old Jewish Town within its own katastrální území (2026-11-16, user's
    // call): the synagogues, the Old Jewish Cemetery, the Town Hall, Pařížská and
    // the Faculty of Arts. The Holy Spirit and Holy Saviour churches, Kafka's
    // birthplace and Jan Palach Square with the Rudolfinum are left out. Took
    // the slug from the Spanish Synagogue's card, now `spanelska-synagoga`.
    members: [
      'old-new-synagogue-1782601630704', 'old-jewish-cemetery', 'spanelska-synagoga', 'pinkas-synagogue',
      'maiselova-synagoga', 'klausova-synagoga', 'vysoka-synagoga', 'nova-obradni-sin', 'zidovska-radnice',
      'kafka-statue', 'dum-obchodnickeho-spolku-merkur', 'faculty-of-arts-uk',
      'socha-mojzise', 'umeleckoprumyslove-museum',
    ],
  }),
  pack({
    slug: 'dvorakovo-nabrezi',
    released: '2026-11-17T17:40:00+01:00',
    name: 'Dvořák Embankment',
    localizedNames: { cz: 'Dvořákovo nábřeží', zh: '德沃夏克河堤' },
    foil: '#2a5d73',
    labels: ['waterbody', 'bridge', 'brutalism', 'historicism'],
    // The buildings on the river itself, from the Faculty of Law to the Štefánik
    // Bridge (2026-11-17, user's call: riverside only). Jan Palach Square with the
    // Rudolfinum, the Mánes and Dvořák statues is the next pack; St Agnes, St
    // Castulus, Sts Simon and Jude and the smallest house stand inland and stay
    // out, as does Merkur Palace across Revoluční. Took over the one-point
    // embankment card's slug and cover. Curie Square and the Fairmont moved to
    // the Pařížská pack on 2026-11-20 (user's call); KodlContemporary is shared.
    // The conservatory's Theatre Na Rejdišti (public entrance from the embankment)
    // joined on 2026-11-20 at the west end, before the Faculty of Law.
    members: [
      'divadlo-na-rejdisti', 'pravnicka-fakulta-uk-knihovna',
      'kodl-contemporary', 'hotel-president', 'cechuv-most', 'sochy-geniu-cechuv-most',
      'pristaviste-u-cechova-mostu', 'nemocnice-na-frantisku', 'ministerstvo-prumyslu-a-obchodu',
      'stefanikuv-most',
    ],
  }),
  pack({
    slug: 'namesti-jana-palacha',
    released: '2026-11-17T19:30:00+01:00',
    name: 'Jan Palach Square',
    localizedNames: { cz: 'Náměstí Jana Palacha', zh: '扬·帕拉赫广场' },
    foil: '#6b2f3a',
    labels: ['square', 'cultural', 'communism', 'historicism'],
    // The square and what frames it (2026-11-17): the Rudolfinum with the Dvořák
    // statue, the Mánes Bridge and statue, the Museum of Decorative Arts and the
    // Faculty of Arts (both shared with Josefov), UMPRUM, the Fourteen Hearts
    // memorial and Hejduk's Palach memorial. Lea Vivot's bench by the Four Seasons
    // is too far down the embankment. New slug.
    members: [
      'rudolfinum', 'socha-antonina-dvoraka', 'josef-manes-monument-1782932267279', 'manesuv-most',
      'umeleckoprumyslove-museum', 'faculty-of-arts-uk', 'pamatnik-ctrnact-srdci',
      'vysoka-skola-umeleckoprumyslova', 'pamatnik-jana-palacha-sousosi',
    ],
  }),
  pack({
    slug: 'ujezd',
    released: '2026-11-17T20:30:00+01:00',
    name: 'Újezd',
    localizedNames: { cz: 'Újezd', zh: '乌耶兹德' },
    foil: '#4f5d2f',
    labels: ['street', 'church', 'communism', 'early-modern'],
    // The street at the foot of Petřín and the old village it was named after
    // (2026-11-17): from the Museum of Music (Újezd 50 / Karmelitská) to the Pink
    // Tank on Kinských square where the street ends, with St John the Baptist Na
    // Prádle and St Lawrence (the two village churches), Tyrš House, the Memorial
    // to the Victims of Communism, the Hunger Wall (shared with Petřín) and the
    // Baroque walls. Took over the one-point Újezd card (two check-ins) and its cover.
    members: [
      'czech-museum-of-music', 'church-of-john-the-baptist-in-prague-1782392522439',
      'kostel-sv-vavrence-mala-strana', 'tyrs-house-1782409888726',
      'memorial-to-the-victims-of-communism-1782565714871', 'hunger-wall-1782410203381',
      'marianske-hradby-rosickych', 'torzo-tanku',
    ],
  }),
  pack({
    slug: 'maltezske-namesti',
    released: '2026-11-17T21:30:00+01:00',
    name: 'Malta Square',
    localizedNames: { cz: 'Maltézské náměstí', zh: '马耳他广场' },
    foil: '#8f2a2a',
    labels: ['square', 'church', 'palace', 'medieval'],
    // The Knights of St John's corner of the Lesser Town (2026-11-17): Our Lady
    // beneath the Chain and the Grand Priory, the Lennon Wall, the palaces of
    // Malta Square and Grand Priory Square, Havel's bench and Brokoff's St John
    // the Baptist. The old Malta Square card was turned into that statue (same
    // slug and spot, user's call), so the pack has a new slug. Our Lady
    // Victorious and Saxon House belong to Karmelitská and Mostecká.
    members: [
      'malta-square-1782492877948', 'virgin-mary-under-chain-1782394339035', 'mala-strana',
      'john-lennon-wall', 'buquoy-palace-embassy-of-france-1782407266228', 'lavicka-vaclava-havla',
      'nostick-palace-ministry-of-culture-of-the-czech-republic-1782395857267',
      'velkoprevorsky-mlyn', 'turbovsky-palac', 'dum-u-zlateho-jednorozce-lazenska',
    ],
  }),
  pack({
    slug: 'andel',
    released: '2026-11-17T22:30:00+01:00',
    name: 'Anděl',
    localizedNames: { cz: 'Anděl', zh: '安德尔' },
    foil: '#3f6f7a',
    labels: ['contemporary', 'functionalism', 'transport', 'communism'],
    // The Smíchov crossroads and what grew around it (2026-11-17): Zlatý Anděl,
    // the Nový Smíchov mall and the Ringhoffer works (both moved here from
    // Plzeňská, user's call), the synagogue, the Women's Homes, Na Knížecí, the
    // V4 mural and the Staropramen visitor centre. The náměstí 14. října cluster
    // to the north (St Wenceslas, the town hall, market hall, National House)
    // stays out. Took over the Anděl Pedestrian Zone card's slug and cover; the
    // card was deleted (user's call).
    members: [
      'zlaty-andel', 'oc-novy-smichov', 'ringhofferovy-zavody', 'smichovska-synagoga',
      'zenske-domovy', 'na-knizeci-bus-terminal', '30-years-of-v4-mural-1783626154504',
      'staropramen-navstevnicke-centrum', 'stanice-metra-andel', 'manifesto-market-andel',
    ],
  }),
  pack({
    slug: 'stary-smichov',
    released: '2026-11-17T23:30:00+01:00',
    name: 'Old Smíchov',
    localizedNames: { cz: 'Starý Smíchov', zh: '斯米霍夫老城中心' },
    foil: '#7a4a2a',
    labels: ['square', 'historicism', 'art-nouveau', 'baroque'],
    // The old town centre of Smíchov (2026-11-17): Náměstí 14. října with St
    // Wenceslas, the National House, the market hall and the Bear Fountain, and
    // Štefánikova with the town hall, the Švanda Theatre, Portheimka and Prager's
    // bank, plus Arbes Square and the regional authority. The KGB Museum card
    // stays out; the Justice Palace and the Chasm of Time belong to Kinských
    // square. New slug. Dientzenhofer Gardens by Jirásek Bridge joined the
    // same day as a new card; the Lesser Town Water Tower, on the river, waits
    // for a Smíchov embankment pack (user's call).
    members: [
      'kostel-sv-vaclava-smichov', 'narodni-dum-na-smichove', 'smchov-market-hall-1782866198316', 'medvedi-kasna',
      'smchov-town-hall-1783626407856', 'svandovo-divadlo-smichov', 'portheimka', 'arbesovo-namesti',
      'budova-banky-stefanikova-smichov', 'krajsky-urad-stredoceskeho-kraje',
      'dienzenhoferovy-sady',
    ],
  }),
  pack({
    slug: 'krizovnicke-namesti',
    released: '2026-11-18T12:00:00+01:00',
    name: 'Křižovnické Square',
    localizedNames: { cz: 'Křižovnické náměstí', zh: '十字军骑士广场' },
    foil: '#3f6b5c',
    labels: ['square', 'baroque', 'church', 'gothic'],
    // The Old Town end of Charles Bridge (2026-11-18): the square itself (bridge
    // tower, the Knights of the Cross church, the Holy Saviour, Charles IV), the
    // first steps of Karlova (the French Crown and
    // Colloredo-Mansfeld) and Novotného lávka (Smetana Museum, water tower,
    // Smetana monument, weir, Karlovy lázně). Charles Bridge and its statues are
    // left for a bridge pack of their own; Embryo, Bellevue and Lea Vivot's bench
    // lie further along the embankment; the Klementinum, St Clement and the
    // Astronomical Tower stand too far back from the square (user's call). New
    // slug, the square had no card.
    members: [
      'staromestska-mostecka-vez', 'kostel-sv-frantiska-z-assisi', 'kostel-sv-salvatora',
      'monument-to-charles-iv-1783353104539', 'dum-u-francouzske-koruny',
      'colloredo-mansfeldsky-palac', 'smetana-museum', 'staromestska-vodarenska-vez',
      'pomnik-bedricha-smetany', 'staromestsky-jez', 'karlovy-lazne',
    ],
  }),
  pack({
    slug: 'mostecka',
    released: '2026-11-18T14:00:00+01:00',
    name: 'Mostecká',
    localizedNames: { cz: 'Mostecká', zh: '大桥街' },
    foil: '#7a3f4f',
    labels: ['street', 'baroque', 'gothic', 'palace'],
    // The Lesser Town bridgehead (2026-11-18): Mostecká from the bridge towers to
    // Malostranské náměstí, with Saxon House, Kaunitz Palace and Grömling Palace
    // at the top (shared with Malostranské náměstí), plus the two side streets'
    // St Joseph (Josefská) and the Golden Unicorn (Lázeňská, shared with Malta
    // Square). Kaiserstein Palace stands on the square itself and stays out, as do
    // the Charles Bridge statues. Took over the one-point street card
    // (`mosteck-bridge-ave-1782391331744`, two check-ins) and its cover; the card
    // was deleted (user's call), keeping the name Mostecká. The House at the
    // Three Ostriches (with the bishops' court story) and Saská ulička were
    // added for it the same day.
    members: [
      'malostranska-mostecka-vez', 'saxon-house-1782424496089',
      'kaunitz-palace-embassy-of-serbia-1782493255720', 'palac-gromlingovsky',
      'st-josephs-church-1782390038875', 'dum-u-zlateho-jednorozce-lazenska',
      'dum-u-tri-pstrosu', 'saska-ulicka',
    ],
  }),
  pack({
    slug: 'vlasska',
    released: '2026-11-18T16:00:00+01:00',
    name: 'Vlašská',
    localizedNames: { cz: 'Vlašská', zh: '意大利街' },
    foil: '#8a5a2a',
    labels: ['street', 'embassy', 'baroque', 'communism'],
    // The street from Tržiště up to the Raoul Wallenberg promenade below Petřín
    // (2026-11-18, user's call: only what stands on the street or close by):
    // Schönborn Palace on the corner, Lobkowicz Palace with the Quo Vadis
    // Trabant in its garden, the Italian Hospital and the Sisters of Mercy
    // hospital. The Vrtba Garden opens onto Karmelitská and the Seminary Garden
    // belongs to Petřín. The House at the Great Shoe (Erben's house, 1857-67,
    // opposite the embassy) joined the same day as a new card (user's call).
    // New slug.
    members: [
      'schnborn-palace-embassy-of-the-us-1782396405461', 'lobkovick-palace-german-embassy-1782395580834',
      'quo-vadis-trabant', 'dum-u-velkeho-strevice', 'italian-hospital-1782409426667',
      'nemocnice-milosrdnych-sester',
    ],
  }),
  pack({
    slug: 'nerudova',
    released: '2026-11-18T22:00:00+01:00',
    name: 'Nerudova',
    localizedNames: { cz: 'Nerudova', zh: '聂鲁达街' },
    foil: '#4a5a8a',
    labels: ['street', 'embassy', 'baroque', 'palace'],
    // The steep street from Malostranské náměstí up to the bend into Ke Hradu
    // (2026-11-18, user's call): Morzin Palace (Romanian Embassy) and U
    // Kajetánů, plus five new cards for it: Thun-Hohenstein Palace (Italian
    // Embassy), Bretfeld Palace and the house signs At the Two Suns (Neruda's
    // home), At the Three Fiddles and At the Golden Horseshoe. The Palace of the
    // Lords of Hradec is on the Castle Steps and Hradčany Square is its own
    // place, so both stay out. New slug.
    members: [
      'morzin-palace-1782409018600', 'dum-u-tri-houslicek', 'thun-hohenstejnsky-palac', 'u-kajetanu',
      'dum-u-zlate-podkovy', 'bretfelduv-palac', 'dum-u-dvou-sluncu',
    ],
  }),
  pack({
    slug: 'male-namesti',
    released: '2026-11-19T00:50:00+01:00',
    name: 'Little Square',
    localizedNames: { cz: 'Malé náměstí', zh: '小广场' },
    foil: '#8a6a2a',
    labels: ['square', 'gothic', 'renaissance', 'historicism'],
    // The little triangular square beside the Old Town Hall, only what stands
    // on it (2026-11-19, user's call): the fountain, the House at the Minute
    // and the Golden Unicorn (both moved from Old Town Square), Richter House,
    // the old Golden Angel card rewritten as the House at the Angel, and two
    // new cards, Rott House and the Golden Lily. Michalská, Melantrichova and
    // Karlova stay out. New slug.
    members: [
      'kasna-na-malem-namesti', 'rottuv-dum', 'dum-u-minuty', 'dum-u-zlateho-jednorozce-staromestske-namesti',
      'dum-u-zlateho-andela', 'richtruv-dum', 'dum-u-zlate-lilie',
    ],
  }),
  pack({
    slug: 'marianske-namesti',
    released: '2026-11-19T01:28:00+01:00',
    name: 'Marian Square',
    localizedNames: { cz: 'Mariánské náměstí', zh: '圣母广场' },
    foil: '#5a4a6e',
    labels: ['square', 'baroque', 'art-nouveau', 'sculpture'],
    // The square between the Klementinum and the New Town Hall (2026-11-19,
    // user's call): the Klementinum (east entrance on the square) with its
    // Astronomical Tower, the New Town Hall with Rabbi Löw and the new Iron
    // Man card on its corners, the City Library with the mayor's residence,
    // Clam-Gallas Palace (its side and garden wall face the square) and the new
    // Terezka fountain card. St Clement (Karlova), U Zlatého tygra (Husova)
    // and Kafka's birthplace stay out. New slug.
    members: [
      'national-library-czech-republic', 'astronomicka-vez-klementina', 'nova-radnice-marianske-namesti',
      'socha-rabiho-lowa', 'socha-zelezny-muz', 'rezidence-primatora', 'clam-gallasuv-palac', 'kasna-terezka',
    ],
  }),
  pack({
    slug: 'ovocny-trh',
    released: '2026-11-19T01:40:00+01:00',
    name: 'Fruit Market',
    localizedNames: { cz: 'Ovocný trh', zh: '水果市场' },
    foil: '#8a4a3a',
    labels: ['square', 'medieval', 'classicism', 'cubism'],
    // The triangular square between Celetná and the Estates Theatre
    // (2026-11-19, user's call): the Carolinum, the Estates Theatre, the new
    // card Kolowrat Palace, the House of the Black Madonna on the Celetná
    // corner and the Men's Passage that opens onto it. Took over the
    // one-point square card's slug and cover (one check-in), the card deleted.
    // Chromy's Commendatore was removed in 2025 and is only mentioned in the
    // theatre card. The Wimmer Palace (Rytířská), St Gall and Celetná stay out.
    members: [
      'estates-theatre', 'karolinum', 'kolowratsky-palac-ovocny-trh', 'dum-u-cerne-matky-bozi', 'panska-pasaz',
    ],
  }),
  pack({
    slug: 'jindrisska',
    released: '2026-11-19T12:00:00+01:00',
    name: 'Jindřišská',
    localizedNames: { cz: 'Jindřišská', zh: '圣亨利街' },
    foil: '#5a6a3a',
    labels: ['street', 'gothic', 'art-nouveau', 'historicism'],
    // The street from Wenceslas Square to Senovážné náměstí (2026-11-19,
    // user's call): Generali Palace and Družba on its two corners with the
    // square (shared with the Wenceslas Square pack), the Main Post Office,
    // the new cards Hotel Palace (Panská corner) and Harrach Palace, the
    // Mucha Museum a few steps up Panská, St Henry and its belfry, and at the
    // far end Senovážné náměstí's Sugar Industry Palace and Czech Musicians.
    // The Jerusalem Synagogue (Jeruzalémská) stays out. New slug.
    members: [
      'palac-generali', 'obchodni-dum-ceskeho-svazu-vyrobnich-druzstev', 'czech-post-jindrisska', 'hotel-palace-panska',
      'mucha-museum', 'harrachovsky-palac-jindrisska', 'kostel-sv-jindricha', 'jindrisska-vez',
      'cukrovarnicky-palac', 'cesti-muzikanti',
    ],
  }),
  pack({
    slug: 'celetna',
    released: '2026-11-19T19:00:00+01:00',
    name: 'Celetná',
    localizedNames: { cz: 'Celetná', zh: '采列特纳街' },
    foil: '#7a3a4a',
    labels: ['street', 'gothic', 'baroque', 'palace'],
    // The first stretch of the Royal Way, Old Town Square to the Powder Tower
    // (2026-11-19, user's call): the White Unicorn on the square corner
    // (shared with Old Town Square), eight new cards (Sixt House, the Three
    // Kings, the Hrzán and Caretto-Millesimo palaces, the Baťa store, the
    // Menhart Palace, the Golden Angel, the Pachta Palace), the Black Madonna
    // (shared with the Fruit Market) and at the far end the Broadway, the
    // Czech Discount Bank and the Powder Tower (shared with Na Příkopě).
    // Took over the one-point street card's slug and cover (two check-ins),
    // the card deleted. Týn Church, Ungelt and St James stand off the street.
    members: [
      'trckovsky-dum', 'sixtuv-dum', 'dum-u-tri-kralu', 'palac-hrzanu-celetna', 'millesimovsky-palac',
      'obchodni-dum-bata-celetna', 'menhartovsky-palac', 'dum-u-zlateho-andela-celetna', 'palac-pachtu-celetna',
      'dum-u-cerne-matky-bozi', 'divadlo-broadway', 'ceska-eskomptni-banka', 'powder-tower',
    ],
  }),
  pack({
    slug: 'palackeho-namesti',
    released: '2026-11-20T12:00:00+01:00',
    name: 'Palacký Square',
    localizedNames: { cz: 'Palackého náměstí', zh: '帕拉茨基广场' },
    foil: '#6b5a2e',
    labels: ['square', 'monument', 'national-revival', 'gothic'],
    // Where the New Town comes down to the river, on the site of old Podskalí
    // (2026-11-20, user's call): Sucharda's Palacký Monument (the old one-point
    // square card, rewritten as the monument and renamed
    // `pomnik-frantiska-palackeho` with its cover), the bridge, the embankment
    // with the Náplavka below, Emmaus and St John on the Rock (moved here
    // from Charles Square on 2026-11-20: it faces Emmaus across Vyšehradská), Hypšman's ministries (the new card for the Ministry of
    // Labour; the Ministry of Health on the square has none), and to the south
    // the Holy Trinity church of old Podskalí and the old poorhouse that is now
    // the Ministry of Justice, plus Mařatka's legionary memorial on náměstí Pod
    // Emauzy (new card). Zítkovy sady is only named in the text. The Výtoň
    // customs house and Botel Admirál stay out.
    members: [
      'pomnik-frantiska-palackeho', 'palackeho-most', 'rasinovo-nabrezi', 'emmaus-monastery-1782494564055',
      'kostel-sv-jana-na-skalce', 'ministerstvo-prace-a-socialnich-veci', 'pomnik-praha-svym-viteznym-synum', 'kostel-nejsvetejsi-trojice-spalena',
      'ministerstvo-spravedlnosti',
    ],
  }),
  pack({
    slug: 'branik',
    released: '2026-11-20T18:00:00+01:00',
    name: 'Braník',
    localizedNames: { cz: 'Braník', zh: '布拉尼克' },
    foil: '#3e6b5a',
    labels: ['village-and-town', 'factory', 'nature', 'baroque'],
    // Old Braník and what lies close by, not the whole katastrální území
    // (2026-11-20, user's call): the Dominican Courtyard, St Prokop, the
    // theatre, the new cards for the Hus monument on Branické náměstí and the
    // Na Křížku château on the slope, the Balance sculpture, the Braník rocks
    // with the Dobeška viewpoint and the Evangelical church below them, and
    // to the south the ice houses and the brewery. Barrandov Bridge, the
    // railway bridge and TESLA stay out. Took over the one-point Old Braník
    // card's cover (two check-ins), the card deleted. New slug.
    members: [
      'dominikansky-dvur', 'kostel-sv-prokopa-branik', 'branicke-divadlo', 'pomnik-jana-husa-branik', 'zamecek-na-krizku',
      'balance-sculpture-1783548889811', 'brank-rock-cliff-1783427336440', 'viewpoint-dobeka-1782864480282',
      'evangelicky-kostel-branik', 'branicke-ledarny', 'brank-brewery-1782863740784',
    ],
  }),
  pack({
    slug: 'parizska',
    released: '2026-11-20T21:00:00+01:00',
    name: 'Pařížská',
    localizedNames: { cz: 'Pařížská', zh: '巴黎大街' },
    foil: '#6b4a5e',
    labels: ['street', 'art-nouveau', 'historicism', 'jewish'],
    // The boulevard cut through the Jewish Town around 1900, from Old Town
    // Square to Čech Bridge (2026-11-20, user's call): St Nicholas and Schier
    // House on the square corners, the Merkur house, the Old-New Synagogue and
    // Bílek's Moses beside it, and at the river end Curie Square, the Fairmont
    // (Pařížská 30; both moved here from the Dvořák Embankment pack) and
    // KodlContemporary, its glass corner extension (shared with the
    // embankment). Took over the one-point street card's slug and cover (two
    // check-ins), the card deleted; it also left the Josefov pack.
    members: [
      'kostel-sv-mikulase-stare-mesto', 'schieruv-dum', 'dum-obchodnickeho-spolku-merkur',
      'old-new-synagogue-1782601630704', 'socha-mojzise', 'namesti-curieovych', 'fairmont-golden-prague', 'kodl-contemporary',
    ],
  }),
  pack({
    slug: 'nuselske-udoli',
    released: '2026-11-20T23:00:00+01:00',
    name: 'Nusle Valley',
    localizedNames: { cz: 'Nuselské údolí', zh: '努斯莱山谷' },
    foil: '#4a5a72',
    labels: ['bridge', 'communism', 'nature', 'gothic'],
    // The valley of the Botič under the Nusle Bridge and what stands on its
    // rims, not the whole katastrální území (2026-11-20, user's call): the
    // bridge, the metro station, the Congress Centre and the twin towers of the
    // Grand Hotel on the Pankrác end; Folimanka with its park, sports hall,
    // shelter and Kintera's sculpture; the Artistic Garden; down the valley the
    // Fidlovačka theatre and the Nusle brewery; and on the Karlov rim the
    // church, the Police Museum in its monastery, the Bastion of the Wayside
    // Shrine and the Ztracenka garden (new card) with the memorial to the victims
    // of two totalitarian regimes on its terrace. Took
    // over the one-point Nusle Valley card's slug and cover (two check-ins), the
    // card deleted; the Valley of Laments achievement now asks for this pack.
    members: [
      'nusle-bridge', 'vysehrad-stanice-metra', 'kongresove-centrum-praha', 'grand-hotel-prague-towers',
      'sportovni-hala-folimanka', 'kryt-folimanka', 'kristof-kintera-rozhodnuti',
      'umelecka-zahrada-nusle', 'divadlo-na-fidlovacce', 'nuselsky-pivovar',
      'karlov-church', 'muzeum-policie-cr', 'bastion-u-bozich-muk', 'zahrada-ztracenka', 'pomnik-obetem-dvou-totalitnich-rezimu',
    ],
  }),
  pack({
    slug: 'namesti-miru',
    released: '2026-11-21T00:30:00+01:00',
    name: 'Náměstí Míru',
    localizedNames: { cz: 'Náměstí Míru', zh: '和平广场' },
    foil: '#7a5a3a',
    labels: ['square', 'church', 'historicism', 'art-nouveau'],
    // The heart of Vinohrady and the ring of buildings round it (2026-11-21,
    // user's call), not the I. P. Pavlova end: St Ludmila, the Vinohrady
    // Theatre, the National House and the old town hall (new cards), the Čapek
    // brothers' monument, the metro station and the old Tobacco Administration
    // on Slezská, now the Municipal Court (new card). The slug was
    // the basilica's card, renamed `bazilika-sv-ludmily` with its cover (its
    // History link moved with it). The market hall (Vinohradský pavilon) stands
    // two blocks east and stays out.
    members: [
      'bazilika-sv-ludmily', 'divadlo-na-vinohradech', 'narodni-dum-na-vinohradech', 'vinohradska-radnice',
      'pomnik-bratri-capku', 'metro-station-namesti-miru-1783382951167', 'mestsky-soud-slezska',
    ],
  }),
  pack({
    slug: 'grebovka',
    released: '2026-11-21T02:00:00+01:00',
    name: 'Grébovka',
    localizedNames: { cz: 'Grébovka (Havlíčkovy sady)', zh: '格雷波夫卡' },
    foil: '#4a6b3a',
    labels: ['park', 'villa', 'historicism', 'nature'],
    // Moritz Gröbe's park, Havlíčkovy sady (2026-11-21, user's call): the villa,
    // the vineyard pavilion, the garden pavilion, and the new cards Grotta and
    // Dolní Landhauska (the lower of the two old vineyard farms). The
    // one-point park card `vinohrady-rose-garden` (named a rose garden but
    // telling the whole park's story, two check-ins) was deleted, user's call.
    // New slug.
    members: [
      'grobova-vila', 'altan-grebovka', 'pavilon-grebovka', 'grotta-grebovka', 'dolni-landhauska',
    ],
  }),
  pack({
    slug: 'namesti-jiriho-z-podebrad',
    released: '2026-11-21T03:30:00+01:00',
    name: 'Jiřího z Poděbrad',
    localizedNames: { cz: 'Jiřího z Poděbrad', zh: '伊日广场' },
    foil: '#5a3a5e',
    labels: ['square', 'church', 'communism', 'tower'],
    // The neighbourhood of Vinohrady and Žižkov around Jiřího z Poděbrad Square
    // and the TV tower (2026-11-21, user's call): Plečnik's church, the fountain
    // (the old one-point square card, rewritten as the United Europe Fountain
    // and renamed `fontana-sjednocena-evropa`), the TV tower, Škroupovo
    // náměstí, the Svatopluk Čech Gardens, the water tower, the Evangelical and
    // Hussite churches, Atrium Flora and the Old Jewish Cemetery under the TV
    // tower (new card). The pack took over the square's slug,
    // so the History link to it now opens the pack.
    members: [
      'kostel-nejsvetejsiho-srdce-pane', 'fontana-sjednocena-evropa', 'zizkov-tv-tower', 'skroupovo-namesti',
      'sady-svatopluka-cecha', 'vinohradska-vodarna', 'ceskobratrska-cirkev-vinohrady', 'husuv-sbor-vinohrady', 'oc-flora',
      'stary-zidovsky-hrbitov-zizkov',
    ],
  }),
  pack({
    slug: 'vitkov',
    released: '2026-11-21T12:00:00+01:00',
    name: 'Vítkov',
    localizedNames: { cz: 'Vítkov', zh: '维特科夫山' },
    foil: '#5e4a2a',
    labels: ['monument', 'medieval', 'world-wars', 'nature'],
    // Vítkov hill and a few cards at its foot (2026-11-21, user's call): the
    // National Memorial, Kafka's Žižka statue, the vineyard slope, the tunnel
    // through the hill, the Army Museum, the Hašek memorial, the Bethlehem
    // Chapel in Žižkov and the U Vystřelenýho oka pub (new card). The Karlín cards at the north foot stay in the Karlín
    // pack. New slug; the 1420 battle event links it first.
    members: [
      'vitkov-national-memorial', 'zizkov-horse-statue', 'vinicni-svah-vitkov', 'karln-ikov-tunnel-1782860314854',
      'armadni-muzeum-zizkov', 'hasek-memorial', 'bethlehem-chapel-in-ikov-1782603513682', 'u-vystreleneho-oka',
    ],
  }),
  pack({
    slug: 'kralovska-zahrada',
    released: '2026-11-21T14:00:00+01:00',
    name: 'Royal Garden',
    localizedNames: { cz: 'Královská zahrada', zh: '皇家花园' },
    foil: '#3e6b4a',
    labels: ['park', 'renaissance', 'palace', 'monument'],
    // North of Prague Castle, across the Deer Moat (2026-11-21, user's call):
    // the moat and the Powder Bridge, the Riding School, the Royal Garden with
    // Queen Anne's Summer Palace, the Ball Game Hall, the New Orangery and the
    // President's House (all moved out of the castle pack), the new Singing
    // Fountain card, and east of it the
    // Chotek Gardens with the Zeyer monument, Sophie Chotek's fan, the Písek
    // Gate, the Bílek Villa, the Czech Lion on Chotkova, the Famous Log and the
    // Bořek Šípek footbridge over to Letná (new card, shared with the Letná pack).
    // Took over the one-point Royal Garden card's slug and cover (two
    // check-ins), the card deleted.
    members: [
      'jeleni-prikop', 'prasny-most', 'jizdarna-prazskeho-hradu', 'queen-annes-summer-palace-1782584407663', 'zpivajici-fontana',
      'micovna-prazskeho-hradu', 'nova-oranzerie', 'prezidentsky-domek', 'chotek-gardens-1782425484882',
      'pomnik-julia-zeyera', 'vejir-zofie-chotkove', 'psek-gate-1782393038404', 'bilkova-vila',
      'socha-cesky-lev', 'the-famous-log', 'lavka-borka-sipka',
    ],
  }),
  pack({
    slug: 'dlouha',
    released: '2026-11-22T18:00:00+01:00',
    name: 'Dlouhá',
    localizedNames: { cz: 'Dlouhá', zh: '长街' },
    foil: '#8a4b2a',
    labels: ['street', 'medieval', 'renaissance', 'cultural'],
    // A street pack (2026-11-22, user's call): Old Town Square to Revoluční.
    // The House at the Golden Elephant on the square corner (Dlouhá 2, shared
    // with Old Town Square), the Theatre in Dlouhá, the House at the Golden
    // Tree, Roxy (new card) and Vinok hanging above the street outside it.
    // Revoluční at the far end stays out. Took over the one-point street card's
    // slug and cover (one check-in), the card deleted.
    members: [
      'dum-u-zlateho-slona', 'roxy-prague', 'vinok-sculpture', 'divadlo-v-dlouhe', 'dum-u-zlateho-stromu',
    ],
  }),
  pack({
    slug: 'klarov',
    released: '2026-11-22T21:00:00+01:00',
    name: 'Klárov',
    localizedNames: { cz: 'Klárov', zh: '克拉洛夫' },
    foil: '#4a5a7a',
    labels: ['square', 'monument', 'world-wars', 'communism'],
    // The junction at the foot of the castle on the Malá Strana side
    // (2026-11-22, user's call): the park with the Second Resistance, RAF and
    // Charousková memorials, the Klar Institute and its House of Physical
    // Culture, Kunsthalle Praha, Malostranská station with its garden, drinking
    // fountain and the K111 shelter below, the Old Castle Stairs, the
    // Wallenstein Riding School, the House at the White Boot, the Mánes Bridge
    // (shared with Jan Palach Square) and the Straka Academy opposite the
    // House of Physical Culture. Five new cards. Took over the one-point
    // Klárov card's cover (two check-ins), the card deleted; new slug.
    members: [
      'klaruv-ustav-slepcu', 'pomnik-marie-charouskove', 'memorial-of-the-second-resistance-movement-1782425088643',
      'pamatnik-ceskoslovenskym-letcum-raf', 'kunsthalle-praha', 'dum-kultury-tela', 'straka-academy-1782495890343',
      'respirium-malostranska', 'pitko-malostranska', 'k111-klarov', 'valdstejnska-jizdarna',
      'old-castle-stairs-1782582571631', 'dum-u-bile-boty', 'manesuv-most',
    ],
  }),
];

export const packsOfCard = (slug) => PACKS
  .filter(p => p.members.includes(slug))
  .map(({ slug: packSlug, name, localizedNames, foil }) => ({ slug: packSlug, name, localizedNames, foil }));
