/*
========================================================
PalEntropía
cab17.js v2.0

BUSCADOR AVANZADO POR NOMBRE

CIRCUITO
--------

Consulta
   ↓
PALBUSCADOR.buscarPorNombre()
   ↓
codigo / J1
   ↓
MATRIXFILTRO

IMPORTANTE
----------
CAB17 NO DUPLICA EL MOTOR DE BÚSQUEDA.

Utiliza directamente PALBUSCADOR.

No modifica CAB16.
========================================================
*/

window.cab17 = {


    /*====================================================
      CONFIGURACIÓN
    ====================================================*/

    minimoCaracteres: 3,


    /*====================================================
      ES CÓDIGO
    ====================================================*/

    esCodigo: function(texto){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(
                texto || ""
            ).trim()
        );

    },


    /*====================================================
      BUSCAR
    ====================================================*/

    async buscar(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        const label =
            document.getElementById(
                "labelResultadosCab16"
            );


        const resultados =
            document.getElementById(
                "resultadosCab16"
            );


        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(
            !campo ||
            !label ||
            !resultados
        ){

            return [];

        }


        const texto =
            String(
                campo.value || ""
            ).trim();


        /*
        ----------------------------------------------------
        INDICADOR
        ----------------------------------------------------
        */

        resultados.innerHTML =
            "<div style='color:#62d6ff;padding:6px;'>" +
            "CAB17 ACTIVO" +
            "</div>";


        /*
        ----------------------------------------------------
        MÍNIMO
        ----------------------------------------------------
        */

        if(
            texto.length <
            this.minimoCaracteres
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";

            return [];

        }


        /*
        ----------------------------------------------------
        CÓDIGO
        ----------------------------------------------------
        */

        if(
            this.esCodigo(
                texto
            )
        ){

            return [];

        }


        /*
        ----------------------------------------------------
        PALBUSCADOR
        ----------------------------------------------------
        */

        if(
            !window.PALBUSCADOR ||
            typeof window.PALBUSCADOR.buscarPorNombre !==
            "function"
        ){

            label.textContent =
                "Buscador no disponible";

            return [];

        }


        let encontrados = [];


        try {

            encontrados =
                await window.PALBUSCADOR.buscarPorNombre(
                    texto
                );

        }

        catch(
            error
        ){

            console.error(
                "CAB17:",
                error
            );


            label.textContent =
                "Error de búsqueda";


            return [];

        }


        /*
        ----------------------------------------------------
        CONTADOR
        ----------------------------------------------------
        */

        label.textContent =
            encontrados.length +
            (
                encontrados.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        ----------------------------------------------------
        MOSTRAR RESULTADOS
        ----------------------------------------------------
        */

        encontrados.forEach(
            resultado => {

                if(
                    !resultado ||
                    !resultado.codigo
                ){

                    return;

                }


                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    resultado.codigo;


                fila.textContent =
                    resultado.nombre ||
                    resultado.codigo;


                /*
                --------------------------------------------
                SELECCIÓN INDIVIDUAL
                --------------------------------------------
                */

                fila.addEventListener(
                    "click",
                    () => {

                        if(
                            window.PALNAVEGADOR &&
                            typeof window.PALNAVEGADOR.cargarPorCodigo ===
                            "function"
                        ){

                            window.PALNAVEGADOR.cargarPorCodigo(
                                resultado.codigo
                            );

                        }

                    }
                );


                resultados.appendChild(
                    fila
                );

            }
        );


        /*
        ----------------------------------------------------
        CHECK ACTIVADO
        ----------------------------------------------------
        */

        if(
            check &&
            check.checked
        ){

            this.enviarMatrix(
                encontrados
            );

        }


        return encontrados;

    },


    /*====================================================
      ENVIAR A MATRIXFILTRO
    ====================================================*/

    enviarMatrix: function(
        resultados
    ){

        if(
            !Array.isArray(
                resultados
            ) ||
            !resultados.length
        ){

            return;

        }


        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            return;

        }


        /*
        ----------------------------------------------------
        EXTRAER J1
        ----------------------------------------------------
        */

        const matriz =
            resultados
            .map(
                resultado => {

                    return String(
                        resultado.codigo || ""
                    ).trim();

                }
            )
            .filter(
                codigo =>
                    codigo !== ""
            );


        if(
            !matriz.length
        ){

            return;

        }


        /*
        ----------------------------------------------------
        MATRIXFILTRO
        ----------------------------------------------------
        */

        window.MATRIXFILTRO.actualizar(
            matriz
        );

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar: function(){

        /*
        ----------------------------------------------------
        INPUT
        ----------------------------------------------------
        */

        document.addEventListener(
            "input",
            evento => {

                const campo =
                    evento.target;


                if(
                    !campo ||
                    campo.id !==
                    "buscarUniversal"
                ){

                    return;

                }


                const texto =
                    campo.value.trim();


                /*
                CÓDIGO → CAB16
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                /*
                NOMBRE → CAB17
                */

                evento.stopImmediatePropagation();


                this.buscar();

            },
            true
        );


        /*
        ----------------------------------------------------
        CHECK
        ----------------------------------------------------
        */

        document.addEventListener(
            "change",
            evento => {

                const elemento =
                    evento.target;


                if(
                    !elemento ||
                    elemento.id !==
                    "buscarTodosCab16"
                ){

                    return;

                }


                const campo =
                    document.getElementById(
                        "buscarUniversal"
                    );


                if(
                    !campo
                ){

                    return;

                }


                const texto =
                    campo.value.trim();


                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                if(
                    texto.length >=
                    this.minimoCaracteres
                ){

                    evento.stopImmediatePropagation();


                    this.buscar();

                }

            },
            true
        );

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        window.cab17.conectar();

    }
);


/*
========================================================
FIN cab17.js v2.0
========================================================
*/
