/*
========================================================
PalEntropía
CAB07.js
Generador de Paleofichas 1.1

FUNCIÓN:

- Recibe j1.
- Obtiene el registro completo desde master.csv.
- Normaliza j3.
- Guarda el registro en CONT07.
- Obtiene la geología mediante LEEPALGEO.
- Guarda TODA la geología en CONT07.
- Prepara la presentación visual.
- NO muestra códigos geológicos.
- Si hay más de 3 edades:
  "Del [primera] al [última]"
- Los datos internos permanecen completos.

========================================================
*/


window.CAB07 = {


    /* =====================================================
       NORMALIZAR J3
       ===================================================== */

    normalizarJ3(j3) {

        if (
            j3 === undefined ||
            j3 === null
        ) {

            return "";

        }


        const partes =
            String(j3)
                .trim()
                .split("-");


        if (
            partes.length !== 2
        ) {

            return String(j3).trim();

        }


        const normalizar =
            valor => {

                valor =
                    valor.trim();


                if (
                    !/^\d+\.\d{4}$/.test(
                        valor
                    )
                ) {

                    return valor;

                }


                const partes =
                    valor.split(".");


                return (
                    partes[0].padStart(
                        4,
                        "0"
                    )
                    +
                    "."
                    +
                    partes[1]
                );

            };


        return (
            normalizar(partes[0])
            +
            "-"
            +
            normalizar(partes[1])
        );

    },


    /* =====================================================
       FORMATEAR EDADES

       HASTA 3:
       muestra todas.

       MÁS DE 3:
       muestra solo el rango visual.

       IMPORTANTE:
       esto afecta únicamente a la presentación.

       CONT07 conserva todos los valores.
       ===================================================== */

    formatearEdades(edades) {

        if (
            !Array.isArray(edades)
        ) {

            return "—";

        }


        const lista =
            edades.filter(Boolean);


        if (
            !lista.length
        ) {

            return "—";

        }


        if (
            lista.length <= 3
        ) {

            return lista.join(
                ", "
            );

        }


        return (
            "Del "
            +
            lista[0]
            +
            " al "
            +
            lista[
                lista.length - 1
            ]
        );

    },


    /* =====================================================
       CREAR CONTENEDOR VISUAL
       ===================================================== */

    prepararContenedor() {

        let contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );


        if (
            contenedor
        ) {

            return contenedor;

        }


        contenedor =
            document.createElement(
                "div"
            );


        contenedor.id =
            "resultadoGeologiaCAB07";


        contenedor.style.margin =
            "12px auto";


        contenedor.style.padding =
            "10px";


        contenedor.style.maxWidth =
            "700px";


        contenedor.style.borderRadius =
            "10px";


        contenedor.style.fontSize =
            "13px";


        const cronologia =
            document.getElementById(
                "cronologia"
            );


        if (
            cronologia
        ) {

            cronologia.insertAdjacentElement(
                "afterend",
                contenedor
            );

        } else {


            const ficha =
                document.getElementById(
                    "ficha"
                );


            if (
                ficha
            ) {

                ficha.appendChild(
                    contenedor
                );

            } else {

                document.body.appendChild(
                    contenedor
                );

            }

        }


        return contenedor;

    },


    /* =====================================================
       MOSTRAR GEOLOGÍA

       SOLO PRESENTACIÓN.

       NO MUESTRA:

       - códigos geológicos

       SÍ MUESTRA:

       - período
       - edad / subperíodos

       ===================================================== */

    mostrarGeologia() {

        const contenedor =
            document.getElementById(
                "resultadoGeologiaCAB07"
            );


        if (
            !contenedor
        ) {

            return;

        }


        let geologia =
            null;


        if (
            window.CONT07 &&
            typeof window.CONT07.obtenerGeologia ===
            "function"
        ) {

            geologia =
                window.CONT07.obtenerGeologia();

        }


        if (
            !geologia
        ) {

            contenedor.innerHTML =
                `
                <strong>Geología</strong>
                <br>
                Sin datos geológicos.
                `;

            return;

        }


        const periodo =
            Array.isArray(
                geologia.periodo
            )
                ? geologia.periodo.filter(Boolean)
                : [];


        const edad =
            Array.isArray(
                geologia.edad
            )
                ? geologia.edad.filter(Boolean)
                : [];


        const textoPeriodo =
            periodo.length
                ? periodo.join(", ")
                : "—";


        const textoEdad =
            this.formatearEdades(
                edad
            );


        contenedor.innerHTML =
            `
            <strong>Geología</strong>

            <br><br>

            <strong>Período:</strong>
            ${textoPeriodo}

            <br><br>

            <strong>Edad:</strong>
            ${textoEdad}
            `;

    },


    /* =====================================================
       ACTUALIZAR PRESENTACIÓN

       ESTA ES LA FUNCIÓN QUE DEBE LLAMARSE DESPUÉS
       DE QUE CARGACONT TERMINE DE CONSTRUIR LA FICHA.

       Así evitamos que el refresco de la ficha borre
       la presentación de CAB07.
       ===================================================== */

    actualizarPresentacion() {

        this.prepararContenedor();

        this.mostrarGeologia();

    },


    /* =====================================================
       PROCESAR
       ===================================================== */

    async procesar(j1) {


        /* -------------------------------------------------
           COMPROBAR CARGADOR MASTER
           ------------------------------------------------- */

        if (
            typeof window.cargarMasterPorJ1 !==
            "function"
        ) {

            console.error(
                "CAB07: cargarMasterPorJ1 no está disponible."
            );

            return null;

        }


        /* -------------------------------------------------
           OBTENER REGISTRO
           ------------------------------------------------- */

        const datos =
            await window.cargarMasterPorJ1(
                j1
            );


        if (
            !datos
        ) {

            console.warn(
                "CAB07: No se encontró el registro:",
                j1
            );

            return null;

        }


        /* -------------------------------------------------
           NORMALIZAR J3
           ------------------------------------------------- */

        datos.j3 =
            this.normalizarJ3(
                datos.j3
            );


        /* -------------------------------------------------
           GUARDAR REGISTRO EN CONT07
           ------------------------------------------------- */

        if (
            window.CONT07 &&
            typeof window.CONT07.guardar ===
            "function"
        ) {

            window.CONT07.guardar(
                datos
            );

        } else {

            console.warn(
                "CAB07: CONT07 no está disponible."
            );

        }


        /* -------------------------------------------------
           OBTENER GEOLOGÍA
           ------------------------------------------------- */

        if (
            window.LEEPALGEO &&
            typeof window.LEEPALGEO.extraer ===
            "function"
        ) {

            try {

                const geologia =
                    window.LEEPALGEO.extraer(
                        datos.j3
                    );


                if (
                    geologia &&
                    window.CONT07 &&
                    typeof window.CONT07.guardarGeologia ===
                    "function"
                ) {

                    /*
                    IMPORTANTE:

                    Aquí se guarda TODO.

                    Incluye:
                    - codes
                    - periodo
                    - edad

                    Nada se elimina.
                    */

                    window.CONT07.guardarGeologia(
                        geologia
                    );

                }

            } catch (error) {

                console.warn(
                    "CAB07: Error al obtener datos geológicos.",
                    error
                );

            }

        } else {

            console.warn(
                "CAB07: LEEPALGEO no está disponible."
            );

        }


        /* -------------------------------------------------
           MOSTRAR CRONOLOGÍA PRINCIPAL
           ------------------------------------------------- */

        const cronologia =
            document.getElementById(
                "cronologia"
            );


        if (
            cronologia
        ) {

            cronologia.textContent =
                datos.j3 || "—";

        }


        /*
        IMPORTANTE:

        NO mostramos aquí la geología.

        CARGACONT todavía tiene que terminar de cargar
        CAB01-CAB06.

        La presentación se hará mediante:

        actualizarPresentacion()

        después de CARGACONT.
        */


        return datos;

    },

        /* =====================================================
       FIN DEL OBJETO CAB07
       ===================================================== */

};


/* =========================================================
   DISPONIBILIDAD GLOBAL
   ========================================================= */

window.CAB07 =
    CAB07;


/*
========================================================
FIN CAB07.js
========================================================
*/
