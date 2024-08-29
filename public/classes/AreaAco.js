const { Tabelas } = require("./Tabelas");

class AreaAco {

    static razaoD = [
        { d: 0.15, tensao: 435 },
        { d: 0.20, tensao: 408.4 },
        { d: 0.25, tensao: 326.7 },
        { d: 0.30, tensao: 247 }
    ]

    constructor(base, altura, cobrimento, estribo, bitola, fck, fcy, mk) {
        console.log(base, altura, cobrimento, estribo, bitola, fck, fcy, mk)
        this.base = base;
        this.altura = altura;
        this.cobrimento = cobrimento;
        this.estribo = estribo;
        this.bitola = bitola;
        this.d = 0;
        this.D = 0;
        this.fck = fck;
        this.fcy = fcy;
        this.mk = mk * 100;
        this.md = 0;
        this.major = 1.4;
        this.fcd = 0;
        this.fyd = 0;
        this.calc();
    }

    calc() {
        // calcular o md
        this.md = this.major * this.mk;
        this.fcd = (this.fck / 10) / 1.4;
        this.fcd = this.redondar(this.fcd, 2)
        // calcular o d
        this.d = this.cobrimento + (this.estribo / 10) + (this.bitola / 10) / 2;
        this.D = this.altura - this.d;

        // achar o x
        // this.acharX();
    }
    acharX() {
        let xa = 0.68 * this.base * this.fcd * -(0.4);
        let xb = 0.68 * this.base * this.fcd * this.D;
        let c = this.md * (-1);
        xa = this.redondar(xa, 2);
        xb = this.redondar(xb, 2);
        c = this.redondar(c, 2);


        let delta = Math.pow(xb, 2) - 4 * xa * c;
        delta = this.redondar(delta, 2)
        let x1 = (-xb + Math.sqrt(delta)) / (2 * xa);
        let x2 = (-xb - Math.sqrt(delta)) / (2 * xa);
        x1 = this.redondar(x1, 2);
        x2 = this.redondar(x2, 2);
        let x = x1;
        let alt = this.altura - this.d

        if (x2 > alt) {
            x = (x1 < alt && x1 > 0 && x1 < x2) ? x1 : x2;
        } else {
            x = x1
        }       

        let armaduraSimples = this.dominio(x);       
        if (armaduraSimples.simples) {
            // fazer aqui armadura simples
            console.log(armaduraSimples.simples, armaduraSimples.x, armaduraSimples.razao);
            return this.AsSimples()
        } else {
            // fazer aqui armadura dupla            
            return this.AsDupla();
        }
    }
    dominio(x) {
        let razao = (x / this.D)
        razao = this.redondar(razao, 2);
        let armaduraSimples = { x: x, razao, simples: false }
        if (razao <= 0.45) armaduraSimples = { x: x, razao, simples: true }
        return armaduraSimples;
    }
    calcKmd() {
        let kmd = this.md / (this.base * Math.pow(this.D, 2) * this.fcd);
        kmd = kmd.toFixed(2)
        kmd = Number(kmd)
        return kmd;
    }
    AsSimples() {
        let kmd = this.calcKmd();
        let kz = new Tabelas(kmd).acharKzSimples()

        // calcular armadura simples
        this.fyd = this.fcy / 1.15
        this.fyd = this.redondar(this.fyd, 2);
        let As = this.md / (this.fyd * this.D * kz);
        As = this.redondar(As, 2);

        let data = new Tabelas().bitolas(this.bitola, As);
        let msg = `Area de armadura mínima é de ${As} cm2. Sujestão ${data.bitolas} barras de ${this.bitola} de diametro com área total de ${data.areaTotal} cm2`
    
        let arr = [msg]
        return arr
    }
    AsDupla() {
        // determinar M1 momento resistente do concreto
        let novoX = (this.D * 0.45).toFixed(2);
        novoX = Number(novoX);

        let m1 = 0.68 * this.base * novoX * this.fcd * (this.D - 0.4 * novoX);
        m1 = this.redondar(m1, 2)

        // determinar M2
        let m2 = (this.md - m1);
        m2 = this.redondar(m2, 2);        

        // achar a tensão d/D
        let dRazao = this.redondar(this.d / this.D, 2);

        let tensao = new Tabelas().acharTensaoDupla(dRazao);
        tensao = tensao / 10;

        // calc As comprimida
        let AsComprimida = m2 / (tensao * (this.D - this.d));
        AsComprimida = this.redondar(AsComprimida, 2);

        // calc As tracionada
        this.fyd = this.fcy / 1.15
        let AsTracionada = m1 / (this.fyd * (this.D - 0.4 * novoX))
        AsTracionada = this.redondar(AsTracionada, 2);
        
        let data = new Tabelas().bitolas(this.bitola, AsTracionada);
        let msg1 = `Area de armadura mínima tracionada é de ${AsTracionada} cm2. Sujestão ${data.bitolas} barras de ${this.bitola} de diametro com área total de ${data.areaTotal} cm2`
    
        let data2 = new Tabelas().bitolas(this.bitola, AsComprimida);
        let msg2 = `Area de armadura mínima comprimida é de ${AsComprimida} cm2. Sujestão ${data2.bitolas} barras de ${this.bitola} de diametro com área total de ${data2.areaTotal} cm2`
        let arr = [msg1,msg2]
        return arr
    }
    redondar(valor, indice) {
        let num = valor.toFixed(indice);
        num = Number(num);
        return num
    }


}




module.exports = { AreaAco }