// https://www.tiktok.com/@vitorinha051
// https://xfantazy.com/video/6394b639f1977b2d7f337bd4

const { Ask } = require("./Confirm");
const forceColor = "rgb(80,80,80)";


class Draw {

    static elements = [];
    static elementId = 0;
    static typeEvent = "";
    static elSelected = {};
    static globalScale = 1;

    constructor(canvas, context, data = null) {
        this.canvas = canvas;
        this.context = context;
        if (data !== null) {
            this.data = data.data;
            this.data.idCanvas = Draw.elementId;
            Draw.elementId++;
            // Draw.elements.push(this.data);
            this.id = data.id;
            this.translate(this.data.x1, this.data.y1, this.data.x2, this.data.y2);
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
        this.x1 = this.rePosCoordinateX(x1, this.scaleFactor);
        this.y1 = this.rePosCoordinateY(y1, this.scaleFactor);
        this.x2 = this.rePosCoordinateX(x2, this.scaleFactor);
        this.y2 = this.rePosCoordinateY(y2, this.scaleFactor);
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
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
        // console.log(Draw.globalScale)
        // this.context.scale(Draw.globalScale,Draw.globalScale);
        const selectedColor = "red";
        const Texts = Draw.elements.filter(el => el.type === "text");
        const setas = Draw.elements.filter(el => el.type === "seta");
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
            }
        })
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

        this.reDraw();
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
        return ((this.screenWidth * 0.1) + coorX * factor);
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
                this.reDraw();
            }
        })
        // this.canvas.addEventListener("wheel", e => {
        //     Draw.globalScale += (e.deltaY / 1000);            
        //     this.reDraw();
        // });
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
            this.reDraw();
        })
    }

}











module.exports = { Draw } 