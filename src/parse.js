// returns 0 = none, 1 = hands on head, 2 = hands in air, 3 = look of disapproval open, 4 = look of disapproval close
function checkSymbol(string) {
  if (string[0] === "ಠ" && string[1] === "_") {
    return 3;
  } else if (string[0] === "_" && string[1] === "ಠ") {
    return 4;
  } else if (string[0] === "/" && string[1] === "o" && string[2] === "\\") {
    return 1;
  } else if (string[0] === "\\" && string[1] === "o" && string[2] === "/") {
    return 2;
  } else {
    return 0;
  }
}

var parse = function(string) {
  var output = {type:'ast', tree:[]};
  var stack = [output];
  var cursor = 0;
  var subcursor = 0;
  var substring = "";
  while(cursor < string.length) {
    if (string[cursor] === "ಠ" && string[cursor+1] === "_") {
      if (string[cursor + 2] === "ಠ") {
        stack[stack.length - 1].tree.push({type: "var", val: "."});
        cursor += 3;
        continue;
      }
      substring = "";
      subcursor = cursor + 2;
      while(subcursor < string.length && checkSymbol(string.substr(subcursor, 3)) === 0) {
        substring += string[subcursor];
        subcursor += 1;
      }
      if (subcursor === string.length) {
        throw new Error("no");
      }
      stack[stack.length - 1].tree.push({type: "var", val: substring.trim()});
      cursor = subcursor + 2;
    } else if (string[cursor] === "/" && string[cursor+1] === "o" && string[cursor+2] === "\\") {
      subcursor = cursor + 3;
      cmd = "";
      val = "";
      while(subcursor < string.length && checkSymbol(string.substr(subcursor, 3)) === 0 && string[subcursor] !== " ") {
        cmd += string[subcursor];
        subcursor += 1;
      }
      while(subcursor < string.length && checkSymbol(string.substr(subcursor, 3)) === 0) {
        val += string[subcursor];
        subcursor += 1;
      }
      if (checkSymbol(string.substr(subcursor, 3)) !== 1) {
        throw new Error("no2");
      }
      var tree = {type: "block", val: val.trim(), cmd: cmd.trim(), tree:[]};
      stack[stack.length - 1].tree.push(tree);
      stack.push(tree);
      cursor = subcursor + 3;
    } else if (string[cursor] === "\\" && string[cursor+1] === "o" && string[cursor+2] === "/") {
      subcursor = cursor + 3;
      substring = "";
      while(subcursor < string.length && checkSymbol(string.substr(subcursor, 3)) === 0) {
        substring += string[subcursor];
        subcursor += 1;
      }
      if (checkSymbol(string.substr(subcursor, 3)) !== 2) {
        throw new Error("no3");
      }
      if (substring !== stack[stack.length - 1].cmd) {
        throw new Error("no4");
      }
      stack.pop();
      if (stack.length === 0) {
        throw new Error("no5");
      }
      cursor = subcursor + 3;
    } else {
      subcursor = cursor;
      substring = "";
      while(subcursor < string.length && (checkSymbol(string.substr(subcursor, 3)) === 0 || checkSymbol(string.substr(subcursor, 3)) === 4)) {
        if (string[subcursor] === "`") {
          substring += string[subcursor+1];
          subcursor += 2;
        } else {
          substring += string[subcursor];
          subcursor += 1;
        }
      }
      stack[stack.length - 1].tree.push({type: "string", val: substring});
      cursor = subcursor;
    }
  }
  if (stack.length > 1) {
    throw new Error("WRONG");
  }
  return output;
};
module.exports = parse;