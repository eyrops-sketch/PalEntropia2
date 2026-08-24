/*
============================================================
palentropía — arena
archivo: palarenaataques.js
versión: 1.0
estado: base de datos de ataques
============================================================

módulo:
herramientas/arena/

función:
base de datos maestra de los ataques utilizados por arena.

estructura:
- código
- nombre
- tipo
- daño base
- precisión
- probabilidad de crítico
- efecto asociado
- descripción

notas:
- los valores son relativos y serán interpretados por el
  motor de combate.
- los ataques pueden reutilizarse entre diferentes especies.
- a001 funciona como ataque básico de seguridad.
- los efectos se definirán posteriormente en
  palarenaefectos.js.
- este archivo no contiene lógica de combate.

============================================================
*/

const PALARENAATAQUES = {

    A001: {
        codigo: "A001",
        nombre: "Ataque normal",
        tipo: "normal",
        dano_base: 20,
        precision: 95,
        critico: 5,
        efecto: null,
        descripcion: "Ataque básico de daño estándar."
    },

    A002: {
        codigo: "A002",
        nombre: "Golpe preciso",
        tipo: "preciso",
        dano_base: 18,
        precision: 100,
        critico: 10,
        efecto: null,
        descripcion: "Ataque preciso con una probabilidad ligeramente superior de crítico."
    },

    A003: {
        codigo: "A003",
        nombre: "Mordisco devastador",
        tipo: "mordisco",
        dano_base: 28,
        precision: 85,
        critico: 20,
        efecto: "E001",
        descripcion: "Ataque potente con elevada probabilidad de golpe crítico."
    },

    A004: {
        codigo: "A004",
        nombre: "Embestida",
        tipo: "embestida",
        dano_base: 24,
        precision: 90,
        critico: 8,
        efecto: "E003",
        descripcion: "Ataque contundente que puede reducir temporalmente la defensa."
    },

    A005: {
        codigo: "A005",
        nombre: "Ataque rápido",
        tipo: "rapido",
        dano_base: 15,
        precision: 95,
        critico: 8,
        efecto: "E006",
        descripcion: "Ataque rápido que puede aumentar temporalmente la iniciativa."
    },

    A006: {
        codigo: "A006",
        nombre: "Golpe pesado",
        tipo: "pesado",
        dano_base: 35,
        precision: 75,
        critico: 10,
        efecto: null,
        descripcion: "Ataque de gran potencia pero menor precisión."
    },

    A007: {
        codigo: "A007",
        nombre: "Ataque perforante",
        tipo: "perforante",
        dano_base: 23,
        precision: 90,
        critico: 8,
        efecto: "E007",
        descripcion: "Ataque que puede ignorar parte de la defensa del objetivo."
    },

    A008: {
        codigo: "A008",
        nombre: "Agarre",
        tipo: "agarre",
        dano_base: 17,
        precision: 85,
        critico: 5,
        efecto: "E004",
        descripcion: "Ataque que puede reducir temporalmente la movilidad del objetivo."
    },

    A009: {
        codigo: "A009",
        nombre: "Ataque venenoso",
        tipo: "veneno",
        dano_base: 14,
        precision: 90,
        critico: 5,
        efecto: "E005",
        descripcion: "Ataque que puede provocar daño progresivo durante varios turnos."
    },

    A010: {
        codigo: "A010",
        nombre: "Evasión ofensiva",
        tipo: "evasivo",
        dano_base: 16,
        precision: 90,
        critico: 5,
        efecto: "E002",
        descripcion: "Ataque que puede proporcionar una oportunidad de esquivar el siguiente ataque."
    }

};


/*
============================================================
FUNCIONES DE ACCESO
============================================================
*/

function obtenerAtaqueArena(codigo) {

    if (!codigo) {
        return null;
    }

    return PALARENAATAQUES[codigo] || null;
}


function obtenerTodosLosAtaquesArena() {

    return Object.values(PALARENAATAQUES);

}


function existeAtaqueArena(codigo) {

    return Object.prototype.hasOwnProperty.call(
        PALARENAATAQUES,
        codigo
    );

}


/*
============================================================
FIN PALARENAATAQUES
============================================================
*/
