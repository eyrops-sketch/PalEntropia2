/*
========================================================
CAB09.js v1.0
Información Avanzada — Fase 2
PalEntropía
========================================================

FUNCIONES DE ESTA PRIMERA VERSIÓN:

1. Crea el botón circular de Información Avanzada.
2. Lo coloca dentro de la Paleoficha.
3. Crea el Lightbox.
4. Muestra datos ficticios de prueba.
5. Permite abrir y cerrar el Lightbox.

NO LEE:

- master.csv
- PALHAB
- PALMEDIO
- PALSTATS
- PALTAXON
- ningún otro módulo de datos.

========================================================
*/

window.CAB09 = {

    /* =================================================
       INICIALIZACIÓN
       ================================================= */

    inicializar(){

        const ficha =
            document.getElementById("ficha");

        if(!ficha){

            console.warn(
                "CAB09: no se encontró #ficha."
            );

            return;

        }


        /* ---------------------------------------------
           Evitar duplicados
           --------------------------------------------- */

        if(
            document.getElementById(
                "botonInfoAvanzada"
            )
        ){

            return;

        }


        /* ---------------------------------------------
           Crear botón
           --------------------------------------------- */

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


        ficha.appendChild(
            boton
        );


        /* ---------------------------------------------
           Crear Lightbox
           --------------------------------------------- */

        this.crearLightbox();


        /* ---------------------------------------------
           Evento botón
           --------------------------------------------- */

        boton.addEventListener(
            "click",
            () => {

                this.abrir();

            }
        );


        /* ---------------------------------------------
           Eventos cierre
           --------------------------------------------- */

        const cerrar =
            document.getElementById(
                "cerrarInfoAvanzada"
            );


        if(cerrar){

            cerrar.addEventListener(
                "click",
                () => {

                    this.cerrar();

                }
            );

        }


        /* ---------------------------------------------
           Cerrar pulsando fuera de la ventana
           --------------------------------------------- */

        const visor =
            document.getElementById(
                "visorInfoAvanzada"
            );


        if(visor){

            visor.addEventListener(
                "click",
                (evento) => {

                    if(
                        evento.target === visor
                    ){

                        this.cerrar();

                    }

                }
            );

        }


        /* ---------------------------------------------
           Cerrar con ESC
           --------------------------------------------- */

        document.addEventListener(
            "keydown",
            (evento) => {

                if(
                    evento.key === "Escape"
                ){

                    this.cerrar();

                }

            }
        );

    },


    /* =================================================
       CREAR LIGHTBOX
       ================================================= */

    crearLightbox(){

        if(
            document.getElementById(
                "visorInfoAvanzada"
            )
        ){

            return;

        }


        const visor =
            document.createElement("div");

        visor.id =
            "visorInfoAvanzada";

        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        visor.innerHTML = `

            <div id="ventanaInfoAvanzada">

                <button
                    id="cerrarInfoAvanzada"
                    class="botonCerrar"
                    type="button"
                    aria-label="Cerrar información avanzada">

                    ×

                </button>


                <h2>
                    Información avanzada
                </h2>


                <!-- =================================
                     HÁBITATS
                     ================================= -->

                <section class="fase2Seccion">

                    <h3>
                        🦖 Hábitats
                    </h3>


                    <div class="fase2Bloque">

                        <span class="fase2Etiqueta">
                            Hábitat principal
                        </span>

                        <div class="fase2Dato">
                            Bosque subtropical
                        </div>

                    </div>


                    <div class="fase2Bloque">

                        <span class="fase2Etiqueta">
                            Hábitats secundarios
                        </span>

                        <div class="fase2Dato">
                            Llanura · Ribera
                        </div>

                    </div>

                </section>


                <!-- =================================
                     MODO DE VIDA
                     ================================= -->

                <section class="fase2Seccion">

                    <h3>
                        🌎 Modo de vida
                    </h3>


                    <div class="fase2Dato">
                        Terrestre · Depredador
                    </div>

                </section>


                <!-- =================================
                     MEDIO DE VIDA
                     ================================= -->

                <section class="fase2Seccion">

                    <h3>
                        🌿 Medio de vida
                    </h3>


                    <div class="fase2Dato">
                        Medio continental
                    </div>

                </section>


                <!-- =================================
                     ESTADÍSTICAS
                     ================================= -->

                <section class="fase2Seccion">

                    <h3>
                        📊 Estadísticas
                    </h3>


                    <div class="fase2Stats">

                        <div>
                            <span>Adaptabilidad</span>
                            <strong>91</strong>
                        </div>

                        <div>
                            <span>Resistencia</span>
                            <strong>96</strong>
                        </div>

                        <div>
                            <span>Sociabilidad</span>
                            <strong>72</strong>
                        </div>

                        <div>
                            <span>Reproducción</span>
                            <strong>88</strong>
                        </div>

                        <div>
                            <span>Ofensiva</span>
                            <strong>99</strong>
                        </div>

                        <div>
                            <span>Defensa</span>
                            <strong>97</strong>
                        </div>

                        <div>
                            <span>Movilidad</span>
                            <strong>86</strong>
                        </div>

                        <div>
                            <span>Plasticidad ecológica</span>
                            <strong>82</strong>
                        </div>

                        <div>
                            <span>Tamaño</span>
                            <strong>98</strong>
                        </div>

                        <div>
                            <span>Velocidad</span>
                            <strong>92</strong>
                        </div>

                        <div>
                            <span>Inteligencia</span>
                            <strong>94</strong>
                        </div>

                    </div>

                </section>


                <!-- =================================
                     ANÁLISIS
                     ================================= -->

                <section class="fase2Seccion">

                    <h3>
                        🔬 Análisis
                    </h3>


                    <div class="fase2Analisis">

                        <div>
                            <span>Índice global</span>
                            <strong>91</strong>
                        </div>

                        <div>
                            <span>Supervivencia</span>
                            <strong>92</strong>
                        </div>

                        <div>
                            <span>Competencia</span>
                            <strong>96</strong>
                        </div>

                        <div>
                            <span>Movilidad</span>
                            <strong>89</strong>
                        </div>

                        <div>
                            <span>Reproducción</span>
                            <strong>80</strong>
                        </div>

                    </div>

                </section>

            </div>

        `;


        document.body.appendChild(
            visor
        );


        /* ---------------------------------------------
           Estilos propios de CAB09
           --------------------------------------------- */

        this.crearEstilos();

    },


    /* =================================================
       ESTILOS
       ================================================= */

    crearEstilos(){

        if(
            document.getElementById(
                "estilosCAB09"
            )
        ){

            return;

        }


        const estilo =
            document.createElement("style");

        estilo.id =
            "estilosCAB09";


        estilo.textContent = `

            /* =========================================
               BOTÓN INFORMACIÓN AVANZADA
               ========================================= */

            #botonInfoAvanzada{

                position:absolute;

                top:14px;
                right:14px;

                width:34px;
                height:34px;

                padding:0;

                border:2px solid #62d6ff;

                border-radius:50%;

                background:#1d9bf0;

                color:#fff;

                font-size:19px;

                font-weight:bold;

                display:flex;

                align-items:center;
                justify-content:center;

                cursor:pointer;

                box-shadow:
                    0 0 10px
                    rgba(98,214,255,.25);

                transition:
                    background .25s,
                    color .25s,
                    transform .15s,
                    box-shadow .25s;

                z-index:10;

            }


            #botonInfoAvanzada:hover{

                background:#62d6ff;

                color:#001018;

                box-shadow:
                    0 0 15px
                    rgba(98,214,255,.42);

            }


            #botonInfoAvanzada:active{

                transform:scale(.92);

            }


            /* =========================================
               LIGHTBOX
               ========================================= */

            #visorInfoAvanzada{

                display:none;

                position:fixed;

                top:0;
                left:0;

                width:100vw;
                height:100vh;

                padding:20px;

                background:
                    rgba(0,0,0,.94);

                z-index:999997;

                justify-content:center;
                align-items:center;

            }


            /* =========================================
               VENTANA
               ========================================= */

            #ventanaInfoAvanzada{

                position:relative;

                width:92%;

                max-width:850px;

                max-height:90vh;

                overflow-y:auto;

                padding:25px;

                background:#181a1c;

                border:2px solid #62d6ff;

                border-radius:18px;

                box-shadow:
                    0 0 30px
                    rgba(98,214,255,.35),

                    0 10px 40px
                    rgba(0,0,0,.55);

            }


            #ventanaInfoAvanzada h2{

                margin-top:0;

                padding-right:40px;

                text-align:center;

                color:#62d6ff;

            }


            /* =========================================
               SECCIONES
               ========================================= */

            .fase2Seccion{

                margin-top:28px;

                padding:18px;

                background:#151719;

                border:1px solid #25292c;

                border-radius:12px;

            }


            .fase2Seccion h3{

                margin-top:0;

                margin-bottom:18px;

                color:#62d6ff;

                text-align:left;

            }


            /* =========================================
               DATOS
               ========================================= */

            .fase2Bloque{

                margin-bottom:15px;

            }


            .fase2Bloque:last-child{

                margin-bottom:0;

            }


            .fase2Etiqueta{

                display:block;

                margin-bottom:5px;

                color:#aaa;

                font-size:14px;

            }


            .fase2Dato{

                color:#fff;

                font-size:18px;

                line-height:1.5;

            }


            /* =========================================
               ESTADÍSTICAS
               ========================================= */

            .fase2Stats{

                display:grid;

                grid-template-columns:
                    1fr 1fr;

                gap:9px;

            }


            .fase2Stats div,
            .fase2Analisis div{

                display:flex;

                align-items:center;

                justify-content:space-between;

                gap:10px;

                padding:11px 12px;

                background:#181a1c;

                border-left:4px solid #62d6ff;

                border-radius:8px;

            }


            .fase2Stats span,
            .fase2Analisis span{

                color:#eee;

            }


            .fase2Stats strong,
            .fase2Analisis strong{

                color:#62d6ff;

                font-size:19px;

            }


            /* =========================================
               ANÁLISIS
               ========================================= */

            .fase2Analisis{

                display:grid;

                grid-template-columns:
                    1fr 1fr;

                gap:9px;

            }


            /* =========================================
               RESPONSIVE
               ========================================= */

            @media(max-width:768px){

                #botonInfoAvanzada{

                    top:10px;
                    right:10px;

                    width:32px;
                    height:32px;

                    font-size:18px;

                }


                #visorInfoAvanzada{

                    padding:10px;

                }


                #ventanaInfoAvanzada{

                    width:96%;

                    max-height:92vh;

                    padding:18px;

                    border-radius:15px;

                }


                .fase2Seccion{

                    padding:14px;

                    margin-top:20px;

                }


                .fase2Stats,
                .fase2Analisis{

                    grid-template-columns:1fr;

                }


                .fase2Dato{

                    font-size:17px;

                }

            }

        `;


        document.head.appendChild(
            estilo
        );

    },


    /* =================================================
       ABRIR
       ================================================= */

    abrir(){

        const visor =
            document.getElementById(
                "visorInfoAvanzada"
            );


        if(!visor){

            return;

        }


        visor.style.display =
            "flex";

        visor.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    },


    /* =================================================
       CERRAR
       ================================================= */

    cerrar(){

        const visor =
            document.getElementById(
                "visorInfoAvanzada"
            );


        if(!visor){

            return;

        }


        visor.style.display =
            "none";

        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }

};


/* ========================================================
   ARRANQUE CAB09
   ======================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        window.CAB09.inicializar();

    }
);
