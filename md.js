'use strict';
const p = str => '\n' + str;
const li = str => p('- ' + str);
const h = (n, str) => p([...Array(n)].map(() => '#')) + ' ' + str;


module.exports = { p, li, h };
