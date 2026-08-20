/*
========================================================
PalEntropía
cab18.js v1.0

BUSCADOR AVANZADO POR TIEMPO GEOLÓGICO

BUSCA:
- eón
- era
- período
- edad

MÍNIMO:
4 caracteres

RESULTADOS:
J1 + nombre

CHECK:
☐ resultados visibles
☑ resultados = rango de navegación

SIN SELECCIÓN MANUAL:
→ aleatorio dentro del rango

FUENTE CRONOLÓGICA:
PALGEO

========================================================
*/

window.cab18 = {

    inicializado:false,

    buscarTodos:false,

    seleccionRealizada:false,


    /*====================================================
      INICIALIZAR
    ====================================================*/

    inicializar:function(){

        if(this.inicializado){

            return;

        }

        this.conectar();

        this.inicializado=true;

        console.log(
            "cab18 v1.0: buscador geológico preparado."
        );

    },


    /*====================================================
      NORMALIZAR
    ====================================================*/

    normalizar:function(texto){

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();

    },


    /*====================================================
      CONECTAR
    ====================================================*/

    conectar:function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        if(!campo){

            return;

        }


        campo.addEventListener(
            "input",
            ()=>{

                this.seleccionRealizada=false;

                this.buscar();

            }
        );


        const check =
            document.getElementById(
                "buscarTodosCab16"
            );


        if(check){

            check.addEventListener(
                "change",
                async ()=>{

                    this.buscarTodos =
                        check.checked;

                    this.seleccionRealizada=false;


                    if(!this.buscarTodos){

                        this.limpiarFiltro();

                    }


                    await this.buscar();

                }
            );

        }

    },


    /*====================================================
      BUSCAR
    ====================================================*/

    buscar:async function(){

        const campo =
            document.getElementById(
                "buscarUniversal"
            );

        const label =
            document.getElementById(
                "labelResultadosCab16"
            );

        const contenedor =
            document.getElementById(
                "resultadosCab16"
            );


        if(
            !campo ||
            !label ||
            !contenedor
        ){

            return;

        }


        const texto =
            campo.value.trim();


        contenedor.innerHTML="";


        if(texto.length<4){

            label.textContent =
                "Introduce al menos 4 caracteres";

            if(this.buscarTodos){

                this.limpiarFiltro();

            }

            return;

        }


        if(
            !window.PALGEO ||
            !Array.isArray(window.PALGEO)
        ){

            label.textContent =
                "PALGEO no disponible";

            return;

        }


        const consulta =
            this.normalizar(texto);


        /*------------------------------------------------
          INTERVALOS PALGEO COINCIDENTES
        ------------------------------------------------*/

        const intervalos =
            window.PALGEO.filter(
                registro=>{

                    return [

                        registro.eon,
                        registro.era,
                        registro.periodo,
                        registro.edad

                    ].some(
                        valor =>
                            this.normalizar(
                                valor
                            ).includes(
                                consulta
                            )
                    );

                }
            );


        if(!intervalos.length){

            label.textContent =
                "0 resultados";

            if(this.buscarTodos){

                this.limpiarFiltro();

            }

            return;

        }


        /*------------------------------------------------
          OBTENER FICHAS
        ------------------------------------------------*/

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener !==
            "function"
        ){

            label.textContent =
                "Datos no disponibles";

            return;

        }


        const datos =
            window.LEEPALJSON.obtener();


        if(
            !Array.isArray(datos)
        ){

            return;

        }


        const resultados=[];


        datos.forEach(
            ficha=>{

                if(!ficha){

                    return;

                }


                const j1 =
                    String(
                        ficha.codigo || ""
                    ).trim();


                const j3 =
                    String(
                        ficha.j3 || ""
                    ).trim();


                if(
                    !j1 ||
                    !j3 ||
                    !/^\d{4}\.\d{4}-\d{4}\.\d{4}$/.test(j3)
                ){

                    return;

                }


                const partes =
                    j3.split("-");


                const inicio =
                    Number(partes[0]);


                const fin =
                    Number(partes[1]);


                const compatible =
                    intervalos.some(
                        intervalo=>{

                            return (
                                window.PALGEOSIMPLIFICADO &&
                                typeof
                                window.PALGEOSIMPLIFICADO
                                .intervaloCompatible ===
                                "function" &&
                                window.PALGEOSIMPLIFICADO
                                .intervaloCompatible(
                                    inicio,
                                    fin,
                                    intervalo
                                )
                            );

                        }
                    );


                if(compatible){

                    resultados.push({

                        codigo:j1,

                        nombre:
                            ficha.nombre ||
                            "Sin nombre"

                    });

                }

            }
        );


        label.textContent =
            resultados.length +
            (
                resultados.length===1
                    ? " resultado"
                    : " resultados"
            );


        this.mostrar(
            resultados
        );


        if(this.buscarTodos){

            await this.aplicarMatrix(
                resultados
            );

        }

    },


    /*====================================================
      MOSTRAR
    ====================================================*/

    mostrar:function(
        resultados
    ){

        const contenedor =
            document.getElementById(
                "resultadosCab16"
            );


        if(!contenedor){

            return;

        }


        resultados.forEach(
            resultado=>{

                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "resultadoCab16";


                fila.dataset.codigo =
                    resultado.codigo;


                fila.innerHTML =
                    "<strong>" +
                    resultado.codigo +
                    "</strong> " +
                    resultado.nombre;


                fila.addEventListener(
                    "click",
                    ()=>{

                        this.seleccionar(
                            resultado.codigo
                        );

                    }
                );


                contenedor.appendChild(
                    fila
                );

            }
        );

    },


    /*====================================================
      APLICAR MATRIX
    ====================================================*/

    aplicarMatrix:async function(
        resultados
    ){

        if(
            !resultados.length ||
            !window.MATRIXFILTRO ||
            !window.MatrixNavegador ||
            !window.PALNAVEGADOR
        ){

            this.limpiarFiltro();

            return;

        }


        const matriz =
            window.MATRIXFILTRO.actualizar(
                resultados
            );


        if(!Array.isArray(matriz)){

            return;

        }


        const registros =
            await window.MatrixNavegador.obtener(
                matriz
            );


        if(
            !Array.isArray(registros) ||
            !registros.length
        ){

            return;

        }


        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio ===
            "function"
        ){

            await window.PALNAVEGADOR.aleatorio();

        }

    },


    /*====================================================
      SELECCIONAR
    ====================================================*/

    seleccionar:async function(
        codigo
    ){

        codigo =
            String(codigo || "")
            .trim()
            .toUpperCase();


        if(!codigo){

            return;

        }


        this.seleccionRealizada=true;


        const campo =
            document.getElementById(
                "buscarUniversal"
            );


        if(campo){

            campo.value=codigo;

        }


        this.cerrar();


        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.cargarPorCodigo ===
            "function"
        ){

            await window.PALNAVEGADOR.cargarPorCodigo(
                codigo
            );

        }

    },


    /*====================================================
      CERRAR
    ====================================================*/

    cerrar:function(){

        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.cerrar ===
            "function"
        ){

            window.PALBUSCADOR.cerrar();

            return;

        }

    },


    /*====================================================
      LIMPIAR FILTRO
    ====================================================*/

    limpiarFiltro:function(){

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.limpiarFiltro ===
            "function"
        ){

            window.PALNAVEGADOR.limpiarFiltro();

        }


        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar ===
            "function"
        ){

            window.MatrixNavegador.limpiar();

        }

    }

};


/*========================================================
ARRANQUE
========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        window.cab18.inicializar();

    }
);


/*
========================================================
FIN cab18.js v1.0
========================================================
*/
