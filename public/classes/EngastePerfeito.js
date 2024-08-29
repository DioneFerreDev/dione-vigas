

class EngastePerfeito {
    constructor(leftApoio, rightApoio, data, leftEdge, rightEdge) {
        this.leftApoio = leftApoio;
        this.rightApoio = rightApoio;
        this.data = data;
        this.leftEdge = leftEdge;
        this.rightEdge = rightEdge;
        this.reactionMomentoLeft = 0;
        this.reactionMomentoRight = 0;
    }

    mReactionPontual() {
        // calcular aqui a reação de momento
        const a = Math.abs(this.data.x - this.leftEdge);
        const b = Math.abs(this.data.x - this.rightEdge);
        const l = a + b;
        const p = Math.abs(this.data.force);

        if (this.leftApoio === "engaged" && this.rightApoio === "engaged") {
            this.reactionMomentoLeft += (p * a * b * b) / (l * l);
            this.reactionMomentoRight += ((p * a * a * b) / (l * l)) * -1;
        } else if (this.leftApoio === "fixed" && this.rightApoio === "engaged" || this.leftApoio === "free" && this.rightApoio === "engaged") {
            this.reactionMomentoLeft += 0;
            this.reactionMomentoRight += ((p * a * b) / (2 * l * l)) * (l + a) * (-1);
        } else if (this.leftApoio === "engaged" && this.rightApoio === "fixed" || this.leftApoio === "engaged" && this.rightApoio === "fixed") {           
            this.reactionMomentoLeft += ((p * a * b) / (2 * l * l)) * (l + b);
            this.reactionMomentoRight += 0;
        }

        return { momentoLeft: this.reactionMomentoLeft, momentoRight: this.reactionMomentoRight }
    }
    mReactionLinear() {
        // calcular aqui a reação de momento
        const a = Math.abs(this.data.x1 - this.leftEdge);
        const b = Math.abs(this.data.x2 - this.rightEdge);
        const c = Math.abs(this.data.x2 - this.data.x1);
        const l = Math.abs(this.rightEdge - this.leftEdge);
        const p = Math.abs(this.data.force);

        if (this.leftApoio === "engaged" && this.rightApoio === "engaged") {

            if (a === 0 && b === 0) {
                this.reactionMomentoLeft += (p * Math.pow(l, 2)) / (12);
                this.reactionMomentoRight += (p * Math.pow(l, 2)) / (12) * (-1);
            } else if (a === 0 && b !== 0) {
                this.reactionMomentoLeft += ((p * Math.pow(c, 2)) / (12 * Math.pow(l, 2))) * (6 * Math.pow(b, 2) + 4 * b * c + Math.pow(c, 2));
                this.reactionMomentoRight += ((p * Math.pow(c, 2)) / (12 * Math.pow(l, 2))) * (4 * b * c + Math.pow(c, 2)) * (-1);
            } else if (a !== 0 && b === 0) {
                this.reactionMomentoLeft += (p * Math.pow(c, 2)) / (12 * Math.pow(l, 2)) * (4 * a * c + Math.pow(c, 2));
                this.reactionMomentoRight += ((p * Math.pow(c, 2)) / (12 * Math.pow(l, 2))) * (6 * Math.pow(a, 2) + 4 * a * c + Math.pow(c, 2)) * (-1);
            }

        } else if (this.leftApoio === "fixed" && this.rightApoio === "engaged" || this.leftApoio === "free" && this.rightApoio === "engaged") {
            this.reactionMomentoLeft += 0;
            if (a === 0 && b === 0) {
                this.reactionMomentoRight += (p * Math.pow(l, 2)) / (8) * (-1);
            } else if (a === 0 && b !== 0) {
                this.reactionMomentoRight += ((p * Math.pow(c, 2)) / (8 * Math.pow(l, 2))) * (2 * Math.pow(l, 2) - Math.pow(c, 2)) * (-1);
            } else if (a !== 0 && b === 0) {
                this.reactionMomentoRight += ((p * c * c) / (8 * l * l)) * Math.pow(l + a, 2) * (-1);
            }

        } else if (this.leftApoio === "engaged" && this.rightApoio === "fixed" || this.leftApoio === "engaged" && this.rightApoio === "free") {
            this.reactionMomentoRight += 0;

            if (a === 0 && b === 0) {
                this.reactionMomentoLeft += (p * Math.pow(l, 2)) / (8);
            } else if (a === 0 && b !== 0) {
                this.reactionMomentoLeft += ((p * Math.pow(c, 2)) / (8 * Math.pow(l, 2))) * Math.pow(l + b, 2);
            } else if (a !== 0 && b === 0) {
                this.reactionMomentoLeft += ((p * c * c) / (8 * l * l)) * (2 * Math.pow(l, 2) - Math.pow(c, 2));
            }
        }

        return { momentoLeft: this.reactionMomentoLeft, momentoRight: this.reactionMomentoRight }
    }
    mReactionMomento() {
        const a = Math.abs(this.data.x - this.leftEdge);
        const b = Math.abs(this.data.x - this.rightEdge);
        const l = Math.abs(this.rightEdge - this.leftEdge);
        const m = this.data.momento;


        if (this.leftApoio === "engaged" && this.rightApoio === "engaged") {
            this.reactionMomentoLeft += ((m * b) / (Math.pow(l, 2))) * (3 * b - 2 * l);
            this.reactionMomentoRight += ((m * b) / (Math.pow(l, 2))) * (2 * l - 3 * a) * (-1);

        } else if (this.leftApoio === "fixed" && this.rightApoio === "engaged" || this.leftApoio === "free" && this.rightApoio === "engaged") {
            this.reactionMomentoLeft += 0;
            this.reactionMomentoRight += ((m) / (2 * Math.pow(l, 2))) * (Math.pow(l, 2) - 3 * Math.pow(a, 2)) * (-1);

        } else if (this.leftApoio === "engaged" && this.rightApoio === "fixed" || this.leftApoio === "engaged" && this.rightApoio === "free") {
            this.reactionMomentoRight += 0;

            this.reactionMomentoLeft += (m / (2 * Math.pow(l, 2))) * (3 * Math.pow(b, 2) - Math.pow(l, 2));
        }

        return { momentoLeft: this.reactionMomentoLeft, momentoRight: this.reactionMomentoRight }
    }
    mReactionLinearInclinado() {
        const a = Math.abs(this.data.x1 - this.leftEdge);
        const b = Math.abs(this.data.x2 - this.rightEdge);
        const c = Math.abs(this.data.x2 - this.data.x1)
        const l = Math.abs(this.rightEdge - this.leftEdge);
        let p = (Math.abs(this.data.force.forceY1) > Math.abs(this.data.force.forceY2)) ? this.data.force.forceY1 : this.data.force.forceY2;
        const isGrowing = (Math.abs(this.data.force.forceY1) > Math.abs(this.data.force.forceY2)) ? false : true;
        p = Math.abs(p);

        if (isGrowing) {
            // linear por toda a viga
            if (a === 0 && b === 0) {
                if (this.leftApoio === "fixed" && this.rightApoio === "engaged" || this.leftApoio === "free" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += 0;
                    this.reactionMomentoRight += ((p * l * l) / 15) * (-1);
                } else if (this.leftApoio === "engaged" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += (p * l * l) / 30;
                    this.reactionMomentoRight += ((p * l * l) / 20) * (-1);
                } else if (this.leftApoio === "engaged" && this.rightApoio === "fixed" || this.leftApoio === "engaged" && this.rightApoio === "free") {
                    this.reactionMomentoLeft += (7 * p * l * l) / 120;
                    this.reactionMomentoRight += 0;
                }
            }else{
                if (this.leftApoio === "fixed" && this.rightApoio === "engaged" || this.leftApoio === "free" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += 0;
                    this.reactionMomentoRight += (((p*c)/(108*l*l))*(3*a+2*c)) * (9*(l*l-a*a) - 12*a*c - c*c*(4+((45*a+28*c)/(30*a+20*c)))) * (-1);
                } else if (this.leftApoio === "engaged" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += ((p*c)/(540*l*l)) * (10*Math.pow(3*b+c,2)*(3*a+2*c)-15*c*c*(3*b-l) - 17*Math.pow(c,3) );
                    this.reactionMomentoRight += ((p*c)/(540*l*l)) * (10*(3*b+c) * Math.pow(3*a+2*c, 2) - 15*c*c*(3*a-l) - 28 * Math.pow(c,3)) * (-1);
                } else if (this.leftApoio === "engaged" && this.rightApoio === "fixed" || this.leftApoio === "engaged" && this.rightApoio === "free") {
                    this.reactionMomentoLeft += ((p*c)/(108*l*l) * (3*b+c)) * (9*(l*l - b*b) - 6*b*c - c*c* (1 + 9*((45*b+17*c) / (270*b + 90*c))));
                    this.reactionMomentoRight += 0;
                }
            }
        } else {
            if (a === 0 && b === 0) {
                if (this.leftApoio === "fixed" && this.rightApoio === "engaged" || this.leftApoio === "free" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += 0;
                    this.reactionMomentoRight += ((7*p*l*l)/120) * (-1);
                } else if (this.leftApoio === "engaged" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += (p*l*l)/20;
                    this.reactionMomentoRight += ((p * l * l) / 30) * (-1);
                } else if (this.leftApoio === "engaged" && this.rightApoio === "fixed" || this.leftApoio === "engaged" && this.rightApoio === "free") {
                    this.reactionMomentoLeft += (p * l * l) / 15;
                    this.reactionMomentoRight += 0;
                }
            }else{
                if (this.leftApoio === "fixed" && this.rightApoio === "engaged" || this.leftApoio === "free" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += 0;
                    this.reactionMomentoRight += ( (p*c) / (108*l*l) * (3*a + c) ) * (9*(l*l - a*a) - 6*a*c - c*c * (1 + 9*((45*a+17*c)/(270*a + 90*c))) )*(-1);
                } else if (this.leftApoio === "engaged" && this.rightApoio === "engaged") {
                    this.reactionMomentoLeft += ((p*c)/(570*l*l)) * (10*(3*a + c) * Math.pow(3*b+2*c, 2) - 15*c*c * (3*b - l) - 28*Math.pow(c,3)) ;
                    this.reactionMomentoRight += ((p*c)/(540*l*l)) * (10*Math.pow(3*a+c, 2)*(3*b+2*c) - 15*c*c * (3*a-l) - 17*Math.pow(c,3))  * (-1) ;
                } else if (this.leftApoio === "engaged" && this.rightApoio === "fixed" || this.leftApoio === "engaged" && this.rightApoio === "free") {
                    this.reactionMomentoLeft += ((p*c)/(108*l*l) * (3*b + 2*c)) * (9*(l*l - b*b) - 12*b*c - c*c * (4 + (45*b + 28*c) / (30*b + 20*c)));
                    this.reactionMomentoRight += 0;
                }
            }
        }

        return { momentoLeft: this.reactionMomentoLeft, momentoRight: this.reactionMomentoRight }
    }

}







module.exports = { EngastePerfeito };