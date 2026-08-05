/*
========================================================
PALDECODER2.js v1.0 LTS
Decodificador Universal de Modo de Vida
PalEntropía
--------------------------------------------------------
Sistema de decodificación del campo:

MVxxxxxxxxxxxx

Cada bloque de 3 dígitos representa un código SM
del catálogo PALMEDIO.

Estructura:

Slot 1 → Modo de vida principal (obligatorio)
Slot 2 → Modo de vida secundario (opcional)
Slot 3 → Modo de vida secundario (opcional)
Slot 4 → Modo de vida secundario (opcional)

Ejemplo:

MV010092066000

→ SM010
→ SM092
→ SM066
→ SM000 (vacío)

========================================================
*/

window.PALDECODER2 = {

/* ======================================================
   Función principal
====================================================== */

decodeModoVida(codigo){

    if(!codigo || typeof codigo !== "string"){
        return null;
    }

    codigo = codigo.trim().toUpperCase();

    if(!codigo.startsWith("MV") || codigo.length !== 14){
        return null;
    }

    const datos = codigo.substring(2);

    const slot1 = datos.substring(0,3);
    const slot2 = datos.substring(3,6);
    const slot3 = datos.substring(6,9);
    const slot4 = datos.substring(9,12);

    return{

        principal: this.leerSlot(slot1),

        secundario1: this.leerSlot(slot2),

        secundario2: this.leerSlot(slot3),

        secundario3: this.leerSlot(slot4)

    };

},

/* ======================================================
   Lee un slot individual
====================================================== */

leerSlot(slot){

    if(!slot || slot === "000"){
        return null;
    }

    const codigo = "SM" + slot;

    if(!window.PALMEDIO || !PALMEDIO[codigo]){
        return null;
    }

    return PALMEDIO[codigo];

},

/* ======================================================
   Devuelve una lista limpia de modos de vida
====================================================== */

obtenerLista(codigo){

    const mv = this.decodeModoVida(codigo);

    if(!mv){
        return [];
    }

    return [

        mv.principal,
        mv.secundario1,
        mv.secundario2,
        mv.secundario3

    ].filter(item => item !== null);

},

/* ======================================================
   Valida un código de Modo de Vida
====================================================== */

esValido(codigo){

    if(!codigo || typeof codigo !== "string"){
        return false;
    }

    codigo = codigo.trim().toUpperCase();

    if(!codigo.startsWith("MV") || codigo.length !== 14){
        return false;
    }

    const datos = codigo.substring(2);

    for(let i = 0; i < 4; i++){

        const slot = datos.substring(i * 3, i * 3 + 3);

        if(slot === "000"){
            continue;
        }

        if(!PALMEDIO["SM" + slot]){
            return false;
        }

    }

    return true;

},

/* ==========================================================
   API pública PALDECODER2 v1.0 LTS

   decodeModoVida(codigo)
      → Decodifica un campo MVxxxxxxxxxxxx y devuelve
        los cuatro slots interpretados.

   leerSlot(slot)
      → Convierte un código SMxxx en su registro
        correspondiente de PALMEDIO.

   obtenerLista(codigo)
      → Devuelve un array limpio con todos los modos
        de vida válidos, eliminando los slots vacíos.

   esValido(codigo)
      → Comprueba que el código MV tenga un formato
        correcto y que todos los códigos SM existan
        dentro de PALMEDIO.

========================================================== */

};

