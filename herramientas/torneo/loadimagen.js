window.cargarImagenesCombatientesAsync = async function(codigo1, codigo2) {

    /*
    ========================================================
    PalEntropía
    loadimagen.js

    Cargador de imagen i3 para Arena estándar

    CASO 1
    Excepciones
    -> BUSCARUTA

    CASO 2
    Arquitectura antigua 001_01 -> 005_15
    -> búsqueda directa
    -> herramientas/generador/paleofichas.json
    -> paleofichas/volXXX/

    CASO 3
    Arquitectura nueva
    -> BUSCARUTA
    ========================================================
    */


    /*
    ========================================================
    VARIABLES
    ========================================================
    */

    let datosJSON = null;
    let cargandoJSON = null;


    /*
    ========================================================
    COMPROBAR IMAGEN
    ========================================================
    */

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


    /*
    ========================================================
    CARGAR PALEOFICHAS.JSON
    ========================================================
    */

    async function cargarJSON() {

        if (datosJSON) {
            return datosJSON;
        }

        if (cargandoJSON) {
            return cargandoJSON;
        }

        cargandoJSON =
            fetch(
                "../generador/paleofichas.json",
                {
                    cache: "default"
                }
            )
            .then(respuesta => {

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudo cargar herramientas/generador/paleofichas.json"
                    );
                }

                return respuesta.json();
            })
            .then(datos => {

                datosJSON = datos;

                return datos;
            })
            .catch(error => {

                cargandoJSON = null;

                throw error;
            });

        return cargandoJSON;
    }


    /*
    ========================================================
    BUSCAR REGISTRO
    ========================================================
    */

    function buscarRegistro(datos, j1) {

        if (!datos) {
            return null;
        }


        /*
        JSON EN FORMA DE ARRAY
        */

        if (Array.isArray(datos)) {

            for (const registro of datos) {

                if (
                    !registro ||
                    typeof registro !== "object"
                ) {
                    continue;
                }

                const codigo =
                    registro.j1 ||
                    registro.codigo;

                if (
                    codigo &&
                    String(codigo).trim() === j1
                ) {
                    return registro;
                }
            }

            return null;
        }


        /*
        JSON EN FORMA DE OBJETO
        */

        if (typeof datos === "object") {

            if (
                datos[j1] &&
                typeof datos[j1] === "object"
            ) {
                return datos[j1];
            }


            for (const clave of Object.keys(datos)) {

                const registro =
                    datos[clave];

                if (
                    !registro ||
                    typeof registro !== "object"
                ) {
                    continue;
                }

                const codigo =
                    registro.j1 ||
                    registro.codigo;

                if (
                    codigo &&
                    String(codigo).trim() === j1
                ) {
                    return registro;
                }
            }
        }

        return null;
    }


    /*
    ========================================================
    OBTENER J2
    ========================================================
    */

    async function obtenerJ2(j1) {

        const datos =
            await cargarJSON();

        const registro =
            buscarRegistro(
                datos,
                j1
            );

        if (!registro) {
            return null;
        }

        const j2 =
            registro.j2 ||
            registro.nombre;

        if (
            j2 === undefined ||
            j2 === null
        ) {
            return null;
        }

        return String(j2).trim();
    }


    /*
    ========================================================
    NORMALIZAR DIRECTORIO
    ========================================================
    */

    function normalizarDirectorio(nombre) {

        return (
            String(nombre)
            .trim()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "_"
            )
            .replace(
                /^_+|_+$/g,
                ""
            )
        );
    }


    /*
    ========================================================
    NORMALIZAR ARCHIVO
    ========================================================
    */

    function normalizarArchivo(nombre) {

        let texto =
            String(nombre)
            .trim()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-zA-Z0-9]+/g,
                "_"
            )
            .replace(
                /^_+|_+$/g,
                ""
            );

        if (!texto) {
            return "";
        }

        return (
            texto.charAt(0).toUpperCase() +
            texto.slice(1)
        );
    }


    /*
    ========================================================
    BUSCAR IMAGEN ARQUITECTURA ANTIGUA
    ========================================================
    */

    async function buscarImagenCaso2(
        j1,
        tipo
    ) {

        const j2 =
            await obtenerJ2(j1);

        if (!j2) {
            return null;
        }


        const partes =
            String(j1).split("_");

        if (partes.length !== 2) {
            return null;
        }


        /*
        MUY IMPORTANTE

        005
        y no

        5
        */

        const volumen =
            partes[0].padStart(
                3,
                "0"
            );


        const directorio =
            normalizarDirectorio(j2);

        const archivo =
            normalizarArchivo(j2);


        if (
            !directorio ||
            !archivo
        ) {
            return null;
        }


        const extensiones = [
            ".png",
            ".jpg",
            ".jpeg",
            ".webp"
        ];


        for (
            const extension
            of extensiones
        ) {

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
                "_" +
                tipo +
                extension;


            const existe =
                await comprobarImagen(
                    ruta
                );


            if (existe) {
                return ruta;
            }
        }


        return null;
    }


    /*
    ========================================================
    DETERMINAR SI ES CASO 2
    ========================================================
    */

    function esCaso2(j1) {

        if (
            !/^\d{3}_\d{2}$/.test(j1)
        ) {
            return false;
        }

        if (
            j1 === "001_12" ||
            j1 === "002_04" ||
            j1 === "003_14" ||
            j1 === "004_14"
        ) {
            return false;
        }

        const partes =
            j1.split("_");

        const volumen =
            Number(partes[0]);

        const ficha =
            Number(partes[1]);

        return (
            volumen >= 1 &&
            volumen <= 5 &&
            ficha >= 1 &&
            ficha <= 15
        );
    }


    /*
    ========================================================
    OBTENER RUTA I3
    ========================================================
    */

    async function obtenerRutaI3(j1) {

        j1 =
            String(j1)
            .trim()
            .toUpperCase();


        /*
        ====================================================
        CASO 2
        ====================================================

        NO UTILIZAMOS BUSCARUTA.

        Se busca directamente en la arquitectura
        antigua real.
        */

        if (esCaso2(j1)) {

            return await buscarImagenCaso2(
                j1,
                "i3"
            );
        }


        /*
        ====================================================
        CASO 1 Y CASO 3
        ====================================================

        BUSCARUTA sigue funcionando exactamente
        como hasta ahora.
        */

        const resultado =
            await window.BUSCARUTA.buscar(
                j1
            );


        if (
            resultado &&
            resultado.imagenes
        ) {

            const imagenI3 =
                resultado.imagenes.find(
                    imagen =>
                        imagen.tipo === "i3"
                );


            if (
                imagenI3 &&
                imagenI3.ruta
            ) {
                return imagenI3.ruta;
            }
        }


        return null;
    }


    /*
    ========================================================
    MOSTRAR / OCULTAR IMAGEN
    ========================================================
    */

    async function cargarImagen(
        codigo,
        idImagen
    ) {

        if (!codigo) {
            return;
        }


        const imagen =
            document.getElementById(
                idImagen
            );


        if (!imagen) {
            return;
        }


        const contenedor =
            imagen.closest(
                ".contenedor-imagen-combatiente"
            );


        const ruta =
            await obtenerRutaI3(
                codigo
            );


        if (ruta) {

            imagen.src =
                ruta;

            imagen.style.display =
                "block";

            if (contenedor) {

                contenedor.style.display =
                    "block";
            }

        } else {

            imagen.src =
                "";

            imagen.style.display =
                "none";

            if (contenedor) {

                contenedor.style.display =
                    "none";
            }
        }
    }


    /*
    ========================================================
    CARGAR COMBATIENTE 1
    ========================================================
    */

    try {

        await cargarImagen(
            codigo1,
            "c1Imagen"
        );


        /*
        ====================================================
        CARGAR COMBATIENTE 2
        ====================================================
        */

        await cargarImagen(
            codigo2,
            "c2Imagen"
        );

    } catch (error) {

        console.warn(
            "No se pudieron cargar las imágenes i3:",
            error
        );
    }
};
