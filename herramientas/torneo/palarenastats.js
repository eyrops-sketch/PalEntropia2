/*
========================================================
PALARENA
palarenastats.js v1.1
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
       CONVERTIR A NÚMERO
    ================================================== */

    numero(valor) {

        const numero =
            Number(valor);

        if (
            Number.isFinite(numero)
        ) {

            return numero;

        }

        return 0;

    },


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
       OBTENER STATS DE LA FICHA
    ================================================== */

    obtenerStats(ficha) {

        if (!ficha) {

            return null;

        }


        /*
        ----------------------------------------------
        CASO 1
        e1...e11 directamente en la ficha
        ----------------------------------------------
        */

        if (
            ficha.e1 !== undefined ||
            ficha.e2 !== undefined ||
            ficha.e3 !== undefined
        ) {

            return {

                e1: this.numero(ficha.e1),
                e2: this.numero(ficha.e2),
                e3: this.numero(ficha.e3),
                e4: this.numero(ficha.e4),
                e5: this.numero(ficha.e5),
                e6: this.numero(ficha.e6),
                e7: this.numero(ficha.e7),
                e8: this.numero(ficha.e8),
                e9: this.numero(ficha.e9),
                e10: this.numero(ficha.e10),
                e11: this.numero(ficha.e11)

            };

        }


        /*
        ----------------------------------------------
        CASO 2
        ficha.estadisticas
        ----------------------------------------------
        */

        if (
            ficha.estadisticas
        ) {

            const s =
                ficha.estadisticas;


            return {

                e1: this.numero(s.e1),
                e2: this.numero(s.e2),
                e3: this.numero(s.e3),
                e4: this.numero(s.e4),
                e5: this.numero(s.e5),
                e6: this.numero(s.e6),
                e7: this.numero(s.e7),
                e8: this.numero(s.e8),
                e9: this.numero(s.e9),
                e10: this.numero(s.e10),
                e11: this.numero(s.e11)

            };

        }


        /*
        ----------------------------------------------
        CASO 3
        ficha.stats
        ----------------------------------------------
        */

        if (
            ficha.stats
        ) {

            const s =
                ficha.stats;


            return {

                e1: this.numero(s.e1),
                e2: this.numero(s.e2),
                e3: this.numero(s.e3),
                e4: this.numero(s.e4),
                e5: this.numero(s.e5),
                e6: this.numero(s.e6),
                e7: this.numero(s.e7),
                e8: this.numero(s.e8),
                e9: this.numero(s.e9),
                e10: this.numero(s.e10),
                e11: this.numero(s.e11)

            };

        }


        /*
        ----------------------------------------------
        CASO 4
        Array de 11 valores
        ----------------------------------------------
        */

        if (
            Array.isArray(ficha.stats)
        ) {

            return {

                e1: this.numero(ficha.stats[0]),
                e2: this.numero(ficha.stats[1]),
                e3: this.numero(ficha.stats[2]),
                e4: this.numero(ficha.stats[3]),
                e5: this.numero(ficha.stats[4]),
                e6: this.numero(ficha.stats[5]),
                e7: this.numero(ficha.stats[6]),
                e8: this.numero(ficha.stats[7]),
                e9: this.numero(ficha.stats[8]),
                e10: this.numero(ficha.stats[9]),
                e11: this.numero(ficha.stats[10])

            };

        }


        /*
        ----------------------------------------------
        NO ENCONTRADO
        ----------------------------------------------
        */

        console.error(
            "PALARENA_STATS: No se encontraron e1-e11.",
            ficha
        );


        return null;

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
                stats.e5 +
                stats.e11 +
                stats.e10
            ) / 3;


        /*
        ----------------------------------------------
        DEFENSA
        Defensa + Resistencia + Tamaño
        ----------------------------------------------
        */

        const defensa =
            (
                stats.e6 +
                stats.e3 +
                stats.e9
            ) / 3;


        /*
        ----------------------------------------------
        VELOCIDAD
        Movilidad + Velocidad
        ----------------------------------------------
        */

        const velocidad =
            (
                stats.e7 +
                stats.e10
            ) / 2;


        /*
        ----------------------------------------------
        RESISTENCIA
        Resistencia + Plasticidad + Adaptabilidad
        ----------------------------------------------
        */

        const resistencia =
            (
                stats.e3 +
                stats.e8 +
                stats.e1
            ) / 3;


        /*
        ----------------------------------------------
        TÁCTICA
        Inteligencia + Sociabilidad + Reproducción
        ----------------------------------------------
        */

        const tactica =
            (
                stats.e11 +
                stats.e2 +
                stats.e4
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

        const stats =
            this.obtenerStats(ficha);


        if (!stats) {

            return null;

        }


        return this.calcular(stats);

    }

};


/*
========================================================
FIN PALARENA_STATS
========================================================
*/
