const RUTA_PALEOFICHAS="../generador_fase_2/paleofichas.json";
const RUTA_GENERADOR="../generador_fase_2/generador_fase_2.html";

let PALEOFICHAS_ARENA={};
let COMBATE_ARENA=null;

function escaparHTML(valor){
    if(valor===null||valor===undefined)return "";
    return String(valor)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

async function cargarPaleofichasArena(){
    const respuesta=await fetch(RUTA_PALEOFICHAS);
    if(!respuesta.ok)
        throw new Error("No se pudo cargar paleofichas.json");

    const fichas=await respuesta.json();

    if(!Array.isArray(fichas))
        throw new Error("paleofichas.json no contiene un array válido.");

    PALEOFICHAS_ARENA={};

    fichas.forEach(function(ficha){
        if(!ficha||!ficha.codigo)return;
        PALEOFICHAS_ARENA[String(ficha.codigo).trim()]=ficha;
    });

    return fichas.length;
}

function obtenerPaleofichaArena(codigo){
    return PALEOFICHAS_ARENA[String(codigo).trim()]||null;
}

function obtenerNombreArena(codigo){
    const ficha=obtenerPaleofichaArena(codigo);
    return ficha&&ficha.nombre
        ? ficha.nombre
        : "Nombre no disponible";
}

function obtenerDosFichasAleatoriasArena(){
    if(
        !window.PALARENA_DATOS||
        !window.PALARENA_DATOS.datos||
        !window.PALARENA_DATOS.datos.length
    ){
        throw new Error("No hay datos cargados en PALARENA_DATOS.");
    }

    const fichasValidas=window.PALARENA_DATOS.datos.filter(
        function(fila){
            return fila&&fila.j1&&obtenerPaleofichaArena(fila.j1);
        }
    );

    if(fichasValidas.length<2)
        throw new Error("No hay suficientes Paleofichas válidas.");

    const indice1=Math.floor(Math.random()*fichasValidas.length);
    let indice2=Math.floor(Math.random()*fichasValidas.length);

    while(indice2===indice1){
        indice2=Math.floor(Math.random()*fichasValidas.length);
    }

    return [fichasValidas[indice1],fichasValidas[indice2]];
}

function numeroArena(valor){
    const numero=Number(valor);
    return Number.isFinite(numero)?numero:0;
}
