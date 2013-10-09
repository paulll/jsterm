function pi (cnt) {
  "use asm";
  
  var c1 = 1|0;
  var c2 = 2|0;
  var last = 1|0;
  var p = 1;
  
  while (cnt !== 0|0) {
    p=p*(c2/c1);
    if (last === 1|0) {
      c1 = c1 + 2|0;
      last = 0|0;
    } else {
      c2 = c2 + 2|0;
      last = 1|0;
    }
    cnt = cnt - 1|0;
  }
  return p * 2
}

function pi2 (cnt) {
  
  var c1 = 1;
  var c2 = 2;
  var last = 1;
  var p = 1;
  
  while (cnt !== 0 {
    p=p*(c2/c1);
    if (last === 1) {
      c1 = c1 + 2;
      last = 0;
    } else {
      c2 = c2 + 2;
      last = 1;
    }
    cnt = cnt - 1;
  }
  return p * 2;
}
console.log ('wait')

setTimeout (function () {
	console.profile ('ASM JS');
	pi(100000000);
	console.profileEnd( 'ASM JS');
	console.profile ( 'JS' );
	pi2 (100000000);
	console.profileEnd( 'JS' )
}, 5000)
