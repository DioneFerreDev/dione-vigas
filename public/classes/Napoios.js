

class Napoios {

    constructor(coefficientes, constants) {
        this.coefficientes = coefficientes;
        this.constants = constants;
        this.solveEquations();
    }
    solveEquations() {
        // Coeficientes das equações
        // var coefficients = [
        //     [1.67, 0.33, 0],
        //     [0.33, 1.67, 0.5],
        //     [0, 0.5, 2]
        // ];

        // Constantes das equações
        // var constants = [64.92, -46.67, 0];

        // Resolvendo o sistema de equações
        var solution = this.gaussianElimination(this.coefficientes, this.constants);
        return solution;
    }
    // Função para aplicar a eliminação de Gauss
    gaussianElimination(coefficients, constants) {
        var n = coefficients.length;

        // Fase de eliminação
        for (var i = 0; i < n; i++) {
            // Encontrar o pivô
            var pivot = coefficients[i][i];

            // Normalizar a linha do pivô
            for (var j = i; j < n; j++) {
                coefficients[i][j] /= pivot;
            }
            constants[i] /= pivot;

            // Eliminar outras linhas
            for (var k = 0; k < n; k++) {
                if (k !== i) {
                    var factor = coefficients[k][i];
                    for (var l = i; l < n; l++) {
                        coefficients[k][l] -= factor * coefficients[i][l];
                    }
                    constants[k] -= factor * constants[i];
                }
            }
        }

        // Fase de substituição
        var solution = [];
        for (var m = 0; m < n; m++) {
            solution.push(-constants[m]); // Invertendo o sinal aqui
        }

        return solution;
    }

    // Testando a função
    // var result = solveEquations();
    // console.log("Solução do sistema de equações:", result);
}


module.exports = { Napoios };