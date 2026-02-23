const hexagrams = [
  '乾', '坤', '屯', '蒙', '需', '訟', '師', '比', '小畜', '履', '泰', '否', '同人', '大有', '謙', '豫', '隨', '蠱', '臨', '觀', '噬嗑', '賁', '剝', '復', '無妄', '大畜', '頤', '大過', '坎', '離', '咸', '恆', '遯', '大壯', '晉', '明夷', '家人', '睽', '蹇', '解', '損', '益', '夬', '姤', '萃', '升', '困', '井', '革', '鼎', '震', '艮', '漸', '歸妹', '豐', '旅', '巽', '兌', '渙', '節', '中孚', '小過', '既濟', '未濟'
];

const yaoLabels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

const data = [];
for (let i = 1; i <= 64; i++) {
  for (let y = 1; y <= 6; y++) {
    const twoDigits = String(i).padStart(2, '0');
    data.push({
      hexagramNumber: i,
      hexagramName: hexagrams[i - 1],
      yaoPosition: y,
      yaoName: yaoLabels[y - 1],
      yaoText: `第${i}卦「${hexagrams[i - 1]}」第${y}爻爻辭（請以您的完整易經原文文件替換此欄位內容）。`,
      imageUrl: `https://g.intellicon.tw/data/iching/${twoDigits}.gif`
    });
  }
}

console.log(JSON.stringify(data, null, 2));
