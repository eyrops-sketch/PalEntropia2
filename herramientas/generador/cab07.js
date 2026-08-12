/* ========================================================
   PalEntropía
   cab07.js v1.0 LTS

   CAB07 — CRONOLOGÍA Y PRESENTACIÓN

   Función:

   - Recibe la Paleoficha cargada por CARGACONT.
   - Obtiene su j3 desde CARGACONT / master.csv.
   - Procesa j3 mediante PALGEOSIMPLIFICADO.
   - Obtiene:
       · cronología humana
       · período
       · subperíodo / edad
       · códigos PALGEO
   - Presenta los datos cronológicos en la ficha.
   - El bloque se coloca después de img2 e img3.

   IMPORTANTE:

   CAB07 NO modifica j3.

   j3 continúa siendo el dato interno original:

       MMMM.DDDD-MMMM.DDDD

   Ejemplo:

       0059.2000-0041.2000

   CAB07 crea los datos de presentación:

       59,2 Ma — 41,2 Ma

       Período
       ...

       Subperíodo
       ...

   Dependencias:

   - CARGACONT
   - PALGEOSIMPLIFICADO
   - elementos HTML del generador

   No contiene:

   - buscador
   - navegación
   - imágenes
   - vídeo
   - lightbox
   - estadísticas

======================================================== */


/* ========================================================
   OBJETO GLOBAL
======================================================== */

window.CAB07 = {


    /* ====================================================
       CONFIGURACIÓN
    ==================================================== */

    idContenedor:
        "cab07Cronologia",


    claseContenedor:
        "cab07-cronologia",


    /* ====================================================
       INICIALIZAR
    ==================================================== */

    inicializar(){

        /*
        -----------------------------------------------
        COMPROBAR PALGEOSIMPLIFICADO
        -----------------------------------------------
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
        -----------------------------------------------
        COMPROBAR FUNCIÓN ANALIZAR
        -----------------------------------------------
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
        -----------------------------------------------
        ESCUCHAR CARGA DEL CONTENEDOR
        -----------------------------------------------
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
            "CAB07: módulo de cronología cargado."
        );


        return true;

    },


    /* ====================================================
       OBTENER J3
       
       CAB07 no busca directamente en master.csv.

       Solicita el registro a CARGACONT para mantener
       CARGACONT como puerta del contenedor.
    ==================================================== */

    obtenerJ3(ficha){

        if(
            !ficha ||
            !ficha.j1
        ){

            return null;

        }


        /*
        -----------------------------------------------
        CARGACONT DISPONIBLE
        -----------------------------------------------
        */

        if(
            !window.CARGACONT ||
            typeof
            window.CARGACONT.buscarJ1EnCSV !==
            "function"
        ){

            console.error(
                "CAB07: CARGACONT no está disponible."
            );

            return null;

        }


        /*
        -----------------------------------------------
        OBTENER REGISTRO DEL CONTENEDOR
        -----------------------------------------------
        */

        const registro =
            window.CARGACONT.buscarJ1EnCSV(
                ficha.j1
            );


        if(
            !registro
        ){

            console.error(
                "CAB07: no existe registro para " +
                ficha.j1 +
                "."
            );

            return null;

        }


        /*
        -----------------------------------------------
        OBTENER J3
        -----------------------------------------------

        LEEPALJSON utiliza "codigo" para j1.

        El registro puede contener j3 directamente
        o mediante la estructura normalizada.
        -----------------------------------------------
        */

        const j3 =
            registro.j3;


        if(
            !j3 ||
            String(j3).trim() === ""
        ){

            console.error(
                "CAB07: j3 vacío para " +
                ficha.j1 +
                "."
            );

            return null;

        }


        return String(j3).trim();

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
        -----------------------------------------------
        COMPROBAR MÓDULO
        -----------------------------------------------
        */

        if(
            !window.PALGEOSIMPLIFICADO
        ){

            return null;

        }


        /*
        -----------------------------------------------
        ANALIZAR
        -----------------------------------------------
        */

        const datos =
            window.PALGEOSIMPLIFICADO.analizar(
                j3
            );


        if(
            !datos
        ){

            console.error(
                "CAB07: no se pudo analizar j3:",
                j3
            );

            return null;

        }


        /*
        -----------------------------------------------
        NORMALIZAR SUBPERÍODO
        -----------------------------------------------

        PALGEOSIMPLIFICADO actualmente devuelve:

            edad

        El generador utilizará:

            subperiodo

        No modificamos PALGEOSIMPLIFICADO.
        -----------------------------------------------
        */

        const subperiodo =
            Array.isArray(
                datos.subperiodo
            )

            ?

            datos.subperiodo

            :

            (

                Array.isArray(
                    datos.edad
                )

                ?

                datos.edad

                :

                []

            );


        /*
        -----------------------------------------------
        RESULTADO PARA EL GENERADOR
        -----------------------------------------------
        */

        return {

            j3:
                j3,

            cronologia:
                datos.rango || j3,

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
       CREAR CONTENEDOR HTML
    ==================================================== */

    crearContenedor(){

        /*
        -----------------------------------------------
        SI YA EXISTE
        -----------------------------------------------
        */

        const existente =
            document.getElementById(
                this.idContenedor
            );


        if(
            existente
        ){

            return existente;

        }


        /*
        -----------------------------------------------
        CREAR BLOQUE
        -----------------------------------------------
        */

        const contenedor =
            document.createElement(
                "section"
            );


        contenedor.id =
            this.idContenedor;


        contenedor.className =
            this.claseContenedor;


        /*
        -----------------------------------------------
        ESTRUCTURA
        -----------------------------------------------
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
        -----------------------------------------------
        INSERTAR DESPUÉS DE IMG3
        -----------------------------------------------
        */

        const img3 =
            document.getElementById(
                "img3"
            );


        if(
            img3
        ){

            /*
            Buscamos el contenedor inmediato de img3
            para que el bloque quede después de la
            zona visual de la tercera imagen.
            */

            const padre =
                img3.parentElement;


            if(
                padre &&
                padre.parentElement
            ){

                padre.parentElement.insertBefore(
                    contenedor,
                    padre.nextSibling
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
            -------------------------------------------
            FALLBACK
            -------------------------------------------

            Si img3 no existe en ese momento,
            se añade al final del contenedor principal.
            -------------------------------------------
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

                document.body.appendChild(
                    contenedor
                );

            }

        }


        return contenedor;

    },


    /* ====================================================
       FORMATEAR LISTA
    ==================================================== */

    formatearLista(lista){

        if(
            !Array.isArray(lista) ||
            !lista.length
        ){

            return "—";

        }


        /*
        -----------------------------------------------
        ELIMINAR DUPLICADOS
        -----------------------------------------------
        */

        const valores =
            [...new Set(

                lista
                .map(
                    valor =>
                        String(valor)
                        .trim()
                )
                .filter(
                    valor => valor !== ""
                )

            )];


        if(
            !valores.length
        ){

            return "—";

        }


        /*
        -----------------------------------------------
        PRESENTACIÓN
        -----------------------------------------------

        Si hay varios valores:

        Valor 1 · Valor 2 · Valor 3
        -----------------------------------------------
        */

        return valores.join(
            " · "
        );

    },


    /* ====================================================
       MOSTRAR DATOS
    ==================================================== */

    mostrar(datos){

        if(
            !datos
        ){

            return false;

        }


        const contenedor =
            this.crearContenedor();


        if(
            !contenedor
        ){

            return false;

        }


        /*
        -----------------------------------------------
        CRONOLOGÍA
        -----------------------------------------------
        */

        const cronologia =
            document.getElementById(
                "cab07CronologiaValor"
            );


        if(
            cronologia
        ){

            cronologia.textContent =
                datos.cronologia || "—";

        }


        /*
        -----------------------------------------------
        PERÍODO
        -----------------------------------------------
        */

        const periodo =
            document.getElementById(
                "cab07PeriodoValor"
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
        -----------------------------------------------
        SUBPERÍODO
        -----------------------------------------------
        */

        const subperiodo =
            document.getElementById(
                "cab07SubperiodoValor"
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
        -----------------------------------------------
        GUARDAR DATOS PROCESADOS
        -----------------------------------------------
        */

        this.ultimo =
            datos;


        /*
        -----------------------------------------------
        EVENTO
        -----------------------------------------------
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
            !ficha ||
            !ficha.j1
        ){

            return null;

        }


        /*
        -----------------------------------------------
        OBTENER J3 DESDE CARGACONT
        -----------------------------------------------
        */

        const j3 =
            this.obtenerJ3(
                ficha
            );


        if(
            !j3
        ){

            return null;

        }


        /*
        -----------------------------------------------
        PROCESAR CON PALGEOSIMPLIFICADO
        -----------------------------------------------
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
        -----------------------------------------------
        PRESENTAR
        -----------------------------------------------
        */

        this.mostrar(
            datos
        );


        /*
        -----------------------------------------------
        CONSOLA
        -----------------------------------------------
        */

        console.log(
            "========================================"
        );

        console.log(
            "PalEntropía — CAB07 v1.0 LTS"
        );

        console.log(
            "Cronología procesada:"
        );

        console.log(
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

    }


};


/* ========================================================
   ESTADO INTERNO
======================================================== */

window.CAB07.ultimo = null;


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
   FIN CAB07 v1.0 LTS
======================================================== */
