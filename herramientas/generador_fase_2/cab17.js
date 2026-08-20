/*
========================================================
PalEntropía
cab17.js v1.5

BUSCADOR AVANZADO POR NOMBRE

FUNCIONAMIENTO
--------------
- Busca en j2.
- Mínimo 3 caracteres.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Obtiene los j1 asociados.
- Entrega los j1 a MATRIXFILTRO.
- No modifica CAB16.

CIRCUITO

consulta
   ↓
j2
   ↓
j1
   ↓
MATRIXFILTRO
========================================================
*/

window.cab17 = {


    /*====================================================
      NORMALIZAR
    ====================================================*/

    normalizar: function(texto){

        return String(
            texto || ""
        )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

    },


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
      OBTENER DATOS
    ====================================================*/

    obtenerDatos: function(){

        if(
            window.LEEPALJSON &&
            typeof window.LEEPALJSON.obtener ===
            "function"
        ){

            const datos =
                window.LEEPALJSON.obtener();


            if(
                Array.isArray(datos)
            ){

                return datos;

            }

        }


        return [];

    },


    /*====================================================
      BUSCAR POR NOMBRE
    ====================================================*/

    buscar: function(){

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

            return;

        }


        const texto =
            this.normalizar(
                campo.value
            );


        /*
        ----------------------------------------------------
        INDICADOR TEMPORAL
        ----------------------------------------------------
        */

        resultados.innerHTML =
            "<div style='color:#62d6ff;padding:6px;'>" +
            "CAB17 ACTIVO" +
            "</div>";


        /*
        ----------------------------------------------------
        MÍNIMO 3 CARACTERES
        ----------------------------------------------------
        */

        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";

            return;

        }


        /*
        ----------------------------------------------------
        DATOS
        ----------------------------------------------------
        */

        const datos =
            this.obtenerDatos();


        /*
        ----------------------------------------------------
        BUSCAR EN J2
        ----------------------------------------------------
        */

        const coincidencias =
            datos.filter(
                registro => {

                    const nombre =
                        this.normalizar(
                            registro.j2
                        );


                    return nombre.includes(
                        texto
                    );

                }
            );


        /*
        ----------------------------------------------------
        RESULTADOS
        ----------------------------------------------------
        */

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*
        ----------------------------------------------------
        MOSTRAR RESULTADOS
        ----------------------------------------------------
        */

        coincidencias.forEach(
            registro => {

                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    registro.j1;


                fila.textContent =
                    registro.j2;


                fila.addEventListener(
                    "click",
                    () => {

                        if(
                            window.PALNAVEGADOR &&
                            typeof window.PALNAVEGADOR.cargarPorCodigo ===
                            "function"
                        ){

                            window.PALNAVEGADOR.cargarPorCodigo(
                                registro.j1
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
        CHECK
        ----------------------------------------------------
        */

        if(
            check &&
            check.checked
        ){

            this.enviarMatrix(
                coincidencias
            );

        }


        return coincidencias;

    },
        /*====================================================
      ENVIAR J1 A MATRIXFILTRO
    ====================================================*/

    enviarMatrix: function(
        registros
    ){

        if(
            !Array.isArray(
                registros
            ) ||
            !registros.length
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
        EXTRAER SOLAMENTE J1
        */

        const j1 =
            registros
            .map(
                registro =>
                    String(
                        registro.j1 || ""
                    ).trim()
            )
            .filter(
                codigo =>
                    codigo !== ""
            );


        if(
            !j1.length
        ){

            return;

        }


        /*
        MATRIXFILTRO YA SE ENCARGA
        DEL RESTO DEL CIRCUITO.
        */

        window.MATRIXFILTRO.actualizar(
            j1
        );

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar: function(){

        /*
        ----------------------------------------------------
        CONSULTA
        ----------------------------------------------------
        */

        document.addEventListener(
            "input",
            (evento) => {

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
            (evento) => {

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


                if(
                    texto.length >= 3
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
FIN cab17.js v1.5
========================================================
*/
