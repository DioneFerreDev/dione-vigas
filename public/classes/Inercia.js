

class Inercia {
    constructor(dimensions, geometry) {
        this.dimensions = dimensions;
        this.geometry = geometry
        this.main();
    }

    main() {
        if (this.geometry === "t-shape") this.IneTShape();
    }
    IneTShape() {
        // calcular yg e xg
        let s1 = this.dimensions.b * this.dimensions.tf;
        let s2 = this.dimensions.tw * (this.dimensions.d - this.dimensions.tf);
        let x1 = this.dimensions.b / 2;
        let x2 = this.dimensions.b / 2;
        let y1 = this.dimensions.d - (this.dimensions.tf / 2);
        let y2 = (this.dimensions.d - this.dimensions.tf) / 2;

        let xg = ((x1 * s1) + (x2 * s2)) / (s1 + s2);
        let yg = ((y1 * s1) + (y2 * s2)) / (s1 + s2);

        let d1 = y1 - yg;
        let d2 = y2 - yg;
        let delta1 = x1 - xg;
        let delta2 = x2 - xg;

        let inerciaX1 = this.inerX(this.dimensions.b, this.dimensions.tf, d1, s1);
        let inerciaX2 = this.inerX(this.dimensions.tw, this.dimensions.d - this.dimensions.tf, d2, s2);
        let inerX = inerciaX1 + inerciaX2;

        let inerciaY1 = this.inerY(this.dimensions.b, this.dimensions.tf, delta1, s1);
        let inerciaY2 = this.inerY(this.dimensions.tw, this.dimensions.d - this.dimensions.tf, delta2, s2);
        let inerY = inerciaY1 + inerciaY2;

        inerX = inerX.toFixed(2);
        inerX = Number(inerX)
        inerY = inerY.toFixed(2);
        inerY = Number(inerY);
        console.log(inerX)
    }
    inerX(b, h, d0, s0) {
        let i = (b * (Math.pow(h, 3)) / 12) + Math.pow(d0, 2) * s0;
        i = Number(i.toFixed(2));
        return i;
    }
    inerY(b, h, delta0, s0) {
        let i = ((Math.pow(b, 3) * h) / 12) + Math.pow(delta0, 2) * s0;
        i = Number(i.toFixed(2));
        return i;
    }

}




module.exports = { Inercia }