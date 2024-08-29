document.addEventListener("DOMContentLoaded", () => {

    let Eqs = [];
    let D = []
    Eqs[1] = " -64.92 1.67D1 -0.33D2 0D3";
    console.log(Eqs[1])
    let t = Eqs[1].replace(/\s-{0,}[0-9.]+/gi, x => {
        console.log(x)                
        x= ` ${x * (-1)}`
        return x
    });
    console.log(t)
    // let strTest = "Dione DioneT Dione DioneTt";

    // const t = strTest.replace(/ dione(t)+/gi, x => {
    //     console.log(x)
    // });








    let Ds = [0, 1, 1, 1]
    let ds = [0, "D1", "D2", "D3"]


    let eq = 0;

    const eq11 = "+64.92 +1.67D1 +0.33D2 +0D3";
    const eq22 = "-46.67 +0.33D1 +1.67D2 +0.5D3";
    const eq33 = "+0 +0D1 +0.5D2 +2D3";
    let eq1 = `+64.92 +${1.67 * Ds[1] + ds[1]} +${0.33 * Ds[2] + ds[2]} +${0 * Ds[3] + ds[3]}`;
    let eq2 = `-46.67 +${0.33 * Ds[1] + ds[1]} +${1.67 * Ds[2] + ds[2]} +${0.5 * Ds[3] + ds[3]}`;
    let eq3 = `+0 +${0 * Ds[1] + ds[1]} +${0.5 * Ds[2] + ds[2]} +${2 * Ds[3] + ds[3]}`;
    // const eq3 = "+0 +0D1 +0.5D2 +2D3";
    let equations = [eq1, eq2, eq3];
    let c = 0;
    while (c < equations.length) {

        c++;
    }


    function mainEquation() {

    }
    function resetting(valor, D) {
        Ds[D] = valor;
        ds[D] = "";

        eq1 = `+64.92 +${1.67 * Ds[1] + ds[1]} +${0.33 * Ds[2] + ds[2]} +${0 * Ds[3] + ds[3]}`;
        eq2 = `-46.67 +${0.33 * Ds[1] + ds[1]} +${1.67 * Ds[2] + ds[2]} +${0.5 * Ds[3] + ds[3]}`;
        eq3 = `+0 +${0 * Ds[1] + ds[1]} +${0.5 * Ds[2] + ds[2]} +${2 * Ds[3] + ds[3]}`;
        equations = [eq1, eq2, eq3]
    }

    let result = null;
    let equation = null;
    for (let i = 0; i < equations.length; i++) {
        // separar
        const caso = i + 1;
        if (caso > 1) {
            result = substituirEquationD(result.eqSimplificada, result.D, equations[i], caso);
            if (isNaN(Number(result.eqSimplificada)) === false) {
                resetting(Number(result.eqSimplificada), result.D);
            }
        } else {
            equation = equations[i];
            result = separar(equation, caso);
        }

        // fazer aqui a substituição do D1 na equação
    }
    function substituirEquationD(eqSimplificada, D, equation, caso) {
        let equationSeparada = equation.split(" ");
        equationSeparada = equationSeparada.filter(eq => eq !== "");
        let novaEq = "";
        let multiplicador = 0

        // substituindo o D e fazendo a multiplicação
        equationSeparada.forEach(eq => {
            const hasD = eq.split(`D${D}`);
            if (hasD.length > 1) {
                multiplicador = hasD[0];
                let eqSimplificadaSeparada = eqSimplificada.split(" ");
                eqSimplificadaSeparada = eqSimplificadaSeparada.filter(eq => eq !== "");

                eqSimplificadaSeparada.forEach(part => {
                    let numero = part.split("D");
                    if (numero.length > 1) {
                        const valor = Number(multiplicador) * Number(numero[0]);
                        if (valor > 0) novaEq += `+${valor}D${numero[1]} `;
                        if (valor < 0) novaEq += `${valor}D${numero[1]} `;
                    } else {
                        const valor = Number(multiplicador) * Number(numero[0]);
                        if (valor > 0) novaEq += `+${valor} `;
                        if (valor < 0) novaEq += `${valor} `;
                    }
                });
            }
        });

        // simplificando na equação final
        let equationReplaced = equation;
        const expression = multiplicador + "D" + D;
        equationReplaced = equationReplaced.replace(expression, novaEq)

        equationReplaced = equationReplaced.split(" ")
        equationReplaced = equationReplaced.filter(eq => eq !== "");

        let eqFinal = "";
        let valorFinal = 0;
        let Ds = []
        equationReplaced.forEach(eq => {
            const hasD = eq.split("D");
            if (hasD.length > 1) {
                const indice = Number(hasD[1])
                Ds[indice] = (Ds[indice] === undefined) ? Number(hasD[0]) : Number(hasD[0]) + Ds[indice];
            } else {
                valorFinal += Number(hasD[0]);
            }
        });
        if (valorFinal > 0) eqFinal += `+${valorFinal} `;
        if (valorFinal < 0) eqFinal += `${valorFinal} `;

        Ds.forEach((valor, i) => {
            if (valor > 0) eqFinal += `+${valor}D${i} `;
            if (valor < 0) eqFinal += `${valor}D${i} `
        });

        eqFinal = separar(eqFinal, caso);
        return eqFinal
    }

    function separar(equation, caso) {
        let eqSeparada = equation.split(" ");
        eqSeparada = eqSeparada.filter(eq => eq !== "")
        // pegar o primeiro D;
        let D = `D${caso}`;
        let multiplicador = 0;
        let eqSimplificada = "";
        for (let i = 0; i < eqSeparada.length; i++) {
            if (eqSeparada.length > 1) {
                const hasD = eqSeparada[i].split(D);
                if (hasD.length > 1) {
                    multiplicador = hasD[0];

                    // isolar o D e simplificar e equação
                    let novaEq = equation.split(multiplicador + D);
                    novaEq = novaEq[0] + novaEq[1];

                    // invertendo de lado da igualdade e mudando os sinais
                    novaEq = novaEq.replace(/\+|-/g, match => {
                        switch (match) {
                            case "+":
                                return "-";
                            case "-":
                                return "+";
                            case "++":
                                return "+";
                            case "+-":
                                return "-";
                            case "--":
                                return "-";
                            case "-+":
                                return "+";
                        }
                    });

                    // fazendo a simplificação;
                    novaEq = novaEq.split(" ");
                    novaEq = novaEq.filter(eq => eq !== "");
                    novaEq.forEach(valor => {
                        const hasD = valor.split("D");
                        if (hasD.length > 1) {
                            const simplificado = Number(hasD[0]) / Number(multiplicador);
                            eqSimplificada += ` ${simplificado}D${hasD[1]}`
                        } else {
                            const simplificado = Number(hasD[0]) / Number(multiplicador);
                            eqSimplificada += ` ${simplificado}`
                        }
                    });
                    return { eqSimplificada, D: caso }
                }
            }
        }
    }














    // let equation = Eqs[1].replace(/-?[0-9.]+[a-z][0-9]+/gi, (x) => {
    //     D.push(x);
    //     if (x !== D[0]) {
    //         return x
    //     } else {
    //         return "";
    //     }
    // });

})