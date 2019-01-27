export default  (...sections) => {
  let qqq = 0;
  return sections.map((section, i) => {
    const bin = {
      range: [qqq, qqq + section.length],
      sample: section.map((card) => {
        if (typeof card === 'number') {
          return { score: card };
        } else if (Array.isArray(card)) {
          return { simplified: card[0], score: card[1] };
        }
        return card;
      })
    };
    qqq += section.length;
    return bin;
  });
};
