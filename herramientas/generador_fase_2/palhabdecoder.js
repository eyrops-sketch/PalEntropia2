/*
========================================================
PalEntropía
PALHABDECODER.js v1.0
Decodificador Universal de Hábitats
========================================================

OBJETIVO
--------------------------------------------------------
Interpreta los campos j5 y j6 procedentes de master.csv.

j5 y j6 contienen:

    15 caracteres
    5 slots de 3 caracteres

Ejemplo:

    j5 = 100097147000000
    j6 = 090062000000000

Cada slot representa un código de hábitat:

    100 → H100
    097 → H097
    147 → H147

El valor:

    000

significa slot vacío y nunca se muestra.

========================================================
REGLAS DE NORMALIZACIÓN
========================================================

1. J5 tiene prioridad sobre J6.

2. El primer slot válido de J5 es el hábitat
   predominante.

3. Los demás hábitats válidos de J5 son hábitats
   principales adicionales.

4. Los códigos de J6 que ya existen en J5 se eliminan.

5. Los códigos de J6 que no estén presentes en J5
   pasan a hábitats secundarios.

6. Si J5 está completamente compuesto por 000,
   el primer hábitat válido de J6 asciende a
   hábitat predominante.

7. El hábitat promovido desde J6 se elimina de la
   lista de secundarios.

8. Los valores 000 nunca se muestran.

9. Se conserva el orden original de los slots.

10. No se modifica nunca el contenido original de
    j5 ni j6.

========================================================
DEPENDENCIAS
========================================================

NO depende de:

    CAB14
    PALHAB.js
    master.csv
    CAB12
    CAB13

Puede utilizarse desde cualquier módulo del proyecto.

========================================================
*/

window.PALHABDECODER = {


/*========================================================
  01 — SEPARAR SLOTS
========================================================*/

/*
--------------------------------------------------------
separarSlots(cadena)

Recibe:

    "100097147000000"

Devuelve:

    ["H100","H097","H147"]

Ignora automáticamente:

    000

También ignora cualquier slot que no tenga exactamente
3 caracteres.
--------------------------------------------------------
*/

separarSlots:function(cadena){

    var resultado=[];


    /*-----------------------------------------------
      Comprobación básica
    -----------------------------------------------*/

    if(typeof cadena !== "string"){

        return resultado;

    }


    /*-----------------------------------------------
      Eliminar espacios exteriores
    -----------------------------------------------*/

    cadena=cadena.trim();


    /*-----------------------------------------------
      Leer los 5 slots
    -----------------------------------------------*/

    for(var i=0;i<15;i+=3){

        var slot=cadena.substring(i,i+3);


        /*-------------------------------------------
          El slot debe tener 3 caracteres
        -------------------------------------------*/

        if(slot.length!==3){

            continue;

        }


        /*-------------------------------------------
          000 = vacío
        -------------------------------------------*/

        if(slot==="000"){

            continue;

        }


        /*-------------------------------------------
          Convertir:

              100

          en:

              H100
        -------------------------------------------*/

        resultado.push("H"+slot);

    }


    return resultado;

},


/*========================================================
  02 — COMPROBAR SI J5 ESTÁ VACÍO
========================================================*/

/*
--------------------------------------------------------
j5Vacio(j5)

Devuelve:

    true

si j5 no contiene ningún código válido.

Devuelve:

    false

si existe al menos un hábitat válido.
--------------------------------------------------------
*/

j5Vacio:function(j5){

    var habitats=this.separarSlots(j5);

    return habitats.length===0;

},


/*========================================================
  03 — ELIMINAR DUPLICADOS INTERNOS
========================================================*/

/*
--------------------------------------------------------
eliminarDuplicados(lista)

Evita que un mismo código aparezca más de una vez
dentro de una misma lista.

Ejemplo:

    ["H100","H097","H100"]

se convierte en:

    ["H100","H097"]

Se conserva siempre la primera aparición.
--------------------------------------------------------
*/

eliminarDuplicados:function(lista){

    var resultado=[];


    for(var i=0;i<lista.length;i++){

        if(resultado.indexOf(lista[i])===-1){

            resultado.push(lista[i]);

        }

    }


    return resultado;

},


/*========================================================
  04 — COMPROBAR SI UN HÁBITAT EXISTE
========================================================*/

/*
--------------------------------------------------------
contiene(lista,codigo)

Devuelve true si el código existe dentro de la lista.
--------------------------------------------------------
*/

contiene:function(lista,codigo){

    return lista.indexOf(codigo)!==-1;

},


/*========================================================
  05 — FILTRAR J6 CONTRA J5
========================================================*/

/*
--------------------------------------------------------
filtrarSecundarios(j5,j6)

Regla fundamental:

    J5 PREDOMINA SOBRE J6

Si un código ya existe en J5, no puede volver a
aparecer como secundario procedente de J6.

Ejemplo:

    J5 = H100,H097,H147

    J6 = H097,H062,H090

Resultado:

    H062,H090

H097 desaparece porque ya está presente en J5.
--------------------------------------------------------
*/

filtrarSecundarios:function(j5,j6){

    var resultado=[];


    for(var i=0;i<j6.length;i++){

        var codigo=j6[i];


        /*-------------------------------------------
          Si ya está en J5, se elimina
        -------------------------------------------*/

        if(this.contiene(j5,codigo)){

            continue;

        }


        /*-------------------------------------------
          Evitar duplicados
        -------------------------------------------*/

        if(resultado.indexOf(codigo)===-1){

            resultado.push(codigo);

        }

    }


    return resultado;

},


/*========================================================
  06 — NORMALIZAR J5
========================================================*/

/*
--------------------------------------------------------
normalizarJ5(j5)

Obtiene los hábitats válidos de J5 y elimina
duplicados internos.

El orden original se conserva.
--------------------------------------------------------
*/

normalizarJ5:function(j5){

    var habitats=this.separarSlots(j5);

    return this.eliminarDuplicados(habitats);

},


/*========================================================
  07 — NORMALIZAR J6
========================================================*/

/*
--------------------------------------------------------
normalizarJ6(j6)

Obtiene los hábitats válidos de J6 y elimina
duplicados internos.

El orden original se conserva.
--------------------------------------------------------
*/

normalizarJ6:function(j6){

    var habitats=this.separarSlots(j6);

    return this.eliminarDuplicados(habitats);

},


/*========================================================
  08 — DECODIFICAR J5 + J6
========================================================*/

/*
--------------------------------------------------------
decodificar(j5,j6)

FUNCIÓN PRINCIPAL.

Devuelve:

{
    predominante: "...",
    principales: [...],
    secundarios: [...],
    origenPredominante: "j5"
}

--------------------------------------------------------

CASO NORMAL

J5:

    100097147000000

J6:

    090062000000000

Resultado:

    predominante:
        H100

    principales:
        H097
        H147

    secundarios:
        H090
        H062

--------------------------------------------------------

CASO CON DUPLICADO

J5:

    100097147000000

J6:

    097062000000000

Resultado:

    predominante:
        H100

    principales:
        H097
        H147

    secundarios:
        H062

H097 desaparece de J6 porque ya está en J5.

--------------------------------------------------------

CASO J5 VACÍO

J5:

    000000000000000

J6:

    097147062000000

Resultado:

    predominante:
        H097

    principales:
        []

    secundarios:
        H147
        H062

H097 asciende desde J6 y deja de ser secundario.
--------------------------------------------------------
*/

decodificar:function(j5,j6){


    /*====================================================
      PASO 1
      Normalizar J5
    ====================================================*/

    var habitatsJ5=this.normalizarJ5(j5);


    /*====================================================
      PASO 2
      Normalizar J6
    ====================================================*/

    var habitatsJ6=this.normalizarJ6(j6);


    /*====================================================
      CASO A
      J5 contiene al menos un hábitat
    ====================================================*/

    if(habitatsJ5.length>0){


        /*-----------------------------------------------
          Primer J5 = predominante
        -----------------------------------------------*/

        var predominante=habitatsJ5[0];


        /*-----------------------------------------------
          Resto de J5 = principales
        -----------------------------------------------*/

        var principales=habitatsJ5.slice(1);


        /*-----------------------------------------------
          J6 = secundarios

          Pero eliminando los códigos que ya existen
          en J5.
        -----------------------------------------------*/

        var secundarios=this.filtrarSecundarios(

            habitatsJ5,

            habitatsJ6

        );


        /*-----------------------------------------------
          Resultado normalizado
        -----------------------------------------------*/

        return {

            predominante:predominante,

            principales:principales,

            secundarios:secundarios,

            origenPredominante:"j5"

        };

    }


    /*====================================================
      CASO B
      J5 completamente vacío
    ====================================================*/

    if(habitatsJ6.length>0){


        /*-----------------------------------------------
          Primer J6 válido asciende a predominante
        -----------------------------------------------*/

        var predominanteJ6=habitatsJ6[0];


        /*-----------------------------------------------
          El resto de J6 permanece como secundario
        -----------------------------------------------*/

        var secundariosJ6=habitatsJ6.slice(1);


        /*-----------------------------------------------
          Resultado normalizado
        -----------------------------------------------*/

        return {

            predominante:predominanteJ6,

            principales:[],

            secundarios:secundariosJ6,

            origenPredominante:"j6"

        };

    }


    /*====================================================
      CASO C
      J5 y J6 completamente vacíos
    ====================================================*/

    return {

        predominante:null,

        principales:[],

        secundarios:[],

        origenPredominante:null

    };

},


/*========================================================
  09 — DECODIFICAR REGISTRO
========================================================*/

/*
--------------------------------------------------------
decodificarRegistro(registro)

Permite pasar directamente un objeto procedente del
contenedor de datos.

Ejemplo:

    {
        j1:"001_01",
        j5:"100097147000000",
        j6:"090062000000000"
    }

La función extrae automáticamente:

    registro.j5
    registro.j6
--------------------------------------------------------
*/

decodificarRegistro:function(registro){


    /*-----------------------------------------------
      Registro inexistente
    -----------------------------------------------*/

    if(!registro){

        return {

            predominante:null,

            principales:[],

            secundarios:[],

            origenPredominante:null

        };

    }


    /*-----------------------------------------------
      Decodificación
    -----------------------------------------------*/

    return this.decodificar(

        registro.j5,

        registro.j6

    );

},


/*========================================================
  10 — OBTENER CÓDIGOS CRUDOS
========================================================*/

/*
--------------------------------------------------------
obtenerCodigos(j5,j6)

Devuelve los códigos ya convertidos a formato Hxxx,
pero sin aplicar todavía la regla de predominancia.

Útil para depuración y futuras herramientas.
--------------------------------------------------------
*/

obtenerCodigos:function(j5,j6){

    return {

        j5:this.normalizarJ5(j5),

        j6:this.normalizarJ6(j6)

    };

}


};


/*
========================================================
FIN PALHABDECODER.js v1.0
========================================================
*/
