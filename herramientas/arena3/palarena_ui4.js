async function mostrarCombatienteArena(datos,n){
    const miniatura=await obtenerMiniaturaArena(datos.codigo,datos.nombre);
    const enlace=RUTA_GENERADOR+"?codigo="+encodeURIComponent(datos.codigo)+"&arena="+n;

    const habitatsHTML=datos.habitats
        .filter(c=>c&&c!=="H000")
        .map(c=>{
            const h=window.PALARENA_DATOS.obtenerHabitat(c);
            const nombre=h&&h.nombre?h.nombre:"";
            return `<div class="habitat"><strong>${escaparHTML(c)}</strong>${nombre?" — "+escaparHTML(nombre):""}</div>`;
        }).join("");

    const modo=window.PALARENA_DATOS.obtenerModo(datos.modo);
    const modoNombre=modo&&modo.nombre?modo.nombre:"";

    return `
        <div class="combatiente">
            ${miniatura?`<img class="miniaturaCombatiente" src="${escaparHTML(miniatura)}" alt="${escaparHTML(datos.nombre)}">`:""}
            <div class="nombre">🦖 ${escaparHTML(datos.nombre)}</div>
            <div class="codigoFicha">Código: ${escaparHTML(datos.codigo)}</div>
            <div class="seccion">
                <h3>🧬 Modo de vida</h3>
                <div class="dato">
                    <strong>${escaparHTML(datos.modo)}</strong>
                    ${modoNombre?" — "+escaparHTML(modoNombre):""}
                </div>
            </div>
            <div class="seccion">
                <h3>🏠 Hábitats</h3>
                ${habitatsHTML||'<div class="habitat">Ninguno</div>'}
            </div>
            <div class="seccion">
                <h3>📊 Estadísticas</h3>
                ${generarEstadisticasArena({estadisticas:datos.estadisticas})}
            </div>
            <a class="enlace" href="${escaparHTML(enlace)}" target="_blank" rel="noopener noreferrer">
                📖 Consultar Paleoficha
            </a>
        </div>
    `;
}

function mostrarPreparadosArena(c1,c2,b1,b2,escenario){
    document.getElementById("panelCombate").style.display="block";
    document.getElementById("panelResultadoCombate").style.display="none";

    document.getElementById("combatientesPreparados").innerHTML=`
        <div>
            <strong>${escaparHTML(c1.nombre)}</strong><br>
            ❤️ HP: ${numeroArena(c1.hp_max)}<br>
            ⚡ Iniciativa: ${numeroArena(c1.iniciativa)}
            <div class="seccion">
                <h3>✨ Bonificaciones</h3>
                ${generarBonificacionesArena(b1)}
            </div>
        </div>
        <hr>
        <div>
            <strong>${escaparHTML(c2.nombre)}</strong><br>
            ❤️ HP: ${numeroArena(c2.hp_max)}<br>
            ⚡ Iniciativa: ${numeroArena(c2.iniciativa)}
            <div class="seccion">
                <h3>✨ Bonificaciones</h3>
                ${generarBonificacionesArena(b2)}
            </div>
        </div>
    `;

    const panel=document.getElementById("escenarioCombate");

    if(panel&&escenario){
        const habitats=Array.isArray(escenario.habitats)
            ?escenario.habitats.map(c=>escaparHTML(c)).join(", ")
            :"—";

        const medios=Array.isArray(escenario.medios)
            ?escenario.medios.map(m=>m&&m.codigo?escaparHTML(m.codigo):"")
                .filter(Boolean).join(", ")
            :"—";

        panel.innerHTML=`
            <h3>🎲 Escenario</h3>
            <div>🏠 Hábitats: <strong>${habitats}</strong></div>
            <div>🧬 Modo: <strong>${escaparHTML(escenario.modo||"—")}</strong></div>
            <div>🌎 Medios: <strong>${medios}</strong></div>
        `;
    }
}

async function nuevoCombateArena(){
    try{
        const fichas=obtenerDosFichasAleatoriasArena();
        const datos1=crearDatosCombatienteArena(fichas[0].j1);
        const datos2=crearDatosCombatienteArena(fichas[1].j1);

        document.getElementById("codigo1").textContent=datos1.codigo;
        document.getElementById("codigo2").textContent=datos2.codigo;

        document.getElementById("resultado").innerHTML=
            await mostrarCombatienteArena(datos1,1)+
            await mostrarCombatienteArena(datos2,2);

        prepararCombateArena(datos1,datos2);

    }catch(error){
        console.error("Error generando nuevo combate:",error);
        document.getElementById("estado").innerHTML=
            `<span class="error">✗ ${escaparHTML(error.message)}</span>`;
    }
}

function resultadoArena(valor){
    if(valor===null||valor===undefined)return "";
    if(typeof valor==="string"||typeof valor==="number")
        return String(valor);

    if(typeof valor==="object"){
        if(valor.mensaje)return String(valor.mensaje);
        if(valor.texto)return String(valor.texto);
        if(valor.descripcion)return String(valor.descripcion);

        if(valor.dano!==undefined)
            return "Daño: "+numeroArena(valor.dano);

        if(valor.danio!==undefined)
            return "Daño: "+numeroArena(valor.danio);

        return JSON.stringify(valor);
    }

    return String(valor);
}

function mostrarHistorialArena(historial){
    return historial.map(function(turno){
        if(!turno)return "";

        if(turno.atacante&&turno.objetivo){
            let texto="Turno "+numeroArena(turno.turno)+
                " — "+turno.atacante+" → "+turno.objetivo;

            if(turno.accion)
                texto+=" — "+turno.accion;

            const resultado=resultadoArena(turno.resultado);

            if(resultado)
                texto+=" — "+resultado;

            return `<div class="turnoCombate">${escaparHTML(texto)}</div>`;
        }

        if(turno.tipo==="efecto"){
            let texto="Turno "+numeroArena(turno.turno)+
                " — Efecto sobre "+(turno.objetivo||"");

            const resultado=resultadoArena(turno.resultado);

            if(resultado)
                texto+=" — "+resultado;

            return `<div class="turnoCombate">${escaparHTML(texto)}</div>`;
        }

        return `
            <div class="turnoCombate">
                ${escaparHTML(resultadoArena(turno))}
            </div>
        `;
    }).join("");
}

function ejecutarCombateAutomaticoArena(){
    try{
        if(!COMBATE_ARENA)
            throw new Error("No hay un combate preparado.");

        COMBATE_ARENA=crearCombateArena(
            COMBATE_ARENA.combatiente1.datos,
            COMBATE_ARENA.combatiente2.datos
        );

        while(COMBATE_ARENA.estado!=="finalizado")
            ejecutarTurnoArena(COMBATE_ARENA);

        const resultado={
            ganador:COMBATE_ARENA.ganador,
            combatiente1:COMBATE_ARENA.combatiente1,
            combatiente2:COMBATE_ARENA.combatiente2,
            historial:COMBATE_ARENA.historial
        };

        document.getElementById("panelResultadoCombate").style.display="block";

        document.getElementById("ganadorCombate").innerHTML=`
            🏆 Ganador:
            <strong>${escaparHTML(resultado.ganador)}</strong>
        `;

        const hp1=numeroArena(resultado.combatiente1.hp);
        const hpMax1=numeroArena(resultado.combatiente1.hp_max);
        const hp2=numeroArena(resultado.combatiente2.hp);
        const hpMax2=numeroArena(resultado.combatiente2.hp_max);

        const porcentajeHp1=hpMax1>0
            ?Math.max(0,Math.min(100,(hp1/hpMax1)*100)):0;

        const porcentajeHp2=hpMax2>0
            ?Math.max(0,Math.min(100,(hp2/hpMax2)*100)):0;

        document.getElementById("estadoCombatientes").innerHTML=`
            <div class="combateFicha">
                <h3>${escaparHTML(resultado.combatiente1.nombre)}</h3>
                ❤️ HP: ${hp1} / ${hpMax1}
                <div class="barraHp">
                    <div class="barraHpInterior" style="width:${porcentajeHp1}%"></div>
                </div>
            </div>

            <div class="combateFicha">
                <h3>${escaparHTML(resultado.combatiente2.nombre)}</h3>
                ❤️ HP: ${hp2} / ${hpMax2}
                <div class="barraHp">
                    <div class="barraHpInterior" style="width:${porcentajeHp2}%"></div>
                </div>
            </div>
        `;

        document.getElementById("historialCombate").innerHTML=
            mostrarHistorialArena(resultado.historial);

    }catch(error){
        console.error("Error ejecutando combate:",error);

        document.getElementById("panelResultadoCombate").style.display="block";

        document.getElementById("ganadorCombate").innerHTML=`
            <span class="error">
                ❌ ${escaparHTML(error.message)}
            </span>
        `;
    }
}

function recibirSeleccionArena(){
    const seleccion=localStorage.getItem("palentropia_arena_seleccion");

    if(!seleccion)return null;

    try{
        const datos=JSON.parse(seleccion);

        if(!datos||!datos.arena||!datos.codigo)
            return null;

        localStorage.removeItem("palentropia_arena_seleccion");

        return datos;

    }catch(error){
        localStorage.removeItem("palentropia_arena_seleccion");
        return null;
    }
}

async function aplicarSeleccionArena(){
    const seleccion=recibirSeleccionArena();

    if(!seleccion||!COMBATE_ARENA)
        return false;

    const nuevosDatos=
        crearDatosCombatienteArena(seleccion.codigo);

    if(seleccion.arena==="1"){
        const datos2=COMBATE_ARENA.combatiente2.datos;

        document.getElementById("codigo1").textContent=nuevosDatos.codigo;

        document.getElementById("resultado").innerHTML=
            await mostrarCombatienteArena(nuevosDatos,1)+
            await mostrarCombatienteArena(datos2,2);

        prepararCombateArena(nuevosDatos,datos2);
        return true;
    }

    if(seleccion.arena==="2"){
        const datos1=COMBATE_ARENA.combatiente1.datos;

        document.getElementById("codigo2").textContent=nuevosDatos.codigo;

        document.getElementById("resultado").innerHTML=
            await mostrarCombatienteArena(datos1,1)+
            await mostrarCombatienteArena(nuevosDatos,2);

        prepararCombateArena(datos1,nuevosDatos);
        return true;
    }

    return false;
}

async function iniciarArena(){
    try{
        document.getElementById("estado").innerHTML=
            "⏳ Cargando datos...";

        await cargarPaleofichasArena();

        const cargado=
            await window.PALARENA_DATOS.cargar();

        if(!cargado)
            throw new Error("No se pudo cargar master.csv");

        document.getElementById("estado").innerHTML=`
            <span class="ok">
                ✓ Paleofichas cargadas correctamente
            </span>
        `;

        nuevoCombateArena();

    }catch(error){
        console.error("Error iniciando Arena:",error);

        document.getElementById("estado").innerHTML=`
            <span class="error">
                ✗ ${escaparHTML(error.message)}
            </span>
        `;
    }
}

document.getElementById("btnNuevo")
    .addEventListener("click",nuevoCombateArena);

document.getElementById("btnEjecutarCombate")
    .addEventListener("click",ejecutarCombateAutomaticoArena);

iniciarArena();

setInterval(async function(){
    try{
        await aplicarSeleccionArena();
    }catch(error){
        console.error(
            "Error aplicando selección desde visor:",
            error
        );
    }
},500);
