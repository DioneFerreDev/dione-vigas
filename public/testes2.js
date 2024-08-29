// n esta atualizando a matriz


document.addEventListener("DOMContentLoaded", () => {




    // let matriz = [
    //     [1, -1, 0, -1, 0],
    //     [0, 1, 1, 1, 2],
    //     [1, 2, 2, 4, 8],
    //     [2, 3, -4, 0, 8]
    // ]
    // let matriz = [
    //     [1, -1, 0, -1, 0],
    //     [0, 1, 1, 1, 2],
    //     [0, 3, 2, 5, 8],
    //     [0, 5, -4, 2, 8]
    // ]
    // let matriz = [
    //     [1, -1, 0, -1, 0],
    //     [0, 1, 1, 1, 2],
    //     [0, 0, -1, 2, 2],
    //     [0, 0, -9, -3, -2]
    // ]
    let matriz = [
        [3, 4, 10],
        [2, 3, 7]
    ]


    let variaveis = [];
    // matriz.forEach((eq, i) => variaveis[i] = 0);
    let col = 0;
    let indexEqRef = 0;
    let matrizEscalonada = [...matriz];
    let matrizAuxiliar = [];




    for (let i = 0; i < (matriz.length - 1); i++) {
        matrizAuxiliar = [];
        for (let eq = 0; eq <= indexEqRef; eq++) {
            matrizAuxiliar.push(matrizEscalonada[eq]);
        }
        Calc();      
        if (i === matriz.length - 2) {
            // agora finalmente fazer o codigo para isolar var e achar seus valores

            for (eq = matrizEscalonada.length - 1; eq >= 0; eq--) {               
                acharVariavel(matrizEscalonada[eq], eq);
            }
        }
    }
    console.log(variaveis)



    function Calc() {
        for (let i = 1 + col; i < matrizEscalonada.length; i++) {


            let equation = matrizEscalonada[i];

            /// se o primeiro valor da equação for diferente de zero, precisamos escalona-la
            // assim vamos pegar justamente a linha acima como referencia
            let eqReferencia = matrizEscalonada[indexEqRef];
            let mult = multiplicador(eqReferencia[col], equation[col]);

            let eqEqualizada = equalizar(eqReferencia, equation, mult);
            matrizAuxiliar = [...matrizAuxiliar, eqEqualizada]
        }

        matrizEscalonada = [...matrizAuxiliar];

        col++;
        indexEqRef++
    }















    function acharVariavel(equation, indexVar) {
        let valor = 0
        let variavel = 0
        let resultado = 0;

        for (let i = 0; i < equation.length; i++) {            
            if (equation[i] !== 0 && indexVar !== i && variaveis[i] !== undefined) {
                valor += equation[i] * variaveis[i];
            } else if (indexVar === i) {
                variavel = equation[i];
            } else if (i === equation.length - 1) {
                resultado = equation[i];
            }
        }
        variaveis[indexVar] = Number(((resultado + valor * (-1)) / variavel).toFixed(3));
        valor = 0
        variavel = 0
        resultado = 0
    }
    function multiplicador(valorRef, valor) {
        let mult = Number((valor * (-1) / valorRef).toFixed(3))
        return mult;
    }
    function equalizar(eqRef, eq, mult) {
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

})

