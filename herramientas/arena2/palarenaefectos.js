/*
============================================================
palentropía — arena
archivo: palarenaefectos.js
versión: 1.0
estado: base de datos de efectos
============================================================

módulo:
herramientas/arena/

función:
base de datos maestra de los efectos utilizados por arena.

estructura:
- código
- nombre
- tipo
- duración
- potencia
- descripción

notas:
- los efectos son independientes de los ataques.
- un mismo efecto puede ser utilizado por varios ataques.
- los efectos temporales serán gestionados posteriormente
  por el motor de combate palarena.js.
- ningún efecto produce penalizaciones ecológicas.
- los efectos de combate son temporales.

============================================================
*/

const PALARENAEFECTOS = {

    E001: {
        codigo: "E001",
        nombre: "Crítico",
        tipo: "instantaneo",
        duracion: 0,
        potencia: 1.5,
        descripcion: "Multiplica el daño producido por el ataque."
    },

    E002: {
        codigo: "E002",
        nombre: "Esquiva",
        tipo: "defensivo",
        duracion: 1,
        potencia: 30,
        descripcion: "Aumenta temporalmente la probabilidad de esquivar el siguiente ataque."
    },

    E003: {
        codigo: "E003",
        nombre: "Defensa reducida",
        tipo: "debilitamiento",
        duracion: 2,
        potencia: 20,
        descripcion: "Reduce temporalmente la defensa del objetivo."
    },

    E004: {
        codigo: "E004",
        nombre: "Movilidad reducida",
        tipo: "debilitamiento",
        duracion: 2,
        potencia: 20,
        descripcion: "Reduce temporalmente la movilidad del objetivo."
    },

    E005: {
        codigo: "E005",
        nombre: "Daño progresivo",
        tipo: "dano_temporal",
        duracion: 3,
        potencia: 8,
        descripcion: "Produce daño adicional al final de cada turno."
    },

    E006: {
        codigo: "E006",
        nombre: "Iniciativa aumentada",
        tipo: "iniciativa",
        duracion: 2,
        potencia: 20,
        descripcion: "Aumenta temporalmente la capacidad de actuar antes que el rival."
    },

    E007: {
        codigo: "E007",
        nombre: "Penetración",
        tipo: "ofensivo",
        duracion: 1,
        potencia: 25,
        descripcion: "Ignora temporalmente una parte de la defensa del objetivo."
    }

};


/*
============================================================
FUNCIONES DE ACCESO
============================================================
*/

function obtenerEfectoArena(codigo) {

    if (!codigo) {
        return null;
    }

    return PALARENAEFECTOS[codigo] || null;

}


function obtenerTodosLosEfectosArena() {

    return Object.values(PALARENAEFECTOS);

}


function existeEfectoArena(codigo) {

    return Object.prototype.hasOwnProperty.call(
        PALARENAEFECTOS,
        codigo
    );

}


/*
============================================================
FIN PALARENAEFECTOS
============================================================
*/
