'use strict';
const p = '\n' + str;
const li = str => p('-' + str);
const h = (n, str) => p(Array.from(Array(n || 1), () => '#') + ' ' + str);


export const md = { li, h, p

}
