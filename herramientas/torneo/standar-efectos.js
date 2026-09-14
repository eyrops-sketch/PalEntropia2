/*
========================================================
PALARENA
standar-efectos.js v1.0
PalEntropía

Biblioteca de efectos
del sistema de combate estándar.

E001  Curación
E002  Evasión
E003  Debilitamiento
E004  Lentitud
E005  Daño progresivo
E006  Iniciativa
E007  Potenciación de daño
========================================================
*/

window.PALARENA_STANDAR_EFECTOS = {


    /* ==================================================
       EFECTOS
    ================================================== */

    datos: {

        E001: {

            codigo: "E001",

            nombre: "Curación",

            tipo: "instantaneo",

            potencia: 20,

            duracion: 0

        },


        E002: {

            codigo: "E002",

            nombre: "Evasión",

            tipo: "modificador",

            potencia: 10,

            duracion: 2

        },


        E003: {

            codigo: "E003",

            nombre: "Debilitamiento",

            tipo: "modificador",

            potencia: 15,

            duracion: 2

        },


        E004: {

            codigo: "E004",

            nombre: "Lentitud",

            tipo: "modificador",

            potencia: 15,

            duracion: 2

        },


        E005: {

            codigo: "E005",

            nombre: "Daño progresivo",

            tipo: "progresivo",

            potencia: 5,

            duracion: 3

        },


        E006: {

            codigo: "E006",

            nombre: "Iniciativa",

            tipo: "modificador",

            potencia: 15,

            duracion: 2

        },


        E007: {

            codigo: "E007",

            nombre: "Potenciación de daño",

            tipo: "modificador",

            potencia: 15,

            duracion: 2

        }

    },


    /* ==================================================
       OBTENER EFECTO
    ================================================== */

    obtener(codigo) {

        if (!codigo) {

            return null;

        }


        const efecto =
            this.datos[codigo];


        if (!efecto) {

            return null;

        }


        return {

            codigo: efecto.codigo,

            nombre: efecto.nombre,

            tipo: efecto.tipo,

            potencia: efecto.potencia,

            duracion: efecto.duracion

        };

    },


    /* ==================================================
       COMPROBAR EFECTO
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
            function(efecto) {

                return {

                    codigo: efecto.codigo,

                    nombre: efecto.nombre,

                    tipo: efecto.tipo,

                    potencia: efecto.potencia,

                    duracion: efecto.duracion

                };

            }
        );

    }

};


/*
========================================================
EXPORTACIÓN DIRECTA
========================================================
*/

window.obtenerEfectoEstandar =
    function(codigo) {

        return window.PALARENA_STANDAR_EFECTOS
            .obtener(codigo);

    };


/*
========================================================
FIN STANDAR-EFECTOS
========================================================
*/
