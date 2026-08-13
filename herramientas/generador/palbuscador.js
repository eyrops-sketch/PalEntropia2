/*
========================================================
PalEntropía
palbuscador.js v4.0 LTS

MOTOR DE BÚSQUEDA DEL GENERADOR

BUSCA POR:

- Código
- Nombre
- Período
- Edad

GEOLOGÍA:

LEEPALJSON
    ↓
j3
    ↓
PALGEOSIMPLIFICADO
    ↓
período / edad
    ↓
j1
    ↓
PALNAVEGADOR

IMPORTANTE:

PALBUSCADOR NO CARGA DIRECTAMENTE CARGACONT.

Toda selección pasa por:

PALNAVEGADOR.cargarPorCodigo()

========================================================
*/


const PALBUSCADOR = {


    /* =====================================================
       VERSIÓN
       ===================================================== */

    version: "4.0 LTS",


    /* =====================================================
       DATOS INTERNOS
       ===================================================== */

    _datosJSON: null,

    _cargandoJSON: null,


    /* =====================================================
       NORMALIZAR TEXTO
       ===================================================== */

    normalizar(texto) {

        if (
            texto === undefined ||
            texto === null
        ) {

            return "";

        }


        return String(texto)

            .toLowerCase()

            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .replace(
                /ñ/g,
                "n"
            )

            .replace(
                /[.,;:()\-\/]/g,
                " "
            )

            .replace(
                /\s+/g,
                " "
            )

            .trim();

    },


    /* =====================================================
       NORMALIZAR CÓDIGO
       ===================================================== */

    normalizarCodigo(codigo) {

        if (
            codigo === undefined ||
            codigo === null
        ) {

            return "";

        }


        return String(codigo)
            .trim()
            .toUpperCase();

    },


    /* =====================================================
       OBTENER MASTER
       ===================================================== */

    obtenerContenedor() {

        if (
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: LEEPALJSON no está disponible."
            );

        }


        const datos =
            window.LEEPALJSON.obtener();


        if (
            !Array.isArray(datos) ||
            !datos.length
        ) {

            throw new Error(
                "PALBUSCADOR: master.csv está vacío."
            );

        }


        return datos;

    },


    /* =====================================================
       CARGAR PALEOFICHAS.JSON
       ===================================================== */

    async cargarJSON() {

        if (
            this._datosJSON
        ) {

            return this._datosJSON;

        }


        if (
            this._cargandoJSON
        ) {

            return this._cargandoJSON;

        }


        this._cargandoJSON =

            fetch(
                "paleofichas.json",
                {
                    cache: "default"
                }
            )

            .then(
                respuesta => {

                    if (
                        !respuesta.ok
                    ) {

                        throw new Error(
                            "PALBUSCADOR: no se pudo cargar paleofichas.json."
                        );

                    }


                    return respuesta.json();

                }
            )

            .then(
                datos => {

                    if (
                        !Array.isArray(datos)
                    ) {

                        throw new Error(
                            "PALBUSCADOR: paleofichas.json inválido."
                        );

                    }


                    this._datosJSON =
                        datos;


                    return datos;

                }
            )

            .catch(
                error => {

                    this._cargandoJSON =
                        null;

                    throw error;

                }
            );


        return this._cargandoJSON;

    },


    /* =====================================================
       OBTENER MAPA DE NOMBRES
       ===================================================== */

    async obtenerMapaNombres() {

        const datos =
            await this.cargarJSON();


        const mapa =
            new Map();


        for (
            const registro of datos
        ) {

            if (
                !registro
            ) {

                continue;

            }


            const codigo =
                this.normalizarCodigo(
                    registro.codigo ||
                    registro.j1
                );


            const nombre =
                String(
                    registro.nombre ||
                    ""
                ).trim();


            if (
                codigo &&
                nombre
            ) {

                mapa.set(
                    codigo,
                    nombre
                );

            }

        }


        return mapa;

    },

       /* =====================================================
       OBTENER VÍDEO
       ===================================================== */

    obtenerVideo(codigo) {

        const j1 =
            this.normalizarCodigo(
                codigo
            );


        if (
            !j1 ||
            !window.PALVIDEO ||
            typeof window.PALVIDEO !==
            "object"
        ) {

            return null;

        }


        const registro =
            window.PALVIDEO[j1];


        if (
            !registro
        ) {

            return null;

        }


        const video =
            String(
                registro.video ||
                ""
            ).trim();


        return video || null;

    },


    /* =====================================================
       COMPROBAR VÍDEO
       ===================================================== */

    tieneVideo(codigo) {

        return !!this.obtenerVideo(
            codigo
        );

    },


    /* =====================================================
       DETERMINAR TIPO DE CONSULTA
       ===================================================== */

    tipoConsulta(texto) {

        const consulta =
            String(
                texto || ""
            ).trim();


        if (
            !consulta
        ) {

            return "vacio";

        }


        /*
        -----------------------------------------------------
        CÓDIGO
        -----------------------------------------------------
        */

        if (
            /^[0-9_]+$/.test(
                consulta
            )
        ) {

            return "codigo";

        }


        /*
        -----------------------------------------------------
        TEXTO

        A partir de 4 caracteres puede buscar:

        - nombre
        - período
        - edad
        -----------------------------------------------------
        */

        if (
            this.normalizar(
                consulta
            ).length >= 4
        ) {

            return "texto";

        }


        /*
        -----------------------------------------------------
        NOMBRE CORTO

        Se mantienen 3 caracteres para nombres.
        -----------------------------------------------------
        */

        if (
            this.normalizar(
                consulta
            ).length >= 3
        ) {

            return "nombre";

        }


        return "corto";

    },


    /* =====================================================
       BUSCAR POR CÓDIGO
       ===================================================== */

    async buscarPorCodigo(consulta) {

        const codigoConsulta =
            this.normalizarCodigo(
                consulta
            );


        if (
            !codigoConsulta
        ) {

            return [];

        }


        const contenedor =
            this.obtenerContenedor();


        const mapaNombres =
            await this.obtenerMapaNombres();


        const resultados = [];


        for (
            const registro of contenedor
        ) {

            if (
                !registro
            ) {

                continue;

            }


            const codigo =
                this.normalizarCodigo(
                    registro.codigo ||
                    registro.j1
                );


            if (
                !codigo
            ) {

                continue;

            }


            if (
                codigo.startsWith(
                    codigoConsulta
                )
            ) {

                resultados.push({

                    codigo:
                        codigo,

                    nombre:
                        mapaNombres.get(
                            codigo
                        ) ||
                        "Sin nombre",

                    tipo:
                        "codigo",

                    relevancia:
                        codigo ===
                        codigoConsulta
                            ? 300
                            : 200

                });

            }

        }


        return this.unicosResultados(
            resultados
        );

    },


    /* =====================================================
       BUSCAR POR NOMBRE
       ===================================================== */

    async buscarPorNombre(consulta) {

        const texto =
            this.normalizar(
                consulta
            );


        if (
            texto.length < 3
        ) {

            return [];

        }


        const datos =
            await this.cargarJSON();


        const resultados = [];


        for (
            const registro of datos
        ) {

            if (
                !registro
            ) {

                continue;

            }


            const codigo =
                this.normalizarCodigo(
                    registro.codigo ||
                    registro.j1
                );


            const nombre =
                String(
                    registro.nombre ||
                    ""
                ).trim();


            if (
                !codigo ||
                !nombre
            ) {

                continue;

            }


            const nombreNormalizado =
                this.normalizar(
                    nombre
                );


            if (
                nombreNormalizado.startsWith(
                    texto
                )
            ) {

                resultados.push({

                    codigo:
                        codigo,

                    nombre:
                        nombre,

                    tipo:
                        "nombre",

                    relevancia:
                        nombreNormalizado ===
                        texto
                            ? 300
                            : 200

                });

            }

        }


        return this.unicosResultados(
            resultados
        );

    },

        /* =====================================================
       BUSCAR POR GEOLOGÍA

       BUSCA:

       - PERÍODO
       - EDAD

       MÍNIMO:
       4 CARACTERES

       FUENTE:

       LEEPALJSON
           ↓
          j3
           ↓
       PALGEOSIMPLIFICADO
           ↓
       periodo / edad
       ===================================================== */

    async buscarPorGeologia(consulta) {

        const texto =
            this.normalizar(
                consulta
            );


        if (
            texto.length < 4
        ) {

            return [];

        }


        const contenedor =
            this.obtenerContenedor();


        const mapaNombres =
            await this.obtenerMapaNombres();


        /*
        -----------------------------------------------------
        COMPROBAR PALGEOSIMPLIFICADO
        -----------------------------------------------------
        */

        if (
            !window.PALGEOSIMPLIFICADO ||
            typeof window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ) {

            console.warn(
                "PALBUSCADOR: PALGEOSIMPLIFICADO no disponible."
            );

            return [];

        }


        const resultados = [];


        /*
        -----------------------------------------------------
        RECORRER MASTER.CSV
        -----------------------------------------------------
        */

        for (
            const registro of contenedor
        ) {

            if (
                !registro
            ) {

                continue;

            }


            const codigo =
                this.normalizarCodigo(
                    registro.codigo ||
                    registro.j1
                );


            /*
            -------------------------------------------------
            EL REGISTRO DEBE TENER J1 Y J3
            -------------------------------------------------
            */

            if (
                !codigo ||
                !registro.j3
            ) {

                continue;

            }


            let analisis;


            /*
            -------------------------------------------------
            ANALIZAR J3

            No interpretamos nosotros la cronología.

            PALGEOSIMPLIFICADO es quien determina:

            - período
            - edad
            - rango
            -------------------------------------------------
            */

            try {

                analisis =
                    window.PALGEOSIMPLIFICADO
                        .analizar(
                            String(
                                registro.j3
                            ).trim()
                        );

            } catch (error) {

                continue;

            }


            if (
                !analisis
            ) {

                continue;

            }


            /*
            -------------------------------------------------
            OBTENER PERÍODOS
            -------------------------------------------------
            */

            const periodos =
                Array.isArray(
                    analisis.periodo
                )
                    ? analisis.periodo
                    : [];


            /*
            -------------------------------------------------
            OBTENER EDADES
            -------------------------------------------------
            */

            const edades =
                Array.isArray(
                    analisis.edad
                )
                    ? analisis.edad
                    : [];


            /*
            -------------------------------------------------
            COMPROBAR PERÍODO
            -------------------------------------------------
            */

            const coincidePeriodo =
                periodos.some(
                    valor => {

                        return this.normalizar(
                            valor
                        ).includes(
                            texto
                        );

                    }
                );


            /*
            -------------------------------------------------
            COMPROBAR EDAD
            -------------------------------------------------
            */

            const coincideEdad =
                edades.some(
                    valor => {

                        return this.normalizar(
                            valor
                        ).includes(
                            texto
                        );

                    }
                );


            /*
            -------------------------------------------------
            NO COINCIDE
            -------------------------------------------------
            */

            if (
                !coincidePeriodo &&
                !coincideEdad
            ) {

                continue;

            }


            /*
            -------------------------------------------------
            DETERMINAR TIPO
            -------------------------------------------------
            */

            let tipo =
                "geologia";


            if (
                coincidePeriodo &&
                coincideEdad
            ) {

                tipo =
                    "periodo-edad";

            } else if (
                coincidePeriodo
            ) {

                tipo =
                    "periodo";

            } else {

                tipo =
                    "edad";

            }


            /*
            -------------------------------------------------
            AÑADIR RESULTADO
            -------------------------------------------------
            */

            resultados.push({

                codigo:
                    codigo,

                nombre:
                    mapaNombres.get(
                        codigo
                    ) ||
                    "Sin nombre",

                tipo:
                    tipo,

                periodo:
                    periodos,

                edad:
                    edades,

                rango:
                    analisis.rango ||
                    null,

                relevancia:
                    coincidePeriodo &&
                    coincideEdad
                        ? 250
                        : 200

            });

        }


        return this.unicosResultados(
            resultados
        );

    },


    /* =====================================================
       ELIMINAR RESULTADOS DUPLICADOS
       ===================================================== */

    unicosResultados(resultados) {

        const mapa =
            new Map();


        for (
            const resultado of resultados
        ) {

            if (
                !resultado ||
                !resultado.codigo
            ) {

                continue;

            }


            const codigo =
                this.normalizarCodigo(
                    resultado.codigo
                );


            if (
                !mapa.has(
                    codigo
                )
            ) {

                mapa.set(
                    codigo,
                    resultado
                );

            }

        }


        return Array.from(
            mapa.values()
        );

    },


    /* =====================================================
       ORDENAR RESULTADOS
       ===================================================== */

    ordenar(resultados) {

        return resultados.sort(

            (a, b) => {

                if (
                    b.relevancia !==
                    a.relevancia
                ) {

                    return (
                        b.relevancia -
                        a.relevancia
                    );

                }


                return String(
                    a.nombre || ""
                ).localeCompare(

                    String(
                        b.nombre || ""
                    ),

                    "es",

                    {
                        sensitivity:
                            "base"
                    }

                );

            }

        );

    },


/* =====================================================
   CARGAR RESULTADO

   Toda selección continúa pasando por PALNAVEGADOR.
   ===================================================== */

    async cargarResultado(resultado) {

        if (!resultado) {

            throw new Error(
                "PALBUSCADOR: resultado vacío."
            );

        }

        const codigo =
            this.normalizarCodigo(
                resultado.codigo
            );

        if (!codigo) {

            throw new Error(
                "PALBUSCADOR: resultado sin código."
            );

        }

        if (
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.cargarPorCodigo !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: PALNAVEGADOR no disponible."
            );

        }

        return await window.PALNAVEGADOR.cargarPorCodigo(
            codigo
        );

    },


/* =====================================================
   CARGAR DIRECTAMENTE POR CÓDIGO
   ===================================================== */

    async cargarPorCodigo(codigo) {

        const j1 =
            this.normalizarCodigo(
                codigo
            );

        if (!j1) {

            throw new Error(
                "PALBUSCADOR: código vacío."
            );

        }

        if (
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.cargarPorCodigo !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: PALNAVEGADOR no disponible."
            );

        }

        return await window.PALNAVEGADOR.cargarPorCodigo(
            j1
        );

    },


/* =====================================================
   INTERPRETAR BÚSQUEDA
   ===================================================== */

    async interpretar(texto) {

        const resultados =
            await this.buscar(
                texto
            );

        if (!resultados.length) {

            return "";

        }

        return resultados[0].codigo;

    },


/* =====================================================
   ESTADO DEL BUSCADOR
   ===================================================== */

    estado() {

        return {

            disponible:
                !!(
                    window.LEEPALJSON &&
                    typeof window.LEEPALJSON.obtener ===
                    "function"
                ),

            jsonCargado:
                !!this._datosJSON,

            palgeoDisponible:
                !!(
                    window.PALGEOSIMPLIFICADO &&
                    typeof window.PALGEOSIMPLIFICADO.analizar ===
                    "function"
                ),

            palnavegadorDisponible:
                !!(
                    window.PALNAVEGADOR &&
                    typeof window.PALNAVEGADOR.cargarPorCodigo ===
                    "function"
                ),

            version:
                this.version

        };

    }

};


/* =====================================================
   DISPONIBILIDAD GLOBAL
   ===================================================== */

window.PALBUSCADOR =
    PALBUSCADOR;


/*
========================================================
FIN PALBUSCADOR.js
========================================================






    
