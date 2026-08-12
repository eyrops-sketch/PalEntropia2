/* ========================================================
   PalEntropía
   cab07.js v1.1 LTS

   CAB07 — CRONOLOGÍA Y PRESENTACIÓN

   FUNCIÓN:

   - Recibe el registro final de CARGACONT.
   - Obtiene j3.
   - Procesa j3 mediante PALGEOSIMPLIFICADO.
   - Consulta PALGEO mediante PALGEOSIMPLIFICADO.
   - Prepara:
       · cronología
       · período
       · subperíodo
       · códigos PALGEO
   - Presenta los datos después de las imágenes i2 e i3.

   IMPORTANTE:

   CAB07 NO modifica j3.

   j3 continúa siendo:

       MMMM.DDDD-MMMM.DDDD

   Ejemplo:

       0059.2000-0041.2000

   PRESENTACIÓN:

       59,2 Ma - 41,2 Ma

       Período
       ...

       Subperíodo
       ...

   DEPENDENCIAS:

   - CARGACONT
   - PALGEOSIMPLIFICADO
   - PALGEO
   - HTML del generador

   NO UTILIZA:

   - decoders antiguos
   - PALBUSCADOR
   - PALNAVEGADOR
   - PALVIDEO
   - BUSCARUTA

======================================================== */


/* ========================================================
   CAB07
======================================================== */

window.CAB07 = {


    /* ====================================================
       CONFIGURACIÓN
    ==================================================== */

    idContenedor:
        "cab07Cronologia",

    claseContenedor:
        "cab07-cronologia",

    ultimo:
        null,


    /* ====================================================
       INICIALIZAR
    ==================================================== */

    inicializar(){

        /*
        ------------------------------------------------
        COMPROBAR PALGEOSIMPLIFICADO
        ------------------------------------------------
        */

        if(
            !window.PALGEOSIMPLIFICADO
        ){

            console.error(
                "CAB07: PALGEOSIMPLIFICADO no está disponible."
            );

            return false;

        }


        /*
        ------------------------------------------------
        COMPROBAR analizar()
        ------------------------------------------------
        */

        if(
            typeof
            window.PALGEOSIMPLIFICADO.analizar !==
            "function"
        ){

            console.error(
                "CAB07: PALGEOSIMPLIFICADO.analizar() no está disponible."
            );

            return false;

        }


        /*
        ------------------------------------------------
        ESCUCHAR CONTENEDOR
        ------------------------------------------------
        */

        document.addEventListener(

            "palentropia:contenedor-cargado",

            evento => {

                this.procesar(
                    evento.detail
                );

            }

        );


        console.log(
            "PalEntropía — CAB07 v1.1 LTS cargado."
        );


        return true;

    },


    /* ====================================================
       OBTENER J3

       PRIMERA OPCIÓN:

       El registro recibido por CARGACONT ya contiene j3.

       SEGUNDA OPCIÓN:

       Si no existe, se consulta el registro de
       master.csv mediante CARGACONT.

       CAB07 nunca lee master.csv directamente.
    ==================================================== */

    obtenerJ3(ficha){

        if(
            !ficha
        ){

            return null;

        }


        /*
        ------------------------------------------------
        OPCIÓN 1
        J3 YA VIENE EN EL REGISTRO
        ------------------------------------------------
        */

        if(
            ficha.j3 !== undefined &&
            ficha.j3 !== null &&
            String(ficha.j3).trim() !== ""
        ){

            return String(
                ficha.j3
            ).trim();

        }


        /*
        ------------------------------------------------
        NECESITAMOS J1
        ------------------------------------------------
        */

        const j1 =
            ficha.j1 ||
            ficha.codigo;


        if(
            !j1
        ){

            console.error(
                "CAB07: no se puede obtener j3 porque falta j1."
            );

            return null;

        }


        /*
        ------------------------------------------------
        COMPROBAR CARGACONT
        ------------------------------------------------
        */

        if(
            !window.CARGACONT
        ){

            console.error(
                "CAB07: CARGACONT no está disponible."
            );

            return null;

        }


        /*
        ------------------------------------------------
        BUSCAR EN MASTER.CSV
        ------------------------------------------------
        */

        if(
            typeof
            window.CARGACONT.buscarJ1EnCSV !==
            "function"
        ){

            console.error(
                "CAB07: CARGACONT.buscarJ1EnCSV() no está disponible."
            );

            return null;

        }


        const registro =
            window.CARGACONT.buscarJ1EnCSV(
                j1
            );


        if(
            !registro
        ){

            console.error(
                "CAB07: no se encontró el registro " +
                j1 +
                " en master.csv."
            );

            return null;

        }


        /*
        ------------------------------------------------
        J3 DEL REGISTRO
        ------------------------------------------------
        */

        if(
            registro.j3 !== undefined &&
            registro.j3 !== null &&
            String(registro.j3).trim() !== ""
        ){

            return String(
                registro.j3
            ).trim();

        }


        /*
        ------------------------------------------------
        POR SI EL REGISTRO UTILIZA CLAVE "J3"
        ------------------------------------------------
        */

        if(
            registro.J3 !== undefined &&
            registro.J3 !== null &&
            String(registro.J3).trim() !== ""
        ){

            return String(
                registro.J3
            ).trim();

        }


        /*
        ------------------------------------------------
        ERROR
        ------------------------------------------------
        */

        console.error(
            "CAB07: el registro " +
            j1 +
            " existe, pero no contiene j3.",
            registro
        );


        return null;

    },


    /* ====================================================
       PROCESAR J3
    ==================================================== */

    procesarJ3(j3){

        if(
            !j3
        ){

            return null;

        }


        /*
        ------------------------------------------------
        VALIDAR FORMATO
        ------------------------------------------------
        */

        if(
            typeof
            window.PALGEOSIMPLIFICADO.validarCronologia ===
            "function"
        ){

            const valida =
                window.PALGEOSIMPLIFICADO.validarCronologia(
                    j3
                );


            if(
                !valida
            ){

                console.error(
                    "CAB07: j3 no tiene una cronología interna válida:",
                    j3
                );

                return null;

            }

        }


        /*
        ------------------------------------------------
        ANALIZAR
        ------------------------------------------------
        */

        const datos =
            window.PALGEOSIMPLIFICADO.analizar(
                j3
            );


        if(
            !datos
        ){

            console.error(
                "CAB07: PALGEOSIMPLIFICADO no pudo analizar:",
                j3
            );

            return null;

        }


        /*
        ------------------------------------------------
        SUBPERÍODO

        PALGEOSIMPLIFICADO v1.2 devuelve "edad".

        CAB07 lo presenta como "subperiodo".
        ------------------------------------------------
        */

        let subperiodo = [];


        if(
            Array.isArray(
                datos.subperiodo
            )
        ){

            subperiodo =
                datos.subperiodo;

        }

        else if(
            Array.isArray(
                datos.edad
            )
        ){

            subperiodo =
                datos.edad;

        }


        /*
        ------------------------------------------------
        RESULTADO NORMALIZADO PARA GENERADOR
        ------------------------------------------------
        */

        return {

            j3:
                j3,

            cronologia:
                datos.rango || null,

            periodo:
                Array.isArray(
                    datos.periodo
                )
                ?
                datos.periodo
                :
                [],

            subperiodo:
                subperiodo,

            codes:
                Array.isArray(
                    datos.codes
                )
                ?
                datos.codes
                :
                [],

            inicio_ma:
                datos.inicio_ma,

            fin_ma:
                datos.fin_ma

        };

    },


    /* ====================================================
       CREAR CONTENEDOR VISUAL
    ==================================================== */

    crearContenedor(){

        /*
        ------------------------------------------------
        SI YA EXISTE
        ------------------------------------------------
        */

        let contenedor =
            document.getElementById(
                this.idContenedor
            );


        if(
            contenedor
        ){

            return contenedor;

        }


        /*
        ------------------------------------------------
        CREAR CONTENEDOR
        ------------------------------------------------
        */

        contenedor =
            document.createElement(
                "section"
            );


        contenedor.id =
            this.idContenedor;


        contenedor.className =
            this.claseContenedor;


        /*
        ------------------------------------------------
        HTML
        ------------------------------------------------
        */

        contenedor.innerHTML = `

            <div class="cab07-campo cab07-intervalo">

                <div class="cab07-etiqueta">
                    Cronología
                </div>

                <div
                    id="cab07CronologiaValor"
                    class="cab07-valor">
                </div>

            </div>


            <div class="cab07-campo cab07-periodo">

                <div class="cab07-etiqueta">
                    Período
                </div>

                <div
                    id="cab07PeriodoValor"
                    class="cab07-valor">
                </div>

            </div>


            <div class="cab07-campo cab07-subperiodo">

                <div class="cab07-etiqueta">
                    Subperíodo
                </div>

                <div
                    id="cab07SubperiodoValor"
                    class="cab07-valor">
                </div>

            </div>

        `;


        /*
        ------------------------------------------------
        INSERTAR DESPUÉS DE IMG3
        ------------------------------------------------

        Se intenta colocar después del contenedor
        visual de img3.

        Si img3 no tiene contenedor propio,
        se coloca directamente después de img3.
        ------------------------------------------------
        */

        const img3 =
            document.getElementById(
                "img3"
            );


        if(
            img3
        ){

            const padre =
                img3.parentElement;


            if(
                padre &&
                padre !== document.body
            ){

                /*
                El bloque se coloca después del
                contenedor de img3.
                */

                padre.after(
                    contenedor
                );

            }

            else{

                img3.after(
                    contenedor
                );

            }

        }

        else{

            /*
            ------------------------------------------------
            FALLBACK

            Si img3 todavía no existe, buscamos una zona
            de imágenes mediante sus elementos conocidos.
            ------------------------------------------------
            */

            const img2 =
                document.getElementById(
                    "img2"
                );


            if(
                img2
            ){

                const padreImg2 =
                    img2.parentElement;


                if(
                    padreImg2
                ){

                    padreImg2.after(
                        contenedor
                    );

                }

                else{

                    img2.after(
                        contenedor
                    );

                }

            }

            else{

                /*
                ------------------------------------------------
                ÚLTIMO FALLBACK

                Intentar encontrar la ficha.
                ------------------------------------------------
                */

                const ficha =
                    document.querySelector(
                        ".ficha"
                    );


                if(
                    ficha
                ){

                    ficha.appendChild(
                        contenedor
                    );

                }

                else{

                    console.error(
                        "CAB07: no se encontró una zona válida para insertar la cronología."
                    );

                    return null;

                }

            }

        }


        return contenedor;

    },


    /* ====================================================
       FORMATEAR LISTA
    ==================================================== */

    formatearLista(lista){

        if(
            !Array.isArray(lista)
        ){

            return "—";

        }


        /*
        ------------------------------------------------
        LIMPIAR
        ------------------------------------------------
        */

        const valores =
            lista
            .map(
                valor =>
                    String(valor)
                    .trim()
            )
            .filter(
                valor =>
                    valor !== ""
            );


        if(
            !valores.length
        ){

            return "—";

        }


        /*
        ------------------------------------------------
        ELIMINAR DUPLICADOS
        ------------------------------------------------
        */

        const unicos =
            [
                ...new Set(
                    valores
                )
            ];


        /*
        ------------------------------------------------
        PRESENTACIÓN
        ------------------------------------------------
        */

        return unicos.join(
            " · "
        );

    },


    /* ====================================================
       MOSTRAR
    ==================================================== */

    mostrar(datos){

        if(
            !datos
        ){

            return false;

        }


        /*
        ------------------------------------------------
        CREAR / OBTENER CONTENEDOR
        ------------------------------------------------
        */

        const contenedor =
            this.crearContenedor();


        if(
            !contenedor
        ){

            return false;

        }


        /*
        ------------------------------------------------
        CRONOLOGÍA
        ------------------------------------------------
        */

        const cronologia =
            contenedor.querySelector(
                "#cab07CronologiaValor"
            );


        if(
            cronologia
        ){

            cronologia.textContent =
                datos.cronologia ||
                "—";

        }


        /*
        ------------------------------------------------
        PERÍODO
        ------------------------------------------------
        */

        const periodo =
            contenedor.querySelector(
                "#cab07PeriodoValor"
            );


        if(
            periodo
        ){

            periodo.textContent =
                this.formatearLista(
                    datos.periodo
                );

        }


        /*
        ------------------------------------------------
        SUBPERÍODO
        ------------------------------------------------
        */

        const subperiodo =
            contenedor.querySelector(
                "#cab07SubperiodoValor"
            );


        if(
            subperiodo
        ){

            subperiodo.textContent =
                this.formatearLista(
                    datos.subperiodo
                );

        }


        /*
        ------------------------------------------------
        GUARDAR
        ------------------------------------------------
        */

        this.ultimo =
            datos;


        /*
        ------------------------------------------------
        EVENTO
        ------------------------------------------------
        */

        document.dispatchEvent(

            new CustomEvent(
                "palentropia:cronologia-procesada",
                {
                    detail:
                        datos
                }
            )

        );


        return true;

    },


    /* ====================================================
       PROCESAR FICHA
    ==================================================== */

    procesar(ficha){

        if(
            !ficha
        ){

            console.error(
                "CAB07: no se recibió ninguna ficha."
            );

            return null;

        }


        /*
        ------------------------------------------------
        OBTENER J3
        ------------------------------------------------
        */

        const j3 =
            this.obtenerJ3(
                ficha
            );


        if(
            !j3
        ){

            console.error(
                "CAB07: no se pudo obtener j3.",
                ficha
            );

            return null;

        }


        /*
        ------------------------------------------------
        PROCESAR
        ------------------------------------------------
        */

        const datos =
            this.procesarJ3(
                j3
            );


        if(
            !datos
        ){

            return null;

        }


        /*
        ------------------------------------------------
        PRESENTAR
        ------------------------------------------------
        */

        this.mostrar(
            datos
        );


        /*
        ------------------------------------------------
        CONSOLA
        ------------------------------------------------
        */

        console.log(
            "========================================"
        );

        console.log(
            "PalEntropía — CAB07 v1.1 LTS"
        );

        console.log(
            "J1:",
            ficha.j1
        );

        console.log(
            "J3:",
            j3
        );

        console.log(
            "Datos PALGEO:",
            datos
        );

        console.log(
            "========================================"
        );


        return datos;

    },


   /* ====================================================
       OBTENER ÚLTIMO RESULTADO
    ==================================================== */

    obtener(){

        return this.ultimo || null;

    },


    /* ====================================================
       LIMPIAR
    ==================================================== */

    limpiar(){

        const contenedor =
            document.getElementById(
                this.idContenedor
            );


        if(
            contenedor
        ){

            contenedor.remove();

        }


        this.ultimo =
            null;

    }

};


/* ========================================================
   INICIALIZACIÓN
======================================================== */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(

        "DOMContentLoaded",

        function(){

            window.CAB07.inicializar();

        }

    );

}

else{

    window.CAB07.inicializar();

}


/* ========================================================
   FIN CAB07 v1.1 LTS
======================================================== */





