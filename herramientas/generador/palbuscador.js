/*
========================================================
PalEntropía
palbuscador.js v3.2 LTS

MOTOR DE BÚSQUEDA DEL GENERADOR

ARQUITECTURA:

MASTER.CSV
↓
LEEPALJSON
↓
PALBUSCADOR
↓
j1
↓
PALNAVEGADOR
↓
CAB07
↓
CONT07
↓
CARGACONT
↓
CAB01–CAB06
↓
GENERADOR

BUSCA POR:

Código (j1)
Nombre (j2)

FUENTES:

master.csv
→ códigos j1

paleofichas.json
→ nombre / j2

PALVIDEO.js
→ enlace de vídeo mediante j1

IMPORTANTE:

PALBUSCADOR NO CARGA DIRECTAMENTE CARGACONT.

Toda selección de una búsqueda pasa por
PALNAVEGADOR para garantizar que:

- se actualice el índice
- se actualice codigoActual
- se ejecute CAB07
- se actualice CONT07
- se actualice la geología
- se cargue finalmente la ficha

========================================================
*/


const PALBUSCADOR = {


    /* =====================================================
       VERSIÓN
       ===================================================== */

    version: "3.2 LTS",


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
       OBTENER CONTENEDOR
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


        const contenedor =
            window.LEEPALJSON.obtener();


        if (
            !Array.isArray(contenedor) ||
            !contenedor.length
        ) {

            throw new Error(
                "PALBUSCADOR: master.csv está vacío."
            );

        }


        return contenedor;

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
                            "PALBUSCADOR: no se pudo cargar " +
                            "paleofichas.json (" +
                            respuesta.status +
                            ")"
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
                            "PALBUSCADOR: paleofichas.json no contiene un array válido."
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
                !codigo ||
                !nombre
            ) {

                continue;

            }


            mapa.set(
                codigo,
                nombre
            );

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
            !j1
        ) {

            return null;

        }


        if (
            !window.PALVIDEO ||
            typeof window.PALVIDEO !==
            "object"
        ) {

            return null;

        }


        const registro =
            window.PALVIDEO[j1];


        if (
            !registro ||
            typeof registro !==
            "object"
        ) {

            return null;

        }


        const video =
            registro.video;


        if (
            video === undefined ||
            video === null
        ) {

            return null;

        }


        const url =
            String(video).trim();


        if (
            !url
        ) {

            return null;

        }


        return url;

    },


    /* =====================================================
       COMPROBAR SI EXISTE VÍDEO
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
            String(texto || "").trim();


        if (
            !consulta
        ) {

            return "vacio";

        }


        if (
            /^[0-9_]+$/.test(
                consulta
            )
        ) {

            return "codigo";

        }


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
                    registro.codigo
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
                        codigo === codigoConsulta
                            ? 200
                            : 100

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

        const nombreConsulta =
            this.normalizar(
                consulta
            );


        if (
            nombreConsulta.length < 3
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
                    nombreConsulta
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
                        nombreConsulta
                            ? 200
                            : 100

                });

            }

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
                !mapa.has(codigo)
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
       BUSCADOR PRINCIPAL
       ===================================================== */

    async buscar(texto) {

        const consultaOriginal =
            String(
                texto || ""
            ).trim();


        if (
            !consultaOriginal
        ) {

            return [];

        }


        const tipo =
            this.tipoConsulta(
                consultaOriginal
            );


        if (
            tipo === "corto" ||
            tipo === "vacio"
        ) {

            return [];

        }


        if (
            tipo === "codigo"
        ) {

            const resultados =
                await this.buscarPorCodigo(
                    consultaOriginal
                );


            return this.ordenar(
                resultados
            );

        }


        if (
            tipo === "nombre"
        ) {

            const resultados =
                await this.buscarPorNombre(
                    consultaOriginal
                );


            return this.ordenar(
                resultados
            );

        }


        return [];

    },


    /* =====================================================
       INTERPRETAR BÚSQUEDA
       ===================================================== */

    async interpretar(texto) {

        const resultados =
            await this.buscar(
                texto
            );


        if (
            !resultados.length
        ) {

            return "";

        }


        return resultados[0].codigo;

    },


    /* =====================================================
       CARGAR RESULTADO

       IMPORTANTE:

       NO llama directamente a CARGACONT.

       El resultado pasa por PALNAVEGADOR.

       Esto garantiza que se actualicen:

       - índice
       - código actual
       - CAB07
       - CONT07
       - geología
       - CARGACONT
       - ficha
       ===================================================== */

    async cargarResultado(resultado) {

        if (
            !resultado
        ) {

            throw new Error(
                "PALBUSCADOR: resultado vacío."
            );

        }


        const codigo =
            this.normalizarCodigo(
                resultado.codigo
            );


        if (
            !codigo
        ) {

            throw new Error(
                "PALBUSCADOR: el resultado no contiene j1."
            );

        }


        /*
        =================================================
        PASAR POR PALNAVEGADOR
        =================================================
        */

        if (
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.cargarPorCodigo !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: PALNAVEGADOR no está disponible."
            );

        }


        return await window.PALNAVEGADOR.cargarPorCodigo(
            codigo
        );

    },


    /* =====================================================
       CARGAR POR CÓDIGO DIRECTAMENTE

       También pasa obligatoriamente por PALNAVEGADOR.
       ===================================================== */

    async cargarPorCodigo(codigo) {

        const j1 =
            this.normalizarCodigo(
                codigo
            );


        if (
            !j1
        ) {

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
                "PALBUSCADOR: PALNAVEGADOR no está disponible."
            );

        }


        return await window.PALNAVEGADOR.cargarPorCodigo(
            j1
        );

    },


    /* =====================================================
       ESTADO
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

            palvideoDisponible:
                !!(
                    window.PALVIDEO &&
                    typeof window.PALVIDEO ===
                    "object"
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


/* =========================================================
   DISPONIBILIDAD GLOBAL
========================================================= */

window.PALBUSCADOR =
    PALBUSCADOR;


/*
========================================================
FIN PALBUSCADOR.js v3.2 LTS
========================================================
*/
