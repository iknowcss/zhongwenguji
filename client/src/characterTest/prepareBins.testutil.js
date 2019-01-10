export default  (...sections) => {
  let qqq = 0;
  return sections.map((section, i) => {
    const bin = {
      range: [qqq, qqq + section.length],
      sample: section.map(score => ({ score }))
    };
    qqq += section.length;
    return bin;
  });
};
