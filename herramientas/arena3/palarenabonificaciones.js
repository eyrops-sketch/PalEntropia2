/*
========================================================
PALARENA
palarenabonificaciones.js v1.2
PalEntropía

APLICACIÓN DE BONIFICACIONES DE ESCENARIO
A LOS 5 INDICADORES DE COMBATE.

INDICADORES:
- Ataque
- Defensa
- Velocidad
- Resistencia
- Táctica

REGLAS:
- Nunca supera 100.
- Nunca baja de 0.
- Nunca existen penalizaciones.
- Las bonificaciones se suman sobre los
  indicadores de combate BASE.

BONIFICACIONES:

HÁBITATS
1 coincidencia = +5
2 coincidencias = +10
3 coincidencias = +15

La bonificación de hábitats se reparte:
- 50% Resistencia
- 50% Táctica

MODO DE VIDA
Coincidencia = +10

Se reparte:
- +5 Ataque
- +5 Velocidad

MEDIOS ECOLÓGICOS
SM = +3 Resistencia
L  = +3 Velocidad
ES = +2 Defensa
C  = +2 Ataque

Además devuelve:
- detalles de bonificaciones
- nombres de las bonificaciones
- valores aplicados
- total
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

        if (
            !stats ||
            !bonificacion
        ) {

            return null;

        }


        /*
        ==================================================
        INDICADORES BASE
        ==================================================
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
        REGISTRO DE BONIFICACIONES
        ==================================================
        */

        const detalles = [];


        /*
        ==================================================
        HÁBITATS
        ==================================================
        */

        const coincidenciasHabitats =
            Number(
                bonificacion.habitats
            ) || 0;


        const bonificacionHabitats =
            Number(
                bonificacion.bonificacionHabitats
            ) || 0;


        if (
            coincidenciasHabitats > 0 &&
            bonificacionHabitats > 0
        ) {

            const resistenciaHabitat =
                bonificacionHabitats / 2;

            const tacticaHabitat =
                bonificacionHabitats / 2;


            resistencia +=
                resistenciaHabitat;

            tactica +=
                tacticaHabitat;


            detalles.push({

                tipo: "hábitats",

                nombre:
                    "Coincidencia de hábitats",

                coincidencias:
                    coincidenciasHabitats,

                bonificacion:
                    bonificacionHabitats,

                efectos: [

                    {
                        indicador:
                            "Resistencia",

                        valor:
                            resistenciaHabitat
                    },

                    {
                        indicador:
                            "Táctica",

                        valor:
                            tacticaHabitat
                    }

                ]

            });

        }


        /*
        ==================================================
        MODO DE VIDA
        ==================================================
        */

        const coincidenciaModo =
            Boolean(
                bonificacion.modo
            );


        const bonificacionModo =
            Number(
                bonificacion.bonificacionModo
            ) || 0;


        if (
            coincidenciaModo &&
            bonificacionModo > 0
        ) {

            const ataqueModo =
                bonificacionModo / 2;

            const velocidadModo =
                bonificacionModo / 2;


            ataque +=
                ataqueModo;

            velocidad +=
                velocidadModo;


            detalles.push({

                tipo: "modo",

                nombre:
                    "Coincidencia de modo de vida",

                bonificacion:
                    bonificacionModo,

                efectos: [

                    {
                        indicador:
                            "Ataque",

                        valor:
                            ataqueModo
                    },

                    {
                        indicador:
                            "Velocidad",

                        valor:
                            velocidadModo
                    }

                ]

            });

        }


        /*
        ==================================================
        MEDIOS ECOLÓGICOS
        ==================================================
        */

        if (
            bonificacion.medios &&
            Array.isArray(
                bonificacion.medios.detalles
            )
        ) {

            bonificacion.medios.detalles.forEach(
                detalle => {

                    const efectosMedio = [];


                    /*
                    --------------------------------------
                    SM — RESISTENCIA
                    --------------------------------------
                    */

                    if (detalle.SM) {

                        resistencia += 3;

                        efectosMedio.push({

                            indicador:
                                "Resistencia",

                            valor:
                                3

                        });

                    }


                    /*
                    --------------------------------------
                    L — VELOCIDAD
                    --------------------------------------
                    */

                    if (detalle.L) {

                        velocidad += 3;

                        efectosMedio.push({

                            indicador:
                                "Velocidad",

                            valor:
                                3

                        });

                    }


                    /*
                    --------------------------------------
                    ES — DEFENSA
                    --------------------------------------
                    */

                    if (detalle.ES) {

                        defensa += 2;

                        efectosMedio.push({

                            indicador:
                                "Defensa",

                            valor:
                                2

                        });

                    }


                    /*
                    --------------------------------------
                    C — ATAQUE
                    --------------------------------------
                    */

                    if (detalle.C) {

                        ataque += 2;

                        efectosMedio.push({

                            indicador:
                                "Ataque",

                            valor:
                                2

                        });

                    }


                    /*
                    --------------------------------------
                    REGISTRAR MEDIO
                    --------------------------------------
                    */

                    if (
                        efectosMedio.length > 0
                    ) {

                        detalles.push({

                            tipo: "medio",

                            codigo:
                                detalle.medio,

                            nombre:
                                "Coincidencia de medio ecológico",

                            efectos:
                                efectosMedio

                        });

                    }

                }
            );

        }


        /*
        ==================================================
        CALCULAR TOTAL APLICADO
        ==================================================
        */

        let total = 0;


        detalles.forEach(
            detalle => {

                if (
                    Array.isArray(
                        detalle.efectos
                    )
                ) {

                    detalle.efectos.forEach(
                        efecto => {

                            total +=
                                Number(
                                    efecto.valor
                                ) || 0;

                        }
                    );

                }

            }
        );


        /*
        ==================================================
        RESULTADO FINAL
        ==================================================
        */

        const resultado = {

            ataque:
                this.limitar(
                    ataque
                ),

            defensa:
                this.limitar(
                    defensa
                ),

            velocidad:
                this.limitar(
                    velocidad
                ),

            resistencia:
                this.limitar(
                    resistencia
                ),

            tactica:
                this.limitar(
                    tactica
                ),


            /*
            ----------------------------------------------
            VALORES BASE
            ----------------------------------------------
            */

            base: {

                ataque:
                    this.limitar(
                        stats.ataque
                    ),

                defensa:
                    this.limitar(
                        stats.defensa
                    ),

                velocidad:
                    this.limitar(
                        stats.velocidad
                    ),

                resistencia:
                    this.limitar(
                        stats.resistencia
                    ),

                tactica:
                    this.limitar(
                        stats.tactica
                    )

            },


            /*
            ----------------------------------------------
            BONIFICACIONES
            ----------------------------------------------
            */

            bonificacion: {

                ataque:
                    this.limitar(
                        ataque
                    ) -
                    this.limitar(
                        stats.ataque
                    ),

                defensa:
                    this.limitar(
                        defensa
                    ) -
                    this.limitar(
                        stats.defensa
                    ),

                velocidad:
                    this.limitar(
                        velocidad
                    ) -
                    this.limitar(
                        stats.velocidad
                    ),

                resistencia:
                    this.limitar(
                        resistencia
                    ) -
                    this.limitar(
                        stats.resistencia
                    ),

                tactica:
                    this.limitar(
                        tactica
                    ) -
                    this.limitar(
                        stats.tactica
                    )

            },


            /*
            ----------------------------------------------
            DESGLOSE
            ----------------------------------------------
            */

            detalles:
                detalles,


            /*
            ----------------------------------------------
            TOTAL
            ----------------------------------------------
            */

            total:
                total

        };


        return resultado;

    }

};


/*
========================================================
FIN PALARENA_BONIFICACIONES
========================================================
*/
