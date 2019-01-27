import prepareBins from '../prepareBins.testutil';

export const bins = prepareBins(
  [
    ['日', 1],
    ['说', 1],
    ['应', 1],
    ['心', 1],
    ['都', 1]
  ],
  [
    ['兵', NaN],
    ['收', NaN],
    ['告', NaN],
    ['司', NaN],
    ['技', NaN]
  ],
  [
    ['奇', 1],
    ['木', 1],
    ['财', 0],
    ['静', 0],
    ['音', 0]
  ],
  [
    ['销', 0],
    ['县', 0],
    ['庭', 0],
    ['睡', 0],
    ['饭', 0]
  ], [
    ['尤', 0],
    ['筑', 0],
    ['凡', 1],
    ['戏', 0],
    ['沿', 0]
  ], [
    ['隆', 0],
    ['酸', 0],
    ['倍', 0],
    ['悄', 0],
    ['迪', 0]
  ], [
    ['贡', 0],
    ['辉', 0],
    ['凌', 0],
    ['尸', 0],
    ['泥', 0]
  ], [
    ['缴', NaN],
    ['伐', NaN],
    ['贪', NaN],
    ['慕', NaN],
    ['挡', NaN]
  ], [
    ['乾', NaN],
    ['虹', NaN],
    ['摘', NaN],
    ['溪', NaN],
    ['碧', NaN]
  ]
);

export const missedCardsResult = [
  { character: '财', score: 0 },
  { character: '静', score: 0 },
  { character: '音', score: 0 },
  { character: '销', score: 0 },
  { character: '县', score: 0 },
  { character: '庭', score: 0 },
  { character: '睡', score: 0 },
  { character: '饭', score: 0 },
  { character: '尤', score: 0 },
  { character: '筑', score: 0 },
  { character: '戏', score: 0 },
  { character: '沿', score: 0 },
  { character: '隆', score: 0 },
  { character: '酸', score: 0 },
  { character: '倍', score: 0 },
  { character: '悄', score: 0 },
  { character: '迪', score: 0 },
  { character: '贡', score: 0 },
  { character: '辉', score: 0 },
  { character: '凌', score: 0 },
  { character: '尸', score: 0 },
  { character: '泥', score: 0 }
];
