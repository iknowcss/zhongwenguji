const fs = require('fs');
const iconv = require('iconv-lite');

const rawData = iconv.decode(fs.readFileSync('./rawpull.html'), 'gb2312');
fs.writeFileSync('./data/processed.txt', 
  rawData
    .substring(
      rawData.indexOf('<pre>') + '<pre>'.length, 
      rawData.indexOf('</pre>')
    )
    .replace(/<br>/g, '\n')
);
