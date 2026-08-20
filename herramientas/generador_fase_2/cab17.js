/*
========================================================
PalEntropía
cab17.js v1.0

BUSCADOR POR NOMBRE — J2

FUNCIÓN
-------
- Busca exclusivamente por nombre.
- Mínimo 3 caracteres.
- Ignora mayúsculas/minúsculas.
- Ignora tildes.
- Utiliza LEEPALJSON.
- Al activar el check:
    resultados → MATRIXFILTRO
- No modifica CAB16.

Ejemplo:

gas

Gastornis
Gasosaurus

↓
MATRIXFILTRO
↓
J1 de ambos registros

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


        resultados.innerHTML = "";


        if(
            texto.length < 3
        ){

            label.textContent =
                "Introduce al menos 3 caracteres";

            return [];

        }


        this.obtenerDatos();


        const coincidencias =
            this.datos.filter(
                registro => {

                    const nombre =
                        this.normalizar(
                            registro.nombre
                        );

                    return nombre.includes(
                        texto
                    );

                }
            );


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

                const fila =
                    document.createElement(
                        "div"
                    );

                fila.className =
                    "resultadoCab16";

                fila.dataset.codigo =
                    registro.codigo;

                fila.textContent =
                    registro.nombre;


                fila.addEventListener(
                    "click",
                    () => {

                        if(
                            window.PALNAVEGADOR &&
                            typeof window.PALNAVEGADOR.cargarPorCodigo ===
                            "function"
                        ){

                            window.PALNAVEGADOR.cargarPorCodigo(
                                registro.codigo
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

    enviarMatrix: async function(
        registros
    ){

        if(
            !Array.isArray(registros) ||
            !registros.length
        ){

            return;

        }


        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar !==
            "function"
        ){

            console.warn(
                "cab17: MATRIXFILTRO no disponible."
            );

            return;

        }


        /*
        MATRIXFILTRO recibe exactamente
        los registros encontrados.
        */

        const matrizJ1 =
            window.MATRIXFILTRO.actualizar(
                registros
            );


        if(
            !Array.isArray(matrizJ1) ||
            !matrizJ1.length
        ){

            return;

        }


        /*
        MatrixNavegador recupera
        los registros completos.
        */

        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener !==
            "function"
        ){

            return;

        }


        const filtrados =
            await window.MatrixNavegador.obtener(
                matrizJ1
            );


        if(
            !Array.isArray(filtrados) ||
            !filtrados.length
        ){

            return;

        }


        /*
        El rango pasa a PALNAVEGADOR.
        */

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.aplicarFiltro ===
            "function"
        ){

            window.PALNAVEGADOR.aplicarFiltro(
                filtrados
            );

        }

    },


    /*====================================================
      CONECTAR CHECK
    ====================================================*/

    conectar: function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(
            !campo ||
            !check
        ){

            return;

        }


        /*
        CAB17 solo interviene cuando
        la consulta NO tiene formato J1.
        */

        campo.addEventListener(
            "input",
            () => {

                const texto =
                    campo.value.trim();


                if(
                    /^\d{3}(?:_\d{0,2})?$/.test(
                        texto
                    )
                ){

                    return;

                }


                this.buscarJ2();

            }
        );


        check.addEventListener(
            "change",
            () => {

                const texto =
                    campo.value.trim();


                if(
                    texto.length >= 3 &&
                    !/^\d{3}(?:_\d{0,2})?$/.test(
                        texto
                    )
                ){

                    this.buscarJ2();

                }

            }
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
FIN cab17.js v1.0
========================================================
*/
