// Rot13 and Rotate with custom number
/*
const rotate = (str, offset) => {
  if (offset < 0 || offset > 26) {
    throw new Error('Offset should be between 0 and 26');
  }
  return str.toUpperCase().split('').map(c => {
    let newc = c.charCodeAt(0) + offset;
    return String.fromCharCode(newc > 90 ? newc - 26 : newc);
  }).join('');
}

const rot13 = str => rotate(str, 13);
const rot5 = str => rotate(str, 5);

const input = 'HELLO';
const output = 'URYYB';
console.log(rot5(input));
console.log(rotate('mjqqt', 21));
*/