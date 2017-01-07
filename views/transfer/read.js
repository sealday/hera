const fs = require('fs');

const log = console.log.bind(console);

fs.readFile('transport.pug', 'utf-8', (err, data) => {
  if (err) throw err;
  let names = [];
  data.split('\n').forEach(line => {
    let matched = line.match(/name='(.*?)'/)
    if (matched) {
      names.push(matched[1]);
    }
  });
  console.log(names);
  let obj = {};
  names.forEach(name => {
    obj[name] = 'String';
  });
  console.log(obj);
});