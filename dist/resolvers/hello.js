"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hello = void 0;

const hello = () => ["Grüß dich!", "Moin!", "Hallo!", "Guten Tag"][Math.floor(Math.random() * 4)];

exports.hello = hello;