/*
========================================================
PalEntropía
cab17.js v1.3

BUSCADOR POR NOMBRE — J2

PRUEBA VISUAL
-------------
Cuando CAB17 procesa una búsqueda por nombre
muestra:

CAB17 ACTIVO

Esto permite comprobar visualmente que CAB17
está recibiendo la consulta.

FUNCIÓN
-------
- Busca por nombre.
- Mínimo 3 caracteres.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Utiliza LEEPALJSON.
- Con check activado → MATRIXFILTRO.
- No modifica CAB16.

========================================================
*/

window.cab17 = {

    datos: [],


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

                this.datos =
                    datos;

            }

        }


        return this.datos;

    },


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
      COMPROBAR CÓDIGO
    ====================================================*/

    esCodigo: function(texto){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(
                texto || ""
            ).trim()
        );

    },


    /*====================================================
      BUSCAR POR NOMBRE
    ====================================================*/

    buscarJ2: function(){

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
            this.normalizar(
                campo.value
            );


        /*
        ====================================================
        PRUEBA VISUAL
        ====================================================
        */

        resultados.innerHTML =
            "<div style='color:#62d6ff; padding:6px;'>" +
            "CAB17 ACTIVO" +
            "</div>";


        /*------------------------------------------------
          MÍNIMO 3 CARACTERES
        ------------------------------------------------*/

        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";


            return [];

        }


        /*------------------------------------------------
          OBTENER DATOS
        ------------------------------------------------*/

        this.obtenerDatos();


        if(
            !Array.isArray(
                this.datos
            ) ||
            !this.datos.length
        ){

            label.textContent =
                "0 resultados";


            return [];

        }


        /*------------------------------------------------
          BUSCAR EN NOMBRE — J2
        ------------------------------------------------*/

        const coincidencias =
            this.datos.filter(
                registro => {

                    if(
                        !registro
                    ){

                        return false;

                    }


                    const nombre =
                        this.normalizar(
                            registro.nombre
                        );


                    return nombre.includes(
                        texto
                    );

                }
            );


        /*------------------------------------------------
          CONTADOR
        ------------------------------------------------*/

        label.textContent =
            coincidencias.length +
            (
                coincidencias.length === 1
                    ? " resultado"
                    : " resultados"
            );


        /*------------------------------------------------
          MOSTRAR RESULTADOS
        ------------------------------------------------*/

        coincidencias.forEach(
            registro => {

                if(
                    !registro ||
                    !registro.codigo
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
                    String(
                        registro.codigo
                    ).trim();


                fila.textContent =
                    registro.nombre;


                /*
                Selección directa.
                */

                fila.addEventListener(
                    "click",
                    () => {

                        const codigo =
                            String(
                                registro.codigo
                            )
                            .trim()
                            .toUpperCase();


                        if(
                            window.PALNAVEGADOR &&
                            typeof window.PALNAVEGADOR.cargarPorCodigo ===
                            "function"
                        ){

                            window.PALNAVEGADOR.cargarPorCodigo(
                                codigo
                            );

                        }

                    }
                );


                resultados.appendChild(
                    fila
                );

            }
        );


        /*------------------------------------------------
          CHECK ACTIVADO
          → MATRIXFILTRO
        ------------------------------------------------*/

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
      MATRIXFILTRO
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
        CAB17 entrega directamente
        los registros encontrados.

        MATRIXFILTRO se encarga
        del resto del circuito.
        */

        window.MATRIXFILTRO.actualizar(
            registros
        );

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar: function(){

        /*
        INPUT
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
                Si es código,
                CAB16 trabaja normalmente.
                */

                if(
                    this.esCodigo(
                        texto
                    )
                ){

                    return;

                }


                /*
                Consulta por nombre.
                */

                evento.stopImmediatePropagation();


                this.buscarJ2();

            },
            true
        );


        /*
        CHECK
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
                Si es código,
                CAB16 trabaja normalmente.
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


                    this.buscarJ2();

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
FIN cab17.js v1.3
========================================================
*/
