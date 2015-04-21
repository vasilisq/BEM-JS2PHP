var should = require('chai').should(),
    process = require('../lib/bemjs2php').process;

describe('#process', function() {

    it('converts single variable declarations', function() {
        process('var a = 45;').should.equal('$a = 45;');
    });

    it('converts multiple variable declarations', function() {
        process('var a = 45, b = 54').should.equal('$a = 45, $b = 54;');
    });

    it('converts multiple variable declarations with one value', function() {
        process('var a, b, c = 45').should.equal('$a, $b, $c = 45;');
    });

    it('converts assignment expressions', function() {
        process('var a = b;').should.equal('$a = $b;');
    });

    it('converts multiple assignment expressions', function() {
        process('var a = b = c = 45').should.equal('$a = $b = $c = 45;');
    });

    it('converts nested assignment expressions', function() {
        process('var a = b = c = d = e = f = 45').should.equal('$a = $b = $c = $d = $e = $f = 45;');
    });

    it('converts init by function', function() {
        process('var a = b = c = d = e = f = f1();').should.equal('$a = $b = $c = $d = $e = $f = f1();');
    });

    it('converts different types', function() {
        process('var a = 45.5;').should.equal('$a = 45.5;');
        process('var a = true;').should.equal('$a = true;');
        process('var a = false;').should.equal('$a = false;');
        process('var a = "STRING";').should.equal('$a = "STRING";');
    });

    it('converts different operations', function() {
        process('var a = -45;').should.equal('$a = -45;');
        process('var a = b++;').should.equal('$a = $b++;');
        process('var a = a + 45;').should.equal('$a = $a + 45;');
        process('var a = a + "STRING";').should.equal('$a = $a + "STRING";');
        process('var a = a * ( 15 + 5 );').should.equal('$a = $a * ( 15 + 5 );');
        process('var a = a * ( 15 + 5 ) / ( 3 / 4 );').should.equal('$a = ( $a * ( 15 + 5 ) ) / ( 3 / 4 );');
        process('var a, b; var c = a > b').should.equal('$a, $b;$c = $a > $b;');
    });

    // PARTIAL SUPPORT
    it('converts objects', function() {
        process("var a = {hello:'world'};").should.equal("$a = [ 'hello' => 'world' ];");
    });

});