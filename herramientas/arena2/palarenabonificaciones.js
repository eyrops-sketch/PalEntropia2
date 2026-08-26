/*
========================================================
PALARENA
palarenabonificaciones.js v1.0
PalEntropía

APLICACIÓN DE BONIFICACIONES DE ESCENARIO
A LOS 5 INDICADORES DE COMBATE.

NO MODIFICA:
- palarenascenario.js
- palarenastats.js
- palarena.js

RECIBE:
- estadísticas de combate base
- bonificación del escenario

DEVUELVE:
- estadísticas de combate modificadas

REGLA:
Nunca supera 100.
Nunca baja de 0.
Nunca existen penalizaciones.
========================================================
*/

window.PALARENA_BONIFICACIONES = {


    /* ==================================================
       LIMITAR
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
       APLICAR BONIFICACIONES
    ================================================== */

    aplicar(stats, bonificacion) {

        if (!stats || !bonificacion) {

            return null;

        }


        /*
        ----------------------------------------------
        ESTADÍSTICAS BASE
        ----------------------------------------------
        */

        let ataque =
            Number(stats.ataque) || 0;

        let defensa =
            Number(stats.defensa) || 0;

        let velocidad =
            Number(stats.velocidad) || 0;

        let resistencia =
            Number(stats.resistencia) || 0;

        let tactica =
            Number(stats.tactica) || 0;


        /*
        ==================================================
        HÁBITATS
        ==================================================

        Cada coincidencia de hábitat
        aporta la bonificación correspondiente.

        Se reparte entre:

        RESISTENCIA
        TÁCTICA
        */

        const bonificacionHabitats =
            Number(
                bonificacion.bonificacionHabitats
            ) || 0;


        resistencia +=
            bonificacionHabitats / 2;


        tactica +=
            bonificacionHabitats / 2;


        /*
        ==================================================
        MODO DE VIDA
        ==================================================

        Se reparte entre:

        ATAQUE
        VELOCIDAD
        */

        const bonificacionModo =
            Number(
                bonificacion.bonificacionModo
            ) || 0;


        ataque +=
            bonificacionModo / 2;


        velocidad +=
            bonificacionModo / 2;


        /*
        ==================================================
        MEDIOS ECOLÓGICOS
        ==================================================

        Cada componente mantiene
        su función específica:

        SM → RESISTENCIA
        L  → VELOCIDAD
        ES → DEFENSA
        C  → ATAQUE
        */

        if (
            bonificacion.medios &&
            Array.isArray(
                bonificacion.medios.detalles
            )
        ) {

            bonificacion.medios.detalles.forEach(
                detalle => {

                    if (detalle.SM) {

                        resistencia += 3;

                    }

                    if (detalle.L) {

                        velocidad += 3;

                    }

                    if (detalle.ES) {

                        defensa += 2;

                    }

                    if (detalle.C) {

                        ataque += 2;

                    }

                }
            );

        }


        /*
        ==================================================
        RESULTADO FINAL
        ==================================================
        */

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

    }

};


/*
========================================================
FIN PALARENA_BONIFICACIONES
========================================================
*/
