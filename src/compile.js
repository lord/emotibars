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
        if (tree.cmd === "if") {
          if (data[tree.val]) {
            output += compile(tree)(data[tree.val]);
          }
        } else if (tree.cmd === "unless") {
          if (!data[tree.val]) {
            output += compile(tree)(data[tree.val]);
          }
        } else if (tree.cmd === "each") {
          for (var j in data[tree.val]) {
            output += compile(tree)(data[tree.val][j]);
          }
        } else {
          throw new Error("command not recognized");
        }
        break;
      case "string":
        output += tree.val;
        break;
      case "var":
        if (tree.val === ".") {
          output += data;
        } else {
          output += data[tree.val];
        }
        break;
      }
    }
    return output;
  });
};
module.exports = compile;