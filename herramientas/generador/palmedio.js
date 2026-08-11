/*
========================================================
PALMEDIO.js v3.0 LTS
Catálogo Universal de Medios Ecológicos
PalEntropía

Arquitectura

SM = Medio general
L  = Localización ecológica
ES = Estrato ecológico
C  = Comportamiento espacial

El campo medio_compuesto mantiene el formato:

xxxxxxxxxxxx

Dividido en cuatro bloques:

SM L ES C

Ejemplo

002002004002

↓

SM002
L002
ES004
C002

========================================================
*/

window.PALMEDIO = {

/* ======================================================
   SM · MEDIO GENERAL
====================================================== */

SM000:{
    codigo:"SM000",
    nombre:"No aplicable",
    categoria:"Medio general",
    descripcion:"Medio ecológico no definido."
},

SM001:{
    codigo:"SM001",
    nombre:"Generalista",
    categoria:"Medio general",
    descripcion:"Utiliza una amplia variedad de recursos y condiciones ecológicas."
},

SM002:{
    codigo:"SM002",
    nombre:"Especialista",
    categoria:"Medio general",
    descripcion:"Depende de recursos, condiciones o modos de vida muy específicos."
},

SM003:{
    codigo:"SM003",
    nombre:"Oportunista",
    categoria:"Medio general",
    descripcion:"Aprovecha rápidamente los recursos disponibles cuando las condiciones son favorables."
},

SM004:{
    codigo:"SM004",
    nombre:"Sedentario",
    categoria:"Medio general",
    descripcion:"Permanece la mayor parte de su vida en una misma área."
},

SM005:{
    codigo:"SM005",
    nombre:"Nómada",
    categoria:"Medio general",
    descripcion:"Se desplaza continuamente siguiendo la disponibilidad de recursos."
},

SM006:{
    codigo:"SM006",
    nombre:"Migrador",
    categoria:"Medio general",
    descripcion:"Realiza desplazamientos periódicos entre distintas regiones."
},

SM007:{
    codigo:"SM007",
    nombre:"Territorial",
    categoria:"Medio general",
    descripcion:"Defiende un área frente a otros individuos."
},

SM008:{
    codigo:"SM008",
    nombre:"Gregario",
    categoria:"Medio general",
    descripcion:"Desarrolla gran parte de su actividad formando grupos."
},

SM009:{
    codigo:"SM009",
    nombre:"Solitario",
    categoria:"Medio general",
    descripcion:"Realiza la mayor parte de su ciclo vital de forma individual."
},

/* ======================================================
   L · LOCALIZACIÓN ECOLÓGICA
====================================================== */

L000:{
    codigo:"L000",
    nombre:"No aplicable",
    categoria:"Localización ecológica",
    descripcion:"Localización ecológica no definida."
},

L001:{
    codigo:"L001",
    nombre:"Superficie terrestre",
    categoria:"Localización ecológica",
    descripcion:"Actividad desarrollada principalmente sobre la superficie del terreno."
},

L002:{
    codigo:"L002",
    nombre:"Columna de agua",
    categoria:"Localización ecológica",
    descripcion:"Actividad desarrollada principalmente en la columna de agua."
},

L003:{
    codigo:"L003",
    nombre:"Fondo",
    categoria:"Localización ecológica",
    descripcion:"Actividad desarrollada principalmente sobre el fondo o muy próxima a él."
},

L004:{
    codigo:"L004",
    nombre:"Subsuelo",
    categoria:"Localización ecológica",
    descripcion:"Actividad desarrollada bajo la superficie del terreno o del sedimento."
},

L005:{
    codigo:"L005",
    nombre:"Espacio aéreo",
    categoria:"Localización ecológica",
    descripcion:"Actividad desarrollada principalmente en el medio aéreo."
},

L006:{
    codigo:"L006",
    nombre:"Vegetación",
    categoria:"Localización ecológica",
    descripcion:"Actividad desarrollada sobre árboles, arbustos u otra vegetación."
},

L007:{
    codigo:"L007",
    nombre:"Orilla",
    categoria:"Localización ecológica",
    descripcion:"Zona de transición entre ambientes terrestres y acuáticos."
},

L008:{
    codigo:"L008",
    nombre:"Interior de cavidades",
    categoria:"Localización ecológica",
    descripcion:"Actividad desarrollada principalmente en cuevas, galerías o cavidades naturales."
},

L009:{
    codigo:"L009",
    nombre:"Localización variable",
    categoria:"Localización ecológica",
    descripcion:"Alterna diferentes localizaciones ecológicas durante su ciclo vital."
},


/* ======================================================
   ES · ESTRATO ECOLÓGICO
====================================================== */

ES000:{
    codigo:"ES000",
    nombre:"No aplicable",
    categoria:"Estrato ecológico",
    descripcion:"Estrato ecológico no definido."
},

ES001:{
    codigo:"ES001",
    nombre:"Superficie",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada principalmente sobre la superficie del medio."
},

ES002:{
    codigo:"ES002",
    nombre:"Estrato bajo",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada en la parte inferior del medio ocupado."
},

ES003:{
    codigo:"ES003",
    nombre:"Estrato medio",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada en la zona media del medio ocupado."
},

ES004:{
    codigo:"ES004",
    nombre:"Estrato alto",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada en la parte superior del medio ocupado."
},

ES005:{
    codigo:"ES005",
    nombre:"Dosel",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada principalmente en el dosel de la vegetación."
},

ES006:{
    codigo:"ES006",
    nombre:"Intersticial",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada entre sedimentos, grietas o pequeños espacios."
},

ES007:{
    codigo:"ES007",
    nombre:"Profundo",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada en zonas profundas del medio ocupado."
},

ES008:{
    codigo:"ES008",
    nombre:"Pelágico",
    categoria:"Estrato ecológico",
    descripcion:"Actividad desarrollada lejos del fondo y de la costa."
},

ES009:{
    codigo:"ES009",
    nombre:"Estrato variable",
    categoria:"Estrato ecológico",
    descripcion:"Alterna distintos estratos ecológicos según las condiciones."
},


/* ======================================================
   C · COMPORTAMIENTO ESPACIAL
====================================================== */

C000:{
    codigo:"C000",
    nombre:"No aplicable",
    categoria:"Comportamiento espacial",
    descripcion:"Comportamiento espacial no definido."
},

C001:{
    codigo:"C001",
    nombre:"Residente",
    categoria:"Comportamiento espacial",
    descripcion:"Permanece habitualmente dentro de una misma área durante su ciclo vital."
},

C002:{
    codigo:"C002",
    nombre:"Explorador",
    categoria:"Comportamiento espacial",
    descripcion:"Recorre activamente su entorno en busca de recursos o alimento."
},

C003:{
    codigo:"C003",
    nombre:"Perseguidor",
    categoria:"Comportamiento espacial",
    descripcion:"Se desplaza activamente siguiendo objetivos móviles, como presas o competidores."
},

C004:{
    codigo:"C004",
    nombre:"Acechador",
    categoria:"Comportamiento espacial",
    descripcion:"Permanece inmóvil u oculto esperando el momento adecuado para actuar."
},

C005:{
    codigo:"C005",
    nombre:"Emboscador",
    categoria:"Comportamiento espacial",
    descripcion:"Ataca desde posiciones de ocultamiento aprovechando el factor sorpresa."
},

C006:{
    codigo:"C006",
    nombre:"Errante",
    categoria:"Comportamiento espacial",
    descripcion:"No mantiene un área fija y cambia con frecuencia de zona de actividad."
},

C007:{
    codigo:"C007",
    nombre:"Migratorio",
    categoria:"Comportamiento espacial",
    descripcion:"Realiza desplazamientos periódicos entre distintas regiones."
},

C008:{
    codigo:"C008",
    nombre:"Colonizador",
    categoria:"Comportamiento espacial",
    descripcion:"Ocupa con facilidad nuevos espacios disponibles."
},

C009:{
    codigo:"C009",
    nombre:"Comportamiento variable",
    categoria:"Comportamiento espacial",
    descripcion:"Alterna distintos comportamientos espaciales según las circunstancias."
}

};






