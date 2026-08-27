function generarBonificacionesArena(bonificacion){
    if(!bonificacion)
        return `<div class="bonificacion">Sin bonificaciones</div>`;

    let html="";

    const habitats=Number(bonificacion.habitats)||0;

    if(habitats>0){
        html+=`
            <div class="bonificacion">
                🏠 Hábitats: <strong>+${habitats}</strong>
            </div>
        `;
    }

    if(bonificacion.modo===true){
        html+=`
            <div class="bonificacion">
                🧬 Modo de vida: <strong>✓ Coincide</strong>
            </div>
        `;
    }

    const bonificacionMedios=
        Number(bonificacion.bonificacionMedios)||0;

    const coincidenciasMedios=
        Number(bonificacion.medios?.coincidencias)||0;

    if(bonificacionMedios>0||coincidenciasMedios>0){
        html+=`
            <div class="bonificacion">
                🌎 Medios ecológicos:
                <strong>${coincidenciasMedios} coincidencia(s)</strong>
                ${bonificacionMedios>0
                    ?` — +${bonificacionMedios}`
                    :""
                }
            </div>
        `;
    }

    return html||`
        <div class="bonificacion">
            Sin bonificaciones
        </div>
    `;
}

function prepararCombateArena(datos1,datos2){
    try{
        if(typeof crearCombatienteArena!=="function")
            throw new Error("palarena.js no está cargado correctamente.");

        let escenario=null;
        let bonificacion1=null;
        let bonificacion2=null;

        if(window.PALARENA_ESCENARIO){
            escenario=window.PALARENA_ESCENARIO.generar();

            const resultado1=
                window.PALARENA_ESCENARIO.evaluar(datos1.codigo);

            if(resultado1)
                bonificacion1=resultado1.bonificacion;

            const resultado2=
                window.PALARENA_ESCENARIO.evaluar(datos2.codigo);

            if(resultado2)
                bonificacion2=resultado2.bonificacion;
        }

        const datosCombate1={
            ...datos1,
            j1:datos1.codigo,
            j2:datos1.nombre,
            ...datos1.estadisticas
        };

        const datosCombate2={
            ...datos2,
            j1:datos2.codigo,
            j2:datos2.nombre,
            ...datos2.estadisticas
        };

        if(window.PALARENA_BONIFICACIONES){
            const statsBase1=obtenerStatsArena(datosCombate1);
            const statsBase2=obtenerStatsArena(datosCombate2);

            const statsModificados1=
                window.PALARENA_BONIFICACIONES.aplicar(
                    statsBase1,bonificacion1
                );

            const statsModificados2=
                window.PALARENA_BONIFICACIONES.aplicar(
                    statsBase2,bonificacion2
                );

            if(statsModificados1)
                aplicarStatsArena(datosCombate1,statsModificados1);

            if(statsModificados2)
                aplicarStatsArena(datosCombate2,statsModificados2);
        }

        const combatiente1=
            crearCombatienteArena(datosCombate1);

        const combatiente2=
            crearCombatienteArena(datosCombate2);

        COMBATE_ARENA=
            crearCombateArena(datosCombate1,datosCombate2);

        COMBATE_ARENA.combatiente1.bonificacion_escenario=bonificacion1;
        COMBATE_ARENA.combatiente2.bonificacion_escenario=bonificacion2;

        mostrarPreparadosArena(
            combatiente1,
            combatiente2,
            bonificacion1,
            bonificacion2,
            escenario
        );

    }catch(error){
        console.error("Error preparando combate:",error);

        const estado=document.getElementById("estado");

        if(estado){
            estado.innerHTML=`
                <span class="error">
                    ✗ ${escaparHTML(error.message)}
                </span>
            `;
        }
    }
}

function aplicarStatsArena(datos,stats){
    datos.e1=stats.adaptabilidad;
    datos.e2=stats.sociabilidad;
    datos.e3=stats.resistencia;
    datos.e4=stats.reproduccion;
    datos.e5=stats.ofensiva;
    datos.e6=stats.defensa;
    datos.e7=stats.movilidad;
    datos.e8=stats.plasticidad;
    datos.e9=stats.tamano;
    datos.e10=stats.velocidad;
    datos.e11=stats.inteligencia;
}
