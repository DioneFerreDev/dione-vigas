let vigas = [];
let forceChoose = "";
let data = {};
// const { Draw } = require("./classes/Draw1");
// const { Draw } = require("./classes/Draw");
const { Draw } = require("./classes/Draw2Z")
const { DrawDiagramas } = require("./classes/DrawDiagramas");
const { Element } = require("./classes/Element");
const { Ask } = require("./classes/Confirm");
const { Inercia } = require("./classes/Inercia");
const { AreaAco } = require("./classes/AreaAco");
const { CalcForces } = require("./classes/Calc");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .7;








document.addEventListener("DOMContentLoaded", playVigas());







function playVigas() {
    eventsBottom();
    const pencil = new Draw(canvas, context);
    pencil.allEvents();


    document.getElementById("createViga").addEventListener("click", e => {
        let fx = Number(document.getElementById("first-x").value);
        // let fy = Number(document.getElementById("first-y").value;
        let fy = 0;
        let sx = Number(document.getElementById("second-x").value);
        // let sy = Number(document.getElementById("second-y").value);
        let sy = 0;

        const viga = new Element({ x1: fx, x2: sx, y1: fy, y2: sy, type: "viga" });
        vigas.push(viga);
        // const newViga = new Draw(canvas, context, viga);
        pencil.drawViga(viga, false);

        document.getElementById("first-x").value = sx;
        // document.getElementById("first-y").value = sy;
        document.getElementById("second-x").value = ((sx - fx) + sx);
        // document.getElementById("second-y").value = (sy - fy);
    })


    function eventsBottom() {
        //call coordinates
        document.getElementById("call-coordinates").addEventListener("click", e => {
            e.preventDefault();
            let wCCoordinates = document.querySelectorAll(".wrap-coordinates")[0];

            showPannel("wrap-change", wCCoordinates, "none", "flex")
        })
        // call forces
        document.getElementById("call-forces").addEventListener("click", e => {
            e.preventDefault();

            let wCCoordinates = document.querySelectorAll(".wrap-force")[0];
            showPannel("wrap-change", wCCoordinates, "none", "flex")
        })
        // call shapes
        document.getElementById("call-shapes").addEventListener("click", e => {
            e.preventDefault();

            let wCCoordinates = document.querySelectorAll(".wrap-shapes")[0];
            showPannel("wrap-change", wCCoordinates, "none", "flex")
        })
        // call apoios
        document.getElementById("call-apoios").addEventListener("click", e => {
            e.preventDefault();
            let wCCoordinates = document.querySelectorAll(".wrap-apoios")[0];
            showPannel("wrap-change", wCCoordinates, "none", "flex");
            // programar o draw de pontos            
            pencil.changeEvent("apoios");
        })
        document.getElementById("choose-shape").addEventListener("click", e => {
            const classChoosed = e.target.value;
            const forms = document.querySelectorAll(".wrap-form-shape ");
            forms.forEach(form => form.classList.add("none"))

            let formShow = document.querySelectorAll("." + classChoosed)[0];
            formShow.classList.remove("none")
        })
        // Back
        document.querySelectorAll(".back").forEach(back => {
            back.addEventListener("click", e => {
                e.preventDefault();
                // console.log(e.target.id)
                let wChange = document.querySelectorAll(".wrap-change")[0];
                let wBack = document.querySelectorAll(".wrap-back");
                pencil.changeEvent("general");
                data = {};

                showPannel("wrap-back", wChange, "none", "flex");
            })
        })
        document.getElementById("calcular-armadura").addEventListener("click", e => {
            let title = document.getElementById("title-armadura");

            const data = pencil.returnElements();
            if (data.length === 0) return;

            const fApoios = new CalcForces(data);
            const forces = fApoios.forces();
            const pencilMomento = new DrawDiagramas(canvas, context, forces);
            let momentos = pencilMomento.calcMomento();

            let maxMomento = 0;
            let mkOriginal = 0;
            momentos.forEach(m => {
                let momento = m
                if (momento < 0) momento *= -1;
                if (momento > maxMomento) { maxMomento = momento; mkOriginal = m };
            });
            console.log(momentos);

            // const i = new Inercia({ d: 12, b: 11, tf: 2, tw: 2 }, "t-shape");
            const i = new Inercia({ d: 50, b: 50, tf: 10, tw: 10 }, "t-shape");
            console.log(i);

            let bitola = Number(document.getElementById("bitola").value);
            let cobrimento = Number(document.getElementById("cobrimento").value);
            let estribo = Number(document.getElementById("estribo").value);
            let ca = Number(document.getElementById("ca").value);
            let c = Number(document.getElementById("c").value);


            if (document.getElementById("choose-shape").value === "ret-shape") {
                title.innerHTML = "";
                let d = Number(document.getElementById("ret-d").value);
                let b = Number(document.getElementById("ret-b").value);
                // base, altura, cobrimento, estribo, bitola, fck, fcy, mk
                // const y = new AreaAco(20, 50, 4, 5, 12.5, 25, 50, 157);
                // const y = new AreaAco(18, 40, 3, 5, 10, 25, 50, 20.8);
                // console.log(18, 40, 3, 5, 10, 25, 50, 20.8)
                // console.log(b, d, cobrimento, estribo, bitola, c, ca, 20.8)
                let mk = (maxMomento < 0) ? maxMomento * (-1) : maxMomento;
                const y = new AreaAco(b, d, cobrimento, estribo, bitola, c, ca, mk);
                let msg = y.acharX();
                msg.forEach(info => {
                    let h3 = document.createElement("h3");
                    let br = document.createElement("br");
                    h3.innerHTML = info;
                    title.appendChild(h3)
                    title.appendChild(br);
                });
                title.innerHTML += `Obs: Mk de ${mkOriginal} KNm`
            }
        })

        // create points ao pressionar back do coordinates
        document.getElementById("createPoints").addEventListener("click", e => {
            if (vigas.length === 0) return;
        })
        // create apoios ao pressionar back do coordinates
        document.getElementById("createApoio").addEventListener("click", e => {
            const kind = document.getElementById("grau-apoio").value;
            const data = pencil.returnElement();
            pencil.createApoio(data.x, data.y, kind);
        })
        // Forces
        // Get free key forces voltar aqui        
        document.querySelectorAll(".btn-force").forEach(btn => {
            btn.addEventListener("click", e => {
                const awary = btn.classList.contains("force-choose");
                if (btn.id === "force-linear-inclinada") {
                    document.getElementById("force-y").removeAttribute("disabled", false);
                    document.getElementById("force-y2").removeAttribute("disabled", false);
                } else {
                    document.getElementById("force-y").removeAttribute("disabled");
                    document.getElementById("force-y2").setAttribute("disabled", true);
                }

                if (awary) {
                    btn.classList.remove("force-choose");
                    document.getElementById("force-y2").setAttribute("disabled", true);
                    document.getElementById("force-y").value = "";
                    document.getElementById("force-y2").value = "";
                    document.getElementById("force-y").setAttribute("disabled", true);
                    document.getElementById("force-y2").setAttribute("disabled", true);
                    return
                } else {
                    document.querySelectorAll(".btn-force").forEach(b => b.classList.remove("force-choose"))
                    forceChoose = btn.id;

                    btn.classList.add("force-choose");
                    const inputForceY = document.getElementById("force-y");
                    inputForceY.removeAttribute("disabled");
                }
            })
        })
        // calcular esforços , cisalhamento e momento fletor
        document.getElementById("calc").addEventListener("click", e => {
            e.preventDefault();
            const data = pencil.returnElements();
            // const apoios = data.filter(el => el.type === "apoio");
            const fApoios = new CalcForces(data);
            const pencilCis = new DrawDiagramas(canvas, context, fApoios.forces());
            pencilCis.diagCisa();

        });
        document.getElementById("calc-momento").addEventListener("click", e => {
            e.preventDefault();
            const data = pencil.returnElements();

            // const apoios = data.filter(el => el.type === "apoio");
            const fApoios = new CalcForces(data);
            const pencilMomento = new DrawDiagramas(canvas, context, fApoios.forces());
            pencilMomento.calcMomento();

        })

    }
    function showPannel(desapear, show, styleDesapear, styleShow) {
        if (desapear === "wrap-back") {
            document.querySelectorAll(".wrap-back").forEach(objDesapear => objDesapear.style.display = styleDesapear)
        } else {
            let objDesapear = document.querySelectorAll("." + desapear)[0];
            objDesapear.style.display = styleDesapear;
        }
        show.style.display = styleShow;
    }
}



