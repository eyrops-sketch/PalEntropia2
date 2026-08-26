/*
========================================================
PALARENA
palarenabonificaciones.js v2.0
PalEntropía

APLICACIÓN DE BONIFICACIONES DE ESCENARIO
A LOS STATS REALES DE ARENA.

RECIBE:
- 11 stats de la Paleoficha
- bonificación del escenario

DEVUELVE:
- 11 stats modificados
- detalle de las bonificaciones aplicadas

REGLAS:
- Nunca supera 100.
- Nunca baja de 0.
- Nunca existen penalizaciones.

DISTRIBUCIÓN:

HÁBITATS
Cada coincidencia = +5

→ Resistencia +2.5
→ Táctica +2.5

MODO DE VIDA
Coincidencia = +10

→ Ofensiva +5
→ Velocidad +5

MEDIOS ECOLÓGICOS

SM → Resistencia +3
L  → Velocidad +3
ES → Defensa +2
C  → Ofensiva +2
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

        if (!stats) {

            return null;

        }


        /*
        ==================================================
        STATS BASE
        ==================================================
        */

        const base = {

            adaptabilidad:
                Number(stats.adaptabilidad) || 0,

            sociabilidad:
                Number(stats.sociabilidad) || 0,

            resistencia:
                Number(stats.resistencia) || 0,

            reproduccion:
                Number(stats.reproduccion) || 0,

            ofensiva:
                Number(stats.ofensiva) || 0,

            defensa:
                Number(stats.defensa) || 0,

            movilidad:
                Number(stats.movilidad) || 0,

            plasticidad:
                Number(stats.plasticidad) || 0,

            tamano:
                Number(stats.tamano) || 0,

            velocidad:
                Number(stats.velocidad) || 0,

            inteligencia:
                Number(stats.inteligencia) || 0

        };


        /*
        ==================================================
        STATS MODIFICADOS
        ==================================================
        */

        const resultado = {

            adaptabilidad:
                base.adaptabilidad,

            sociabilidad:
                base.sociabilidad,

            resistencia:
                base.resistencia,

            reproduccion:
                base.reproduccion,

            ofensiva:
                base.ofensiva,

            defensa:
                base.defensa,

            movilidad:
                base.movilidad,

            plasticidad:
                base.plasticidad,

            tamano:
                base.tamano,

            velocidad:
                base.velocidad,

            inteligencia:
                base.inteligencia

        };


        /*
        ==================================================
        DETALLE
        ==================================================
        */

        const detalle = {

            habitats: 0,

            modo: 0,

            SM: 0,

            L: 0,

            ES: 0,

            C: 0

        };


        /*
        ==================================================
        HÁBITATS
        ==================================================
        */

        const bonificacionHabitats =
            Number(
                bonificacion &&
                bonificacion.bonificacionHabitats
            ) || 0;


        if (
            bonificacionHabitats > 0
        ) {

            const mitad =
                bonificacionHabitats / 2;


            resultado.resistencia +=
                mitad;

            resultado.inteligencia +=
                mitad;


            /*
            La parte destinada a táctica
            se representa mediante
            Inteligencia, ya que Arena
            utiliza los 11 stats originales.
            */

            detalle.habitats =
                bonificacionHabitats;

        }


        /*
        ==================================================
        MODO DE VIDA
        ==================================================
        */

        const bonificacionModo =
            Number(
                bonificacion &&
                bonificacion.bonificacionModo
            ) || 0;


        if (
            bonificacionModo > 0
        ) {

            const mitad =
                bonificacionModo / 2;


            resultado.ofensiva +=
                mitad;

            resultado.velocidad +=
                mitad;


            detalle.modo =
                bonificacionModo;

        }


        /*
        ==================================================
        MEDIOS ECOLÓGICOS
        ==================================================
        */

        if (
            bonificacion &&
            bonificacion.medios &&
            Array.isArray(
                bonificacion.medios.detalles
            )
        ) {

            bonificacion.medios.detalles.forEach(
                function(detalleMedio) {


                    /*
                    --------------------------------------
                    SM
                    --------------------------------------
                    */

                    if (
                        detalleMedio.SM
                    ) {

                        resultado.resistencia +=
                            3;

                        detalle.SM +=
                            3;

                    }


                    /*
                    --------------------------------------
                    L
                    --------------------------------------
                    */

                    if (
                        detalleMedio.L
                    ) {

                        resultado.velocidad +=
                            3;

                        detalle.L +=
                            3;

                    }


                    /*
                    --------------------------------------
                    ES
                    --------------------------------------
                    */

                    if (
                        detalleMedio.ES
                    ) {

                        resultado.defensa +=
                            2;

                        detalle.ES +=
                            2;

                    }


                    /*
                    --------------------------------------
                    C
                    --------------------------------------
                    */

                    if (
                        detalleMedio.C
                    ) {

                        resultado.ofensiva +=
                            2;

                        detalle.C +=
                            2;

                    }

                }
            );

        }


        /*
        ==================================================
        LIMITAR STATS
        ==================================================
        */

        Object.keys(resultado)
            .forEach(
                function(clave) {

                    resultado[clave] =
                        window.PALARENA_BONIFICACIONES
                            .limitar(
                                resultado[clave]
                            );

                }
            );


        /*
        ==================================================
        DEVOLVER
        ==================================================
        */

        return {

            adaptabilidad:
                resultado.adaptabilidad,

            sociabilidad:
                resultado.sociabilidad,

            resistencia:
                resultado.resistencia,

            reproduccion:
                resultado.reproduccion,

            ofensiva:
                resultado.ofensiva,

            defensa:
                resultado.defensa,

            movilidad:
                resultado.movilidad,

            plasticidad:
                resultado.plasticidad,

            tamano:
                resultado.tamano,

            velocidad:
                resultado.velocidad,

            inteligencia:
                resultado.inteligencia,

            detalle:
                detalle

        };

    }

};


/*
========================================================
FIN PALARENA_BONIFICACIONES
========================================================
*/
