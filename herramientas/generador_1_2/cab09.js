/*
========================================================
CAB09.js
PalEntropía — Fase 2
Información ecológica y estadística
========================================================
*/

window.CAB09 = {

    inicializar(){

        const ficha = document.getElementById("ficha");

        if(!ficha){

            console.error(
                "CAB09: no se encontró #ficha."
            );

            return;

        }


        /* =================================================
           BOTÓN INFORMACIÓN AVANZADA
           ================================================= */

        if(
            document.getElementById(
                "botonInfoAvanzada"
            )
        ){

            return;

        }


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

        boton.textContent =
            "ⓘ";


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


        const cerrar =
            document.createElement("button");


        cerrar.id =
            "cerrarInfoAvanzada";

        cerrar.type =
            "button";

        cerrar.className =
            "botonCerrar";

        cerrar.setAttribute(
            "aria-label",
            "Cerrar información avanzada"
        );

        cerrar.textContent =
            "×";


        const titulo =
            document.createElement("h2");


        titulo.textContent =
            "Información avanzada";


        /* =================================================
           DATOS FICTICIOS DE PRUEBA
           ================================================= */

        const habitats =
            document.createElement("section");

        habitats.className =
            "bloqueFase2";

        habitats.innerHTML =

            "<h3>Hábitats</h3>" +

            "<div id=\"fase2Habitats\">" +

                "<div class=\"fase2Habitat\">" +
                    "<strong>Principal:</strong> Bosque" +
                "</div>" +

                "<div class=\"fase2Habitat\">" +
                    "<strong>Secundario:</strong> Llanura" +
                "</div>" +

                "<div class=\"fase2Habitat\">" +
                    "<strong>Secundario:</strong> Ribera" +
                "</div>" +

            "</div>";


        const modoVida =
            document.createElement("section");

        modoVida.className =
            "bloqueFase2";

        modoVida.innerHTML =

            "<h3>Modo de vida</h3>" +

            "<div id=\"fase2ModoVida\">" +

                "Terrestre. Activo. " +
                "Comportamiento principalmente solitario." +

            "</div>";


        const medioVida =
            document.createElement("section");

        medioVida.className =
            "bloqueFase2";

        medioVida.innerHTML =

            "<h3>Medio de vida</h3>" +

            "<div id=\"fase2MedioVida\">" +

                "Medio terrestre continental." +

            "</div>";


        const estadisticas =
            document.createElement("section");

        estadisticas.className =
            "bloqueFase2";

        estadisticas.innerHTML =

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


        const analisis =
            document.createElement("section");

        analisis.className =
            "bloqueFase2";

        analisis.innerHTML =

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
            habitats
        );

        ventana.appendChild(
            modoVida
        );

        ventana.appendChild(
            medioVida
        );

        ventana.appendChild(
            estadisticas
        );

        ventana.appendChild(
            analisis
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
                        "true";

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

    }

};





