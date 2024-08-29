const round = 1;
const { Draw } = require("./Draw");

class DrawDiagramas extends Draw {
    constructor(canvas, context, fApoios) {
        super(Draw.elements);
        this.elements = Draw.elements;
        this.fApoios = fApoios;
        this.forces = this.elements.map(f => {
            if (f.type === "force-pontual") return { type: f.type, force: f.force, x: f.x, y: f.y }
            if (f.type === "force-linear") return { type: f.type, force: f.force, x1: f.x1, y1: f.y, x2: f.x2, y2: f.y2 }
            if (f.type === "force-linear-inclinada") {
                // forca é forcey1 e forcey2
                let pTotal = 0
                const fconstante = (Math.abs(f.force.forceY1) < Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                const fvariante = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                const isGrowing = (fvariante === f.force.forceY2) ? true : false;
                pTotal = fconstante + fvariante;
                return {
                    type: "force-linear-inclinada", fConstante: fconstante, fVariante: fvariante, x1: f.x1, y1: f.force.forceY1,
                    x2: f.x2, y2: f.force.forceY2, isGrowing
                }
            }
            // depois fazer o restante das forças aqui
        });
        this.forces = this.forces.filter(force => force !== undefined);
        this.fApoios.forEach(f => this.forces.push(f))
        this.canvas = canvas;
        this.context = context;
        this.screenWidth = this.canvas.width;
        this.screenHeight = this.canvas.height;
        this.drawViga();
    }
    translate(x1, y1, x2 = null, y2 = null) {
        x2 === null ? 0 : x2
        y2 === null ? 0 : y2

        this.screenWidth = this.canvas.width;
        this.screenHeight = this.canvas.height;
        this.scaleFactor = this.screenWidth / 10;
        this.x1 = this.rePosCoordinateX(x1, this.scaleFactor);
        this.y1 = this.rePosCoordinateY(y1, this.scaleFactor);
        this.x2 = this.rePosCoordinateX(x2, this.scaleFactor);
        this.y2 = this.rePosCoordinateY(y2, this.scaleFactor);
    }
    rePosCoordinateY(coorY, factor) {
        return (((this.screenHeight / 2) * 1.1) + coorY * factor);
    }
    rePosCoordinateX(coorX, factor) {
        return ((this.screenWidth * 0.1) + coorX * factor);
    }
    drawViga() {
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
        const vigas = this.elements.filter(el => el.type === "viga");
        const apoios = this.elements.filter(el => el.type === "apoio");

        vigas.forEach(el => {
            this.translate(el.x1, el.y1, el.x2, el.y2);

            let viga = new Path2D();
            this.context.strokeStyle = "green";
            this.context.fillStyle = "green";
            this.context.lineWidth = 2;
            viga.moveTo(this.x1, this.y1);
            viga.lineTo(this.x2, this.y2);
            viga.closePath();
            this.context.fill(viga)
            this.context.stroke(viga);
        })
        apoios.forEach(apoio => {
            this.createApoio(apoio.firstx, apoio.firsty);
        });
        // this.diagCisa();
    }
    createApoio(firstx, firsty) {
        this.translate(firstx, firsty);

        const aPath = new Path2D();
        this.y1 += 7;
        const factorTriangle = 7;
        this.context.lineWidth = 2;
        this.context.strokeStyle = "blue";
        this.context.fillStyle = "white";
        aPath.moveTo(this.x1, this.y1);
        aPath.lineTo(this.x1 + factorTriangle, this.y1 + factorTriangle);
        aPath.lineTo(this.x1 - factorTriangle, this.y1 + factorTriangle);
        aPath.closePath();
        // aPath.lineTo(this.x1, this.y1)
        this.context.stroke(aPath);
        this.context.fill(aPath);
    }
    diagCisa() {
        const points = this.elements.filter(el => el.type === "point");
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

                const centro = new Path2D();
                centro.arc(xCentro, yCentro, 5, 0, 2 * Math.PI);
                this.context.fillStyle = "orange"
                this.context.fill(centro);

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
        this.context.stroke(cis);
        // this.diaMomento(points)

    }
    calcMomento() {
        const points = this.elements.filter(el => el.type === "point");
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
    }

    // erro aqui não esta formando a ultima area
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
        this.drawDiagMomento(this.calcArea(areas));

        function zerarArea() {
            x1 = null;
            y1 = null;
            x2 = null;
            y2 = null;
        }
    }
    calcArea(geometrics) {
        let areas = [];
        let area = 0;
        geometrics.forEach(geo => {
            let type = "";
            if (geo.y1 === geo.y2) {
                // area quadratica
                const lowerForce = (Math.abs(geo.y1) < Math.abs(geo.y2)) ? geo.y1 : geo.y2;;
                type = "force-pontual";
                area = Math.abs(geo.x2 - geo.x1) * Math.abs(lowerForce);
                area = (geo.y1 < 0 || geo.y2 < 0) ? area * -1 : area;
            } else if (geo.inclinada === false) {
                type = "force-linear";
                area += (Math.abs(geo.x2 - geo.x1) * Math.abs(geo.y1 - geo.y2)) / 2;
                area = (geo.y1 < 0 || geo.y2 < 0) ? area * -1 : area;
            } else {
                console.log(geo)
                type = "force-linear-inclinada";
                // calc os dois tipos de pontuais. da const e variante
                const constante = geo.constante;
                const variante = geo.variante;
                const vao = geo.vao;
                const terco = geo.terco;
                const pTotal = geo.pTotal;
                const x2 = geo.x2;
                const x1 = geo.x1;
                let bracoVariante = Math.abs(x2 - x1);
                const y1 = Math.abs(geo.y1);
                const y2 = Math.abs(geo.y2);
                const cisArea = (y1 > y2) ? geo.y1 : geo.y2;

                // verificando se o cis se repartiu em dois, assim um positivo  e outra area negativa
                if (geo.y1 === 0 || geo.y2 === 0) {
                    if (constante === 0) {
                        const varianteArea = cisArea * bracoVariante;
                        area += varianteArea;
                    } else {
                        // calculando o momento pertencente a constante
                        const pConstante = constante * vao
                        const pVariante = Math.abs((variante * bracoVariante) / 2);
                        const areaOutVariante = (cisArea > 0) ? cisArea - pVariante : cisArea + pVariante;
                        const xBaseConstante = Math.abs(vao * areaOutVariante / pConstante)
                        const areaConstante = (areaOutVariante * xBaseConstante) / 2;
                        area += areaConstante;

                        // calculando o momento pertencente a variane.
                        let areaVariante = pVariante * bracoVariante;
                        areaVariante *= (cisArea < 0) ? -1 : 1;
                        area += areaVariante;

                    }
                } else {
                    // area do cis totalmente na parte superior ou inferior
                    const force = this.forces.filter(f => f.type === "force-linear-inclinada" && f.x1 === geo.x1)[0];
                    const partBraco = (Math.abs(force.y1) > Math.abs(force.y2)) ? (bracoVariante / 3) : (bracoVariante / 3 * 2);
                    // const partBraco = (y1 > y2) ? (bracoVariante / 3) * 2 : (bracoVariante / 3);
                    let altCis = Math.abs(y2 - y1);
                    altCis *= (cisArea > 0) ? 1 : -1;
                    if (constante === 0) {
                        const varianteArea = altCis * partBraco;
                        area += varianteArea;
                    } else {
                        // calculando o momento pertencente a constante                        
                        const pConstante = constante * vao;
                        const isGrowing = (Math.abs(force.y2) > Math.abs(force.y1)) ? true : false;
                        const parteBracoVariante = isGrowing ? (vao / 3) * 2 : vao / 3;
                        const pVariante = Math.abs((variante * parteBracoVariante));
                        let areaOutVariante = (cisArea > 0) ? cisArea - pVariante : cisArea + pVariante;
                        areaOutVariante -= (y1 < y2) ? geo.y1 : geo.y2;
                        console.log(areaOutVariante, pVariante, geo.y1, geo.y2, variante);
                        // const xBaseConstante = Math.abs(vao * areaOutVariante / pConstante)
                        const areaConstante = (areaOutVariante * vao) / 2;
                        console.log(areaConstante)
                        area += areaConstante;

                        // calculando o momento pertencente a variane.
                        // const braco2Variante = (y1 > y2) ? (vao / 3 * 2) : vao / 3;
                        let areaVariante = pVariante * partBraco;
                        areaVariante *= (cisArea < 0) ? -1 : 1;
                        console.log(areaVariante)
                        area += areaVariante;
                    }
                }

            }
            area = Number(area.toFixed(round));
            if (geo.mixed !== true) {
                areas.push({ type: type, mixed: geo.mixed, x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2, area });
                area = 0
            }
        })
        return areas;
    }
    drawDiagMomento(areas) {
        console.log(areas);
        console.log(this.forces);
        const cisAreas = areas;
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

        this.context.strokeStyle = "red";
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.translate(0, 0);
        this.context.moveTo(this.x1, this.y1);

        for (let i = 0; i < cisAreas.length; i++) {
            const cis = cisAreas[i];
            const PrevCis = (i > 0) ? cisAreas[i - 1] : null;
            const nextCis = (i < cisAreas.length - 1) ? cisAreas[i + 1] : null;
            const thisArea = cis.area;
            somAreas += thisArea;
            let mPixel2 = this.forcePixel(somAreas * (-1), mx, scale);

            if (cis.type === "force-pontual") {
                // linha reta           
                this.translate(cis.x2, 0);
                this.context.lineTo(this.x1, this.y1 + mPixel2);
                this.context.moveTo(this.x1, this.y1);
                this.context.lineTo(this.x1, this.y1 + mPixel2);
                let digNumber = Number(somAreas.toFixed(round))
                this.textForce(digNumber, this.x1, this.y1 + mPixel2, false)
            } else if (cis.type === "force-linear") {
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
                    this.context.quadraticCurveTo(xCentro, yCentro, x2 - adjCurve, y2);
                    this.context.lineTo(x2, y2);
                } else if (cis.area < 0 && PrevCis !== null && PrevCis.type === "force-linear" && PrevCis.area > 0) {
                    this.context.lineTo(x1 + adjCurve, y1);
                    this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                } else {
                    this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                }
                // this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                this.context.moveTo(x2, y0);
                this.context.lineTo(x2, y2);

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
                    this.context.quadraticCurveTo(xCentro, yCentro, x2 - adjCurve, y2);
                    this.context.lineTo(x2, y2);
                } else if (cis.area < 0 && PrevCis !== null && PrevCis.type === "force-linear" && PrevCis.area > 0) {
                    this.context.lineTo(x1 + adjCurve, y1);
                    this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                } else {
                    this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                }
                // this.context.quadraticCurveTo(xCentro, yCentro, x2, y2);
                this.context.moveTo(x2, y0);
                this.context.lineTo(x2, y2);

                let digNumber = Number(somAreas.toFixed(round))
                this.textForce(digNumber, x2, y2, false);
            }

        }
        this.context.stroke();
    }
    forcePixel(force, mx, scale) {
        return (force * scale * (-1)) / mx

    }
    textForce(force, xposition, yposition, txtCis) {
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
    }
}













module.exports = { DrawDiagramas }