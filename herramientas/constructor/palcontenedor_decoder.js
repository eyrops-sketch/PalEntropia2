/*
========================================================
PALCONTENEDOR_DECODER.js v1.0
PalEntropía

Decodificador general del contenedor.csv

Función:
- Recibe un registro del contenedor
- Separa J1-J10
- Separa E1-E11
- Genera una Paleoficha normalizada
- No modifica ninguna base de datos
- No depende del constructor
========================================================
*/

window.PALCONTENEDOR_DECODER = {


    /*=========================================
    DECODIFICAR REGISTRO
    =========================================*/

    decodificarRegistro: function(registro){

        if(!registro){

            return null;

        }


        /*=====================================
        COMPROBAR J
        =====================================*/

        const J = {};

        for(let i = 1; i <= 10; i++){

            const campo = "j" + i;

            J[campo] =

                registro[campo] !== undefined

                ?

                registro[campo]

                :

                "";

        }


        /*=====================================
        COMPROBAR E
        =====================================*/

        const E = {};

        for(let i = 1; i <= 11; i++){

            const campo = "e" + i;

            E[campo] =

                registro[campo] !== undefined

                ?

                registro[campo]

                :

                "";

        }


        /*=====================================
        PALEOFICHA NORMALIZADA
        =====================================*/

        const paleoficha = {

            codigo:
                J.j1,

            cronologia:
                J.j3,

            HP:
                J.j5,

            HS:
                J.j6,

            modo_vida:
                J.j9,

            medio_compuesto:
                J.j10,

            estadisticas:
                E

        };


        /*=====================================
        RESULTADO
        =====================================*/

        return {

            J: J,

            E: E,

            paleoficha: paleoficha

        };

    }

};




