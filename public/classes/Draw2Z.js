// https://www.tiktok.com/@vitorinha051
// https://xfantazy.com/video/6394b639f1977b2d7f337bd4

const { Ask } = require("./Confirm");
const forceColor = "rgb(80,80,80)";
const round = 1;


class Draw {

    static elements = [];
    static elementId = 0;
    static typeEvent = "";
    static elSelected = {};
    static globalScale = 1;
    static SCROLL_SENSITIVITY = 0.00005;
    static cameraZoom = 1;
    static lastCameraZoom = 1;
    static MAX_ZOOM = 1.5;
    static MIN_ZOOM = 0.5;
    static lastCameraOffset = { x: 0, y: 0 };

    constructor(canvas, context, data = null) {
        // this.cameraOffset = { x: window.innerWidth * 0.1, y: (window.innerHeight / 2 * 1.1) }
        this.cameraOffset = { x: 0, y: 0 }
        this.isDragging = false
        this.dragStart = { x: 0, y: 0 }
        this.initialPinchDistance = null
        this.lastZoom = this.cameraZoom
        this.canvas = canvas;
        // this.canvas.width = this.canvas.width * 10
        this.canvas.width = 8500
        console.log("passou aqui"+this.canvas.width)
        this.context = context;
        this.momentos = [];
        if (data !== null) {
            this.data = data.data;
            this.data.idCanvas = Draw.elementId;
            Draw.elementId++;
            // Draw.elements.push(this.data);
            this.id = data.id;
            this.screenWidth = this.canvas.width;
            this.screenHeight = this.canvas.height;
            this.translate(this.data.x1, this.data.y1, this.data.x2, this.data.y2);
            // this.context.translate(this.screenWidth * .1, (this.screenHeight / 2) * 1.1)
        }
    }
    changeEvent(message) {
        Draw.typeEvent = message;
    }
    translate(x1, y1, x2 = null, y2 = null) {
        x2 === null ? 0 : x2
        y2 === null ? 0 : y2

        this.screenWidth = this.canvas.width;
        this.screenHeight = this.canvas.height;
        this.scaleFactor = this.screenWidth / 22;
        this.scaleFactor = this.scaleFactor /10
        this.x1 = this.rePosCoordinateX(x1, this.scaleFactor);
        this.y1 = this.rePosCoordinateY(y1, this.scaleFactor);
        this.x2 = this.rePosCoordinateX(x2, this.scaleFactor);
        this.y2 = this.rePosCoordinateY(y2, this.scaleFactor);
        console.log(this.x1, this.y1)
    }
    drawViga(data) {
        this.data = data.data;
        this.data.idCanvas = Draw.elementId;
        Draw.elementId++;
        this.id = data.id;
        this.translate(this.data.x1, this.data.y1, this.data.x2, this.data.y2);

        let viga = new Path2D();
        this.context.strokeStyle = "green";
        this.context.fillStyle = "green";
        this.context.lineWidth = 2;
        viga.moveTo(this.x1, this.y1);
        viga.lineTo(this.x2, this.y2);
        viga.closePath();
        this.context.fill(viga)
        this.context.stroke(viga);
        this.data.elCanvas = viga;
        Draw.elements.push(this.data);
        this.createPoint();
    }
    reDraw() {
        // console.log(Draw.elements)
        // this.context.translate((this.screenWidth * 0.1), (this.screenHeight / 2) * 1.1);
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
        if (Draw.lastCameraOffset.x !== this.cameraOffset.x || Draw.lastCameraOffset.y !== this.cameraOffset.y) {
            console.log("dife")
            this.context.translate(0 + this.cameraOffset.x-Draw.lastCameraOffset.x , 0 + this.cameraOffset.y-Draw.lastCameraOffset.y);
            Draw.lastCameraOffset = { x: this.cameraOffset.x, y: this.cameraOffset.y };
        }
        if (Draw.lastCameraZoom !== Draw.cameraZoom) {
            let z = (Draw.cameraZoom > Draw.lastCameraZoom) ? 1.025 : 1 - 0.025;

            console.log(this.cameraOffset)

            this.context.scale(z, z);
            this.context.translate(0, 0);
            console.log(Draw.cameraZoom)
            Draw.lastCameraZoom = Draw.cameraZoom;
        }
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);

        const selectedColor = "red";
        const Texts = Draw.elements.filter(el => el.type === "text");
        const TextsDiags = Draw.elements.filter(el => el.type === "text-diag");
        const setas = Draw.elements.filter(el => el.type === "seta");

        if (TextsDiags.length === 0) {
            setas.forEach(seta => {
                this.context.lineWidth = 1;
                this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== seta.idCanvas) ? forceColor : selectedColor;
                this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== seta.idCanvas) ? forceColor : selectedColor;

                this.context.stroke(seta.elCanvas);
                this.context.fill(seta.elCanvas);
            });
            Texts.forEach(txt => {
                this.context.font = 'normal 10px Arial';
                this.context.lineWidth = 1;
                this.context.fillStyle = forceColor;
                this.context.strokeStyle = forceColor;

                this.context.strokeText(txt.force, txt.x, txt.y);
            })
            TextsDiags.forEach(txt => {
                this.context.font = 'normal 10px Arial';
                this.context.lineWidth = 1;
                this.context.fillStyle = "red";
                this.context.strokeStyle = "red";

                this.context.strokeText(txt.force, txt.x, txt.y);
            })
            Draw.elements.forEach(el => {
                if (el.type === "force-momento") {
                    this.context.lineWidth = 2.5;
                    // this.context.fillStyle = "white";
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;

                    this.context.stroke(el.elCanvas);
                    // this.context.fill(el.elCanvas);
                } else if (el.type === "force-linear-inclinada") {
                    this.context.lineWidth = 1;
                    // this.context.fillStyle = "white";
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;

                    this.context.stroke(el.elCanvas);
                    // this.context.fill(el.elCanvas);
                } else if (el.type === "force-pontual") {
                    this.context.lineWidth = 2;
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;

                    this.context.stroke(el.elCanvas);
                    this.context.fill(el.elCanvas);
                } else if (el.type === "force-linear") {
                    this.context.lineWidth = 1;
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? forceColor : selectedColor;;

                    this.context.stroke(el.elCanvas);
                    this.context.fill(el.elCanvas);

                } else if (el.type === "apoio") {
                    //desenhar os apoios
                    this.context.lineWidth = 2;
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "blue" : selectedColor;;
                    this.context.fillStyle = "white";

                    this.context.stroke(el.elCanvas);
                    this.context.fill(el.elCanvas);
                } else if (el.type === "viga") {
                    // desenhar a viga               
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.lineWidth = 2;

                    this.context.stroke(el.elCanvas);
                    this.context.fill(el.elCanvas);
                } else if (el.type === "point") {
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.fillStroke = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.lineWidth = 3;

                    this.context.fill(el.elCanvas);
                    // this.context.stroke(el.elCanvas);
                } else if (el.type === "diagrama-cisalhamento") {
                    // desenhar a viga               
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "red" : selectedColor;;
                    this.context.lineWidth = 1;

                    // this.context.stroke(el.elCanvas);
                }
            })
        } else {
            setas.forEach(seta => {
                this.context.lineWidth = 1;
                this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== seta.idCanvas) ? forceColor : selectedColor;
                this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== seta.idCanvas) ? forceColor : selectedColor;

                this.context.stroke(seta.elCanvas);
                this.context.fill(seta.elCanvas);
            });

            TextsDiags.forEach(txt => {
                this.context.font = 'normal 10px Arial';
                this.context.lineWidth = 1;
                this.context.fillStyle = "red";
                this.context.strokeStyle = "red";

                this.context.strokeText(txt.force, txt.x, txt.y);
            })
            Draw.elements.forEach(el => {
                if (el.type === "apoio") {
                    //desenhar os apoios
                    this.context.lineWidth = 2;
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "blue" : selectedColor;;
                    this.context.fillStyle = "white";

                    this.context.stroke(el.elCanvas);
                    this.context.fill(el.elCanvas);
                } else if (el.type === "viga") {
                    // desenhar a viga               
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.lineWidth = 2;

                    this.context.stroke(el.elCanvas);
                    this.context.fill(el.elCanvas);
                } else if (el.type === "point") {
                    this.context.fillStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.fillStroke = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "green" : selectedColor;;
                    this.context.lineWidth = 3;

                    this.context.fill(el.elCanvas);
                    // this.context.stroke(el.elCanvas);
                } else if (el.type === "diagrama-cisalhamento" || el.type === "diagrama-momento") {
                    // desenhar a viga               
                    this.context.strokeStyle = (!Draw.elSelected || Draw.elSelected.idCanvas !== el.idCanvas) ? "red" : selectedColor;;
                    this.context.lineWidth = 1;

                    this.context.stroke(el.elCanvas);
                }
            })
        }


        requestAnimationFrame(this.reDraw.bind(this))
    }
    diagCisa(forces) {
        Draw.elements = Draw.elements.filter(el => el.type !== "text-diag");
        this.forces = forces;        
        const points = Draw.elements.filter(el => el.type === "point");
        points.sort((a, b) => { return a.x - b.x });
        this.localForces = [];
        let currentForce = 0;

        // passar para local forces todas as forces
        for (let i = 0; i < points.length; i++) {
            const currentX = points[i].x;

            // verificando se há forcas lineares
            const forcesLineares = this.forces.filter(f => f.type === "force-linear" && f.x2 === currentX);
            if (forcesLineares.length > 0) {
                let firstX = 0;
                forcesLineares.forEach(linear => {
                    currentForce += linear.force * Math.abs(linear.x2 - linear.x1);
                    firstX = linear.x1
                });
                this.localForces.push({ type: "force-linear", x: firstX, x2: currentX, force: currentForce })
            }
            // verificando se há forcas lineares inclinadas
            const forcesLinInclinadas = this.forces.filter(f => f.type === "force-linear-inclinada" && f.x2 === currentX);
            if (forcesLinInclinadas.length > 0) {
                let firstX = 0;
                let fVariante = 0;
                let fConstante = 0;
                let isGrowing = true;
                forcesLinInclinadas.forEach(inclinada => {
                    const vao = Math.abs(inclinada.x2 - inclinada.x1);
                    fVariante = inclinada.fVariante;
                    fConstante = inclinada.fConstante;
                    fVariante = fVariante - fConstante;
                    currentForce += fVariante * vao / 2;
                    currentForce += fConstante * vao;
                    firstX = inclinada.x1
                    isGrowing = inclinada.isGrowing;
                    fConstante = Number(fConstante.toFixed(round));
                    fVariante = Number(fVariante.toFixed(2));
                });
                this.localForces.push({
                    type: "force-linear-inclinada", x: firstX, x2: currentX, force: currentForce,
                    fConstante, fVariante, isGrowing
                })
            }

            // verificando se há forcas pontuais
            const forcesPontuais = this.forces.filter(f => f.type === "force-pontual" && f.x === currentX);
            if (forcesPontuais.length > 0) {
                forcesPontuais.forEach(pontual => { currentForce += pontual.force });
                this.localForces.push({ type: "force-pontual", x: currentX, force: currentForce });
            }
        }

        let fMax = 0;
        this.localForces.forEach(f => {
            if (fMax < f.force) fMax = f.force
        });
        this.translate(0, 0);
        const cis = new Path2D();
        this.context.strokeStyle = "red";
        this.context.lineWidth = 1;
        cis.moveTo(this.x1, this.y1);
        let hCis = 0;
        let lastY = 0;
        const scale = 60;

        // agora desenhando o dig cisalhamento        
        for (let i = 0; i < points.length; i++) {
            const currentX = points[i].x;
            const pontuais = this.localForces.filter(pontual => pontual.type === "force-pontual" && pontual.x === currentX);
            const lineares = this.localForces.filter(linear => linear.type === "force-linear" && linear.x === currentX);
            const inclinadas = this.localForces.filter(inclinada => inclinada.type === "force-linear-inclinada" && inclinada.x === currentX);
            let localForce = 0;

            if (pontuais.length > 0) {
                const pontual = pontuais[0];
                this.translate(currentX, 0);
                localForce = pontual.force;
                localForce = Number(localForce.toFixed(round));
                lastY = localForce;
                hCis = this.forcePixel(localForce, fMax, scale);
                cis.lineTo(this.x1, this.y1 + hCis);
                this.textForce(localForce, this.x1, this.y1 + hCis, true);
            }
            if (inclinadas.length > 0) {
                const inclinada = inclinadas[0];
                const lastLForce = lastY;
                const isGrowing = inclinada.isGrowing;
                localForce = inclinada.force;
                lastY = localForce;
                localForce = Number(localForce.toFixed(round));
                this.translate(currentX, 0);

                hCis = this.forcePixel(localForce, fMax, scale);
                const lastCis = this.forcePixel(lastLForce, fMax, scale);
                this.translate(currentX, 0, inclinada.x2, 0);
                let x1 = this.x1;
                let x2 = this.x2;
                let y1 = this.y1 + lastCis;
                let y2 = this.y2 + hCis;

                // calcular hipotenusa;
                const larg = Math.abs(x2 - x1);
                const alt = Math.abs(y2 - y1);
                const hipotenusa = Math.hypot(larg, alt);

                // calculando cosseno e seno
                const cos = larg / hipotenusa
                const sen = alt / hipotenusa

                // deslocamento para o centro da hipotenusa
                // mudar o a porcentagem aqui para ajuste se ne cessário
                const halfHipotenusa = hipotenusa / 2;
                let xCentro = cos * halfHipotenusa;
                let yCentro = sen * halfHipotenusa;

                xCentro += x1;
                yCentro = yCentro + y1;

                // deslocamento final para a profundidade do raio
                const profRaio = (hipotenusa) * 0.12;
                xCentro = (isGrowing === true) ? xCentro + (sen * profRaio) : xCentro - (sen * profRaio);
                yCentro = (isGrowing === true) ? yCentro - (cos * profRaio) : yCentro + (cos * profRaio);
                cis.quadraticCurveTo(xCentro, yCentro, x2, y2);

                cis.moveTo(x2, this.y1);
                cis.lineTo(x2, y2)

                // const centro = new Path2D();
                // centro.arc(xCentro, yCentro, 5, 0, 2 * Math.PI);
                // this.context.fillStyle = "orange"
                // this.context.fill(centro);

                this.textForce(localForce, this.x2, this.y1 + hCis, true);
            } else if (lineares.length > 0) {
                const linear = lineares[0];
                this.translate(currentX, 0, linear.x2, 0);
                localForce = linear.force;
                lastY = localForce;
                localForce = Number(localForce.toFixed(round));
                hCis = this.forcePixel(localForce, fMax, scale);
                cis.lineTo(this.x2, this.y1 + hCis);
                cis.moveTo(this.x2, this.y1);
                cis.lineTo(this.x2, this.y1 + hCis);
                this.textForce(localForce, this.x2, this.y1 + hCis, true);
            } else if (lineares.length === 0 && pontuais.length > 0 && i < points.length - 1 && inclinadas.length === 0) {
                const nextX = points[i + 1].x
                this.translate(points[i].x, 0, nextX, 0);
                cis.lineTo(this.x2, this.y1 + hCis);
                cis.moveTo(this.x2, this.y1);
                cis.lineTo(this.x2, this.y1 + hCis);
            } else if (lineares.length == 0 && pontuais.length === 0 && i < points.length - 1 && inclinadas.length === 0) {
                const nextX = points[i + 1].x
                this.translate(points[i].x, 0, nextX, 0);
                cis.lineTo(this.x2, this.y1 + hCis);
            }
        }
        Draw.elements = Draw.elements.filter(el => el.type !== "diagrama-cisalhamento");
        Draw.elements = Draw.elements.filter(el => el.type !== "diagrama-momento");
        let elCis = { elCanvas: cis, type: "diagrama-cisalhamento" }
        Draw.elements.push(elCis)
        // this.context.stroke(cis);
        // this.diaMomento(points)
        console.log(cis)
    }
    forcePixel(force, mx, scale) {
        return (force * scale * (-1)) / mx

    }
    calcArea(geometrics, points) {
        let areas = [];
        geometrics.forEach(geo => {
            let type = "";
            if (geo.y1 === geo.y2) {
                // area quadratica                
                type = "force-pontual";
            } else if (geo.inclinada === false) {
                type = "force-linear";
            } else {
                type = "force-linear-inclinada";
            }

            if (geo.mixed !== true) {
                const area = this.localMomento(geo.x2);
                areas.push({ type: type, mixed: geo.mixed, x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2, area });
            }
        })
        return areas;
    }
    localMomento(eixo) {
        let momento = 0;
        const noVerify = eixo;

        // pontual
        const pontuais = this.forces.filter(f => f.type === "force-pontual" && f.x <= noVerify);
        if (pontuais.length > 0) {
            pontuais.forEach(pontual => {
                const braco = eixo - pontual.x;
                const forcePontual = pontual.force;
                momento += forcePontual * braco;
            })
        }

        // linear
        const lineares = this.forces.filter(f => f.type === "force-linear" && f.x1 < noVerify);
        if (lineares.length > 0) {
            lineares.forEach(linear => {
                const x1 = linear.x1;
                const x2 = (linear.x2 < eixo) ? linear.x2 : eixo;
                const vao = Math.abs(x2 - x1);
                const pontoForce = (x1 + vao / 2)
                const braco = (eixo - pontoForce)
                const forcePontual = linear.force * vao;
                momento += forcePontual * braco;
            })

        }

        // linear inclinada
        const inclinadas = this.forces.filter(f => f.type === "force-linear-inclinada" && f.x1 < noVerify);
        if (inclinadas.length > 0) {
            inclinadas.forEach(inclinada => {
                const x1 = inclinada.x1;
                const x2 = (inclinada.x2 < eixo) ? inclinada.x2 : eixo;
                const vao = Math.abs(x2 - x1);

                //calc a parte da constante
                const forceConstante = inclinada.fConstante;
                const fPontualConstante = forceConstante * vao;
                const pontoForce = (vao / 2) + x1;
                const braco = eixo - pontoForce;
                momento += fPontualConstante * braco;

                // calc a parte da variante em relação ao vao, assim fazendo a semelhança de triangulos
                const forceVariante = inclinada.fVariante - inclinada.fConstante;
                const vaoOriginal = Math.abs(inclinada.x2 - inclinada.x1);
                const h = (forceVariante * vao) / vaoOriginal;
                const fPontualVariante = (vao * h) / 2;
                const isGrowing = inclinada.isGrowing;
                const pontoForceVariante = (isGrowing) ? x1 + (vao / 3) * 2 : x1 + (vao / 3);
                const bracoVariante = eixo - pontoForceVariante;
                momento += fPontualVariante * bracoVariante;
            });

        }
        momento = Number(momento.toFixed(round))
        return momento;
    }
    calcMomento(forces) {
        this.forces = forces;
        const points = Draw.elements.filter(el => el.type === "point");
        points.sort((a, b) => { return a.x - b.x });
        this.localForces = [];
        let currentForce = 0;

        // passar para local forces todas as forces
        for (let i = 0; i < points.length; i++) {
            const currentX = points[i].x;

            // verificando se há forcas lineares
            const forcesLineares = this.forces.filter(f => f.type === "force-linear" && f.x2 === currentX);
            if (forcesLineares.length > 0) {
                let firstX = 0;
                forcesLineares.forEach(linear => {
                    currentForce += linear.force * Math.abs(linear.x2 - linear.x1);
                    firstX = linear.x1
                });
                this.localForces.push({ type: "force-linear", x: firstX, x2: currentX, force: currentForce })
            }
            // verificando se há forcas inclinadas
            const forcesInclinadas = this.forces.filter(f => f.type === "force-linear-inclinada" && f.x2 === currentX);
            if (forcesInclinadas.length > 0) {
                let firstX = 0;
                let isGrowing = true;
                let variante = 0;
                let constante = 0;
                let pTotal = 0;
                let vao = 0;
                forcesInclinadas.forEach(inclinada => {
                    constante = inclinada.fConstante;
                    variante = inclinada.fVariante - constante;
                    vao = Math.abs(inclinada.x2 - inclinada.x1);
                    isGrowing = inclinada.isGrowing;
                    currentForce += constante * vao;
                    currentForce += variante * vao / 2;
                    currentForce = Number(currentForce.toFixed(round));
                    firstX = inclinada.x1
                    pTotal += (constante * vao) + (variante * vao / 2);
                });
                this.localForces.push({ type: "force-linear-inclinada", x: firstX, x2: currentX, force: currentForce, isGrowing, variante, constante, pTotal, vao });
            }

            // verificando se há forcas pontuais
            const forcesPontuais = this.forces.filter(f => f.type === "force-pontual" && f.x === currentX);
            if (forcesPontuais.length > 0) {
                forcesPontuais.forEach(pontual => { currentForce += pontual.force });
                this.localForces.push({ type: "force-pontual", x: currentX, force: currentForce });
            }
        }
        let fMax = 0;
        this.localForces.forEach(f => { if (fMax < f.force) fMax = f.force });

        this.diaMomento(points);
        return this.momentos;
    }
    diaMomento(data) {
        const points = data;
        let curF = 0;
        let areas = [];
        let x1 = null;
        let y1 = null;
        let x2 = null;
        let y2 = null;

        for (let i = 0; i < points.length; i++) {
            const pX = points[i].x;
            const ultPx = points[points.length - 1].x;
            const pontuais = this.localForces.filter(f => f.type === "force-pontual" && f.x === pX);
            const lineares = this.localForces.filter(f => f.type === "force-linear" && f.x === pX);
            const inclinadas = this.localForces.filter(f => f.type === "force-linear-inclinada" && f.x === pX);

            if (pontuais.length > 0) {
                const pontual = pontuais[0];

                if (pontual.force !== curF) {
                    if (x1 !== null && x1 !== pontual.x) {
                        // ent definir o ret
                        x2 = pontual.x;
                        y2 = curF;
                        areas.push({ x1, y1, x2, y2, mixed: false })
                        zerarArea();
                    }
                    // nova força
                    x1 = pontual.x;
                    y1 = pontual.force;
                    curF = pontual.force;
                } else if (pontual.force === curF) {
                    if (x1 !== null && x1 !== pontual.x) {
                        // ent definir o ret
                        x2 = pontual.x
                        y2 = curF;
                        areas.push({ x1, y1, x2, y2, mixed: false })
                        zerarArea();
                    }
                }
            }
            // terminar de fazer inclinadas
            if (inclinadas.length > 0) {
                const inclinada = inclinadas[0];
                const variante = inclinada.variante;
                const constante = inclinada.constante;
                const pTotal = inclinada.pTotal;
                const vao = inclinada.vao;

                // o erro esta aqui pq não há força ret anterior, ent acaba salvando o x2 e y2 o transformando em um ret
                if (x1 !== null && x1 !== inclinada.x) {
                    // ent definir o ret
                    x2 = inclinada.x;
                    y2 = curF;
                    areas.push({ x1, y1, x2, y2, mixed: false, inclinada: true, variante, constante, pTotal, vao })
                    zerarArea();
                }
                // nova força
                const isNegF1 = (curF < 0) ? true : false;
                const isNegF2 = (inclinada.force < 0) ? true : false;
                if (isNegF1 === isNegF2) {
                    // area com um triangulo e um retangulo

                    //calculando a area do triangulo                    
                    x1 = inclinada.x
                    y1 = curF;
                    x2 = inclinada.x2;
                    y2 = inclinada.force;
                    curF = inclinada.force;
                    const isGrowing = (Math.abs(y2) > Math.abs(y1)) ? true : false;
                    // areas.push();
                    const areaTriMixed = { x1, y1, x2, y2, mixed: false, inclinada: true, variante, constante, pTotal, vao, isGrowing }
                    zerarArea();

                    // calculando a area do retangulo
                    x1 = inclinada.x;
                    y1 = curF;
                    x2 = inclinada.x2;
                    y2 = curF;
                    areas.push({ x1, y1, x2, y2, mixed: true, inclinada: true, variante, constante, pTotal, vao });
                    areas.push(areaTriMixed);
                    zerarArea();

                } else {
                    // area com dois triangulos
                    // const x = (Math.abs(curF) * Math.abs(inclinada.x2 - inclinada.x)) / (Math.abs(curF) + Math.abs(inclinada.force)) + inclinada.x;
                    const vao = Math.abs(inclinada.x2 - inclinada.x);
                    let x = (inclinada.isGrowing) ? (vao / 3) * 2 : vao / 3;
                    x += inclinada.x;
                    x1 = inclinada.x;
                    y1 = curF;
                    x2 = x;
                    y2 = 0;
                    areas.push({ x1, y1, x2, y2, mixed: false, inclinada: true, terco: false, variante, constante, pTotal, vao });
                    zerarArea();


                    x1 = x;
                    y1 = 0;
                    x2 = inclinada.x2;
                    y2 = inclinada.force;
                    areas.push({ x1, y1, x2, y2, mixed: false, inclinada: true, terco: true, variante, constante, pTotal, vao });
                    zerarArea();
                    curF = inclinada.force;
                }
            } else if (lineares.length > 0) {
                const linear = lineares[0];

                // o erro esta aqui pq não há força ret anterior, ent acaba salvando o x2 e y2 o transformando em um ret
                if (x1 !== null && x1 !== linear.x) {
                    // ent definir o ret
                    x2 = linear.x;
                    y2 = curF;
                    areas.push({ x1, y1, x2, y2, mixed: false, inclinada: false })
                    zerarArea();
                }
                // nova força
                const isNegF1 = (curF < 0) ? true : false;
                const isNegF2 = (linear.force < 0) ? true : false;
                if (isNegF1 === isNegF2) {
                    // area com um triangulo e um retangulo

                    //calculando a area do triangulo
                    x1 = linear.x
                    y1 = curF;
                    x2 = linear.x2;
                    y2 = linear.force;
                    curF = linear.force;
                    // areas.push();
                    const areaTriMixed = { x1, y1, x2, y2, mixed: false, inclinada: false }
                    zerarArea();

                    // calculando a area do retangulo
                    x1 = linear.x;
                    y1 = curF;
                    x2 = linear.x2;
                    y2 = curF;
                    areas.push({ x1, y1, x2, y2, mixed: true, inclinada: false });
                    areas.push(areaTriMixed);
                    zerarArea();

                } else {
                    // area com dois triangulos
                    const x = (Math.abs(curF) * Math.abs(linear.x2 - linear.x)) / (Math.abs(curF) + Math.abs(linear.force)) + linear.x;
                    x1 = linear.x;
                    y1 = curF;
                    x2 = x;
                    y2 = 0;
                    areas.push({ x1, y1, x2, y2, mixed: false, inclinada: false });
                    zerarArea();


                    x1 = x;
                    y1 = 0;
                    x2 = linear.x2;
                    y2 = linear.force;
                    areas.push({ x1, y1, x2, y2, mixed: false, inclinada: false });
                    zerarArea();
                    curF = linear.force;
                }
            }
            // caso no nó n há forças, foi setado o x1. Deixar presetado o x2 e y2 caso haja mudança de y e ent feche
            // a área.
            if (lineares.length === 0 && pontuais.length === 0 && inclinadas.length === 0) {
                if (x1 !== null && x1 !== pX) {
                    x2 = pX;
                    y2 = curF;
                } else if (x1 === null) {
                    x1 = pX;
                    y1 = curF;
                }
            }
        }
        this.drawDiagMomento(this.calcArea(areas, points));

        function zerarArea() {
            x1 = null;
            y1 = null;
            x2 = null;
            y2 = null;
        }
    }
    drawDiagMomento(areas) {

        Draw.elements = Draw.elements.filter(el => el.type !== "text-diag");
        let eng = new CalcForces().returnReactionMomento();
        // let cisAreas = [];
        let cisAreas = (eng.isEngaged) ? [eng, ...areas] : areas;
        console.log(cisAreas)
        // let cisAreas = areas;
        // let somAreas = cisAreas[0].area;
        let somAreas = 0;
        const scale = 70;
        let mx = 0;
        for (let i = 0; i < cisAreas.length; i++) {
            const penultIndex = (cisAreas[i].length - 1);
            const forceNeutra = Math.abs(cisAreas[i].area);
            if (mx < forceNeutra) mx = forceNeutra;

            if (i < penultIndex) {
                const some = Math.abs(cisAreas[i].area + cisAreas[i].area);
                if (mx < some) mx = some;
            }
        }
        const mom = new Path2D();
        this.context.strokeStyle = "red";
        this.context.lineWidth = 1;
        // this.context.beginPath();
        this.translate(0, 0);
        mom.moveTo(this.x1, this.y1);

        let somaAnterior = 0;

        for (let i = 0; i < cisAreas.length; i++) {
            const cis = cisAreas[i];
            const PrevCis = (i > 0) ? cisAreas[i - 1] : null;
            const nextCis = (i < cisAreas.length - 1) ? cisAreas[i + 1] : null;
            // somAreas += thisArea;
            // somAreas = cis.area;

            if (eng.isEngaged && i !== 0) somAreas = cis.area + eng.area;
            if (eng.isEngaged && i === 0) somAreas = eng.area;
            if (!eng.isEngaged) somAreas = cis.area

            const thisArea = somAreas - somaAnterior;
            let mPixel2 = this.forcePixel(somAreas * (-1), mx, scale);

            if (cis.type === "engaste") {
                this.translate(0, 0);
                mom.lineTo(this.x1, this.y1 + mPixel2);
                mom.moveTo(this.x1, this.y1);
                mom.lineTo(this.x1, this.y1 + mPixel2);
                let digNumber = Number(somAreas.toFixed(round))
                this.textForce(digNumber, this.x1, this.y1 + mPixel2, false)

            } else if (cis.type === "force-pontual") {
                // linha reta           
                this.translate(cis.x2, 0);
                mom.lineTo(this.x1, this.y1 + mPixel2);
                mom.moveTo(this.x1, this.y1);
                mom.lineTo(this.x1, this.y1 + mPixel2);
                let digNumber = Number(somAreas.toFixed(round))
                this.textForce(digNumber, this.x1, this.y1 + mPixel2, false)
            } else if (cis.type === "force-linear") {
                // com area cis positiva
                // linha curva fazer hipotenusa

                // x1 x inicial da força, x2 x final da força, y1 momento somado até ent, y2 momento somado incluindo dessa geo 
                this.translate(cis.x1, 0);
                const y0 = this.y1;
                const adjCurve = 4;
                // const somaAnterior = (somAreas - thisArea);
                const mPixel1 = this.forcePixel(somaAnterior * (-1), mx, scale);
                const mPixel2 = this.forcePixel(somAreas * (-1), mx, scale);
                this.translate(cis.x1, 0, cis.x2, 0, mx);
                let x1 = this.x1;
                let x2 = this.x2;
                let y1 = mPixel1 + this.y1;
                let y2 = mPixel2 + this.y2;

                // calcular hipotenusa;
                const larg = Math.abs(x2 - x1);
                const alt = Math.abs(y2 - y1);
                const hipotenusa = Math.hypot(larg, alt);

                // calculando cosseno e seno
                const cos = (thisArea > 0) ? (larg / hipotenusa) : (larg / hipotenusa);
                const sen = (thisArea > 0) ? (alt / hipotenusa) : (alt / hipotenusa);

                // deslocamento para o centro da hipotenusa
                // mudar o a porcentagem aqui para ajuste se ne cessário
                const halfHipotenusa = (thisArea > 0) ? ((hipotenusa / 2) * 1) : ((hipotenusa / 2) * 1);
                let xCentro = (thisArea > 0) ? (cos * halfHipotenusa) : (cos * halfHipotenusa);
                let yCentro = (thisArea > 0) ? (sen * halfHipotenusa) : (sen * halfHipotenusa);

                xCentro += x1;
                yCentro = (thisArea > 0) ? y1 + yCentro : y1 - yCentro;


                // deslocamento final para a profundidade do raio
                const profRaio = (hipotenusa) * 0.12;
                xCentro = (thisArea > 0) ? xCentro - (sen * profRaio) : xCentro + (sen * profRaio);
                yCentro += cos * profRaio;

                // const centro = new Path2D();
                // centro.arc(xCentro, yCentro, 5, 0, 2 * Math.PI);
                // this.context.fillStyle= "orange";
                // this.context.fill(centro);

                if (cis.area > 0 && nextCis !== null && nextCis.type === "force-linear" && nextCis.area < 0) {
                    mom.quadraticCurveTo(xCentro, yCentro, x2 - adjCurve, y2);
                    mom.lineTo(x2, y2);
                } else if (cis.area < 0 && PrevCis !== null && PrevCis.type === "force-linear" && PrevCis.area > 0) {
                    mom.lineTo(x1 + adjCurve, y1);
                    mom.quadraticCurveTo(xCentro, yCentro, x2, y2);
                } else {
                    mom.quadraticCurveTo(xCentro, yCentro, x2, y2);
                }
                // this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                mom.moveTo(x2, y0);
                mom.lineTo(x2, y2);

                let digNumber = Number(somAreas.toFixed(round))
                this.textForce(digNumber, x2, y2, false);
            } else if (cis.type === "force-linear-inclinada") {
                // com area cis positiva
                // linha curva fazer hipotenusa

                // x1 x inicial da força, x2 x final da força, y1 momento somado até ent, y2 momento somado incluindo dessa geo 
                this.translate(cis.x1, 0);
                const y0 = this.y1;
                const adjCurve = 4;
                const somaAnterior = (somAreas - thisArea);
                const mPixel1 = this.forcePixel(somaAnterior * (-1), mx, scale);
                const mPixel2 = this.forcePixel(somAreas * (-1), mx, scale);
                this.translate(cis.x1, 0, cis.x2, 0, mx);
                let x1 = this.x1;
                let x2 = this.x2;
                let y1 = mPixel1 + this.y1;
                let y2 = mPixel2 + this.y2;

                // calcular hipotenusa;
                const larg = Math.abs(x2 - x1);
                const alt = Math.abs(y2 - y1);
                const hipotenusa = Math.hypot(larg, alt);

                // calculando cosseno e seno
                const cos = (thisArea > 0) ? (larg / hipotenusa) : (larg / hipotenusa);
                const sen = (thisArea > 0) ? (alt / hipotenusa) : (alt / hipotenusa);

                // deslocamento para o centro da hipotenusa
                // mudar o a porcentagem aqui para ajuste se ne cessário
                const halfHipotenusa = (thisArea > 0) ? ((hipotenusa / 2) * 1) : ((hipotenusa / 2) * 1);
                let xCentro = (thisArea > 0) ? (cos * halfHipotenusa) : (cos * halfHipotenusa);
                let yCentro = (thisArea > 0) ? (sen * halfHipotenusa) : (sen * halfHipotenusa);

                xCentro += x1;
                yCentro = (thisArea > 0) ? y1 + yCentro : y1 - yCentro;


                // deslocamento final para a profundidade do raio
                const profRaio = (hipotenusa) * 0.12;
                xCentro = (thisArea > 0) ? xCentro - (sen * profRaio) : xCentro + (sen * profRaio);
                yCentro += cos * profRaio;

                // const centro = new Path2D();
                // centro.arc(xCentro, yCentro, 5, 0, 2 * Math.PI);
                // this.context.fillStyle= "orange";
                // this.context.fill(centro);

                if (cis.area > 0 && nextCis !== null && nextCis.type === "force-linear" && nextCis.area < 0) {
                    mom.quadraticCurveTo(xCentro, yCentro, x2 - adjCurve, y2);
                    mom.lineTo(x2, y2);
                } else if (cis.area < 0 && PrevCis !== null && PrevCis.type === "force-linear" && PrevCis.area > 0) {
                    mom.lineTo(x1 + adjCurve, y1);
                    mom.quadraticCurveTo(xCentro, yCentro, x2, y2);
                } else {
                    mom.quadraticCurveTo(xCentro, yCentro, x2, y2);
                }
                // this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                mom.moveTo(x2, y0);
                mom.lineTo(x2, y2);

                let digNumber = Number(somAreas.toFixed(round))
                this.textForce(digNumber, x2, y2, false);
            }
            somaAnterior = somAreas;
        }
        Draw.elements = Draw.elements.filter(el => el.type !== "diagrama-cisalhamento");
        Draw.elements = Draw.elements.filter(el => el.type !== "diagrama-momento");
        let elMom = { elCanvas: mom, type: "diagrama-momento" }
        Draw.elements.push(elMom)
        // this.context.stroke();

    }
    textForce(force, xposition, yposition, txtCis) {
        this.momentos = [...this.momentos, force]
        let gapY = 0
        if (txtCis) {
            gapY = (force < 0) ? 15 : -10;
        } else {
            gapY = (force < 0) ? -10 : 15;
        }

        this.context.font = 'normal 10px Arial';
        this.context.lineWidth = 1;
        this.context.strokeStyle = "red";
        this.context.strokeText(force, xposition + 5, yposition + gapY);
        const dataText = { type: "text-diag", force, x: xposition + 5, y: yposition + gapY }
        Draw.elements.push(dataText);
    }
    drawPoint(x1, y1, x2, y2) {
        Draw.elements.push({ idCanvas: Draw.elementId, type: "point", x: x1, y: y1, elCanvas: {} });
        Draw.elementId++;
        const points = Draw.elements.filter(p => p.type === "point");

        points.forEach(point => {
            // Create circle
            const circle = new Path2D();
            this.translate(x1, y1, x2, y2);
            circle.arc(this.x1, this.y1, 3, 0, 2 * Math.PI);
            this.context.fillStyle = "green";
            this.context.fillStroke = "green";
            this.context.lineWidth = 2;
            this.context.fill(circle);
            // this.context.stroke(circle);
            Draw.elements[Draw.elements.length - 1].elCanvas = circle;
            // fazendo testes
            // Draw.elSelected = Draw.elements[Draw.elements.length - 1];
            // this.createForce("force-pontual", -10)
        });
    }
    returnElement() {
        return Draw.elSelected;
    }
    returnElements() {
        return Draw.elements;
    }
    createApoio(firstx, firsty, type) {
        const kind = type;
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
        this.translate(firstx, firsty);
        const aPath = new Path2D();
        const gapY = 7;
        this.y1 += gapY;
        const factorTriangle = 7;
        // this.context.beginPath();        
        this.context.strokeStyle = "green";
        this.context.fillStyle = "white";

        if (kind === "free" || kind === "fixed") {
            this.context.lineWidth = 2;
            aPath.moveTo(this.x1, this.y1);
            aPath.lineTo(this.x1 + factorTriangle, this.y1 + factorTriangle);
            aPath.lineTo(this.x1 - factorTriangle, this.y1 + factorTriangle);
            aPath.closePath();
        } else if (kind === "engaged") {
            this.context.lineWidth = 1;
            const hEngaged = 15;
            const y = this.y1 - gapY;
            aPath.moveTo(this.x1, y);
            aPath.lineTo(this.x1, y - hEngaged)

            aPath.moveTo(this.x1, y);
            aPath.lineTo(this.x1, y + hEngaged)
        }
        // aPath.lineTo(this.x1, this.y1)
        this.context.stroke(aPath);
        this.context.fill(aPath);
        const apoio = {
            idCanvas: Draw.elementId,
            type: "apoio",
            firstx,
            firsty,
            kind
        }
        Draw.elementId++;
        Draw.elements.push(apoio);
        Draw.elements[Draw.elements.length - 1].elCanvas = aPath;

        // this.reDraw();
    }
    createPoint() {
        const vigas = Draw.elements.filter(el => el.type === "viga");
        const points = Draw.elements.filter(el => el.type === "point");
        for (let a = 0; a < vigas.length; a++) {
            let x = points.filter(el => el.x === vigas[a].x1);
            if (x.length === 0) { this.drawPoint(vigas[a].x1, vigas[a].y1, vigas[a].x2, vigas[a].y2); }

            x = points.filter(el => el.x === vigas[a].x2);
            if (x.length === 0) { this.drawPoint(vigas[a].x2, vigas[a].y1, vigas[a].x2, vigas[a].y2); }
        }
    }
    rePosCoordinateY(coorY, factor) {
        return (((this.screenHeight / 2) * 1.1) + coorY * factor);
    }
    rePosCoordinateX(coorX, factor) {
        return ((this.screenWidth/10 * 0.1) + coorX * factor);
    }
    createForce(typeForce, force) {
        // lembrar de criar o elemento para adicionar n arr
        // Ao aplicar a força limpar canvas 
        if (typeForce === "force-momento") {
            if (Draw.elSelected === {}) return;
            const data = { x1: Draw.elSelected.x, y1: Draw.elSelected.y }
            const el = { idCanvas: Draw.elementId, type: typeForce, x: data.x1, y: data.y1, force }
            Draw.elements.push(el);
            Draw.elementId++;
            this.translate(data.x1, data.y1);
            let verticalOrientation = (force < 0) ? -1 : 1;
            let gapY = 4;
            gapY *= -1
            this.momento(this.x1, this.y1, force, verticalOrientation);
        }
        if (typeForce === "force-pontual") {
            if (Draw.elSelected === {}) return;
            const data = { x1: Draw.elSelected.x, y1: Draw.elSelected.y }
            const el = { idCanvas: Draw.elementId, type: typeForce, x: data.x1, y: data.y1, force }
            Draw.elements.push(el);
            Draw.elementId++;
            this.translate(data.x1, data.y1);
            let verticalOrientation = 1;
            let gapY = 4;
            if (force < 0) {
                verticalOrientation *= -1;
                gapY *= -1
            }
            this.seta(gapY, force, verticalOrientation);
        }
        if (typeForce === "force-linear") {
            if (Draw.elSelected === {}) return;
            const data = { x1: Draw.elSelected.x1, y1: Draw.elSelected.y1, x2: Draw.elSelected.x2, y2: Draw.elSelected.y2 }
            const el = { idCanvas: Draw.elementId, type: typeForce, x1: data.x1, y: data.y1, x2: data.x2, y2: data.y2, force }
            Draw.elements.push(el);
            Draw.elementId++;
            this.translate(data.x1, data.y1, data.x2, data.y2);
            let verticalOrientation = 1;
            verticalOrientation = force < 0 ? verticalOrientation *= -1 : verticalOrientation;
            this.linearDraw(force, verticalOrientation);
        }
        if (typeForce === "force-linear-inclinada") {
            if (Draw.elSelected === {}) return;

            const data = { x1: Draw.elSelected.x1, y1: Draw.elSelected.y1, x2: Draw.elSelected.x2, y2: Draw.elSelected.y2 }
            const el = { idCanvas: Draw.elementId, type: typeForce, x1: data.x1, y: data.y1, x2: data.x2, y2: data.y2, force }
            Draw.elements.push(el);
            Draw.elementId++;
            this.translate(data.x1, data.y1, data.x2, data.y2);
            let verticalOrientation = 1;
            verticalOrientation = force < 0 ? verticalOrientation *= -1 : verticalOrientation;
            this.leandLinear(force);
        }
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
        // this.reDraw();
    }
    // (data.x1, gapY, force, verticalOrientation)
    momento(x, y, force, isNeg) {
        const clockwise = (isNeg < 0) ? false : true;
        const addXRad = .5
        const addYRad = .5
        const raio = 15;
        const pathArc = new Path2D();
        let startAngle = Math.PI / 2;
        (isNeg < 0) ? startAngle -= addXRad : startAngle += addXRad;
        let endAngle = (isNeg < 0) ? Math.PI + addYRad : 0 - addYRad;
        pathArc.arc(x, y, raio, startAngle, endAngle, clockwise);

        const wSeta = 3;
        const hSeta = -7;
        const adjustX = (isNeg < 0) ? -1.5 : 1.5;
        // calcular o seno q dara a pos y da seta
        let posYSeta = y + 4 + Math.sin(endAngle) * raio;
        // calcular o cos q dara a pos em x da seta
        let posXSeta = x + adjustX + Math.cos(endAngle) * raio;
        const pathHeadSeta = new Path2D(pathArc);
        pathHeadSeta.moveTo(posXSeta, posYSeta);
        pathHeadSeta.lineTo(posXSeta + wSeta, posYSeta);
        pathHeadSeta.lineTo(posXSeta, posYSeta + hSeta)
        pathHeadSeta.lineTo(posXSeta - wSeta, posYSeta);
        pathHeadSeta.lineTo(posXSeta, posYSeta);
        pathHeadSeta.closePath();
        this.context.stroke(pathHeadSeta);
        this.context.fill(pathHeadSeta);
        Draw.elements[Draw.elements.length - 1].elCanvas = pathHeadSeta;

        //escrevendo a força
        const hText = - 20;
        this.context.font = '13px';
        this.context.lineWidth = 1;
        this.context.fillStyle = forceColor;
        this.context.strokeStyle = forceColor;
        const idText = Draw.elements[Draw.elements.length - 1].idCanvas;
        const dataText = { type: "text", idCanvas: idText, force, x, y: y + hText }
        this.context.strokeText(force, x, y + hText);
        Draw.elements.push(dataText);
    }
    forceScale(force) {
        const max = 40;
        const min = 7;
        const forces = Draw.elements.filter(f => f.type === "force-linear" || f.type === "force-linear-inclinada");
        let forceMax = 0;
        let forceMin = 0

        if (forces.length === 0) {
            forceMax = Math.abs(force)
        } else {
            forces.forEach(f => {
                if (f.type === "force-linear") {
                    if (Math.abs(f.force) > Math.abs(forceMax)) forceMax = Math.abs(f.force);
                    if (Math.abs(f.force) < forceMin || forceMin === 0) forceMin = Math.abs(f.force);
                }
                if (f.type === "force-linear-inclinada") {
                    const inclinadaMax = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? Math.abs(f.force.forceY1) : Math.abs(f.force.forceY2);
                    if (inclinadaMax > forceMax) forceMax = inclinadaMax;
                    if (inclinadaMax < forceMin || forceMin === 0) forceMin = inclinadaMax;
                }
            });
        }

        let forcePix = (Math.abs(force) * max) / forceMax;
        forcePix = (forcePix > min) ? forcePix : min;

        forcePix = Math.abs(forcePix)
        return forcePix
    }
    leandLinear(force) {
        let isMixed = false;
        let isRightDirection = true;
        let gapY = 5;
        let firstY = force.forceY1;
        let secondY = force.forceY2;
        const forceMax = Math.abs(firstY) > Math.abs(secondY) ? firstY : secondY;
        const forcMin = Math.abs(firstY) < Math.abs(secondY) ? firstY : secondY;
        let maxY = this.forceScale(forceMax);
        let minY = this.forceScale(forcMin);
        let gapText = 15;
        const leandPath = new Path2D();
        this.context.strokeStyle = forceColor;
        this.context.fillStyle = "white";
        this.context.lineWidth = 2;
        let m = new DOMMatrix();

        let verticalOrientation = (firstY < 0 || secondY < 0) ? -1 : 1;
        gapText *= verticalOrientation;
        maxY *= verticalOrientation;
        minY *= verticalOrientation;
        if (firstY < 0 || secondY < 0) {
            maxY += gapY
            minY += gapY
        } else {
            maxY -= gapY
            minY -= gapY
        }
        gapY *= verticalOrientation;
        this.y1 += gapY;
        this.y2 += gapY;
        if (Math.abs(secondY) > Math.abs(firstY)) {
            // graf crescente p direita                
            if (firstY === 0) {
                // cresc p direita cm fy partindo do zero
                leandPath.moveTo(this.x1, this.y1);
                leandPath.lineTo(this.x2, this.y2 + maxY);
                leandPath.lineTo(this.x2, this.y2);
            } else {
                // cresc p direita cm fy em degrau
                isMixed = true;
                leandPath.moveTo(this.x1, this.y1);
                leandPath.lineTo(this.x1, this.y1 + minY);
                leandPath.lineTo(this.x2, this.y2 + maxY);
                leandPath.lineTo(this.x2, this.y2);
            }
        } else {
            isRightDirection = false;
            // graf p cima crescente p esquerda
            if (secondY === 0) {
                // cresc p esquerda cm secondy partindo do zero
                leandPath.moveTo(this.x2, this.y2);
                leandPath.lineTo(this.x1, this.y2 + maxY);
                leandPath.lineTo(this.x1, this.y1);
            } else {
                // cresc p esquerda cm sy em degrau
                isMixed = true;
                leandPath.moveTo(this.x2, this.y2);
                leandPath.lineTo(this.x2, this.y2 + minY);
                leandPath.lineTo(this.x1, this.y1 + maxY);
                leandPath.lineTo(this.x1, this.y1);
            }
        }
        const amount = Math.trunc(((this.x2 - this.x1) / 6) / 2);
        const incX = (this.x2 - this.x1) / amount;

        let pathSetas = "";
        if (isRightDirection) {
            for (let i = 1; i < amount; i++) {
                const xinc = i * incX;
                const larg = (this.x2 - this.x1);
                // let hinc = (!isMixed) ? (xinc * (maxY - gapY)) / larg : (xinc * (maxY - minY - gapY) / larg) + minY;                       
                const tg = (!isMixed) ? (maxY) / larg : (maxY - minY) / larg;
                let hinc = (!isMixed) ? xinc * tg : (xinc * tg) + (minY);

                const h = hinc + (this.y1);
                pathSetas = this.innerSetaInc(this.x1 + xinc, this.y1, h, verticalOrientation, isMixed);
                leandPath.addPath(pathSetas, m);
            }
        } else {
            for (let i = amount - 1; i > 0; i--) {
                const xinc = i * incX;
                const larg = (this.x2 - this.x1);
                const tg = (!isMixed) ? (maxY) / larg : (maxY - minY) / larg;
                let hinc = (!isMixed) ? xinc * tg : (xinc * tg) + (minY);
                const h = hinc + (this.y1)
                pathSetas = this.innerSetaInc(this.x2 - xinc, this.y1, h, verticalOrientation, isMixed);
                leandPath.addPath(pathSetas, m);
            }
        }

        // fazer aqui o cod das innersetas
        // this.innerSeta(this.x1 + incX * i, this.y1, factorForce, verticalOrientation);
        this.context.stroke(leandPath);
        this.context.fill(leandPath);
        Draw.elements[Draw.elements.length - 1].elCanvas = leandPath;
        if (firstY === 0) {
            this.textLeand(this.y2 + maxY + gapText, secondY, verticalOrientation, this.x2);
        } else {
            if (Math.abs(firstY) < Math.abs(secondY)) {
                this.textLeand(this.y1 + minY + gapText, firstY, verticalOrientation, this.x1);
                this.textLeand(this.y2 + maxY + gapText, secondY, verticalOrientation, this.x2);
            } else {
                this.textLeand(this.y1 + maxY + gapText, firstY, verticalOrientation, this.x1);
                this.textLeand(this.y2 + minY + gapText, secondY, verticalOrientation, this.x2);
            }
        }
    }
    innerSetaInc(x, y, h, verticalOrientation) {
        const pathLine = new Path2D();
        pathLine.moveTo(x, y);
        pathLine.lineTo(x, h);
        const altHead = y + 3 * verticalOrientation;

        if (verticalOrientation < 0) {
            if (altHead <= h) return pathLine;
        } else {
            if (altHead >= h) return pathLine;
        }

        const pathHeadSeta = new Path2D(pathLine);
        pathHeadSeta.moveTo(x, y);
        pathHeadSeta.lineTo(x + 2, altHead);
        pathHeadSeta.lineTo(x - 2, altHead);
        pathHeadSeta.lineTo(x, y)

        return pathHeadSeta;
    }
    textLeand(gapY, force, verticalOrientation, x) {
        let y = gapY;
        // y *= verticalOrientation;
        this.context.font = '13px';
        this.context.lineWidth = 1;
        this.context.fillStyle = forceColor;
        this.context.strokeStyle = forceColor;
        const idText = Draw.elements[Draw.elements.length - 1].idCanvas;
        const dataText = { type: "text", idCanvas: idText, force, x, y }
        this.context.strokeText(force, x, y);
        Draw.elements.push(dataText);
    }
    drawTextSeta(gapY, force, verticalOrientation, factorTriangle) {
        this.y1 += gapY;
        this.context.font = '13px';
        this.context.lineWidth = 1;
        this.context.fillStyle = forceColor;
        this.context.strokeStyle = forceColor;
        const idText = Draw.elements[Draw.elements.length - 1].idCanvas;
        const dataText = { type: "text", idCanvas: idText, force, x: this.x1 - 2, y: this.y1 + ((factorTriangle + 4 + 10) * verticalOrientation) + 50 * verticalOrientation }
        this.context.strokeText(force, this.x1 - 2, this.y1 + ((factorTriangle + 4 + 10) * verticalOrientation) + 50 * verticalOrientation);
        Draw.elements.push(dataText);
    }
    seta(gapY, force, verticalOrientation) {

        this.context.fillStyle = forceColor;
        this.context.strokeStyle = forceColor;
        const factorTriangle = 5;
        const path = new Path2D();
        this.context.lineWidth = 2;
        path.moveTo(this.x1, this.y1 + (factorTriangle + 4) * verticalOrientation);
        path.lineTo(this.x1, this.y1 + ((factorTriangle + 4) * verticalOrientation) + 50 * verticalOrientation);

        const path0 = new Path2D(path);
        path0.moveTo(this.x1, this.y1 + 5 * verticalOrientation);
        path0.lineTo(this.x1 + factorTriangle - 2, this.y1 + (factorTriangle + 4) * verticalOrientation);
        path0.lineTo(this.x1, this.y1 + (factorTriangle + 4) * verticalOrientation);
        path0.lineTo(this.x1 - factorTriangle + 2, this.y1 + (factorTriangle + 4) * verticalOrientation);
        path0.closePath();

        this.context.stroke(path0);
        this.context.fill(path0);
        Draw.elements[Draw.elements.length - 1].elCanvas = path0;

        this.drawTextSeta(gapY, force, verticalOrientation, factorTriangle);
    }
    innerSeta(x, y, h, verticalOrientation) {
        this.context.fillStyle = forceColor;
        this.context.strokeStyle = forceColor;
        const factorTriangle = 4;
        const path = new Path2D();
        this.context.lineWidth = 0.5;
        path.moveTo(x, y + (factorTriangle + 4) * verticalOrientation);
        path.lineTo(x, h);
        let m = new DOMMatrix();

        const path0 = new Path2D();
        path0.addPath(path, m)
        path0.moveTo(x, y + 5 * verticalOrientation);
        path0.lineTo(x + factorTriangle - 2, y + (factorTriangle + 4) * verticalOrientation);
        path0.lineTo(x, y + (factorTriangle + 4) * verticalOrientation);
        path0.lineTo(x - factorTriangle + 2, y + (factorTriangle + 4) * verticalOrientation);
        path0.closePath();

        return path0;
        // this.context.fill(path0);
        // this.context.stroke(path0);
        // seta               
        Draw.elements.push({ type: "seta", elCanvas: path0 });
    }
    linearDraw(force, verticalOrientation) {
        let m = new DOMMatrix();
        const gapY = verticalOrientation < 0 ? 5 : 15;
        const forcePixel = this.forceScale(force);
        const factorForce = this.y1 + forcePixel * verticalOrientation;

        // const text = this.context.strokeText(force, this.x1 + (this.x2 - this.x1) / 2, factorForce + gapY * verticalOrientation);
        const linearPath = new Path2D();
        linearPath.moveTo(this.x1, this.y1 - 5);
        linearPath.lineTo(this.x1, factorForce);
        linearPath.lineTo(this.x2, factorForce);
        linearPath.lineTo(this.x2, this.y2 - 5);
        linearPath.lineTo(this.x2, factorForce);
        linearPath.lineTo(this.x1, factorForce);
        linearPath.moveTo(this.x1, this.y1 - 5);
        this.context.lineWidth = 1;
        this.context.strokeStyle = forceColor;
        this.context.fillStyle = forceColor;

        const amount = Math.trunc(((this.x2 - this.x1) / 6) / 2);
        const incX = (this.x2 - this.x1) / amount;
        let pathSetas = ""
        for (let i = 1; i < amount; i++) {
            pathSetas = this.innerSeta(this.x1 + incX * i, this.y1, factorForce, verticalOrientation);
            linearPath.addPath(pathSetas, m);
        }
        this.context.stroke(linearPath);
        this.context.fill(linearPath);
        // aqui
        Draw.elements[Draw.elements.length - 1].elCanvas = linearPath;

        // desenhando o texto
        this.context.font = '13px';
        this.context.lineWidth = 1;
        this.context.strokeStyle = forceColor;
        const idText = Draw.elements[Draw.elements.length - 1].idCanvas;
        const dataText = { type: "text", idCanvas: idText, force, x: this.x1 + (this.x2 - this.x1) / 2, y: factorForce + gapY * verticalOrientation }
        this.context.strokeText(force, this.x1 + (this.x2 - this.x1) / 2, factorForce + gapY * verticalOrientation);
        Draw.elements.push(dataText);
    }
    allEvents() {
        this.insertForce();
        this.canvas.addEventListener("click", (event) => {
            const eventChoose = document.querySelector(".force-choose");
            if (eventChoose === null) {
                Draw.typeEvent = Draw.typeEvent;
            } else {
                const event = eventChoose.id;
                Draw.typeEvent = event;
            }
            if (Draw.elements.length === 0) return
            let keySelect = false;
            Draw.elements.forEach(draw => {
                let hasFill = false;
                if (Draw.typeEvent === "general" && draw.type !== "text" || Draw.typeEvent === "force-linear" && draw.type !== "text") {
                    Draw.elements = Draw.elements.filter(el => el.type !== "diagrama-cisalhamento");
                    Draw.elements = Draw.elements.filter(el => el.type !== "diagrama-momento");
                    Draw.elements = Draw.elements.filter(el => el.type !== "text-diag");
                    // Check whether point is inside circle                                    
                    const isPointInStroke = this.context.isPointInStroke(draw.elCanvas, event.offsetX, event.offsetY);
                    const isPointInPath = this.context.isPointInPath(draw.elCanvas, event.offsetX, event.offsetY);
                    if (draw.type === "point") {
                        this.context.strokeStyle = isPointInStroke ? "red" : "green";
                        this.context.fillStyle = isPointInPath ? "red" : "green";
                        hasFill = isPointInPath || isPointInStroke ? true : false;
                    }
                    if (draw.type === "viga") {
                        this.context.fillStyle = isPointInPath || isPointInStroke ? "red" : "green";
                        this.context.strokeStyle = isPointInStroke || isPointInPath ? "red" : "green";
                    }
                    if (draw.type === "force-pontual" || draw.type === "force-linear" || draw.type === "force-linear-inclinada" || draw.type === "force-momento") {
                        this.context.strokeStyle = isPointInPath || isPointInStroke ? "red" : forceColor;
                        if (draw.type === "force-pontual")
                            this.context.fillStyle = isPointInPath || isPointInStroke ? "red" : forceColor;
                        else
                            this.context.fillStyle = isPointInPath || isPointInStroke ? "red" : "white";
                        if (draw.type === "force-pontual") hasFill = isPointInPath || isPointInStroke ? true : false;
                        this.context.lineWidth = (draw.type === "force-linear" || draw.type === "force-linear-inclinada") ? 1 : 2;
                    }
                    if (draw.type === "apoio" && Draw.typeEvent !== "force-linear" || draw.type === "apoio" && Draw.typeEvent !== "force-pontual") {
                        this.context.strokeStyle = isPointInStroke ? "red" : "green";
                        this.context.fillStyle = isPointInPath ? "red" : "white";
                    }
                    if (isPointInStroke || isPointInPath) {
                        Draw.elSelected = draw;
                        keySelect = true;
                    }
                    this.context.stroke(draw.elCanvas);
                    if (Draw.elSelected.type === "force-pontual") this.context.fill(draw.elCanvas)
                }
                if (Draw.typeEvent === "apoios" && draw.type === "point" && draw.type !== "text" || Draw.typeEvent === "force-pontual"
                    && draw.type === "point" && draw.type !== "text" || Draw.typeEvent === "force-momento" && draw.type === "point" && draw.type !== "text") {
                    // Check whether point is inside circle
                    const isPointInStroke = this.context.isPointInStroke(draw.elCanvas, event.offsetX, event.offsetY);
                    this.context.strokeStyle = isPointInStroke ? "red" : "green";
                    this.context.fillStyle = isPointInStroke ? "red" : "green";

                    if (isPointInStroke) {
                        if (Draw.typeEvent === "apoios" || Draw.typeEvent === "force-pontual" || Draw.typeEvent === "force-momento") {
                            Draw.elSelected = draw;
                            keySelect = true;
                        }
                    }
                    this.context.stroke(draw.elCanvas);
                }
                if (Draw.typeEvent === "force-linear-inclinada" && draw.type === "viga" || Draw.typeEvent === "force-linear-inclinada-left" && draw.type === "viga") {
                    const isPointInStroke = this.context.isPointInStroke(draw.elCanvas, event.offsetX, event.offsetY);
                    const isPointInPath = this.context.isPointInPath(draw.elCanvas, event.offsetX, event.offsetY);
                    this.context.strokeStyle = isPointInStroke || isPointInPath ? "red" : "green";
                    this.context.fillStyle = isPointInStroke || isPointInPath ? "red" : "green";

                    if (isPointInStroke || isPointInStroke) {
                        Draw.elSelected = draw;
                        keySelect = true;
                    }
                    this.context.stroke(draw.elCanvas);
                }
            })
            Draw.elSelected = keySelect ? Draw.elSelected : {};
            // voltar aqui redraw
            this.reDraw();
        });
        window.addEventListener("keydown", e => {
            if (e.keyCode === 46 && Draw.elSelected.idCanvas !== undefined) {
                if (Draw.elSelected.type === "viga" || Draw.elSelected.type === "point") return
                // const ask = new Ask("Deseja realmente deletar o elemento selecionado");
                // if (!ask.respond()) return;

                Draw.elements = Draw.elements.filter(el => el.idCanvas !== Draw.elSelected.idCanvas);
                Draw.elSelected = {};
                // this.reDraw(this.context);
            }
        })
        // this.canvas.addEventListener("wheel", e => {
        //     Draw.globalScale += (e.deltaY / 1000);            
        //     this.reDraw();
        // });
        this.canvas.addEventListener('mousedown', this.onPointerDown.bind(this))
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, this.onPointerDown.bind(this)))
        this.canvas.addEventListener('mouseup', this.onPointerUp.bind(this))
        this.canvas.addEventListener('touchend', (e) => this.handleTouch(e, this.onPointerUp.bind(this)))
        this.canvas.addEventListener('mousemove', this.onPointerMove.bind(this))
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e, this.onPointerMove.bind(this)))
        this.canvas.addEventListener('wheel', (e) => this.adjustZoom(e.deltaY * Draw.SCROLL_SENSITIVITY))
    }
    adjustZoom(zoomAmount, zoomFactor) {
        if (!this.isDragging) {
            if (zoomAmount) {
                Draw.cameraZoom += zoomAmount
            }
            else if (zoomFactor) {
                Draw.cameraZoom = zoomFactor * this.lastZoom
            }
            // Draw.cameraZoom += zoomAmount
            Draw.cameraZoom = Math.min(Draw.cameraZoom, Draw.MAX_ZOOM)
            Draw.cameraZoom = Math.max(Draw.cameraZoom, Draw.MIN_ZOOM)
            // this.reDraw()
        }
    }


    drawRect(x, y, width, height) {
        ctx.fillRect(x, y, width, height)
    }

    drawText(text, x, y, size, font) {
        ctx.font = `${size}px ${font}`
        ctx.fillText(text, x, y)
    }

    // Gets the relevant location from a mouse or single touch event
    getEventLocation(e) {
        if (e.touches && e.touches.length == 1) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }
        else if (e.clientX && e.clientY) {
            return { x: e.clientX, y: e.clientY }
        }
    }
    onPointerDown(e) {
        this.isDragging = true
        this.dragStart.x = this.getEventLocation(e).x / Draw.cameraZoom - this.cameraOffset.x
        this.dragStart.y = this.getEventLocation(e).y / Draw.cameraZoom - this.cameraOffset.y
    }

    onPointerUp(e) {
        this.isDragging = false
        this.initialPinchDistance = null
        this.lastZoom = Draw.cameraZoom
    }

    onPointerMove(e) {
        if (this.isDragging) {
            this.cameraOffset.x = this.getEventLocation(e).x / Draw.cameraZoom - this.dragStart.x
            this.cameraOffset.y = this.getEventLocation(e).y / Draw.cameraZoom - this.dragStart.y
        }
    }

    handleTouch(e, singleTouchHandler) {
        if (e.touches.length == 1) {
            singleTouchHandler(e)
        }
        else if (e.type == "touchmove" && e.touches.length == 2) {
            this.isDragging = false
            this.handlePinch(e)
        }
    }
    handlePinch(e) {
        e.preventDefault()

        let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

        // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance
        }
        else {
            this.adjustZoom(null, currentDistance / this.initialPinchDistance)
        }
    }

    adjustZoom(zoomAmount, zoomFactor) {
        if (!this.isDragging) {
            if (zoomAmount) {
                Draw.cameraZoom += zoomAmount
            }
            else if (zoomFactor) {
                console.log(zoomFactor)
                Draw.cameraZoom = zoomFactor * this.lastZoom
            }

            Draw.cameraZoom = Math.min(Draw.cameraZoom, Draw.MAX_ZOOM)
            Draw.cameraZoom = Math.max(Draw.cameraZoom, Draw.MIN_ZOOM)

            console.log(zoomAmount)
        }
    }

    insertForce() {
        document.getElementById("createForce").addEventListener("click", e => {
            const inputForceY = document.getElementById("force-y");
            const inputForceY2 = document.getElementById("force-y2");
            let force = 0
            if (inputForceY.value === "" || inputForceY.value === 0 || inputForceY.value === null || inputForceY.value === undefined) return;
            if (Draw.typeEvent === "force-linear-inclinada" || Draw.typeEvent === "force-linear-inclinada-left") {
                if (inputForceY2.value === "" || inputForceY.value === 0 || inputForceY.value === null || inputForceY.value === undefined) return;
                force = { forceY1: Number(inputForceY.value), forceY2: Number(inputForceY2.value) }
            } else {
                force = Number(inputForceY.value)
            }
            // const act = new Draw(canvas, context);                
            this.createForce(Draw.typeEvent, force);

            inputForceY.value = "";
            inputForceY2.value = "";
            inputForceY.setAttribute("disabled", true);
            inputForceY2.setAttribute("disabled", true);
            document.getElementById(Draw.typeEvent).classList.remove("force-choose");
            forceChoose = "";
            // this.reDraw();
        })
    }

}











module.exports = { Draw } 