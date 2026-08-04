/*
========================================================
PalEntropía
paldecoder.js v1.0 LTS

Decodificador de presentación
Constructor de Paleofichas

Módulos:
- PALHAB
- PALGEO

Convierte códigos internos en información legible
sin modificar las bases maestras.
========================================================
*/


window.PALDECODER = {


/* ======================================================
   MÓDULO HABITATS
   Entrada:
   HP / HS

   Salida:
   - nombres
   - descripciones
   - códigos para filtros
====================================================== */


decodeHabitats(HP, HS){


    let resultado={

        principales:[],
        secundarios:[],

        codes:[],
        matriz:[]

    };



    function leer(cadena){


        let salida=[];


        if(!cadena){
            return salida;
        }


        // elimina prefijo HP o HS si existe
        cadena=cadena
        .replace("HP","")
        .replace("HS","");



        // siempre 5 slots de 3 dígitos

        for(let i=0;i<15;i+=3){


            let numero=cadena.substring(i,i+3);



            if(numero==="000"){
                continue;
            }



            let codigo="H"+numero;



            let habitat=window.PALHAB[codigo];



            if(habitat){


                salida.push({

                    codigo:habitat.codigo,

                    nombre:habitat.nombre,

                    descripcion:habitat.descripcion

                });


            }


        }


        return salida;

    }



    resultado.principales=
    leer(HP);



    resultado.secundarios=
    leer(HS);



    resultado.codes=[

        ...resultado.principales.map(h=>h.codigo),

        ...resultado.secundarios.map(h=>h.codigo)

    ];



    resultado.matriz=[

        ...resultado.codes

    ];



    return resultado;


},



/* ======================================================
   FILTRO RÁPIDO DE HÁBITAT

   Devuelve TRUE/FALSE
====================================================== */


hasHabitat(datos,codigo){


    if(!datos || !codigo){
        return false;
    }



    return datos.codes.includes(codigo);


},



/* ======================================================
   FIN MÓDULO HABITATS
====================================================== */


/* ======================================================
   MÓDULO GEOLOGÍA
   PALGEO

   Entrada:
   cronologia

   Formato:
   MMMM.DDDD-MMMM.DDDD

   Ejemplo:
   0059.2000-0041.2000

   Devuelve:
   - rango temporal
   - eón
   - era
   - período
   - edades
   - códigos rápidos
====================================================== */


decodeCronologia(cronologia){


    if(!cronologia){

        return null;

    }



    let partes = cronologia.split("-");



    if(partes.length!==2){

        return null;

    }



    let inicio=parseFloat(partes[0]);

    let fin=parseFloat(partes[1]);



    let resultado={


        inicio_ma:inicio,

        fin_ma:fin,


        rango:this.formatearRango(inicio,fin),


        eon:[],

        era:[],

        periodo:[],

        edad:[],


        codes:[],

        eon_codes:[],

        era_codes:[],

        periodo_codes:[],

        edad_codes:[]


    };



    if(!window.PALGEO){

        return resultado;

    }



    window.PALGEO.forEach(intervalo=>{


        /*
        Comprobación de solapamiento temporal

        Si los rangos tienen cualquier parte común
        se considera compatible.
        */


        let compatible = (

            inicio >= intervalo.fin_ma &&

            fin <= intervalo.inicio_ma

        );



        if(compatible){



            if(!resultado.eon.includes(intervalo.eon)){

                resultado.eon.push(intervalo.eon);

            }



            if(!resultado.era.includes(intervalo.era)){

                resultado.era.push(intervalo.era);

            }



            if(
                intervalo.periodo &&
                !resultado.periodo.includes(intervalo.periodo)
            ){

                resultado.periodo.push(intervalo.periodo);

            }



            if(
                intervalo.edad &&
                !resultado.edad.includes(intervalo.edad)
            ){

                resultado.edad.push(intervalo.edad);

            }



            resultado.codes.push(intervalo.codigo);



            this.decodeGeoCode(

                intervalo.codigo,

                resultado

            );


        }


    });



    return resultado;


},





/* ======================================================
   DESCOMPOSICIÓN DE CÓDIGOS GEO

   Código PALGEO:

   EE EE EE

   Ejemplo:

   04030103

   04 Fanerozoico
   03 Cenozoico
   01 Paleógeno
   03 Edad

====================================================== */


decodeGeoCode(codigo,resultado){


    if(!codigo){

        return;

    }



    let texto=String(codigo);



    if(texto.length>=2){


        let eon=texto.substring(0,2);



        if(
            !resultado.eon_codes.includes(eon)
        ){

            resultado.eon_codes.push(eon);

        }


    }



    if(texto.length>=4){


        let era=texto.substring(2,4);



        if(
            !resultado.era_codes.includes(era)
        ){

            resultado.era_codes.push(era);

        }


    }



    if(texto.length>=6){


        let periodo=texto.substring(4,6);



        if(
            !resultado.periodo_codes.includes(periodo)
        ){

            resultado.periodo_codes.push(periodo);

        }


    }



    if(texto.length>=8){


        let edad=texto.substring(6,8);



        if(
            !resultado.edad_codes.includes(edad)
        ){

            resultado.edad_codes.push(edad);

        }


    }


},



/* ======================================================
   FORMATO DE EDAD PARA PRESENTACIÓN
====================================================== */
formatearRango(inicio,fin){

    function formato(valor){

        if(valor===0){
            return "Actualidad";
        }

        if(valor<0.001){
            return Math.round(valor*1000000)+" a";
        }

        if(valor<1){
    return (valor*1000000).toLocaleString("es-ES")+" a";
        }

        let texto=valor.toFixed(4);

        texto=texto
            .replace(/\.?0+$/,"")
            .replace(".",",");

        return texto+" Ma";

    }

    return formato(inicio)+" - "+formato(fin);

},


/* ======================================================
   FIN MÓDULO GEO
====================================================== */


/* ======================================================
   DECODIFICADOR GENERAL DE PALEOFICHA

   Convierte:

   Datos internos:
   - cronologia
   - HP
   - HS
   - códigos

   En datos preparados para interfaz.

====================================================== */


decodeFicha(ficha){


    if(!ficha){

        return null;

    }



    let salida={};



    /*
    IDENTIDAD
    */


    salida.codigo = ficha.codigo || "";

    salida.nombre = ficha.nombre || "";



    /*
    CRONOLOGÍA
    */


    salida.cronologia =
    this.decodeCronologia(
        ficha.cronologia
    );



    /*
    HÁBITATS
    */


    salida.habitat =
    this.decodeHabitats(

        ficha.HP,

        ficha.HS

    );



    /*
    COPIA DE CAMPOS DISPONIBLES

    No modifica la ficha original.
    */


    salida.datos={};



    Object.keys(ficha).forEach(campo=>{


        if(
            campo!=="HP" &&
            campo!=="HS" &&
            campo!=="cronologia"
        ){


            salida.datos[campo]=
            ficha[campo];


        }


    });



    return salida;


},





/* ======================================================
   GENERADOR DE ETIQUETAS PARA PRESENTACIÓN

   Pensado para tarjetas, fichas y buscadores

====================================================== */


crearEtiquetas(fichaDecodificada){



    let etiquetas=[];



    if(
        fichaDecodificada.habitat
    ){


        fichaDecodificada.habitat.codes
        .forEach(codigo=>{


            etiquetas.push({

                tipo:"habitat",

                codigo:codigo,


                nombre:
                window.PALHAB[codigo]
                ?
                window.PALHAB[codigo].nombre
                :
                codigo


            });


        });


    }





    if(
        fichaDecodificada.cronologia
    ){


        fichaDecodificada.cronologia.codes
        .forEach(codigo=>{


            let geo=
            window.PALGEO.find(
                g=>g.codigo===codigo
            );



            if(geo){


                etiquetas.push({

                    tipo:"geologia",

                    codigo:codigo,

                    nombre:
                    geo.edad


                });


            }


        });


    }



    return etiquetas;


},




/* ======================================================
   BÚSQUEDA TEMPORAL

   Comprueba si una especie pertenece
   a un intervalo dado.

====================================================== */


estaEnPeriodo(ficha,ma){



    let geo=
    this.decodeCronologia(
        ficha.cronologia
    );



    if(!geo){

        return false;

    }



    return (

        ma <= geo.inicio_ma &&

        ma >= geo.fin_ma

    );


},




/* ======================================================
   FIN DECODER GENERAL
====================================================== */


/* ======================================================
   FILTROS RÁPIDOS PALENTROPÍA

   Pensados para:
   - buscador
   - Arena
   - Constructor
   - índices dinámicos

====================================================== */



/* ------------------------------------------------------
   FILTRO POR HÁBITAT
------------------------------------------------------ */


filtrarPorHabitat(fichas,codigoHabitat){


    if(!Array.isArray(fichas)){

        return [];

    }



    return fichas.filter(ficha=>{


        let hab=
        this.decodeHabitats(

            ficha.HP,

            ficha.HS

        );



        return hab.codes.includes(
            codigoHabitat
        );


    });


},




/* ------------------------------------------------------
   FILTRO POR INTERVALO TEMPORAL

   Ejemplo:

   040106 = Pérmico

------------------------------------------------------ */


filtrarPorTiempo(fichas,ma){


    if(!Array.isArray(fichas)){

        return [];

    }



    return fichas.filter(ficha=>{


        return this.estaEnPeriodo(

            ficha,

            ma

        );


    });


},




/* ------------------------------------------------------
   OBTENER INFORMACIÓN GEO POR CÓDIGO
------------------------------------------------------ */


getGeo(codigo){


    if(!window.PALGEO){

        return null;

    }



    return window.PALGEO.find(

        geo=>
        geo.codigo===codigo

    );


},




/* ------------------------------------------------------
   OBTENER INFORMACIÓN HABITAT POR CÓDIGO
------------------------------------------------------ */


getHab(codigo){


    if(!window.PALHAB){

        return null;

    }



    return window.PALHAB[codigo] || null;


},




/* ------------------------------------------------------
   BUSCADOR GENERAL

   Busca por:
   - nombre
   - hábitat
   - edad geológica

------------------------------------------------------ */


buscar(fichas,texto){



    if(!Array.isArray(fichas)){

        return [];

    }



    texto=
    String(texto)
    .toLowerCase();



    return fichas.filter(ficha=>{


        let decodificada=
        this.decodeFicha(ficha);



        let nombre=
        decodificada.nombre
        .toLowerCase();



        if(
            nombre.includes(texto)
        ){

            return true;

        }



        let habitats=
        decodificada.habitat.codes
        .join(" ")
        .toLowerCase();



        if(
            habitats.includes(texto)
        ){

            return true;

        }



        let edades=
        decodificada.cronologia.edad
        .join(" ")
        .toLowerCase();



        if(
            edades.includes(texto)
        ){

            return true;

        }



        return false;


    });


}



};


/* ======================================================
   FIN PALDECODER v1.0 LTS
====================================================== */
  




  

