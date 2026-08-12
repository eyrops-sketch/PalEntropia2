/*
=========================================================
PalEntropía
palbuscador.js v3.2 LTS

MOTOR DE BÚSQUEDA DEL GENERADOR
=========================================================

ARQUITECTURA:

MASTER.CSV
    ↓
LEEPALJSON
    ↓
PALBUSCADOR
    │
    ├── Código
    │      ↓
    │   CARGACONT
    │      ↓
    │   CAB01-CAB06
    │
    ├── Nombre
    │      ↓
    │   CARGACONT
    │      ↓
    │   CAB01-CAB06
    │
    └── Tiempo geológico
           ↓
        CAB07
           ↓
        LEEPALGEO
           ↓
        PALGEOSIMPLIFICADO
           ↓
        PALGEO


BUSCA POR:

- Código (j1)
- Nombre (j2)
- Tiempo geológico
  - Código geológico
  - Período
  - Edad


IMPORTANTE:

PALBUSCADOR NO construye la Paleoficha.

Para código y nombre:
    CARGACONT sigue siendo la puerta de entrada.

Para geología:
    CAB07 analiza el j3 mediante LEEPALGEO.


=========================================================
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


        /* ---------------------------------------------
           CÓDIGO
        --------------------------------------------- */

        if (
            /^[0-9_]+$/.test(
                consulta
            )
        ) {

            return "codigo";

        }


        /* ---------------------------------------------
           TEXTO
           
           Primero se considera nombre.
           Si no produce resultados,
           buscar() probará geología.
        --------------------------------------------- */

        if (
            this.normalizar(
                consulta
            ).length >= 3
        ) {

            return "texto";

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
       BUSCAR POR TIEMPO GEOLÓGICO

       FLUJO:

       MASTER.CSV
          ↓
       j1
          ↓
       CAB07
          ↓
       j3
          ↓
       LEEPALGEO
          ↓
       codes / periodo / edad

       La búsqueda se hace sobre TODOS los registros.

       CAB07 devuelve el registro completo y
       LEEPALGEO interpreta su j3.

       ===================================================== */

    async buscarPorGeologia(consulta) {

        const textoConsulta =
            this.normalizar(
                consulta
            );


        if (
            !textoConsulta
        ) {

            return [];

        }


        /* ---------------------------------------------
           COMPROBAR CAB07
        --------------------------------------------- */

        if (
            !window.CAB07 ||
            typeof window.CAB07.procesar !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: CAB07 no está disponible."
            );

        }


        /* ---------------------------------------------
           COMPROBAR LEEPALGEO
        --------------------------------------------- */

        if (
            !window.LEEPALGEO ||
            typeof window.LEEPALGEO.extraer !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: LEEPALGEO no está disponible."
            );

        }


        const contenedor =
            this.obtenerContenedor();


        const mapaNombres =
            await this.obtenerMapaNombres();


        const resultados = [];


        /* ---------------------------------------------
           RECORRER MASTER.CSV

           Se procesa cada j1 mediante CAB07.
        --------------------------------------------- */

        for (
            const registro of contenedor
        ) {

            if (
                !registro ||
                !registro.codigo
            ) {

                continue;

            }


            const j1 =
                this.normalizarCodigo(
                    registro.codigo
                );


            if (
                !j1
            ) {

                continue;

            }


            let datos;


            try {

                datos =
                    await window.CAB07.procesar(
                        j1
                    );

            }
            catch (
                error
            ) {

                console.warn(
                    "PALBUSCADOR: error geológico en " +
                    j1,
                    error
                );

                continue;

            }


            if (
                !datos ||
                !datos.j3
            ) {

                continue;

            }


            /* -----------------------------------------
               EXTRAER DATOS GEOLOGICOS
            ----------------------------------------- */

            const geologia =
                window.LEEPALGEO.extraer(
                    datos.j3
                );


            if (
                !geologia
            ) {

                continue;

            }


            /* -----------------------------------------
               BUSCAR EN CÓDIGOS
            ----------------------------------------- */

            const coincideCodigo =
                Array.isArray(
                    geologia.codes
                ) &&
                geologia.codes.some(
                    codigo =>
                        this.normalizar(
                            codigo
                        ).includes(
                            textoConsulta
                        )
                );


            /* -----------------------------------------
               BUSCAR EN PERÍODOS
            ----------------------------------------- */

            const coincidePeriodo =
                Array.isArray(
                    geologia.periodo
                ) &&
                geologia.periodo.some(
                    periodo =>
                        this.normalizar(
                            periodo
                        ).includes(
                            textoConsulta
                        )
                );


            /* -----------------------------------------
               BUSCAR EN EDADES
            ----------------------------------------- */

            const coincideEdad =
                Array.isArray(
                    geologia.edad
                ) &&
                geologia.edad.some(
                    edad =>
                        this.normalizar(
                            edad
                        ).includes(
                            textoConsulta
                        )
                );


            if (
                !coincideCodigo &&
                !coincidePeriodo &&
                !coincideEdad
            ) {

                continue;

            }


            let tipo =
                "geologia";


            let relevancia =
                100;


            if (
                coincideCodigo
            ) {

                tipo =
                    "codigo_geologico";

                relevancia =
                    130;

            }
            else if (
                coincidePeriodo
            ) {

                tipo =
                    "periodo";

                relevancia =
                    120;

            }
            else if (
                coincideEdad
            ) {

                tipo =
                    "edad";

                relevancia =
                    110;

            }


            resultados.push({

                codigo:
                    j1,

                nombre:
                    mapaNombres.get(
                        j1
                    ) ||
                    "Sin nombre",

                tipo:
                    tipo,

                relevancia:
                    relevancia,

                geologia:
                    geologia

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

       ORDEN:

       1. CÓDIGO
          → PALBUSCADOR
          → CARGACONT

       2. NOMBRE
          → PALBUSCADOR
          → CARGACONT

       3. TIEMPO GEOLÓGICO
          → CAB07

       El buscador NO construye la Paleoficha.
       Solo localiza el j1 y lo entrega al
       módulo correspondiente.
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


        /* ---------------------------------------------
           CONSULTA DEMASIADO CORTA
        --------------------------------------------- */

        if (
            tipo === "corto" ||
            tipo === "vacio"
        ) {

            return [];

        }


        /* ---------------------------------------------
           CÓDIGO
        --------------------------------------------- */

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


        /* ---------------------------------------------
           NOMBRE
        --------------------------------------------- */

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


        /* ---------------------------------------------
           TIEMPO GEOLÓGICO

           Se reserva para CAB07.

           En esta fase PALBUSCADOR no intenta
           interpretar cronologías ni consultar
           PALGEO directamente.
        --------------------------------------------- */

        if (
            tipo === "geologico"
        ) {

            return await this.buscarPorGeologia(
                consultaOriginal
            );

        }


        return [];

    },


    /* =====================================================
       INTERPRETAR BÚSQUEDA

       Devuelve el primer código encontrado.

       Útil para el buscador visual cuando necesita
       convertir una consulta en un j1.
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
       BUSCAR POR GEOLOGÍA

       La búsqueda geológica pertenece a CAB07.

       PALBUSCADOR actúa únicamente como puente.

       CAB07 debe devolver un array de resultados
       con al menos:

       {
           codigo: "001_01"
       }

       Si CAB07 todavía no dispone de la función
       de búsqueda geológica, devuelve [] sin romper
       el buscador de código/nombre.
    ===================================================== */

    async buscarPorGeologia(
        consulta
    ) {

        if (
            !window.CAB07
        ) {

            console.warn(
                "PALBUSCADOR: CAB07 no está disponible para búsqueda geológica."
            );

            return [];

        }


        /* ---------------------------------------------
           BUSCAR

           Se admite buscarGeologia() como función
           principal del módulo CAB07.
        --------------------------------------------- */

        if (
            typeof window.CAB07.buscarGeologia ===
            "function"
        ) {

            const resultados =
                await window.CAB07.buscarGeologia(
                    consulta
                );


            if (
                !Array.isArray(
                    resultados
                )
            ) {

                return [];

            }


            return this.ordenar(
                this.unicosResultados(
                    resultados
                )
            );

        }


        /* ---------------------------------------------
           ALIAS OPCIONAL

           Permite que CAB07 pueda utilizar
           buscarTiempo() sin modificar
           PALBUSCADOR.
        --------------------------------------------- */

        if (
            typeof window.CAB07.buscarTiempo ===
            "function"
        ) {

            const resultados =
                await window.CAB07.buscarTiempo(
                    consulta
                );


            if (
                !Array.isArray(
                    resultados
                )
            ) {

                return [];

            }


            return this.ordenar(
                this.unicosResultados(
                    resultados
                )
            );

        }


        console.warn(
            "PALBUSCADOR: CAB07 no dispone todavía de búsqueda geológica."
        );


        return [];

    },


    /* =====================================================
       CARGAR RESULTADO

       CÓDIGO / NOMBRE:

       PALBUSCADOR
            ↓
          j1
            ↓
       CARGACONT
            ↓
       CAB01–CAB06
            ↓
       GENERADOR

       El buscador no construye la ficha.
    ===================================================== */

    async cargarResultado(
        resultado
    ) {

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


        /* ---------------------------------------------
           CARGACONT
        --------------------------------------------- */

        if (
            !window.CARGACONT ||
            typeof window.CARGACONT.cargar !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: CARGACONT no está disponible."
            );

        }


        return await window.CARGACONT.cargar(
            codigo
        );

    },


    /* =====================================================
       CARGAR POR CÓDIGO DIRECTAMENTE
    ===================================================== */

    async cargarPorCodigo(
        codigo
    ) {

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


        /* ---------------------------------------------
           CARGACONT
        --------------------------------------------- */

        if (
            !window.CARGACONT ||
            typeof window.CARGACONT.cargar !==
            "function"
        ) {

            throw new Error(
                "PALBUSCADOR: CARGACONT no está disponible."
            );

        }


        return await window.CARGACONT.cargar(
            j1
        );

    },


    /* =====================================================
       CARGAR RESULTADO GEOLOGICO

       CAB07 ya ha localizado el j1.

       Una vez localizado el código, la carga final
       vuelve a pasar por CARGACONT para que CAB01–CAB06
       preparen los datos normales de la Paleoficha.

       Por tanto:

       BÚSQUEDA GEOLOGICA
              ↓
            CAB07
              ↓
             j1
              ↓
          CARGACONT
              ↓
          CAB01–CAB06
    ===================================================== */

    async cargarResultadoGeologico(
        resultado
    ) {

        if (
            !resultado
        ) {

            throw new Error(
                "PALBUSCADOR: resultado geológico vacío."
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
                "PALBUSCADOR: el resultado geológico no contiene j1."
            );

        }


        return await this.cargarPorCodigo(
            codigo
        );

    },


    /* =====================================================
       UNIFICAR CARGA DE RESULTADO

       Permite que el generador utilice una única
       función independientemente del tipo de búsqueda.
    ===================================================== */

    async seleccionarResultado(
        resultado
    ) {

        if (
            !resultado
        ) {

            throw new Error(
                "PALBUSCADOR: no se ha seleccionado ningún resultado."
            );

        }


        const tipo =
            String(
                resultado.tipo || ""
            )
            .trim()
            .toLowerCase();


        /* ---------------------------------------------
           GEOLOGÍA
        --------------------------------------------- */

        if (
            tipo === "geologico" ||
            tipo === "geologia" ||
            tipo === "tiempo"
        ) {

            return await this.cargarResultadoGeologico(
                resultado
            );

        }


        /* ---------------------------------------------
           CÓDIGO / NOMBRE
        --------------------------------------------- */

        return await this.cargarResultado(
            resultado
        );

    },


    /* =====================================================
       LIMPIAR CACHE JSON
       
       Útil cuando paleofichas.json se actualiza.
    ===================================================== */

    limpiarCacheJSON() {

        this._datosJSON =
            null;

        this._cargandoJSON =
            null;

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

            cargacontDisponible:
                !!(
                    window.CARGACONT &&
                    typeof window.CARGACONT.cargar ===
                    "function"
                ),

            cab07Disponible:
                !!(
                    window.CAB07 &&
                    typeof window.CAB07 ===
                    "object"
                ),

            cab07GeologiaDisponible:
                !!(
                    window.CAB07 &&
                    (
                        typeof window.CAB07.buscarGeologia ===
                        "function" ||
                        typeof window.CAB07.buscarTiempo ===
                        "function"
                    )
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


/* =========================================================
   FIN PALBUSCADOR.js v3.1 LTS
========================================================= */
