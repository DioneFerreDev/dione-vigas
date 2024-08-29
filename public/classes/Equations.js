class Equations {



    constructor(matriz) {
        this.matriz = matriz;
        this.variaveis = [];
        this.col = 0;
        this.indexEqRef = 0;
        this.matrizEscalonada = [...matriz];
        this.matrizAuxiliar = [];
        this.main();
    }
    main() {
        for (let i = 0; i < (this.matriz.length - 1); i++) {
            this.matrizAuxiliar = [];
            for (let eq = 0; eq <= this.indexEqRef; eq++) {
                this.matrizAuxiliar.push(this.matrizEscalonada[eq]);
            }
            this.Calc();
            if (i === this.matriz.length - 2) {
                // agora finalmente fazer o codigo para isolar var e achar seus valores

                for (eq = this.matrizEscalonada.length - 1; eq >= 0; eq--) {
                    this.acharVariavel(this.matrizEscalonada[eq], eq);
                }
            }
        }
        return this.variaveis
    }
    Calc() {
        for (let i = 1 + this.col; i < this.matrizEscalonada.length; i++) {


            let equation = this.matrizEscalonada[i];

            /// se o primeiro valor da equação for diferente de zero, precisamos escalona-la
            // assim vamos pegar justamente a linha acima como referencia
            let eqReferencia = this.matrizEscalonada[this.indexEqRef];
            let mult = this.multiplicador(eqReferencia[this.col], equation[this.col]);

            let eqEqualizada = this.equalizar(eqReferencia, equation, mult);
            this.matrizAuxiliar = [...this.matrizAuxiliar, eqEqualizada]
        }

        this.matrizEscalonada = [...this.matrizAuxiliar];

        this.col++;
        this.indexEqRef++
    }
    acharVariavel(equation, indexVar) {
        let valor = 0
        let variavel = 0
        let resultado = 0;

        for (let i = 0; i < equation.length; i++) {
            if (equation[i] !== 0 && indexVar !== i && this.variaveis[i] !== undefined) {
                valor += equation[i] * this.variaveis[i];
            } else if (indexVar === i) {
                variavel = equation[i];
            } else if (i === equation.length - 1) {
                resultado = equation[i];
            }
        }
        this.variaveis[indexVar] = Number(((resultado + valor * (-1)) / variavel).toFixed(3));
        valor = 0
        variavel = 0
        resultado = 0
    }
    multiplicador(valorRef, valor) {
        let mult = Number((valor * (-1) / valorRef).toFixed(3))
        return mult;
    }
    equalizar(eqRef, eq, mult) {
        let arr = [];
        eqRef.forEach(valor => {
            valor *= mult;
            arr.push(valor)
        })

        eq.forEach((vEq, i) => {
            arr[i] += vEq;
        })
        return arr
    }

}


module.exports = { Equations };





























