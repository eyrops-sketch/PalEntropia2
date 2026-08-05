/*
========================================================
PALDECODER2.js v1.0 LTS

Decodificador Universal Biológico
PalEntropía

Responsabilidades:

1. Interpretar modo_vida (MVxxx)
   usando PALMODO.js

2. Interpretar medio_compuesto
   usando PALMEDIO.js

========================================================
*/


window.PALDECODER2 = {


decodeModoVida(codigo){


    if(!codigo || typeof codigo !== "string"){
        return null;
    }


    codigo = codigo
    .trim()
    .toUpperCase();


    if(!codigo.startsWith("MV")){
        return null;
    }


    if(!window.PALMODO){
        return null;
    }


    const modo = PALMODO[codigo];


    if(!modo){
        return null;
    }


    return modo;


},
decodeMedio(codigo){


    if(!codigo || typeof codigo !== "string"){
        return null;
    }


    codigo = codigo
    .trim()
    .toUpperCase();


    if(codigo.length !== 12){
        return null;
    }


    if(!window.PALMEDIO){
        return null;
    }


    const sm = codigo.substring(0,3);
    const l  = codigo.substring(3,6);
    const es = codigo.substring(6,9);
    const c  = codigo.substring(9,12);



    return {


        medio:
            PALMEDIO["SM" + sm] || null,


        localizacion:
            PALMEDIO["L" + l] || null,


        estrato:
            PALMEDIO["ES" + es] || null,


        comportamiento:
            PALMEDIO["C" + c] || null


    };


},
obtenerModoVida(codigo){


    const modo = this.decodeModoVida(codigo);


    if(!modo){
        return null;
    }


    return {

        codigo: modo.codigo,
        nombre: modo.nombre,
        descripcion: modo.descripcion

    };


},



obtenerMedio(codigo){


    const medio = this.decodeMedio(codigo);


    if(!medio){
        return [];
    }


    return [

        medio.medio,
        medio.localizacion,
        medio.estrato,
        medio.comportamiento

    ].filter(item => item !== null);


},



esValidoModoVida(codigo){


    if(!codigo || typeof codigo !== "string"){
        return false;
    }


    codigo = codigo
    .trim()
    .toUpperCase();


    if(!codigo.startsWith("MV")){
        return false;
    }


    if(!window.PALMODO){
        return false;
    }


    return !!PALMODO[codigo];


},
esValidoMedio(codigo){


    if(!codigo || typeof codigo !== "string"){
        return false;
    }


    codigo = codigo.trim();


    if(!/^[0-9]{12}$/.test(codigo)){
        return false;
    }


    return true;


}






};
