/*
========================================================
PALARENA
standar-ataques.js v1.0
PalEntropía

Biblioteca de ataques y acciones
del sistema de combate estándar.

ACCIONES

A001  Ataque básico
A002  Ataque potente
A003  Ataque táctico
D001  Defender
========================================================
*/

window.PALARENA_STANDAR_ATAQUES = {


    /* ==================================================
       ATAQUES
    ================================================== */

    datos: {

        A001: {

            codigo: "A001",

            nombre: "Ataque básico",

            tipo: "ataque",

            potencia: 1.00,

            critico: true,

            efecto: null

        },


        A002: {

            codigo: "A002",

            nombre: "Ataque potente",

            tipo: "ataque",

            potencia: 1.40,

            critico: true,

            efecto: null

        },


        A003: {

            codigo: "A003",

            nombre: "Ataque táctico",

            tipo: "ataque",

            potencia: 0.80,

            critico: true,

            efecto: "E00X"

        },


        D001: {

            codigo: "D001",

            nombre: "Defender",

            tipo: "defensa",

            potencia: 0,

            critico: false,

            efecto: null

        }

    },


    /* ==================================================
       OBTENER ATAQUE
    ================================================== */

    obtener(codigo) {

        if (!codigo) {

            return null;

        }


        const ataque =
            this.datos[codigo];


        if (!ataque) {

            return null;

        }


        /*
        ----------------------------------------------
        Devolver copia para evitar modificar
        accidentalmente la biblioteca.
        ----------------------------------------------
        */

        return {

            codigo: ataque.codigo,

            nombre: ataque.nombre,

            tipo: ataque.tipo,

            potencia: ataque.potencia,

            critico: ataque.critico,

            efecto: ataque.efecto

        };

    },


    /* ==================================================
       COMPROBAR ATAQUE
    ================================================== */

    existe(codigo) {

        return Boolean(
            this.datos[codigo]
        );

    },


    /* ==================================================
       OBTENER TODOS
    ================================================== */

    obtenerTodos() {

        return Object.values(
            this.datos
        ).map(
            function(ataque) {

                return {

                    codigo: ataque.codigo,

                    nombre: ataque.nombre,

                    tipo: ataque.tipo,

                    potencia: ataque.potencia,

                    critico: ataque.critico,

                    efecto: ataque.efecto

                };

            }
        );

    },


    /* ==================================================
       OBTENER ATAQUES OFENSIVOS
    ================================================== */

    obtenerAtaques() {

        return this.obtenerTodos()
            .filter(
                function(ataque) {

                    return (
                        ataque.tipo === "ataque"
                    );

                }
            );

    },


    /* ==================================================
       OBTENER ACCIÓN DEFENSIVA
    ================================================== */

    obtenerDefensa() {

        return this.obtener("D001");

    }

};


/*
========================================================
EXPORTACIÓN DIRECTA
========================================================
*/

window.obtenerAtaqueEstandar =
    function(codigo) {

        return window.PALARENA_STANDAR_ATAQUES
            .obtener(codigo);

    };


/*
========================================================
FIN STANDAR-ATAQUES
========================================================
*/
