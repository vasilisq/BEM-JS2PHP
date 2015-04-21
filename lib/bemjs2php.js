var esprima = require('esprima'),
    converter = require('./converter');

module.exports = {

    /**
     * BEM JS -> PHP
     * @param js
     * @returns {String} PHP Code
     */
    process: function(js) {

        var ret = String('');

        try {
            var syntax = esprima.parse( String(js) );
        } catch( e ) {
            console.log( 'Error while parsing: \n' + e.stack );
        } finally {
            // Parse syntax
            try {
                syntax.body.forEach(function (unit) {

                    ret += converter.convert( unit );

                });
            } catch( e ) {
                console.log( 'Error while parsing JS AST: \n' + e.stack );
            }
        }

        return ret;

    }

};