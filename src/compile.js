var compile = function(ast) {
  return (function(data) {
    console.log("AST: %j", ast);
    console.log("Data: %j", data);
    var output = "";
    for (var i in ast.tree) {
      switch(ast.tree[i].type) {
      case "block":
        output += compile(ast.tree[i])(data);
        break;
      case "string":
        output += ast.tree[i].val;
        break;
      case "var":
        output += data[ast.tree[i].val];
        break;
      }
    }
    return output;
  });
};
module.exports = compile;