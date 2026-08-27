async function comprobarImagenArena(ruta){
    return new Promise(function(resolve){
        const imagen=new Image();
        imagen.onload=function(){resolve(true);};
        imagen.onerror=function(){resolve(false);};
        imagen.src=ruta;
    });
}

async function obtenerMiniaturaArena(codigo,nombre){
    const partes=String(codigo).trim().split("_");
    const volumen=Number(partes[0]);
    const ficha=Number(partes[1]);

    if(volumen>=1&&volumen<=5&&ficha>=1&&ficha<=15){
        const excepciones=["001_12","002_04","003_14","004_14"];

        if(!excepciones.includes(String(codigo).trim())){
            const directorio=String(nombre).trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g,"")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g,"_")
                .replace(/^_+|_+$/g,"");

            const archivo=String(nombre).trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g,"")
                .replace(/[^a-zA-Z0-9]+/g,"_")
                .replace(/^_+|_+$/g,"");

            if(directorio&&archivo){
                const extensiones=[".png",".jpg",".jpeg",".webp"];

                for(const extension of extensiones){
                    const ruta="../../paleofichas/vol"+
                        partes[0]+"/"+codigo+"_"+directorio+"/"+
                        archivo+"_i3"+extension;

                    if(await comprobarImagenArena(ruta))
                        return ruta;
                }
            }
        }
    }

    if(
        window.BUSCARUTA&&
        typeof window.BUSCARUTA.buscar==="function"
    ){
        try{
            const resultado=await window.BUSCARUTA.buscar(codigo);

            if(resultado&&Array.isArray(resultado.imagenes)){
                const imagen=resultado.imagenes.find(
                    function(item){
                        return item&&
                            item.tipo==="i3"&&
                            item.estado==="ok"&&
                            item.ruta;
                    }
                );

                if(imagen)return imagen.ruta;
            }
        }catch(error){
            return null;
        }
    }

    return null;
}

function generarEstadisticasArena(datos){
    const estadisticas=[
        ["e1","Adaptabilidad"],["e2","Sociabilidad"],
        ["e3","Resistencia"],["e4","Reproducción"],
        ["e5","Ofensiva"],["e6","Defensa"],
        ["e7","Movilidad"],["e8","Plasticidad ecológica"],
        ["e9","Tamaño"],["e10","Velocidad"],
        ["e11","Inteligencia"]
    ];

    let html="";

    estadisticas.forEach(function(stat){
        html+=`
            <div class="stat">
                <span>${escaparHTML(stat[1])}</span>
                <span>${numeroArena(datos.estadisticas[stat[0]])}</span>
            </div>
        `;
    });

    return html;
}

function crearDatosCombatienteArena(codigo){
    const datos=window.PALARENA_DATOS.preparar(codigo);

    if(!datos)
        throw new Error("No se pudo preparar la Paleoficha "+codigo);

    return{
        codigo:datos.j1,
        nombre:obtenerNombreArena(datos.j1),
        modo:datos.modo,
        habitats:datos.habitats,
        estadisticas:datos.estadisticas
    };
}
