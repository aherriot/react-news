'use strict';

export default function randElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
