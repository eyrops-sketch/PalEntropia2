/*
========================================================
PALARENA
palarenaescenario.js v1.2
PalEntropía

Generador de escenarios de Arena

REGLAS:
- 3 hábitats aleatorios
- 1 modo de vida aleatorio
- 2 medios ecológicos aleatorios
- Las coincidencias generan BONIFICACIONES
- Nunca existen penalizaciones
- No utiliza tiempo geológico

BONIFICACIONES:
Hábitats:
  1 coincidencia = +5
  2 coincidencias = +10
  3 coincidencias = +15

Modo de vida:
  Coincidencia = +10

Medio ecológico:
  SM = +3
  L  = +3
  ES = +2
  C  = +2

IMPORTANTE:
El resultado de la evaluación se conserva temporalmente
en window.PALARENA_BONIFICACION_ACTUAL para que otros
módulos puedan utilizar directamente las bonificaciones.
========================================================
*/

window.PALARENA_BONIFICACION_ACTUAL = null;


window.PALARENA_ESCENARIO = {

    escenario: null,


    /* ==================================================
       UTILIDADES
       ================================================== */

    aleatorio(array) {

        if (!Array.isArray(array) || array.length === 0) {
            return null;
        }

        return array[
            Math.floor(Math.random() * array.length)
        ];
    },


    mezclar(array) {

        const copia = [...array];

        for (let i = copia.length - 1; i > 0; i--) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [
                copia[i],
                copia[j]
            ] = [
                copia[j],
                copia[i]
            ];
        }

        return copia;
    },


    /* ==================================================
       HÁBITATS DISPONIBLES
    ================================================== */

    obtenerHabitatsDisponibles() {

        if (!window.PALHAB) {

            console.error(
                "PALARENA_ESCENARIO: PALHAB no está cargado."
            );

            return [];
        }

        return Object.keys(window.PALHAB)
            .filter(codigo => codigo !== "H000");
    },


    /* ==================================================
       MODOS DISPONIBLES
    ================================================== */

    obtenerModosDisponibles() {

        if (!window.PALMODO) {

            console.error(
                "PALARENA_ESCENARIO: PALMODO no está cargado."
            );

            return [];
        }

        return Object.keys(window.PALMODO)
            .filter(codigo => codigo !== "MV000");
    },


    /* ==================================================
       MEDIOS DISPONIBLES
    ================================================== */

    obtenerMediosDisponibles() {

        if (!window.PALMEDIO) {

            console.error(
                "PALARENA_ESCENARIO: PALMEDIO no está cargado."
            );

            return [];
        }


        const medios = [];


        const SM = Object.keys(window.PALMEDIO)
            .filter(codigo =>
                codigo.startsWith("SM") &&
                codigo !== "SM000"
            );


        const L = Object.keys(window.PALMEDIO)
            .filter(codigo =>
                codigo.startsWith("L") &&
                codigo !== "L000"
            );


        const ES = Object.keys(window.PALMEDIO)
            .filter(codigo =>
                codigo.startsWith("ES") &&
                codigo !== "ES000"
            );


        const C = Object.keys(window.PALMEDIO)
            .filter(codigo =>
                codigo.startsWith("C") &&
                codigo !== "C000"
            );


        SM.forEach(sm => {

            L.forEach(l => {

                ES.forEach(es => {

                    C.forEach(c => {

                        medios.push({

                            SM: sm,
                            L: l,
                            ES: es,
                            C: c,

                            codigo:
                                sm +
                                l +
                                es +
                                c

                        });

                    });

                });

            });

        });


        return medios;
    },


    /* ==================================================
       GENERAR ESCENARIO
    ================================================== */

    generar() {

        const habitatsDisponibles =
            this.obtenerHabitatsDisponibles();


        const habitats =
            this.mezclar(habitatsDisponibles)
                .slice(0, 3);


        const modosDisponibles =
            this.obtenerModosDisponibles();


        const modo =
            this.aleatorio(modosDisponibles);


        const mediosDisponibles =
            this.obtenerMediosDisponibles();


        const medios =
            this.mezclar(mediosDisponibles)
                .slice(0, 2);


        this.escenario = {

            habitats: habitats,

            modo: modo,

            medios: medios

        };


        /*
        --------------------------------------------------
        NUEVO ESCENARIO
        --------------------------------------------------

        Al generar un escenario nuevo eliminamos
        temporalmente la bonificación anterior.
        */

        window.PALARENA_BONIFICACION_ACTUAL = null;


        return this.escenario;
    },


    /* ==================================================
       COMPROBAR HÁBITATS
    ================================================== */

    comprobarHabitats(datosFicha) {

        if (
            !datosFicha ||
            !Array.isArray(datosFicha.habitats)
        ) {
            return 0;
        }


        if (
            !this.escenario ||
            !Array.isArray(this.escenario.habitats)
        ) {
            return 0;
        }


        return this.escenario.habitats
            .filter(codigo =>
                datosFicha.habitats.includes(codigo)
            )
            .length;
    },


    /* ==================================================
       COMPROBAR MODO
    ================================================== */

    comprobarModo(datosFicha) {

        if (!datosFicha || !this.escenario) {
            return false;
        }

        return datosFicha.modo ===
               this.escenario.modo;
    },


    /* ==================================================
       COMPROBAR MEDIOS
    ================================================== */

    comprobarMedios(datosFicha) {

        if (
            !datosFicha ||
            !datosFicha.medio ||
            !this.escenario
        ) {
            return {

                coincidencias: 0,

                detalles: []

            };
        }


        let total = 0;

        const detalles = [];


        this.escenario.medios.forEach(
            medioEscenario => {

                let SM = false;
                let L = false;
                let ES = false;
                let C = false;


                if (
                    datosFicha.medio.SM ===
                    medioEscenario.SM
                ) {

                    SM = true;
                    total += 3;

                }


                if (
                    datosFicha.medio.L ===
                    medioEscenario.L
                ) {

                    L = true;
                    total += 3;

                }


                if (
                    datosFicha.medio.ES ===
                    medioEscenario.ES
                ) {

                    ES = true;
                    total += 2;

                }


                if (
                    datosFicha.medio.C ===
                    medioEscenario.C
                ) {

                    C = true;
                    total += 2;

                }


                detalles.push({

                    medio:
                        medioEscenario.codigo,

                    SM: SM,

                    L: L,

                    ES: ES,

                    C: C

                });

            }
        );


        return {

            coincidencias: total,

            detalles: detalles

        };
    },


    /* ==================================================
       CALCULAR BONIFICACIÓN
    ================================================== */

    calcularBonificacion(datosFicha) {

        const coincidenciasHabitats =
            this.comprobarHabitats(datosFicha);


        const coincidenciaModo =
            this.comprobarModo(datosFicha);


        const medios =
            this.comprobarMedios(datosFicha);


        /*
        ----------------------------------------------
        HÁBITATS
        ----------------------------------------------
        */

        let bonificacionHabitats =
            coincidenciasHabitats * 5;


        /*
        ----------------------------------------------
        MODO
        ----------------------------------------------
        */

        let bonificacionModo = 0;


        if (coincidenciaModo) {

            bonificacionModo = 10;

        }


        /*
        ----------------------------------------------
        MEDIOS
        ----------------------------------------------
        */

        const bonificacionMedios =
            medios.coincidencias;


        /*
        ----------------------------------------------
        TOTAL
        ----------------------------------------------
        */

        const total =
            bonificacionHabitats +
            bonificacionModo +
            bonificacionMedios;


        return {

            habitats:
                coincidenciasHabitats,

            bonificacionHabitats:
                bonificacionHabitats,

            modo:
                coincidenciaModo,

            bonificacionModo:
                bonificacionModo,

            medios:
                medios,

            bonificacionMedios:
                bonificacionMedios,

            total:
                total

        };
    },


    /* ==================================================
       EVALUAR PALEOFICHA
    ================================================== */

    evaluar(j1) {

        if (!window.PALARENA_DATOS) {

            console.error(
                "PALARENA_ESCENARIO: PALARENA_DATOS no está cargado."
            );

            return null;
        }


        if (!this.escenario) {

            this.generar();

        }


        const datos =
            window.PALARENA_DATOS.preparar(j1);


        if (!datos) {

            return null;

        }


        const bonificacion =
            this.calcularBonificacion(datos);


        /*
        ==================================================
        GUARDAR BONIFICACIÓN ACTUAL
        ==================================================

        No recalculamos nada.

        Simplemente guardamos exactamente el resultado
        que acaba de producir este módulo.

        Otros módulos pueden leer:

        window.PALARENA_BONIFICACION_ACTUAL
        */

        window.PALARENA_BONIFICACION_ACTUAL =
            bonificacion;


        return {

            ficha:
                datos,

            escenario:
                this.escenario,

            bonificacion:
                bonificacion

        };
    },


    /* ==================================================
       OBTENER ESCENARIO ACTUAL
    ================================================== */

    obtener() {

        return this.escenario;

    }

};


/*
========================================================
FIN PALARENA_ESCENARIO
========================================================
*/
