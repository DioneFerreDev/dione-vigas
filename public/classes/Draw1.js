// https://www.tiktok.com/@vitorinha051
class Draw {

    static elements = [];
    static elementId = 0;
    static typeEvent = "";
    static elSelected = {};

    constructor(canvas, context, data = null) {
        this.canvas = canvas;
        this.context = context;
        if (data !== null) {
            this.data = data.data;
            this.data.idCanvas = Draw.elementId;
            Draw.elementId++;
            Draw.elements.push(this.data);
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
        this.scaleFactor = this.screenWidth / 15;
        this.x1 = this.rePosCoordinateX(x1, this.scaleFactor);
        this.y1 = this.rePosCoordinateY(y1, this.scaleFactor);
        this.x2 = this.rePosCoordinateX(x2, this.scaleFactor);
        this.y2 = this.rePosCoordinateY(y2, this.scaleFactor);
    }

    drawViga() {
        let viga = new Path2D();
        this.context.strokeStyle = "green";
        this.context.lineWidth = 2;
        viga.moveTo(this.x1, this.y1);
        viga.lineTo(this.x2, this.y2);
        this.context.fill(viga)
        this.context.stroke(viga);
        this.createPoint();
        console.log(Draw.elements)
        this.canvas.addEventListener("click", (event) => {
            if (Draw.typeEvent !== "apoios" && Draw.typeEvent !== "force-pontual") {
                // Check whether point is inside circle                
                const isPointInStroke = this.context.isPointInStroke(viga, event.offsetX, event.offsetY);
                this.context.strokeStyle = isPointInStroke ? "red" : "green";

                if (isPointInStroke) {
                    Draw.elSelected = { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
                } else {
                    Draw.elSelected = {}
                }
                this.context.stroke(viga);
            }
        });

    }

    drawPoint(x, y) {
        Draw.elements.push({ idCanvas: Draw.elementId, type: "point", x, y });
        Draw.elementId++;
        const points = Draw.elements.filter(p => p.type === "point");
        points.forEach(point => {
            // Create circle
            const circle = new Path2D();
            this.data.x1 = x;
            this.data.y1 = y;
            this.translate(x, y);
            circle.arc(this.x1, this.y1, 2, 0, 2 * Math.PI);
            this.context.fillStyle = "green";
            this.context.fillStroke = "green";
            this.context.fill(circle);
            this.context.stroke(circle);

            this.canvas.addEventListener("click", (event) => {

                // Check whether point is inside circle
                const isPointInStroke = this.context.isPointInStroke(circle, event.offsetX, event.offsetY);
                this.context.strokeStyle = isPointInStroke ? "red" : "green";

                if (isPointInStroke) {
                    if (Draw.typeEvent === "apoios" || Draw.typeEvent === "force-pontual") {Draw.elSelected = point; }
                } else {
                    // Draw.elSelected = {}
                }

                this.context.stroke(circle);
            });
        });
    }
    returnElement() {
        return Draw.elSelected;
    }
    createApoio(firstx, firsty) {
        this.translate(firstx, firsty);
        const factorTriangle = 7;
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.strokeStyle = "green";
        this.context.moveTo(this.x1, this.y1);
        this.context.lineTo(this.x1 + factorTriangle, this.y1 + factorTriangle);
        this.context.lineTo(this.x1 - factorTriangle, this.y1 + factorTriangle);
        this.context.closePath();
        this.context.stroke();
        const apoio = {
            idCanvas: Draw.elementId,
            type: "apoio",
            firstx,
            firsty
        }
        Draw.elementId++;
        Draw.elements.push(apoio);
    }
    createPoint() {
        const vigas = Draw.elements.filter(el => el.type === "viga");
        const points = Draw.elements.filter(el => el.type === "point");
        for (let a = 0; a < vigas.length; a++) {
            let x = points.filter(el => el.x === vigas[a].x1);
            if (x.length === 0) { this.drawPoint(vigas[a].x1, vigas[a].y1); }

            x = points.filter(el => el.x === vigas[a].x2);
            if (x.length === 0) { this.drawPoint(vigas[a].x2, vigas[a].y1); }
        }
    }
    rePosCoordinateY(coorY, factor) {
        return (((this.screenHeight / 2) * 1.5) + coorY * factor);
    }
    rePosCoordinateX(coorX, factor) {
        return ((this.screenWidth * 0.1) + coorX * factor);
    }
    createForce(typeForce, force, data) {
        // lembrar de criar o elemento para adicionar n arr
        if (typeForce === "force-pontual") {
            console.log(Draw.elementId)
            const el = { idCanvas: Draw.elementId, type: typeForce, x: data.x, y: data.y, force }
            Draw.elements.push(el);
            Draw.elementId++;
            this.translate(data.x, data.y);
            let verticalOrientation = 1;
            let gapY = 4;
            if (force < 0) {
                verticalOrientation *= -1;
                gapY *= -1
            }
            this.seta(gapY, force, verticalOrientation);
        }
        if (typeForce === "force-linear") {
            console.log("agora é uma força linear");
            console.log
        }
    }
    seta(gapY, force, verticalOrientation) {
        this.y1 += gapY;
        const path = new Path2D;
        const factorTriangle = 5;
        path.moveTo(this.x1, this.y1 + (factorTriangle + 4) * verticalOrientation);
        path.lineTo(this.x1, this.y1 + ((factorTriangle + 4) * verticalOrientation) + 50 * verticalOrientation);

        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.fillStyle = "blue";
        this.context.strokeStyle = "blue";
        this.context.moveTo(this.x1, this.y1);
        this.context.lineTo(this.x1 + factorTriangle - 2, this.y1 + (factorTriangle + 4) * verticalOrientation);
        this.context.lineTo(this.x1, this.y1 + (factorTriangle + 4) * verticalOrientation);
        this.context.lineTo(this.x1 - factorTriangle + 2, this.y1 + (factorTriangle + 4) * verticalOrientation);
        this.context.font = '13px';
        this.context.strokeText(force, this.x1 - 2, this.y1 + ((factorTriangle + 4 + 10) * verticalOrientation) + 50 * verticalOrientation);

        this.context.stroke(path);
        this.context.fill();

        console.log(force)
        console.log(data)
    }
}










module.exports = { Draw } 