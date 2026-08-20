/*
========================================================
PalEntropía
cab18.js v2.0

BUSCADOR AVANZADO — TIEMPO GEOLÓGICO

CAB16 → CÓDIGO
CAB17 → NOMBRE
CAB18 → TIEMPO GEOLÓGICO

BUSCA:
- eón
- era
- período
- edad

NO INTERPRETA Ma.

REGLAS:
Código  → CAB16
Nombre → mínimo 3 caracteres → CAB17
Tiempo → mínimo 4 caracteres → CAB18

RESULTADO:
codigo + nombre

CIRCUITO:
PALGEO
↓
J1 + J2
↓
MATRIXFILTRO
↓
MatrixNavegador
↓
PALNAVEGADOR
↓
aleatorio
========================================================
*/

window.cab18 = {

    inicializado:false,
    buscarTodos:false,
    seleccionRealizada:false,


    inicializar:function(){

        if(this.inicializado) return;

        this.conectar();

        this.inicializado=true;

    },


    esCodigo:function(texto){

        return /^\d{3}(?:_\d{0,2})?$/.test(
            String(texto || "").trim()
        );

    },


    normalizar:function(texto){

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"");

    },


    conectar:function(){

        const campo=
            document.getElementById(
                "buscarUniversal"
            );

        if(!campo) return;


        campo.addEventListener(
            "input",
            ()=>{

                this.seleccionRealizada=false;

                const texto=
                    campo.value.trim();


                if(this.esCodigo(texto)) return;


                /*
                CAB17 trabaja desde 3 caracteres.
                CAB18 solamente entra desde 4.
                */

                if(texto.length<4) return;

                this.buscar();

            }
        );


        const check=
            document.getElementById(
                "buscarTodosCab16"
            );

        if(check){

            check.addEventListener(
                "change",
                async ()=>{

                    this.buscarTodos=
                        check.checked;

                    this.seleccionRealizada=false;

                    await this.buscar();

                }
            );

        }

    },


    buscar:async function(){

        const campo=
            document.getElementById(
                "buscarUniversal"
            );

        const label=
            document.getElementById(
                "labelResultadosCab16"
            );

        const resultados=
            document.getElementById(
                "resultadosCab16"
            );

        if(!campo || !label || !resultados)
            return [];


        const texto=
            campo.value.trim();


        resultados.innerHTML="";


        if(this.esCodigo(texto))
            return [];


        /*
        CAB18:
        mínimo 4 caracteres.
        */

        if(texto.length<4)
            return [];


        /*
        PALGEO
        */

        if(
            !Array.isArray(window.PALGEO)
        ){

            label.textContent=
                "Base geológica no disponible.";

            return [];

        }


        const consulta=
            this.normalizar(texto);


        /*
        BUSCAR INTERVALOS
        */

        const intervalos=
            window.PALGEO.filter(
                intervalo=>{

                    if(!intervalo) return false;


                    return [

                        intervalo.eon,
                        intervalo.era,
                        intervalo.periodo,
                        intervalo.edad

                    ].some(
                        valor=>
                            this.normalizar(
                                valor
                            ).includes(
                                consulta
                            )
                    );

                }
            );


        if(!intervalos.length){

            label.textContent=
                "0 resultados";

            this.limpiarFiltro();

            return [];

        }


        /*
        DATOS DE PALEOFICHAS
        */

        if(
            !window.LEEPALJSON ||
            typeof window.LEEPALJSON.obtener!=="function"
        ){

            label.textContent=
                "Datos no disponibles.";

            return [];

        }


        const fichas=
            window.LEEPALJSON.obtener();


        if(!Array.isArray(fichas))
            return [];


        /*
        BUSCAR SOLAPAMIENTO TEMPORAL
        */

        const coincidencias=[];


        fichas.forEach(
            ficha=>{

                if(
                    !ficha ||
                    !ficha.codigo ||
                    !ficha.j3
                ) return;


                const partes=
                    String(ficha.j3)
                        .split("-");


                if(partes.length!==2)
                    return;


                const inicio=
                    Number(partes[0]);

                const fin=
                    Number(partes[1]);


                if(
                    !Number.isFinite(inicio) ||
                    !Number.isFinite(fin)
                ) return;


                const coincide=
                    intervalos.some(
                        intervalo=>{

                            const gi=
                                Number(
                                    intervalo.inicio_ma
                                );

                            const gf=
                                Number(
                                    intervalo.fin_ma
                                );


                            if(
                                !Number.isFinite(gi) ||
                                !Number.isFinite(gf)
                            )
                                return false;


                            return (
                                Math.min(
                                    inicio,
                                    gi
                                )
                                >
                                Math.max(
                                    fin,
                                    gf
                                )
                            );

                        }
                    );


                if(!coincide) return;


                /*
                IMPORTANTE:
                CAB18 entrega J1 + J2.
                */

                coincidencias.push({

                    codigo:
                        String(
                            ficha.codigo
                        )
                        .trim()
                        .toUpperCase(),

                    nombre:
                        String(
                            ficha.nombre ||
                            "Sin nombre"
                        )
                        .trim()

                });

            }
        );


        /*
        ELIMINAR DUPLICADOS
        */

        const unicas=[];

        const vistos=
            new Set();


        coincidencias.forEach(
            ficha=>{

                if(
                    vistos.has(
                        ficha.codigo
                    )
                ) return;


                vistos.add(
                    ficha.codigo
                );


                unicas.push(
                    ficha
                );

            }
        );


        label.textContent=
            unicas.length+
            (
                unicas.length===1
                    ? " resultado"
                    : " resultados"
            );


        this.mostrar(
            unicas
        );


        if(unicas.length){

            await this.aplicarMatrix(
                unicas
            );

        }
        else{

            this.limpiarFiltro();

        }


        return unicas;

    },


    mostrar:function(coincidencias){

        const contenedor=
            document.getElementById(
                "resultadosCab16"
            );

        if(!contenedor) return;


        coincidencias.forEach(
            resultado=>{

                if(
                    !resultado ||
                    !resultado.codigo
                ) return;


                const codigo=
                    String(
                        resultado.codigo
                    )
                    .trim()
                    .toUpperCase();


                const nombre=
                    String(
                        resultado.nombre ||
                        "Sin nombre"
                    )
                    .trim();


                const fila=
                    document.createElement(
                        "div"
                    );


                fila.className=
                    "resultadoCab16";


                fila.dataset.codigo=
                    codigo;


                /*
                CÓDIGO + NOMBRE REAL
                */

                fila.textContent=
                    codigo+
                    "   "+
                    nombre;


                fila.addEventListener(
                    "click",
                    ()=>{
                        this.seleccionar(
                            codigo
                        );
                    }
                );


                contenedor.appendChild(
                    fila
                );

            }
        );

    },

        aplicarMatrix:async function(
        coincidencias
    ){

        if(
            !Array.isArray(coincidencias) ||
            !coincidencias.length
        ){

            this.limpiarFiltro();

            return;

        }


        /*
        MATRIXFILTRO
        */

        if(
            !window.MATRIXFILTRO ||
            typeof window.MATRIXFILTRO.actualizar!=="function"
        ){

            console.warn(
                "cab18: MATRIXFILTRO no disponible."
            );

            return;

        }


        const matrizJ1=
            window.MATRIXFILTRO.actualizar(
                coincidencias
            );


        if(
            !Array.isArray(matrizJ1) ||
            !matrizJ1.length
        ){

            return;

        }


        /*
        MatrixNavegador
        */

        if(
            !window.MatrixNavegador ||
            typeof window.MatrixNavegador.obtener!=="function"
        ){

            return;

        }


        let registros;


        try{

            registros=
                await window.MatrixNavegador.obtener(
                    matrizJ1
                );

        }
        catch(error){

            console.warn(
                "cab18: error MatrixNavegador.",
                error
            );

            return;

        }


        if(
            !Array.isArray(registros) ||
            !registros.length
        ){

            return;

        }


        /*
        PALNAVEGADOR
        */

        if(
            !window.PALNAVEGADOR ||
            typeof window.PALNAVEGADOR.aplicarFiltro!=="function"
        ){

            return;

        }


        window.PALNAVEGADOR.aplicarFiltro(
            registros
        );


        /*
        ALEATORIO AUTOMÁTICO
        */

        if(
            !this.seleccionRealizada &&
            typeof window.PALNAVEGADOR.aleatorio==="function"
        ){

            try{

                await window.PALNAVEGADOR.aleatorio();

            }
            catch(error){

                console.warn(
                    "cab18: error aleatorio.",
                    error
                );

            }

        }

    },


    seleccionar:async function(
        codigo
    ){

        codigo=
            String(codigo || "")
            .trim()
            .toUpperCase();


        if(!codigo) return;


        this.seleccionRealizada=true;


        const campo=
            document.getElementById(
                "buscarUniversal"
            );


        if(campo)
            campo.value=codigo;


        const label=
            document.getElementById(
                "labelBusquedaUniversal"
            );


        if(label)
            label.textContent=codigo;


        this.cerrar();


        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.cargarPorCodigo==="function"
        ){

            try{

                await window.PALNAVEGADOR.cargarPorCodigo(
                    codigo
                );

            }
            catch(error){

                console.warn(
                    "cab18: error cargando selección.",
                    error
                );

            }

        }

    },


    cerrar:function(){

        if(
            window.PALBUSCADOR &&
            typeof window.PALBUSCADOR.cerrar==="function"
        ){

            window.PALBUSCADOR.cerrar();

            return;

        }


        [
            "lightboxBuscador",
            "buscadorLightbox",
            "lightboxBusqueda",
            "modalBuscador"
        ]
        .forEach(
            id=>{

                const elemento=
                    document.getElementById(id);


                if(elemento){

                    elemento.style.display="none";

                    elemento.classList.remove(
                        "activo"
                    );

                    elemento.classList.remove(
                        "visible"
                    );

                }

            }
        );

    },


    limpiarFiltro:function(){

        if(
            window.PALNAVEGADOR &&
            typeof window.PALNAVEGADOR.limpiarFiltro==="function"
        ){

            window.PALNAVEGADOR.limpiarFiltro();

        }


        if(
            window.MatrixNavegador &&
            typeof window.MatrixNavegador.limpiar==="function"
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
FIN cab18.js v2.0
========================================================
*/
