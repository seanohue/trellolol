'use strict';
const fs = require('fs');
const trelloPath = './example.json';
const trelloFile = fs.readSync(trelloPath);
const trelloBoardObj = JSON.parse(trelloFile);

console.log(trelloBoardObj);
