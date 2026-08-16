/*
========================================================
PalEntropía
stylecab10.css
CAB10 — ECOLOGÍA
Extensión visual de Style v2.1
========================================================
*/


/*=========================================================
LIGHTBOX ECOLOGÍA
=========================================================*/

#lightboxEcologia{

    position:fixed !important;

    top:0 !important;
    left:0 !important;

    width:100vw !important;
    height:100vh !important;

    padding:20px !important;

    background:rgba(0,0,0,.90) !important;

    z-index:999998 !important;

    display:flex !important;

    justify-content:center !important;
    align-items:center !important;

    box-sizing:border-box !important;

}


/*=========================================================
VENTANA ECOLOGÍA
=========================================================*/

#lightboxEcologia > div{

    position:relative;

    width:90%;

    max-width:700px;

    max-height:80vh;

    overflow:auto;

    padding:25px;

    background:#181a1c !important;

    color:#eee !important;

    border:2px solid #62d6ff;

    border-radius:18px;

    box-shadow:
        0 0 25px rgba(98,214,255,.35),
        0 10px 35px rgba(0,0,0,.45);

    text-align:center;

    box-sizing:border-box;

}


/*=========================================================
TÍTULO
=========================================================*/

#lightboxEcologia h2{

    margin-top:0;

    margin-bottom:20px;

    color:#62d6ff !important;

    text-align:center;

    font-size:28px;

}


/*=========================================================
TEXTO
=========================================================*/

#lightboxEcologia p{

    color:#aaa !important;

    font-size:16px;

    line-height:1.6;

}


/*=========================================================
BOTÓN CERRAR
=========================================================*/

#lightboxEcologia button{

    min-height:42px;

    padding:9px 20px;

    margin-top:18px;

    background:#1d9bf0 !important;

    color:#fff !important;

    border:1px solid #62d6ff;

    border-radius:22px;

    font-size:16px;

    font-weight:bold;

    cursor:pointer;

    box-shadow:
        0 0 10px rgba(98,214,255,.25);

    transition:
        background .25s,
        transform .15s,
        box-shadow .25s;

}


#lightboxEcologia button:hover{

    background:#62d6ff !important;

    color:#001018 !important;

    box-shadow:
        0 0 15px rgba(98,214,255,.42);

}


#lightboxEcologia button:active{

    transform:scale(.94);

}


/*=========================================================
SCROLL INTERNO
=========================================================*/

#lightboxEcologia > div::-webkit-scrollbar{

    width:10px;

}


#lightboxEcologia > div::-webkit-scrollbar-track{

    background:#151719;

    border-radius:10px;

}


#lightboxEcologia > div::-webkit-scrollbar-thumb{

    background:#62d6ff;

    border-radius:10px;

}


#lightboxEcologia > div::-webkit-scrollbar-thumb:hover{

    background:#00e5ff;

}


/*=========================================================
RESPONSIVE
=========================================================*/

@media (max-width:768px){

    #lightboxEcologia{

        padding:15px !important;

    }


    #lightboxEcologia > div{

        width:95%;

        max-height:85vh;

        padding:18px;

        border-radius:15px;

    }


    #lightboxEcologia h2{

        font-size:24px;

    }


    #lightboxEcologia p{

        font-size:15px;

    }


    #lightboxEcologia button{

        min-height:42px;

        padding:9px 18px;

        font-size:15px;

    }

}


/*=========================================================
FIN STYLECAB10.CSS
=========================================================*/
