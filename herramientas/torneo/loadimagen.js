window.cargarImagenesCombatientesAsync = async function(codigo1, codigo2) {

    if (!window.BUSCARUTA) {
        return;
    }

    /*
    ========================================================
    FUNCIONES AUXILIARES
    ========================================================
    */

    function normalizarDirectorio(nombre) {

        return (
            String(nombre)
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
        );
    }


    function normalizarArchivo(nombre) {

        let texto =
            String(nombre)
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");

        if (!texto) {
            return "";
        }

        return (
            texto.charAt(0).toUpperCase() +
            texto.slice(1)
        );
    }


    function comprobarImagen(ruta) {

        return new Promise(resolve => {

            const imagen = new Image();

            imagen.onload = function() {
                resolve(true);
            };

            imagen.onerror = function() {
                resolve(false);
            };

            imagen.src = ruta;
        });
    }


    async function buscarImagenAntigua(j1, j2) {

        if (!j1 || !j2) {
            return null;
        }

        const partes = String(j1).split("_");

        if (partes.length !== 2) {
            return null;
        }

        /*
        La arquitectura antigua utiliza:

        paleofichas/
        vol005/
        005_09_uintatherium/
        Uintatherium_i3.png
        */

        const volumen =
            partes[0].padStart(3, "0");

        const directorio =
            normalizarDirectorio(j2);

        const archivo =
            normalizarArchivo(j2);

        if (!directorio || !archivo) {
            return null;
        }

        const extensiones = [
            ".png",
            ".jpg",
            ".jpeg",
            ".webp"
        ];

        for (const extension of extensiones) {

            const ruta =
                "../../paleofichas/" +
                "vol" +
                volumen +
                "/" +
                j1 +
                "_" +
                directorio +
                "/" +
                archivo +
                "_i3" +
                extension;

            const existe =
                await comprobarImagen(ruta);

            if (existe) {
                return ruta;
            }
        }

        return null;
    }


    async function obtenerImagenI3(codigo) {

        if (!codigo) {
            return null;
        }

        /*
        Primero se utiliza BUSCARUTA normalmente.
        Esto mantiene intactos:

        - excepciones
        - arquitectura nueva
        - rutas ya correctas
        */

        const resultado =
            await window.BUSCARUTA.buscar(codigo);

        const imagenI3 =
            resultado &&
            resultado.imagenes
                ? resultado.imagenes.find(
                    imagen => imagen.tipo === "i3"
                )
                : null;


        /*
        ====================================================
        CASO 2 — ARQUITECTURA ANTIGUA
        ====================================================

        buscaruta.js genera actualmente:

        vol5/

        pero la estructura real utiliza:

        vol005/

        Por eso solamente aquí hacemos la
        reconstrucción de la ruta.
        */

        if (
            resultado &&
            resultado.caso === "caso2" &&
            resultado.j2
        ) {

            /*
            Si BUSCARUTA ya encuentra la imagen,
            se conserva esa ruta.
            */

            if (
                imagenI3 &&
                imagenI3.ruta
            ) {
                return imagenI3.ruta;
            }


            /*
            Si BUSCARUTA no la encuentra,
            buscamos directamente en la estructura
            antigua correcta.
            */

            const rutaAntigua =
                await buscarImagenAntigua(
                    codigo,
                    resultado.j2
                );

            if (rutaAntigua) {
                return rutaAntigua;
            }

            return null;
        }


        /*
        ====================================================
        CASO 1 Y CASO 3
        ====================================================

        Se mantiene exactamente el comportamiento
        proporcionado por BUSCARUTA.
        */

        if (
            imagenI3 &&
            imagenI3.ruta
        ) {
            return imagenI3.ruta;
        }

        return null;
    }


    /*
    ========================================================
    CARGA COMBATIENTE 1
    ========================================================
    */

    try {

        if (codigo1) {

            const img1El =
                document.getElementById(
                    "c1Imagen"
                );

            const cont1El =
                img1El
                    ? img1El.closest(
                        ".contenedor-imagen-combatiente"
                    )
                    : null;


            const ruta1 =
                await obtenerImagenI3(
                    codigo1
                );


            if (
                img1El &&
                ruta1
            ) {

                img1El.src =
                    ruta1;

                img1El.style.display =
                    "block";

                if (cont1El) {

                    cont1El.style.display =
                        "block";
                }

            } else if (img1El) {

                img1El.src =
                    "";

                img1El.style.display =
                    "none";

                if (cont1El) {

                    cont1El.style.display =
                        "none";
                }
            }
        }


        /*
        ====================================================
        CARGA COMBATIENTE 2
        ====================================================
        */

        if (codigo2) {

            const img2El =
                document.getElementById(
                    "c2Imagen"
                );

            const cont2El =
                img2El
                    ? img2El.closest(
                        ".contenedor-imagen-combatiente"
                    )
                    : null;


            const ruta2 =
                await obtenerImagenI3(
                    codigo2
                );


            if (
                img2El &&
                ruta2
            ) {

                img2El.src =
                    ruta2;

                img2El.style.display =
                    "block";

                if (cont2El) {

                    cont2El.style.display =
                        "block";
                }

            } else if (img2El) {

                img2El.src =
                    "";

                img2El.style.display =
                    "none";

                if (cont2El) {

                    cont2El.style.display =
                        "none";
                }
            }
        }

    } catch (e) {

        console.warn(
            "No se pudieron cargar las imágenes i3:",
            e
        );
    }
};
