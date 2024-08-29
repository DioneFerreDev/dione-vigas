let vigas = [];
// const { Draw } = require("./classes/Draw");
// const { Points } = require("./classes/Draw");
// const { TesteHover } = require("./classes/Draw");
// const { storeDraw } = require("./classes/Draw");
// const { Viga } = require("./classes/Viga");
// const { messageManager } = require("./classes/Draw");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .7;








document.addEventListener("DOMContentLoaded", playVigas());







function playVigas() {
  eventsBottom();


  document.getElementById("createViga").addEventListener("click", e => {
    let fx = document.getElementById("first-x").value;
    // let fy = document.getElementById("first-y").value;
    let fy = 0;
    let sx = document.getElementById("second-x").value;
    // let sy = document.getElementById("second-y").value;
    let sy = 0;



    const viga = new Viga({ x1: Number(fx), y1: Number(fy), x2: Number(sx), y2: Number(sy) });
    vigas.push(viga);
    console.log(vigas)
    new Draw(canvas, context, { x1: fx, y1: fy, x2: sx, y2: sy, id: viga.id });
    new storeDraw({ x1: fx, y1: fy, x2: sx, y2: sy, id: viga.id, type: "viga" });

    document.getElementById("first-x").value = sx;
    // document.getElementById("first-y").value = sy;
    document.getElementById("second-x").value = (sx - fx);
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


    })
    // Back
    document.querySelectorAll(".back").forEach(back => {
      back.addEventListener("click", e => {
        e.preventDefault();
        let wChange = document.querySelectorAll(".wrap-change")[0];
        let wBack = document.querySelectorAll(".wrap-back");

        showPannel("wrap-back", wChange, "none", "flex");
      })
    })

    // create points ao pressionar back do coordinates
    document.getElementById("createPoints").addEventListener("click", e => {
      console.log("voltou")
      if (vigas.length === 0) return;

      new Points(canvas, context, vigas);
    })

  }

  function resizeWindow() {
    canvas.height = window.innerHeight - document.getElementById("menu-vigas").clientHeight - 6;
  }
  function showPannel(desapear, show, styleDesapear, styleShow) {
    if (desapear === "wrap-back") {
      document.querySelectorAll(".wrap-back").forEach(objDesapear => objDesapear.style.display = styleDesapear)
    } else {
      let objDesapear = document.querySelectorAll("." + desapear)[0];
      objDesapear.style.display = styleDesapear;
    }

    show.style.display = styleShow;
    // resizeWindow();
  }


}