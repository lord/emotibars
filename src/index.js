var parse = require('./parse.js');
var compile = require('./compile.js');
var emotibars = function(template, data) {
  return compile(parse(template))(data);
};

emotibars.parse = parse;
emotibars.compile = compile;

module.exports = emotibars;
