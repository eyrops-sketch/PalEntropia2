/*
========================================================
PALARENA
palarenabonificaciones.js v1.2
PalEntropía

APLICACIÓN DE BONIFICACIONES DE ESCENARIO
A LOS 5 INDICADORES DE COMBATE.

RECIBE:
- estadísticas de combate base
- bonificación del escenario

DEVUELVE:
- estadísticas de combate modificadas
- desglose completo de las bonificaciones

REGLAS:
- Nunca supera 100.
- Nunca baja de 0.
- Nunca existen penalizaciones.
- Conserva los nombres de los elementos
  que generan cada bonificación.
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
       OBTENER NOMBRE HÁBITAT
       ================================================== */

    nombreHabitat(codigo) {

        if (
            window.PALHAB &&
            window.PALHAB[codigo]
        ) {

            const habitat =
                window.PALHAB[codigo];

            if (
                typeof habitat === "string"
            ) {

                return habitat;

            }

            return (
                habitat.nombre ||
                habitat.descripcion ||
                codigo
            );

        }

        return codigo;

    },


    /* ==================================================
       OBTENER NOMBRE MODO
       ================================================== */

    nombreModo(codigo) {

        if (
            window.PALMODO &&
            window.PALMODO[codigo]
        ) {

            const modo =
                window.PALMODO[codigo];

            if (
                typeof modo === "string"
            ) {

                return modo;

            }

            return (
                modo.nombre ||
                modo.descripcion ||
                codigo
            );

        }

        return codigo;

    },


    /* ==================================================
       OBTENER NOMBRE MEDIO
       ================================================== */

    nombreMedio(codigo) {

        if (
            window.PALMEDIO &&
            window.PALMEDIO[codigo]
        ) {

            const medio =
                window.PALMEDIO[codigo];

            if (
                typeof medio === "string"
            ) {

                return medio;

            }

            return (
                medio.nombre ||
                medio.descripcion ||
                codigo
            );

        }

        return codigo;

    },


    /* ==================================================
       APLICAR BONIFICACIONES
       ================================================== */

    aplicar(stats, bonificacion) {

        if (!stats) {

            return null;

        }


        /*
        ----------------------------------------------
        SI NO EXISTE ESCENARIO
        ----------------------------------------------
        */

        if (!bonificacion) {

            return {

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
                    ),

                desglose: {

                    habitats: [],

                    modo: null,

                    medios: []

                }

            };

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
        DESGLOSE
        ==================================================
        */

        const desglose = {

            habitats: [],

            modo: null,

            medios: []

        };


        /*
        ==================================================
        HÁBITATS
        ==================================================
        */

        const bonificacionHabitats =
            Number(
                bonificacion.bonificacionHabitats
            ) || 0;


        if (
            bonificacionHabitats > 0
        ) {

            const coincidencias =
                Number(
                    bonificacion.habitats
                ) || 0;


            /*
            La bonificación de hábitat
            se reparte entre:

            RESISTENCIA
            TÁCTICA
            */

            const resistenciaHabitat =
                bonificacionHabitats / 2;

            const tacticaHabitat =
                bonificacionHabitats / 2;


            resistencia +=
                resistenciaHabitat;

            tactica +=
                tacticaHabitat;


            /*
            Obtener los hábitats reales
            del escenario.
            */

            if (
                bonificacion.escenarioHabitats &&
                Array.isArray(
                    bonificacion.escenarioHabitats
                )
            ) {

                bonificacion
                    .escenarioHabitats
                    .forEach(
                        codigo => {

                            desglose.habitats.push({

                                codigo:
                                    codigo,

                                nombre:
                                    this.nombreHabitat(
                                        codigo
                                    ),

                                ataque: 0,

                                defensa: 0,

                                velocidad: 0,

                                resistencia:
                                    resistenciaHabitat /
                                    Math.max(
                                        1,
                                        coincidencias
                                    ),

                                tactica:
                                    tacticaHabitat /
                                    Math.max(
                                        1,
                                        coincidencias
                                    )

                            });

                        }
                    );

            }

        }


        /*
        ==================================================
        MODO DE VIDA
        ==================================================
        */

        const bonificacionModo =
            Number(
                bonificacion.bonificacionModo
            ) || 0;


        if (
            bonificacionModo > 0
        ) {

            /*
            Se reparte:

            ATAQUE
            VELOCIDAD
            */

            const ataqueModo =
                bonificacionModo / 2;

            const velocidadModo =
                bonificacionModo / 2;


            ataque +=
                ataqueModo;

            velocidad +=
                velocidadModo;


            const codigoModo =
                bonificacion.escenarioModo ||
                bonificacion.modoCodigo ||
                "";


            desglose.modo = {

                codigo:
                    codigoModo,

                nombre:
                    this.nombreModo(
                        codigoModo
                    ),

                ataque:
                    ataqueModo,

                velocidad:
                    velocidadModo

            };

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

            bonificacion
                .medios
                .detalles
                .forEach(
                    detalle => {

                        const datos = {

                            codigo:
                                detalle.medio || "",

                            nombre:
                                this.nombreMedio(
                                    detalle.medio || ""
                                ),

                            SM: false,

                            L: false,

                            ES: false,

                            C: false,

                            ataque: 0,

                            defensa: 0,

                            velocidad: 0,

                            resistencia: 0,

                            tactica: 0

                        };


                        /*
                        SM
                        */

                        if (detalle.SM) {

                            datos.SM = true;

                            datos.resistencia =
                                3;

                            resistencia +=
                                3;

                        }


                        /*
                        L
                        */

                        if (detalle.L) {

                            datos.L = true;

                            datos.velocidad =
                                3;

                            velocidad +=
                                3;

                        }


                        /*
                        ES
                        */

                        if (detalle.ES) {

                            datos.ES = true;

                            datos.defensa =
                                2;

                            defensa +=
                                2;

                        }


                        /*
                        C
                        */

                        if (detalle.C) {

                            datos.C = true;

                            datos.ataque =
                                2;

                            ataque +=
                                2;

                        }


                        /*
                        Solo guardar medios
                        que realmente producen
                        alguna bonificación.
                        */

                        if (
                            datos.SM ||
                            datos.L ||
                            datos.ES ||
                            datos.C
                        ) {

                            desglose.medios.push(
                                datos
                            );

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

            desglose:
                desglose

        };

    }

};


/*
========================================================
FIN PALARENA_BONIFICACIONES
========================================================
*/
