/*
========================================================
CAB09.js
PalEntropía — Fase 2
Lightbox de Información Avanzada
VERSIÓN DE PRUEBA
========================================================
*/

(function(){

    function iniciarCAB09(){

        const ficha =
            document.getElementById("ficha");

        if(!ficha){

            console.error(
                "CAB09: no se encontró #ficha."
            );

            return;

        }


        /* =================================================
           EVITAR DUPLICADOS
           ================================================= */

        if(
            document.getElementById(
                "botonInfoAvanzada"
            )
        ){

            return;

        }


        /* =================================================
           BOTÓN
           ================================================= */

        const boton =
            document.createElement("button");

        boton.id =
            "botonInfoAvanzada";

        boton.type =
            "button";

        boton.title =
            "Información avanzada";

        boton.setAttribute(
            "aria-label",
            "Información avanzada"
        );

        boton.textContent = "ⓘ";


        /*
        La ficha necesita posición relativa
        para colocar el botón dentro de ella.
        */

        ficha.style.position =
            "relative";


        ficha.appendChild(
            boton
        );


        /* =================================================
           LIGHTBOX
           ================================================= */

        const visor =
            document.createElement("div");

        visor.id =
            "visorInfoAvanzada";

        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        const ventana =
            document.createElement("div");

        ventana.id =
            "ventanaInfoAvanzada";


        /* =================================================
           BOTÓN CERRAR
           ================================================= */

        const cerrar =
            document.createElement("button");

        cerrar.id =
            "cerrarInfoAvanzada";

        cerrar.type =
            "button";

        cerrar.setAttribute(
            "aria-label",
            "Cerrar información avanzada"
        );

        cerrar.textContent =
            "×";


        /* =================================================
           TÍTULO
           ================================================= */

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            "Información avanzada";


        /* =================================================
           HÁBITATS — DATOS FICTICIOS
           ================================================= */

        const bloqueHabitats =
            document.createElement("section");

        bloqueHabitats.className =
            "bloqueFase2";

        bloqueHabitats.innerHTML =

            "<h3>Hábitats</h3>" +

            "<div id=\"fase2Habitats\">" +

                "<div class=\"fase2Habitat\">" +
                    "<strong>Hábitat principal:</strong> Bosque" +
                "</div>" +

                "<div class=\"fase2Habitat\">" +
                    "<strong>Hábitat secundario:</strong> Llanura" +
                "</div>" +

                "<div class=\"fase2Habitat\">" +
                    "<strong>Hábitat secundario:</strong> Ribera" +
                "</div>" +

            "</div>";


        /* =================================================
           MODO DE VIDA — DATO FICTICIO
           ================================================= */

        const bloqueModo =
            document.createElement("section");

        bloqueModo.className =
            "bloqueFase2";

        bloqueModo.innerHTML =

            "<h3>Modo de vida</h3>" +

            "<div id=\"fase2ModoVida\">" +

                "Terrestre. Activo. " +
                "Comportamiento principalmente solitario." +

            "</div>";


        /* =================================================
           MEDIO DE VIDA — DATO FICTICIO
           ================================================= */

        const bloqueMedio =
            document.createElement("section");

        bloqueMedio.className =
            "bloqueFase2";

        bloqueMedio.innerHTML =

            "<h3>Medio de vida</h3>" +

            "<div id=\"fase2MedioVida\">" +

                "Medio terrestre continental." +

            "</div>";


        /* =================================================
           ESTADÍSTICAS — DATOS FICTICIOS
           ================================================= */

        const bloqueStats =
            document.createElement("section");

        bloqueStats.className =
            "bloqueFase2";

        bloqueStats.innerHTML =

            "<h3>Estadísticas</h3>" +

            "<div id=\"fase2Estadisticas\">" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Adaptabilidad:</strong> 85" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Resistencia:</strong> 78" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Sociabilidad:</strong> 62" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Reproducción:</strong> 81" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Ofensiva:</strong> 94" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Defensa:</strong> 88" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Movilidad:</strong> 76" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Plasticidad ecológica:</strong> 72" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Tamaño:</strong> 91" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Velocidad:</strong> 84" +
                "</div>" +

                "<div class=\"fase2Stat\">" +
                    "<strong>Inteligencia:</strong> 79" +
                "</div>" +

            "</div>";


        /* =================================================
           ANÁLISIS — DATOS FICTICIOS
           ================================================= */

        const bloqueAnalisis =
            document.createElement("section");

        bloqueAnalisis.className =
            "bloqueFase2";

        bloqueAnalisis.innerHTML =

            "<h3>Análisis estadístico</h3>" +

            "<div id=\"fase2Analisis\">" +

                "<div class=\"fase2Analisis\">" +
                    "<strong>Índice global:</strong> 82" +
                "</div>" +

                "<div class=\"fase2Analisis\">" +
                    "<strong>Supervivencia:</strong> 81" +
                "</div>" +

                "<div class=\"fase2Analisis\">" +
                    "<strong>Competencia:</strong> 87" +
                "</div>" +

                "<div class=\"fase2Analisis\">" +
                    "<strong>Movilidad:</strong> 80" +
                "</div>" +

                "<div class=\"fase2Analisis\">" +
                    "<strong>Reproducción:</strong> 72" +
                "</div>" +

            "</div>";


        /* =================================================
           MONTAJE
           ================================================= */

        ventana.appendChild(
            cerrar
        );

        ventana.appendChild(
            titulo
        );

        ventana.appendChild(
            bloqueHabitats
        );

        ventana.appendChild(
            bloqueModo
        );

        ventana.appendChild(
            bloqueMedio
        );

        ventana.appendChild(
            bloqueStats
        );

        ventana.appendChild(
            bloqueAnalisis
        );


        visor.appendChild(
            ventana
        );


        document.body.appendChild(
            visor
        );


        /* =================================================
           ABRIR
           ================================================= */

        boton.addEventListener(
            "click",
            function(){

                visor.style.display =
                    "flex";

                visor.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }
        );


        /* =================================================
           CERRAR
           ================================================= */

        cerrar.addEventListener(
            "click",
            function(){

                visor.style.display =
                    "none";

                visor.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );


        /* =================================================
           CERRAR AL PULSAR FUERA
           ================================================= */

        visor.addEventListener(
            "click",
            function(event){

                if(
                    event.target === visor
                ){

                    visor.style.display =
                        "none";

                    visor.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }

            }
        );


        /* =================================================
           ESC
           ================================================= */

        document.addEventListener(
            "keydown",
            function(event){

                if(
                    event.key === "Escape"
                ){

                    visor.style.display =
                        "none";

                    visor.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }

            }
        );


        console.log(
            "CAB09: Lightbox de Fase 2 inicializado."
        );

    }


    /* =====================================================
       INICIALIZACIÓN
       ===================================================== */

    if(
        document.readyState === "loading"
    ){

        document.addEventListener(
            "DOMContentLoaded",
            iniciarCAB09
        );

    }
    else{

        iniciarCAB09();

    }


})();
