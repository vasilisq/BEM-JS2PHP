/**
 * Converts Javascript AST elements to PHP Expressions
 */

module.exports = {

    /**
     *
     * @param unit Esprima`s AST element
     * @returns {String} PHP Expression
     */
    convert: function( unit ) {

        switch (unit.type) {

            case 'VariableDeclaration':
                return this.varDecl( unit );
                break;

            default:
                throw 'Unsupported expression type: ' + unit.type;

        }

    },

    /**
     * Processes variable declarations
     *
     * @param unit Esprima`s AST element
     * @returns {String} PHP Expression
     */
    varDecl: function( unit ) {

        var exp = String('');

        var converter = this;



        unit.declarations.forEach( function( e, i ) {

            if( e.type !== 'VariableDeclarator' )
                return;

            exp += converter.operand(e.id);

            if(e.init !== null ) {

                if( e.init.type !== 'AssignmentExpression' )
                    exp += ' = ';

                exp += converter.operand(e.init);

            }

            if( (i+1) != unit.declarations.length )
                exp += ', ';

        });


        exp += ';';

        return exp;

    },

    /**
     * Process operands
     *
     * @param o
     * @return {String}
     */
    operand: function( o ) {

        switch(o.type) {

            case 'Literal':
                return String(o.raw);
            break;

            case 'Identifier':
                return this.identifier(o);
            break;

            case 'CallExpression':
                return this.call(o);
            break;

            case 'AssignmentExpression':
                return this.assignment(o);
            break;

            case 'UnaryExpression':
                return this.unary(o);
            break;

            case 'UpdateExpression':
                return this.unary(o);
            break;

            case 'BinaryExpression':
                return this.binary(o);
            break;

            case 'ObjectExpression':
                return this.object(o);
            break;

            default:
                throw 'Unknown operand type.';

        }

    },

    /**
     * Process assignment
     *
     * @param a Assignment expression
     * @returns {String}
     */
    assignment: function( a ) {

        var exp = String(' = ');

        exp += this.identifier( a.left );

        if( a.right.type !== 'AssignmentExpression' )
            exp += ' ' + a.operator + ' ';

        exp += this.operand( a.right );

        return exp;


    },

    /**
     * Process identifier
     *
     * @param id Identifier
     * @returns {String}
     */
    identifier: function( id ) {

        return  String( '$' + id.name );

    },

    /**
     * Process call expression
     *
     * @param c Call expr
     * @returns {String}
     */
    call: function( c ) {

        return String(c.callee.name + '()' );

    },

    /**
     * Unary expression
     *
     * @param u Unary expr
     * @returns {String}
     */
    unary: function( u ) {

        var arg = this.operand( u.argument );

        return (u.prefix === true) ? String(u.operator + arg) : String( arg + u.operator );

    },

    /**
     * Binary expression
     *
     * @param b Binary expr
     * @returns {String}
     */
    binary: function( b ) {

        var left = this.operand( b.left );

        if(b.left.type === 'BinaryExpression')
            left = '( ' + left + ' )';

        var right = this.operand( b.right );

        if(b.right.type === 'BinaryExpression')
            right = '( ' + right + ' )';

        return String( left + ' ' + b.operator + ' ' + right );

    },

    /**
     * Object expresion
     *
     * @param obj Object expr
     * @returns {String}
     */
    object: function( obj ) {

        /**
         * @todo: Shorthands, methods, computed.
         */

        var converter = this;

        var exp = String('[ ');

        // List props
        obj.properties.forEach( function( e, i ) {

            // DO NOT PROCESS KEYS AS OPERANDS
            exp += "'" + e.key.name + "' => ";

            exp += converter.operand( e.value );

            if( (i+1) != obj.properties.length )
                exp += ', ';

        });

        return exp += String(' ]');

    }

};