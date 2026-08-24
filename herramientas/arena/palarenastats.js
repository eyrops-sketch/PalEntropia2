/*
========================================================
PALARENA
palarenastats.js v1.0
PalEntropía

Conversión de los 11 stats de Paleoficha
a 5 indicadores de combate.

STATS BASE

e1  Adaptabilidad
e2  Sociabilidad
e3  Resistencia
e4  Reproducción
e5  Ofensiva
e6  Defensa
e7  Movilidad
e8  Plasticidad ecológica
e9  Tamaño
e10 Velocidad
e11 Inteligencia

INDICADORES DE COMBATE

Ataque
Defensa
Velocidad
Resistencia
Táctica

Todos los valores finales:
0 - 100
========================================================
*/

window.PALARENA_STATS = {


    /* ==================================================
       LIMITAR VALORES
       ================================================== */

    limitar(valor) {

        return Math.max(
            0,
            Math.min(
                100,
                Math.round(valor)
            )
        );

    },


    /* ==================================================
       CALCULAR 5 INDICADORES
       ================================================== */

    calcular(stats) {

        if (!stats) {

            return null;

        }


        /*
        ----------------------------------------------
        ATAQUE
        Ofensiva + Inteligencia + Velocidad
        ----------------------------------------------
        */

        const ataque =
            (
                Number(stats.e5) +
                Number(stats.e11) +
                Number(stats.e10)
            ) / 3;


        /*
        ----------------------------------------------
        DEFENSA
        Defensa + Resistencia + Tamaño
        ----------------------------------------------
        */

        const defensa =
            (
                Number(stats.e6) +
                Number(stats.e3) +
                Number(stats.e9)
            ) / 3;


        /*
        ----------------------------------------------
        VELOCIDAD
        Movilidad + Velocidad
        ----------------------------------------------
        */

        const velocidad =
            (
                Number(stats.e7) +
                Number(stats.e10)
            ) / 2;


        /*
        ----------------------------------------------
        RESISTENCIA
        Resistencia + Plasticidad + Adaptabilidad
        ----------------------------------------------
        */

        const resistencia =
            (
                Number(stats.e3) +
                Number(stats.e8) +
                Number(stats.e1)
            ) / 3;


        /*
        ----------------------------------------------
        TÁCTICA
        Inteligencia + Sociabilidad + Reproducción
        ----------------------------------------------
        */

        const tactica =
            (
                Number(stats.e11) +
                Number(stats.e2) +
                Number(stats.e4)
            ) / 3;


        return {

            ataque:
                this.limitar(ataque),

            defensa:
                this.limitar(defensa),

            velocidad:
                this.limitar(velocidad),

            resistencia:
                this.limitar(resistencia),

            tactica:
                this.limitar(tactica)

        };

    },


    /* ==================================================
       CALCULAR DESDE PALEOFICHA
       ================================================== */

    calcularFicha(ficha) {

        if (!ficha) {

            return null;

        }


        const stats = {

            e1: ficha.e1,
            e2: ficha.e2,
            e3: ficha.e3,
            e4: ficha.e4,
            e5: ficha.e5,
            e6: ficha.e6,
            e7: ficha.e7,
            e8: ficha.e8,
            e9: ficha.e9,
            e10: ficha.e10,
            e11: ficha.e11

        };


        return this.calcular(stats);

    }

};


/*
========================================================
FIN PALARENA_STATS
========================================================
*/
