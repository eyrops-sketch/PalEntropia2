/* ========================================================
   PalEntropía
   cargacont.js v1.5 LTS

   COMPUERTA DEL CONTENEDOR

   BASE:
   CARGACONT v1.4 LTS FUNCIONAL

   AÑADIDO v1.5:
   - Recuperación independiente de j3 desde master.csv
   - j3 NO depende de LEEPALJSON
   - Transformación de j3 mediante PALGEOSIMPLIFICADO
   - Entrega de datos geológicos al generador

   IMPORTANTE:

   LEEPALJSON sigue proporcionando:

       j1
       j2
       j7
       j8

   CARGACONT obtiene j3 directamente de master.csv.

======================================================== */


/* ========================================================
   CONFIGURACIÓN GLOBAL
======================================================== */

window.CARGACONT = {

    campoPuntero: "j1",

    rutaJSON:
        "paleofichas.json",

    rutaCSV:
        "master.csv",

    dominio:
        "https://palentropia.es/",

    _datosJSON: null,

    _cargandoJSON: null,

    _datosCSVCompleto: null,

    _cargandoCSV: null,

    ultimo: null,


    /* ====================================================
       NORMALIZAR J1
    ==================================================== */

    normalizarJ1(j1){

        return String(j1 || "")
            .trim()
            .toUpperCase();

    },


    /* ====================================================
       OBTENER CONTENEDOR CSV REDUCIDO
       
       ESTE CONTENEDOR SIGUE SIENDO EL DE LEEPALJSON.

       NO SE MODIFICA SU ESTRUCTURA.
    ==================================================== */

    obtenerContenedor(){

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            throw new Error(
                "CARGACONT: LEEPALJSON no está disponible."
            );

        }


        const contenedor =
            window.LEEPALJSON.obtener();


        if(
            !Array.isArray(contenedor) ||
            !contenedor.length
        ){

            throw new Error(
                "CARGACONT: master.csv está vacío."
            );

        }


        return contenedor;

    },


    /* ====================================================
       CARGAR MASTER.CSV COMPLETO

       IMPORTANTE:

       Esta lectura es independiente de LEEPALJSON.

       Su única finalidad es conservar j3.

       NO sustituye a LEEPALJSON.
    ==================================================== */

    async cargarCSVCompleto(){

        if(
            this._datosCSVCompleto
        ){

            return this._datosCSVCompleto;

        }


        if(
            this._cargandoCSV
        ){

            return this._cargandoCSV;

        }


        this._cargandoCSV =

            fetch(
                this.rutaCSV,
                {
                    cache:
                        "default"
                }
            )

            .then(

                respuesta => {

                    if(
                        !respuesta.ok
                    ){

                        throw new Error(
                            "CARGACONT: no se pudo cargar " +
                            this.rutaCSV +
                            " (" +
                            respuesta.status +
                            ")"
                        );

                    }


                    return respuesta.text();

                }

            )

            .then(

                textoCSV => {

                    const filas =
                        this.parsearCSVCompleto(
                            textoCSV
                        );


                    if(
                        !Array.isArray(filas) ||
                        !filas.length
                    ){

                        throw new Error(
                            "CARGACONT: master.csv no contiene registros."
                        );

                    }


                    this._datosCSVCompleto =
                        filas;


                    return filas;

                }

            )

            .catch(

                error => {

                    this._cargandoCSV =
                        null;


                    throw error;

                }

            );


        return this._cargandoCSV;

    },


    /* ====================================================
       PARSER CSV COMPLETO

       Conserva TODAS las columnas del master.csv.

       Especialmente:

       j1
       j3

       Permite campos entre comillas.
    ==================================================== */

    parsearCSVCompleto(texto){

        const filas = [];

        let fila = [];

        let campo = "";

        let dentroComillas = false;


        for(
            let i = 0;
            i < texto.length;
            i++
        ){

            const caracter =
                texto[i];

            const siguiente =
                texto[i + 1];


            /* ----------------------------------------
               COMILLAS
            ---------------------------------------- */

            if(
                caracter === '"'
            ){

                if(
                    dentroComillas &&
                    siguiente === '"'
                ){

                    campo += '"';

                    i++;

                }else{

                    dentroComillas =
                        !dentroComillas;

                }

                continue;

            }


            /* ----------------------------------------
               SEPARADOR
            ---------------------------------------- */

            if(
                caracter === "," &&
                !dentroComillas
            ){

                fila.push(
                    campo
                );

                campo = "";

                continue;

            }


            /* ----------------------------------------
               FIN DE FILA
            ---------------------------------------- */

            if(
                (
                    caracter === "\n" ||
                    caracter === "\r"
                ) &&
                !dentroComillas
            ){

                if(
                    caracter === "\r" &&
                    siguiente === "\n"
                ){

                    i++;

                }


                fila.push(
                    campo
                );

                campo = "";


                if(
                    fila.some(
                        valor =>
                            String(valor)
                            .trim() !== ""
                    )
                ){

                    filas.push(
                        fila
                    );

                }


                fila = [];

                continue;

            }


            /* ----------------------------------------
               CARACTER NORMAL
            ---------------------------------------- */

            campo +=
                caracter;

        }


        /* --------------------------------------------
           ÚLTIMA FILA
        -------------------------------------------- */

        if(
            campo !== "" ||
            fila.length > 0
        ){

            fila.push(
                campo
            );


            if(
                fila.some(
                    valor =>
                        String(valor)
                        .trim() !== ""
                )
            ){

                filas.push(
                    fila
                );

            }

        }


        if(
            !filas.length
        ){

            return [];

        }


        /* --------------------------------------------
           CABECERA
        -------------------------------------------- */

        const cabecera =
            filas[0].map(

                valor => {

                    return String(
                        valor === undefined ||
                        valor === null
                            ? ""
                            : valor
                    )
                    .replace(
                        /^\uFEFF/,
                        ""
                    )
                    .trim()
                    .toLowerCase();

                }

            );


        /* --------------------------------------------
           ÍNDICES
        -------------------------------------------- */

        const indiceJ1 =
            cabecera.indexOf("j1");

        const indiceJ3 =
            cabecera.indexOf("j3");


        if(
            indiceJ1 === -1
        ){

            throw new Error(
                "CARGACONT: master.csv no contiene la columna j1."
            );

        }


        if(
            indiceJ3 === -1
        ){

            throw new Error(
                "CARGACONT: master.csv no contiene la columna j3."
            );

        }


        /* --------------------------------------------
           CONSTRUIR REGISTROS

           Solo necesitamos j1 y j3 aquí.

           Las demás columnas permanecen bajo
           responsabilidad de LEEPALJSON.
        -------------------------------------------- */

        const resultado = [];


        for(
            let i = 1;
            i < filas.length;
            i++
        ){

            const filaActual =
                filas[i];


            const codigo =
                String(
                    filaActual[indiceJ1] ??
                    ""
                )
                .replace(
                    /^\uFEFF/,
                    ""
                )
                .trim();


            const cronologia =
                String(
                    filaActual[indiceJ3] ??
                    ""
                )
                .replace(
                    /^\uFEFF/,
                    ""
                )
                .trim();


            if(
                !codigo
            ){

                continue;

            }


            resultado.push({

                j1:
                    codigo,

                j3:
                    cronologia

            });

        }


        return resultado;

    },


    /* ====================================================
       BUSCAR J1 EN MASTER.CSV

       Esta función sigue utilizando LEEPALJSON
       para los datos normales del generador.
    ==================================================== */

    buscarJ1EnCSV(j1){

        const contenedor =
            this.obtenerContenedor();


        for(
            const registro of contenedor
        ){

            if(!registro){

                continue;

            }


            const codigo =
                this.normalizarJ1(
                    registro.codigo
                );


            if(
                codigo === j1
            ){

                return registro;

            }

        }


        return null;

    },


    /* ====================================================
       BUSCAR J3 DIRECTAMENTE EN MASTER.CSV

       NO utiliza LEEPALJSON.

       Esto es fundamental porque LEEPALJSON
       no expone j3.
    ==================================================== */

    async obtenerJ3(j1){

        const datos =
            await this.cargarCSVCompleto();


        for(
            const registro of datos
        ){

            if(!registro){

                continue;

            }


            const codigo =
                this.normalizarJ1(
                    registro.j1
                );


            if(
                codigo !== j1
            ){

                continue;

            }


            const cronologia =
                String(
                    registro.j3 || ""
                )
                .trim();


            if(
                !cronologia
            ){

                throw new Error(
                    "CARGACONT: j3 vacío en master.csv para " +
                    j1 +
                    "."
                );

            }


            return cronologia;

        }


        throw new Error(
            "CARGACONT: no existe j3 para " +
            j1 +
            " en master.csv."
        );

    },


    /* ====================================================
       TRANSFORMAR CRONOLOGÍA

       j3:

       0521.0000-0509.0000

       ↓

       PALGEOSIMPLIFICADO

       ↓

       cronologia
       inicio_ma
       fin_ma
       rango
       codes
       periodo
       edad
    ==================================================== */

    transformarCronologia(
        cronologia
    ){

        if(
            !cronologia
        ){

            throw new Error(
                "CARGACONT: no se ha recibido j3."
            );

        }


        if(
            !window.PALGEOSIMPLIFICADO
        ){

            throw new Error(
                "CARGACONT: PALGEOSIMPLIFICADO no está disponible."
            );

        }


        if(
            typeof
            window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: PALGEOSIMPLIFICADO.analizar() no está disponible."
            );

        }


        const datos =
            window.PALGEOSIMPLIFICADO.analizar(
                String(
                    cronologia
                ).trim()
            );


        if(
            !datos
        ){

            throw new Error(
                "CARGACONT: no se pudo transformar j3: " +
                cronologia
            );

        }


        return datos;

    },


    /* ====================================================
       CARGAR PALEOFICHAS.JSON

       ESTA PARTE ES LA MISMA QUE EN v1.4.
    ==================================================== */

    async cargarJSON(){

        if(
            this._datosJSON
        ){

            return this._datosJSON;

        }


        if(
            this._cargandoJSON
        ){

            return this._cargandoJSON;

        }


        this._cargandoJSON =

            fetch(
                this.rutaJSON,
                {
                    cache:
                        "default"
                }
            )

            .then(

                respuesta => {

                    if(
                        !respuesta.ok
                    ){

                        throw new Error(
                            "CARGACONT: no se pudo cargar " +
                            this.rutaJSON +
                            " (" +
                            respuesta.status +
                            ")"
                        );

                    }


                    return respuesta.json();

                }

            )

            .then(

                datos => {

                    if(
                        !Array.isArray(datos)
                    ){

                        throw new Error(
                            "CARGACONT: paleofichas.json no contiene un array válido."
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


    /* ====================================================
       BUSCAR J1 EN PALEOFICHAS.JSON
    ==================================================== */

    async buscarEnJSON(j1){

        const datos =
            await this.cargarJSON();


        for(
            const registro of datos
        ){

            if(!registro){

                continue;

            }


            const codigo =

                this.normalizarJ1(
                    registro.codigo ||
                    registro.j1
                );


            if(
                codigo === j1
            ){

                return registro;

            }

        }


        return null;

    },


    /* ====================================================
       OBTENER DATOS FINALES
    ==================================================== */

    async obtenerDatosFinales(j1){

        const registro =
            await this.buscarEnJSON(
                j1
            );


        if(!registro){

            throw new Error(
                "CARGACONT: no existe " +
                j1 +
                " en paleofichas.json."
            );

        }


        const nombre =
            registro.nombre;


        const dieta =
            registro.dieta;


        const anatomia =
            registro.anatomia;


        if(
            !nombre ||
            String(nombre).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j2/nombre vacío para " +
                j1 +
                "."
            );

        }


        if(
            !dieta ||
            String(dieta).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j7/dieta vacío para " +
                j1 +
                "."
            );

        }


        if(
            !anatomia ||
            String(anatomia).trim() === ""
        ){

            throw new Error(
                "CARGACONT: j8/anatomia vacío para " +
                j1 +
                "."
            );

        }


        return {

            j2:
                String(nombre).trim(),

            j7:
                String(dieta).trim(),

            j8:
                String(anatomia).trim()

        };

    },


    /* ====================================================
       CONVERTIR RUTA EN URL ABSOLUTA

       ESTA PARTE CONTINÚA EN LA PARTE 2.
    ==================================================== */




       /* ====================================================
       CARGAR POR J1
    ==================================================== */

    async cargar(j1){

        j1 =
            this.normalizarJ1(
                j1
            );


        if(!j1){

            throw new Error(
                "CARGACONT: no se ha indicado j1."
            );

        }


        /* --------------------------------------------
           COMPROBAR J1 EN MASTER.CSV

           LEEPALJSON solamente se utiliza para
           localizar los registros disponibles.

           NO se busca j3 aquí.
        -------------------------------------------- */

        const registroCSV =
            this.buscarJ1EnCSV(
                j1
            );


        if(!registroCSV){

            throw new Error(
                "CARGACONT: el j1 " +
                j1 +
                " no existe en master.csv."
            );

        }


        /* --------------------------------------------
           DATOS DEFINITIVOS DESDE JSON

           Aquí obtenemos:

           j2
           j3
           j7
           j8
        -------------------------------------------- */

        const datosFinales =
            await this.obtenerDatosFinales(
                j1
            );


        /* --------------------------------------------
           TRANSFORMAR J3

           CARGACONT entrega al generador
           los datos ya preparados.
        -------------------------------------------- */

        const datosGeo =
            this.transformarCronologia(
                datosFinales.j3
            );


        /* --------------------------------------------
           COMPROBAR BUSCARUTA
        -------------------------------------------- */

        if(
            !window.BUSCARUTA ||
            typeof window.BUSCARUTA.buscar !==
            "function"
        ){

            throw new Error(
                "CARGACONT: BUSCARUTA no está disponible."
            );

        }


        /* --------------------------------------------
           BUSCAR IMÁGENES
        -------------------------------------------- */

        const resultadoBusqueda =
            await window.BUSCARUTA.buscar(
                j1
            );


        /* --------------------------------------------
           CONVERTIR IMÁGENES
        -------------------------------------------- */

        const imagenes =
            this.prepararImagenes(
                resultadoBusqueda
            );


        /* --------------------------------------------
           REGISTRO FINAL
           
           Este es el registro que recibe CAB02.

           j3 permanece disponible como cronología
           interna.

           Además se entregan los datos ya procesados
           por PALGEOSIMPLIFICADO / PALGEO.
        -------------------------------------------- */

        const resultado = {

            j1:
                j1,

            j2:
                datosFinales.j2,

            j3:
                datosGeo.cronologia,

            j7:
                datosFinales.j7,

            j8:
                datosFinales.j8,


            /* ----------------------------------------
               DATOS GEO
            ---------------------------------------- */

            rango:
                datosGeo.rango,

            periodo:
                datosGeo.periodo,

            subperiodo:
                datosGeo.edad,

            codes:
                datosGeo.codes,

            edad:
                datosGeo.edad,


            /* ----------------------------------------
               IMÁGENES
            ---------------------------------------- */

            i0:
                imagenes.i0,

            i2:
                imagenes.i2,

            i3:
                imagenes.i3

        };


        /* --------------------------------------------
           CACHE
        -------------------------------------------- */

        this.ultimo =
            resultado;


        /* --------------------------------------------
           EVENTO
        -------------------------------------------- */

        document.dispatchEvent(

            new CustomEvent(
                "palentropia:contenedor-cargado",
                {
                    detail:
                        resultado
                }
            )

        );


        /* --------------------------------------------
           CONSOLA
        -------------------------------------------- */

        console.log(
            "========================================"
        );

        console.log(
            "PalEntropía — CARGACONT v1.5 LTS"
        );

        console.log(
            "Registro final:"
        );

        console.log(
            resultado
        );

        console.log(
            "Datos PALGEO:"
        );

        console.log(
            datosGeo
        );

        console.log(
            "========================================"
        );


        return resultado;

    },


    /* ====================================================
       CARGA ALEATORIA
    ==================================================== */

    async aleatorio(){

        const contenedor =
            this.obtenerContenedor();


        const registros =
            contenedor.filter(

                registro => {

                    if(!registro){

                        return false;

                    }


                    const codigo =
                        this.normalizarJ1(
                            registro.codigo
                        );


                    return /^\d{3}_\d{2}$/.test(
                        codigo
                    );

                }

            );


        if(
            !registros.length
        ){

            throw new Error(
                "CARGACONT: no existen j1 válidos."
            );

        }


        const indice =
            Math.floor(
                Math.random() *
                registros.length
            );


        const j1 =
            this.normalizarJ1(
                registros[indice].codigo
            );


        return await this.cargar(
            j1
        );

    },


    /* ====================================================
       OBTENER ÚLTIMO REGISTRO
    ==================================================== */

    obtener(){

        return this.ultimo || null;

    },


    /* ====================================================
       ESTADO
    ==================================================== */

    estado(){

        return {

            disponible:
                !!this.ultimo,

            j1:
                this.ultimo
                    ? this.ultimo.j1
                    : null

        };

    }

};


/* ========================================================
   FIN CARGACONT v1.5 LTS
======================================================== */


   
