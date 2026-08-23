/*
========================================================
PALARENA
palarenaescenario.js v1.0
PalEntropía

Generador de escenarios de Arena

REGLAS:
- 3 hábitats aleatorios
- 1 modo de vida aleatorio
- 2 medios ecológicos aleatorios
- Las coincidencias generan BONIFICACIONES
- Nunca existen penalizaciones
- No utiliza tiempo geológico

Fuentes:
PALHAB
PALMODO
PALMEDIO
========================================================
*/

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
       OBTENER CÓDIGOS DE HÁBITAT
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
       OBTENER MODOS DISPONIBLES
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
       OBTENER MEDIOS DISPONIBLES
       
       Un medio completo se representa mediante:

       SM + L + ES + C

       Ejemplo:
       SM002 | L001 | ES001 | C003
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


        /*
        Generamos combinaciones completas.
        */

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

        /*
        ----------------------------------------------
        1. HÁBITATS
        ----------------------------------------------
        */

        const habitatsDisponibles =
            this.obtenerHabitatsDisponibles();


        const habitats =
            this.mezclar(habitatsDisponibles)
                .slice(0, 3);


        /*
        ----------------------------------------------
        2. MODO DE VIDA
        ----------------------------------------------
        */

        const modosDisponibles =
            this.obtenerModosDisponibles();


        const modo =
            this.aleatorio(modosDisponibles);


        /*
        ----------------------------------------------
        3. MEDIOS
        ----------------------------------------------
        */

        const mediosDisponibles =
            this.obtenerMediosDisponibles();


        const medios =
            this.mezclar(mediosDisponibles)
                .slice(0, 2);


        /*
        ----------------------------------------------
        ESCENARIO FINAL
        ----------------------------------------------
        */

        this.escenario = {

            habitats: habitats,

            modo: modo,

            medios: medios

        };


        return this.escenario;
    },


    /* ==================================================
       COMPARAR HÁBITATS
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
       COMPARAR MODO DE VIDA
    ================================================== */

    comprobarModo(datosFicha) {

        if (!datosFicha || !this.escenario) {
            return false;
        }

        return datosFicha.modo ===
               this.escenario.modo;
    },


    /* ==================================================
       COMPARAR MEDIOS
       
       Se compara cada componente:

       SM
       L
       ES
       C
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


        const resultado = {

            coincidencias: 0,

            detalles: []

        };


        this.escenario.medios.forEach(
            medioEscenario => {

                let coincidencias = 0;


                if (
                    datosFicha.medio.SM ===
                    medioEscenario.SM
                ) {
                    coincidencias++;
                }


                if (
                    datosFicha.medio.L ===
                    medioEscenario.L
                ) {
                    coincidencias++;
                }


                if (
                    datosFicha.medio.ES ===
                    medioEscenario.ES
                ) {
                    coincidencias++;
                }


                if (
                    datosFicha.medio.C ===
                    medioEscenario.C
                ) {
                    coincidencias++;
                }


                resultado.coincidencias +=
                    coincidencias;


                resultado.detalles.push({

                    medio:
                        medioEscenario.codigo,

                    coincidencias:
                        coincidencias

                });

            }
        );


        return resultado;
    },


    /* ==================================================
       CALCULAR BONIFICACIÓN
       
       IMPORTANTE:
       Nunca devuelve valores negativos.
    ================================================== */

    calcularBonificacion(datosFicha) {

        const habitats =
            this.comprobarHabitats(datosFicha);


        const modo =
            this.comprobarModo(datosFicha);


        const medios =
            this.comprobarMedios(datosFicha);


        /*
        Bonificación inicial.
        */

        let bonificacion = 0;


        /*
        ----------------------------------------------
        HÁBITATS
        ----------------------------------------------
        Cada coincidencia = +5
        Máximo 3 coincidencias.
        */

        bonificacion +=
            habitats * 5;


        /*
        ----------------------------------------------
        MODO DE VIDA
        ----------------------------------------------
        Coincidencia = +10
        */

        if (modo) {
            bonificacion += 10;
        }


        /*
        ----------------------------------------------
        MEDIOS
        ----------------------------------------------
        Cada coincidencia de componente = +2

        Máximo teórico:
        2 medios × 4 componentes × 2 = 16
        */

        bonificacion +=
            medios.coincidencias * 2;


        return {

            habitats: habitats,

            modo: modo,

            medios: medios,

            total: bonificacion

        };
    },


    /* ==================================================
       EVALUAR FICHA
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


        return {

            ficha: datos,

            escenario: this.escenario,

            bonificacion: bonificacion

        };
    },


    /* ==================================================
       OBTENER ESCENARIO
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
