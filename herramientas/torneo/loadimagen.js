window.cargarImagenesCombatientesAsync = async function(codigo1, codigo2) {
    if (!window.BUSCARUTA) { return; }

    try {
        if (codigo1) {
            const res1 = await window.BUSCARUTA.buscar(codigo1);
            alert(JSON.stringify(res1));
            const img1El = document.getElementById("c1Imagen");
            const cont1El = img1El ? img1El.closest(".contenedor-imagen-combatiente") : null;
            const imgI3_1 = res1 && res1.imagenes ? res1.imagenes.find(img => img.tipo === "i3") : null;

            if (img1El && imgI3_1 && imgI3_1.ruta) {
                img1El.src = imgI3_1.ruta;
                img1El.style.display = "block";
                if (cont1El) cont1El.style.display = "block";
            } else if (img1El) {
                img1El.src = "";
                img1El.style.display = "none";
                if (cont1El) cont1El.style.display = "none";
            }
        }

        if (codigo2) {
            const res2 = await window.BUSCARUTA.buscar(codigo2);
            const img2El = document.getElementById("c2Imagen");
            const cont2El = img2El ? img2El.closest(".contenedor-imagen-combatiente") : null;
            const imgI3_2 = res2 && res2.imagenes ? res2.imagenes.find(img => img.tipo === "i3") : null;

            if (img2El && imgI3_2 && imgI3_2.ruta) {
                img2El.src = imgI3_2.ruta;
                img2El.style.display = "block";
                if (cont2El) cont2El.style.display = "block";
            } else if (img2El) {
                img2El.src = "";
                img2El.style.display = "none";
                if (cont2El) cont2El.style.display = "none";
            }
        }
    } catch (e) {
        console.warn("No se pudieron cargar las imágenes i3:", e);
    }
};
