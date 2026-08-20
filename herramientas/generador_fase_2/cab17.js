/*
========================================================
PalEntropía
cab17.js v1.2

BUSCADOR POR NOMBRE — J2

FUNCIÓN
-------
- Busca por nombre.
- Mínimo 3 caracteres.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Utiliza LEEPALJSON.
- Comparte la interfaz de CAB16.
- Si el check está activado:
    resultados → MATRIXFILTRO.

CIRCUITO
--------
NOMBRE
  ↓
CAB17
  ↓
REGISTROS ENCONTRADOS
  ↓
MATRIXFILTRO
  ↓
MATRIXNAVEGADOR
  ↓
PALNAVEGADOR

CAB16 NO SE MODIFICA.
========================================================
*/

window.cab17 = {

    datos: [],


    /*====================================================
      DATOS
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
      NORMALIZAR TEXTO
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
      COMPROBAR SI ES CÓDIGO
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


        resultados.innerHTML =
            "";


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
          DATOS
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
          BUSCAR EN J2 — NOMBRE
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
                Selección directa del resultado.
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
      ENVIAR A MATRIXFILTRO
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
        MATRIXFILTRO recibe directamente
        los registros encontrados.

        No duplicamos aquí la lógica de
        MatrixNavegador ni PALNAVEGADOR.
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
        Usamos DOCUMENT como punto de escucha.

        Esto permite que CAB17 funcione aunque
        buscarUniversal sea creado dinámicamente.
        */


        /*------------------------------------------------
          CONSULTA
        ------------------------------------------------*/

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
                Si es código J1,
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
                Si no es J1,
                CAB17 se hace cargo.
                */

                evento.stopImmediatePropagation();


                this.buscarJ2();

            },
            true
        );


        /*------------------------------------------------
          CHECK
        ------------------------------------------------*/

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
                Si es código J1,
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
                Si es una consulta por nombre,
                CAB17 vuelve a procesarla.
                */

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
FIN cab17.js v1.2
========================================================
*/
