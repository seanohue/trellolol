'use strict';

// Makes a paragraph in MD by leading with a newline.
const p = str => '\n' + str;

// Makes a list item by leading with a newline and -
const li = str => p('- ' + str);

// Makes a header by leading with a newline and a number of #'s according to how header-y it is.
const h = (n, str) => p([...Array(n)].map(() => '#')) + ' ' + str;


module.exports = { p, li, h };
