var lookup = function(data, selector) {
  if (selector === ".") {
    return data;
  } else {
    var selectors = selector.split('.');
    var returnVal = data;
    for (var i in selectors) {
      returnVal = returnVal[selectors[i]];
    }
    return returnVal;
  }
};

var compile = function(ast) {
  return (function(data) {
    // console.log("AST: %j", ast);
    // console.log("Data: %j", data);
    var output = "";
    var tree;
    for (var i in ast.tree) {
      tree = ast.tree[i];
      switch(tree.type) {
      case "block":
        if (tree.val.match(/ /)) {
          throw new Error("FAILURE");
        }
        if (tree.cmd === "if") {
          if (lookup(data,tree.val)) {
            output += compile(tree)(lookup(data,tree.val));
          }
        } else if (tree.cmd === "unless") {
          if (!lookup(data,tree.val)) {
            output += compile(tree)(lookup(data,tree.val));
          }
        } else if (tree.cmd === "each") {
          for (var j in lookup(data,tree.val)) {
            output += compile(tree)(lookup(data,tree.val)[j]);
          }
        } else {
          throw new Error("command not recognized");
        }
        break;
      case "string":
        output += tree.val;
        break;
      case "var":
        output += lookup(data,tree.val);
        break;
      }
    }
    return output;
  });
};
module.exports = compile;