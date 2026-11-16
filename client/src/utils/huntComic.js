// The Treasure Hunt in six pictures (2026-11-16, user's idea): one hunt from
// morning to evening, first person. The pictures carry no words but the
// game's own English on the phone screen; the distance tag and the caption
// are text, so they translate. Pictures in public/guide/hunt-comic/<n>.webp
// (watercolour, 800 px, prompts in docs/guide-illustrations.md).
//
// The rules here must match the server (docs/treasure-hunt.md): hidden at
// least 4 km away, warmer/colder every ~100 m until 500 m, free clues within
// 3 km / 1 km / 500 m / 300 m, a bought clue drops one rung, a miss two,
// a press within 100 m finds it, 24 hours per hunt.
export const HUNT_COMIC = [
  {
    dist: { en: 'about 6 km', cz: 'asi 6 km', zh: '约6公里' },
    text: {
      en: "Once a day, start a hunt anywhere in Prague. One of the cards you haven't collected yet is hidden at least 4 km away, and at first all you know is roughly how far.",
      cz: 'Jednou denně spustíš hon kdekoli v Praze. Jedna z karet, které ještě nemáš, se schová nejméně 4 km daleko, a zpočátku víš jen zhruba, jak daleko.',
      zh: '每天一次，在布拉格市内任意地点开始寻宝。一张你还没收集的卡藏在至少 4 公里外，一开始你只知道它大概有多远。',
    },
  },
  {
    dist: { en: 'about 5 km', cz: 'asi 5 km', zh: '约5公里' },
    text: {
      en: "Start walking. Every 100 m or so the app tells you whether you are closer or farther than before, until you are within 500 m.",
      cz: 'Vyraz. Zhruba každých 100 m ti aplikace řekne, jestli jsi blíž, nebo dál než předtím, dokud nejsi do 500 m.',
      zh: '出发吧。大约每走 100 米，手机会告诉你比刚才近了还是远了，一直到 500 米以内为止。',
    },
  },
  {
    dist: { en: 'about 3 km', cz: 'asi 3 km', zh: '约3公里' },
    text: {
      en: 'Within 3 km the first clue comes free: which bank of the Vltava. Within 1 km you get the district.',
      cz: 'Do 3 km dostaneš první nápovědu zdarma: na kterém břehu Vltavy. Do 1 km přijde městský obvod.',
      zh: '走进 3 公里，第一条线索免费送上：在伏尔塔瓦河的哪一岸。走进 1 公里，再告诉你在哪个区。',
    },
  },
  {
    dist: { en: 'under 500 m', cz: 'pod 500 m', zh: '不到500米' },
    text: {
      en: "Within 500 m, the quarter; within 300 m, its rarity or one of its labels. Can't wait? Buy the next clue early, but each one drops the prize a rung.",
      cz: 'Do 500 m přijde čtvrť, do 300 m vzácnost nebo jeden ze štítků. Nevydržíš? Další nápovědu si můžeš koupit dřív, ale každá sníží odměnu o stupeň.',
      zh: '500 米内告诉你街区，300 米内告诉你稀有度或一个标签。等不及？可以提前买下一条线索，但每买一条，奖励就降一档。',
    },
  },
  {
    dist: { en: 'under 300 m', cz: 'pod 300 m', zh: '不到300米' },
    text: {
      en: 'Think it\'s here? Press "It\'s here!". A miss drops the prize two rungs, but tells you which way the treasure lies.',
      cz: 'Myslíš, že je to tady? Stiskni „Je to tady!“. Netrefa sníží odměnu o dva stupně, ale prozradí, kterým směrem poklad leží.',
      zh: '觉得就在附近？按下“就在这里！”。按错会让奖励掉两档，但会告诉你宝藏在哪个方向。',
    },
  },
  {
    dist: { en: 'under 100 m', cz: 'pod 100 m', zh: '不到100米' },
    text: {
      en: 'Within 100 m, a press finds it. This one paid 3×; walk all the way there and hit it on the first press, and it pays 10×. A hunt lasts 24 hours, and checking in there the normal way ends it at the card\'s plain XP.',
      cz: 'Do 100 m ho stisk najde. Tenhle vynesl 3×; dojdi až na místo, trefa na první stisk a dostaneš 10×. Hon trvá 24 hodin, a když se tam přihlásíš obyčejně, skončí s běžnými XP karty.',
      zh: '走到 100 米内按下，就找到了。这一次拿到 3 倍；一路走到跟前、第一下就按中，能拿 10 倍。每次寻宝限时 24 小时；如果在那里直接普通打卡，这次寻宝就结束了，只拿卡片原本的经验。',
    },
  },
];

export const HUNT_COMIC_TITLE = {
  en: 'A hunt in six pictures',
  cz: 'Hon v šesti obrázcích',
  zh: '六格图看懂寻宝',
};
