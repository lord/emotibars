var Emotibars = require('../src');
var should = require('should');

describe('Emotibars', function(){
  describe('Basic API', function() {
    it('should be a function itself', function() {
      Emotibars.should.be.a.Function;
    });

    it('should have a parse function', function() {
      Emotibars.parse.should.be.a.Function;
    });

    it('should have a compile function', function() {
      Emotibars.compile.should.be.a.Function;
    });

    it('might have a precompile property, but if it does, it should be a function', function() {
      if (Emotibars.precompile) {
        Emotibars.precompile.should.be.a.Function;
      }
    });
  });

  describe('Parse', function() {
    it('should return an object that represents an AST', function() {
      Emotibars.parse('Foo \u0CA0_\u0CA0.').should.be.an.Object;
    });
  });

  describe('Compile', function() {
    it('should take an AST and return a function', function() {
      Emotibars.compile(Emotibars.parse('Foo \u0CA0_\u0CA0.')).should.be.a.Function;
    });
  });

  describe('All At Once', function() {
    it('should take a template and data and return the correct output', function() {
      Emotibars('Foo').should.equal('Foo');
    });
  });

  describe('Template Functionality', function() {
    describe('Escapes', function() {
      it('should allow a backtick to escape another backtick', function() {
        Emotibars('Foo``Bar').should.equal('Foo`Bar');
      });

      it('should allow looks of disapproval that don\'t have mouths', function() {
        (function(){
          return Emotibars('\u0CA0\u0CA0\u0CA0\u0CA0\u0CA0\u0CA0');
        }).should.not.throw();

        Emotibars('\u0CA0\u0CA0\u0CA0\u0CA0\u0CA0\u0CA0').should.equal('\u0CA0\u0CA0\u0CA0\u0CA0\u0CA0\u0CA0');
      });

      it('should allow you to escape a look of disapproval with a backtick', function() {
        Emotibars('`\u0CA0_\u0CA0').should.equal('\u0CA0_\u0CA0');
      });

      it('shouldn\'t require any special escapes for various quotes since they\'re unimportant', function() {
        Emotibars('test\'"test').should.equal('test\'"test');
      });

      it('should allow escapes for \\o/', function() {
        Emotibars('`\\o/').should.equal('\\o/');
        Emotibars('This is a yay guy `\\o/!').should.equal('This is a yay guy \\o/!');
      });

      it('should allow escapes for /o\\', function() {
        Emotibars('`/o\\').should.equal('/o\\');
        Emotibars('This is a ohno guy `/o\\!').should.equal('This is a ohno guy /o\\!');
      });

      it('should do the unnecessary escapes from the explanation', function() {
        Emotibars('My name is `ಠ_name`_ಠ.').should.equal('My name is ಠ_name_ಠ.');
        Emotibars('My name is `ಠ_name_ಠ.').should.equal('My name is ಠ_name_ಠ.');
      });

      it('shoudn\'t get confused if you have an escaped backtick next to a real token', function() {
        Emotibars('My name is ``ಠ_name_ಠ.', {name: 'alex'}).should.equal('My name is `alex.');
        Emotibars('``/o\\if name/o\\test\\o/if\\o/', {name: 'alex'}).should.equal('`test');
      });
    });

    describe('Helpers', function() {
      it('should have an `if` helper', function(){
        Emotibars('/o\\if ./o\\true\\o/if\\o/', true).should.equal('true');
        Emotibars('/o\\if ./o\\true\\o/if\\o/', false).should.equal('');
      });

      it('should have an `unless` helper', function(){
        Emotibars('/o\\unless ./o\\true\\o/unless\\o/', true).should.equal('');
        Emotibars('/o\\unless ./o\\true\\o/unless\\o/', false).should.equal('true');
      });

      it('should have an `each` helper', function(){
        Emotibars('/o\\each ./o\\ಠ_ಠ\\o/each\\o/', ['a','b','c','d']).should.equal('abcd');
      });
    });

    describe('Errors', function() {
      it('should throw an error for unmatched look of disapproval', function() {
        (function() {
          return Emotibars('This is a longer template, and luckily it has an error in it around here \u0CA0_\
and because it never closes, we should get some context on where it went wrong', {});
        }).should.throw();
      });

      it('should throw an error for incorrectly nested blocks', function() {
        (function(){
          return Emotibars('/o\\if foo/o\\true/o\\each bars/o\\ test \\o/if\\o/ \\o/each\\o/', {foo:true, bars:[]});
        }).should.throw();
      });

      it('should throw an error for a block that\'s never closed', function() {
        (function(){
          return Emotibars('/o\\each bars/o\\ test', {bars:[]});
        }).should.throw();
      });

      it('should throw an error if an unrecognized helper is found', function() {
        (function(){
          return Emotibars('/o\\eachy foo/o\\output\\o/eachy\\o/', {foo: []});
        }).should.throw();
      });

      it('should throw an error if too many arguments are inside of a helper block', function() {
        (function(){
          return Emotibars('/o\\each foo bar/o\\output\\o/each\\o/', {foo: []});
        }).should.throw();
      });
    });

    describe('Variables', function() {
      it('should replace context variables', function() {
        Emotibars('Aಠ_ಠB', 'foocontext').should.equal('AfoocontextB');
      });

      it('should replace named variables', function() {
        Emotibars('Aಠ_name_ಠB', {name: 'foo'}).should.equal('AfooB');
      });

      it('should allow context variables as . in block helpers', function() {
        Emotibars('/o\\each foos/o\\/o\\if ./o\\true\\o/if\\o/\\o/each\\o/', {foos: [true, false]}).should.equal('true');
      });

      it('should allow variables with dot properties', function() {
        Emotibars('ಠ_foo.bar.baz_ಠ', {foo:{bar:{baz:'yay'}}}).should.equal('yay');
      });
    });
  })
});