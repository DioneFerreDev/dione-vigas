const round = 3;
const { EngastePerfeito } = require("./EngastePerfeito");
const { Deslocamentos } = require("./Deslocamentos");
const { Equations } = require("./Equations");
const { DrawDiagramas } = require("./DrawDiagramas");
// const { Napoios } = require("../classes/Napoios");

class CalcForces {

    static momentoEngaste = { isEngaged: false };

    constructor(data = null) {
        if (data !== null) {
            this.fPontual = data.filter(el => el.type === "force-pontual");
            this.fLinear = data.filter(el => el.type === "force-linear");
            this.fInclinado = data.filter(el => el.type === "force-linear-inclinada");
            this.momento = data.filter(el => el.type === "momento");
            this.balancoInitial = { force: 0, ok: false };
            this.balancoFinal = { force: 0, ok: false };
            this.apoios = data.filter(el => el.type === "apoio");
            this.apoios.sort((a, b) => { return a.firstx - b.firstx });
            this.points = data.filter(el => el.type === "point");
        }
    }

    forces() {
        let fVertical = 0;
        if (this.fLinear.length > 0) {
            this.fLinear.forEach(f => {
                fVertical += f.force * (f.x2 - f.x1);
            });
        }
        if (this.fPontual.length > 0) {
            this.fPontual.forEach(f => {
                fVertical += f.force;
            });
        }
        if (this.fInclinado.length > 0) {
            this.fInclinado.forEach(f => {
                const fconstante = (Math.abs(f.force.forceY1) < Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                const fvariante = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                fVertical += fconstante * Math.abs(f.x2 - f.x1);
                fVertical += ((fvariante - fconstante) * Math.abs(f.x2 - f.x1)) / 2;
            })
        }
        // fazer com as demais forças

        //calc os apoios
        if (this.apoios.length === 2) {
            let mVa = 0;
            // calc o momento
            this.apoios.sort((a, b) => { return a.firstx - b.firstx });
            const xapoioVa = this.apoios[0].firstx;
            if (this.fLinear.length > 0) {
                this.fLinear.forEach(f => {
                    const vao = Math.abs(f.x2 - f.x1);
                    const fPontual = f.force * vao;
                    const xPosition = (vao / 2) + f.x1;
                    const braco = xapoioVa - xPosition;
                    mVa += fPontual * braco;
                });
            }
            if (this.fPontual.length > 0) {
                this.fPontual.forEach(f => {
                    const braco = xapoioVa - f.x;
                    const pontual = f.force
                    mVa += pontual * braco;
                });
            }
            if (this.fInclinado.length > 0) {
                this.fInclinado.forEach(f => {
                    const vao = Math.abs(f.x2 - f.x1);
                    let xPosition = 0;
                    let braco = 0;
                    let fVariante = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                    const fConstante = (Math.abs(f.force.forceY1) < Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                    fVariante = fVariante - fConstante;

                    // calculando a variante
                    const tercoVao = vao / 3;
                    xPosition = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.x1 + tercoVao : f.x2 - tercoVao;
                    braco = xapoioVa - xPosition;
                    const pVariante = (fVariante * vao) / 2;
                    mVa += pVariante * braco;

                    // calculando a constante;
                    xPosition = f.x1 + Math.abs(f.x2 - f.x1) / 2;
                    braco = xapoioVa - xPosition;
                    const pConstante = fConstante * vao;
                    mVa += pConstante * braco;
                })
            }
            // pegar a distancia entre b e a
            const xapoioVb = this.apoios[1].firstx;
            const mVb = (xapoioVa - xapoioVb);
            // fazer o momento       
            mVa *= -1;
            let vb = (mVa / mVb);
            // fazer a conta do va va+vb =sv //=> va = (vb + sv) * -1            
            let va = (vb + fVertical) * (-1);
            va = Number(va.toFixed(round));
            vb = Number(vb.toFixed(round));


            return ([
                { type: "force-pontual", x: this.apoios[0].firstx, y: this.apoios[0].firsty, force: va },
                { type: "force-pontual", x: this.apoios[1].firstx, y: this.apoios[0].firsty, force: vb }
            ]
            )
        } else {
            // verificar se há viga em balanço, se houver passar o momento para o apio mais próximo
            let momentoBalanco = 0;
            let verticalBalanco = 0;
            const firstApoio = this.apoios.reduce((a, b) => {
                if (b.firstx < a.firstx) a = b;
                return a;
            });
            const latestApoio = this.apoios.reduce((a, b) => {
                if (b.firstx > a.firstx) a = b;
                return a;
            });

            // calc momento no primeiro apoio
            if (this.fPontual.length > 0) {
                this.fPontual.forEach(f => {
                    if (f.x < firstApoio.firstx) {
                        const braco = firstApoio.firstx - f.x;
                        const force = f.force;
                        verticalBalanco += force;
                        momentoBalanco += force * braco;
                    }
                });
            }
            if (this.fLinear.length > 0) {
                this.fLinear.forEach(f => {
                    if (f.x1 < firstApoio.firstx) {
                        const vao = Math.abs(f.x2 - f.x1);
                        const fPontual = f.force * vao;
                        const xPosition = f.x1 + vao / 2;
                        const braco = firstApoio.firstx - xPosition
                        momentoBalanco += fPontual * braco;
                        verticalBalanco += fPontual;
                    }
                });
            }
            if (this.fInclinado.length > 0) {
                this.fInclinado.forEach(f => {
                    if (f.x1 < firstApoio.firstx) {
                        const vao = Math.abs(f.x2 - f.x1);
                        let xPosition = 0;
                        let braco = 0;
                        let fVariante = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                        const fConstante = (Math.abs(f.force.forceY1) < Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                        fVariante = fVariante - fConstante;

                        // calculando a variante
                        const tercoVao = vao / 3;
                        xPosition = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.x1 + tercoVao : f.x2 - tercoVao;
                        braco = firstApoio.firstx - xPosition;
                        const pVariante = (fVariante * vao) / 2;
                        momentoBalanco += pVariante * braco;
                        verticalBalanco += pVariante;

                        // calculando a constante;
                        xPosition = f.x1 + Math.abs(f.x2 - f.x1) / 2;
                        braco = firstApoio.firstx - xPosition;
                        const pConstante = fConstante * vao;
                        momentoBalanco += pConstante * braco;
                        verticalBalanco += pConstante;
                    }
                });
            }
            if (momentoBalanco !== 0) this.momento.push({ x: firstApoio.firstx, type: "force-momento", momento: momentoBalanco });
            if (verticalBalanco !== 0) {
                this.balancoInitial.force = verticalBalanco;
                this.balancoInitial.ok = true;
            }
            momentoBalanco = 0;
            verticalBalanco = 0;
            // calc momento no ultimo apoio
            if (this.fPontual.length > 0) {
                this.fPontual.forEach(f => {
                    if (f.x > latestApoio.firstx) {
                        const braco = latestApoio.firstx - f.x;
                        const force = f.force;
                        momentoBalanco += force * braco;
                        verticalBalanco += force;
                    }
                });
            }
            if (this.fLinear.length > 0) {
                this.fLinear.forEach(f => {
                    if (f.x1 >= latestApoio.firstx) {
                        const vao = Math.abs(f.x2 - f.x1);
                        const fPontual = f.force * vao;
                        const xPosition = f.x1 + vao / 2;
                        const braco = latestApoio.firstx - xPosition
                        momentoBalanco += fPontual * braco;
                        verticalBalanco += fPontual;
                    }
                });
            }
            if (this.fInclinado.length > 0) {
                this.fInclinado.forEach(f => {
                    if (f.x1 >= latestApoio.firstx) {
                        const vao = Math.abs(f.x2 - f.x1);
                        let xPosition = 0;
                        let braco = 0;
                        let fVariante = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                        const fConstante = (Math.abs(f.force.forceY1) < Math.abs(f.force.forceY2)) ? f.force.forceY1 : f.force.forceY2;
                        fVariante = fVariante - fConstante;

                        // calculando a variante
                        const tercoVao = vao / 3;
                        xPosition = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? f.x1 + tercoVao : f.x2 - tercoVao;
                        braco = latestApoio.firstx - xPosition;
                        const pVariante = (fVariante * vao) / 2;
                        momentoBalanco += pVariante * braco;
                        verticalBalanco += pVariante;

                        // calculando a constante;
                        xPosition = f.x1 + Math.abs(f.x2 - f.x1) / 2;
                        braco = latestApoio.firstx - xPosition;
                        const pConstante = fConstante * vao;
                        momentoBalanco += pConstante * braco;
                        verticalBalanco += pConstante;
                    }
                });
            }
            // this.fPontual           

            //sistema isogeometrico
            for (let i = 0; i < this.apoios.length; i++) {
                if (i !== 0 && i !== this.apoios.length - 1) this.apoios[i].kind = "engaged";
            }

            if (momentoBalanco !== 0) this.momento.push({ x: latestApoio.firstx, type: "force-momento", momento: momentoBalanco });
            if (verticalBalanco !== 0) {
                this.balancoFinal.force = verticalBalanco;
                this.balancoFinal.ok = true;
            }

            // Problema 0, caso 0 achar as reações de momentos causado pelas cargas utilizando a tabela de engaste perfeito;
            let verticaisTotal = [];
            let reactionMomentos = [];
            let tramosReactionMomentos = [];
            let tramosDeslocamentos = [];
            for (let i = 0; i < this.apoios.length; i++) {
                const CurrentApoio = this.apoios[i];
                let momentoLeft = 0;
                let momentoRight = 0;
                let momento = 0;
                let verticais = 0;

                // verificando se n é o ultimo apoio
                if (CurrentApoio.firstx !== latestApoio.firstx) {
                    const nextApoio = this.apoios[i + 1];
                    const points = this.points.filter(point => point.x > CurrentApoio.firstx && point.x < nextApoio.firstx);

                    // pegando as pontuais
                    if (this.fPontual.length > 0) {
                        this.fPontual.forEach(f => {
                            if (f.x >= CurrentApoio.firstx && f.x < nextApoio.firstx) {
                                // tipo da força,tipo apoio esquerdo, tipo apoio direito,data da força,inicio da viga, fim da viga.
                                let m = new EngastePerfeito(CurrentApoio.kind, nextApoio.kind, f, CurrentApoio.firstx, nextApoio.firstx);
                                m = m.mReactionPontual();
                                console.log(m)
                                momentoLeft += m.momentoLeft;
                                momentoRight += m.momentoRight;

                                // calculando o momento para posteriormente calcular as verticais
                                const braco = nextApoio.firstx - f.x;
                                momento += Math.abs(f.force) * braco;
                                verticais += f.force;
                                console.log(verticais, momento)
                            }
                        });
                    }
                    console.log(verticais)

                    // pegando as lineares
                    if (this.fLinear.length > 0) {
                        this.fLinear.forEach(f => {
                            if (f.x1 >= CurrentApoio.firstx && f.x1 < nextApoio.firstx) {
                                // tipo da força,tipo apoio esquerdo, tipo apoio direito,data da força,inicio da viga, fim da viga.
                                let m = new EngastePerfeito(CurrentApoio.kind, nextApoio.kind, f, CurrentApoio.firstx, nextApoio.firstx);
                                m = m.mReactionLinear();
                                momentoLeft += m.momentoLeft;
                                momentoRight += m.momentoRight;


                                // calculando o momento para posteriormente calcular as verticais
                                const vao = Math.abs(f.x2 - f.x1);
                                const pontualForce = Math.abs(f.force) * vao;
                                const localForce = f.x1 + vao / 2;
                                const braco = nextApoio.firstx - localForce;
                                momento += pontualForce * braco;
                                verticais += pontualForce * (-1);

                            }
                        });
                    }
                    // pegando as inclinadas 
                    if (this.fInclinado.length > 0) {
                        this.fInclinado.forEach(f => {
                            console.log(f)
                            if (f.x1 >= CurrentApoio.firstx && f.x1 < nextApoio.firstx) {
                                // tipo da força,tipo apoio esquerdo, tipo apoio direito,data da força,inicio da viga, fim da viga.
                                let m = new EngastePerfeito(CurrentApoio.kind, nextApoio.kind, f, CurrentApoio.firstx, nextApoio.firstx);
                                m = m.mReactionLinearInclinado();
                                console.log(m)
                                momentoLeft += m.momentoLeft;
                                momentoRight += m.momentoRight;

                                console.log(m.momentoLeft, m.momentoRight, momentoLeft, momentoRight)

                                // calculando o momento para posteriormente calcular as verticais
                                const vao = Math.abs(f.x2 - f.x1);

                                let pontualForce = 0;
                                let braco = 0;
                                let localForce = 0;
                                const isGrowing = (Math.abs(f.force.forceY1) < Math.abs(f.force.forceY2)) ? true : false;
                                let pontualForceConstante = 0;

                                //verificar se é inclinado composto
                                if (f.force.forceY1 === 0 || f.force.forceY2 === 0) {
                                    pontualForce = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY2)) ? Math.abs(f.force.forceY1) : Math.abs(f.force.forceY2);
                                    pontualForce = (pontualForce * vao) / 2
                                    if (isGrowing) {
                                        localForce = f.x1 + (vao / 3) * 2;
                                        braco = nextApoio.firstx - localForce;
                                        momento += pontualForce * braco
                                        console.log(f.x1, f.x2, vao, localForce, braco, pontualForce * braco, momento)
                                    } else {
                                        localForce = f.x1 + (vao / 3);
                                        braco = nextApoio.firstx - localForce;
                                        momento += pontualForce * braco
                                        console.log(f.x1, f.x2, vao, localForce, braco, pontualForce * braco, momento)
                                    }
                                } else {
                                    // composto
                                    pontualForce = (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY1)) ? Math.abs(f.force.forceY1) - Math.abs(f.force.forceY2) : Math.abs(f.force.forceY2) - Math.abs(f.force.forceY1);
                                    pontualForce = (pontualForce * vao) / 2

                                    if (Math.abs(f.force.forceY1) > Math.abs(f.force.forceY1)) {
                                        pontualForce = Math.abs(f.force.forceY1) - Math.abs(f.force.forceY2);
                                    }

                                    if (isGrowing) {
                                        pontualForce = Math.abs(f.force.forceY2) - Math.abs(f.force.forceY1);
                                        pontualForce = (pontualForce * vao) / 2
                                        pontualForceConstante = Math.abs(f.force.forceY1);
                                        pontualForceConstante = pontualForceConstante * vao

                                        localForce = f.x1 + (vao / 3) * 2;
                                        braco = nextApoio.firstx - localForce;
                                        momento += pontualForce * braco
                                        console.log(f.x1, f.x2, vao, localForce, braco, pontualForce, pontualForce * braco, momento)

                                        localForce = f.x1 + (vao / 2);
                                        braco = nextApoio.firstx - localForce;
                                        momento += pontualForceConstante * braco
                                        console.log(f.x1, f.x2, vao, localForce, braco, pontualForceConstante * braco, momento)

                                    } else {
                                        pontualForce = Math.abs(f.force.forceY1) - Math.abs(f.force.forceY2);
                                        pontualForce = (pontualForce * vao) / 2
                                        pontualForceConstante = Math.abs(f.force.forceY2);
                                        pontualForceConstante = pontualForceConstante * vao

                                        localForce = f.x1 + (vao / 3);
                                        braco = nextApoio.firstx - localForce;
                                        momento += pontualForce * braco
                                        console.log(f.x1, f.x2, vao, localForce, braco, pontualForce, pontualForce * braco, momento)

                                        localForce = f.x1 + (vao / 2);
                                        braco = nextApoio.firstx - localForce;
                                        momento += pontualForceConstante * braco
                                        console.log(f.x1, f.x2, vao, localForce, braco, pontualForceConstante, pontualForceConstante * braco, momento)
                                    }
                                }
                                // const pontualForce = Math.abs(f.force) * vao;
                                // const localForce = f.x1 + vao / 2;
                                // const braco = nextApoio.firstx - localForce;
                                console.log(f)
                                // momento += pontualForce * braco;
                                verticais += pontualForce * (-1) + pontualForceConstante * (-1);
                                console.log(verticais);

                            }
                        });
                    }

                    // pegando os momentos                    
                    if (this.momento.length > 0) {

                        // se o momento estiver no balanço inicial, calcular o momento no inicio
                        if (CurrentApoio.firstx === firstApoio.firstx) {
                            this.momento.forEach(f => {
                                if (f.x === CurrentApoio.firstx) {
                                    // tipo apoio esquerdo, tipo apoio direito,data da força,inicio da viga, fim da viga.
                                    let m = new EngastePerfeito(CurrentApoio.kind, nextApoio.kind, f, CurrentApoio.firstx, nextApoio.firstx);
                                    m = m.mReactionMomento();
                                    momentoLeft += m.momentoLeft;
                                    momentoRight += m.momentoRight;

                                    momento += f.momento * (-1);

                                }
                            });

                            // nos demais casos o momento só será calculado se estiver ao longo da viga incluindo no final.
                        } else {
                            this.momento.forEach(f => {
                                if (f.x > CurrentApoio.firstx && f.x <= nextApoio.firstx) {
                                    // tipo apoio esquerdo, tipo apoio direito,data da força,inicio da viga, fim da viga.
                                    let m = new EngastePerfeito(CurrentApoio.kind, nextApoio.kind, f, CurrentApoio.firstx, nextApoio.firstx);
                                    m = m.mReactionMomento();
                                    momentoLeft += m.momentoLeft;
                                    momentoRight += m.momentoRight;

                                    momento += f.momento * (-1);

                                }
                            });
                        }
                    }

                    // fazer aqui as verticais do caso 0
                    const bracoVertical = Math.abs(nextApoio.firstx - CurrentApoio.firstx)
                    const vLeft = ((momentoLeft + momentoRight + momento) * (-1)) / (bracoVertical * (-1));
                    const vRight = (verticais + vLeft) * (-1);
                    tramosReactionMomentos.push({ momentoLeft, momentoRight, vLeft, vRight });
                    console.log(tramosReactionMomentos)
                }

                if (CurrentApoio.firstx !== firstApoio.firstx && CurrentApoio.firstx !== latestApoio.firstx) {
                    const oldApoio = this.apoios[i - 1];
                    const nextApoio = this.apoios[i + 1];
                    const deslocamentos = new Deslocamentos(oldApoio.kind, CurrentApoio.kind, nextApoio.kind, oldApoio.firstx, CurrentApoio.firstx, nextApoio.firstx, i);
                    tramosDeslocamentos.push(deslocamentos.calcDeformation());
                }
            }

            tramosReactionMomentos.forEach((f, i) => {
                // if (i !== 0) console.log(i, f.vLeft, tramosReactionMomentos[i - 1].vRight)
                if (i === 0) {
                    verticaisTotal[0] = [];
                    verticaisTotal[0].push(f.vLeft);
                } else if (i === tramosReactionMomentos.length - 1) {
                    let v = f.vLeft + tramosReactionMomentos[i - 1].vRight;
                    verticaisTotal[i] = [];
                    verticaisTotal[i].push(v);

                    verticaisTotal[i + 1] = [];
                    verticaisTotal[i + 1].push(f.vRight);
                } else {
                    let v = f.vLeft + tramosReactionMomentos[i - 1].vRight;
                    verticaisTotal[i] = [];
                    verticaisTotal[i].push(v);
                }
            });

            // somando o caso zero
            let reactionZero = [];
            for (let i = 0; i < tramosReactionMomentos.length; i++) {

                // caso o apoio n seja o ultimo, pois n tera o proximo apoio se for o ultimo
                if (i < tramosReactionMomentos.length - 1) {

                    // caso for o primeiro apoio, ja adicionar sem fazer somas
                    if (i === 0) {
                        const mReaction = tramosReactionMomentos[i].momentoLeft;
                        const vReaction = tramosReactionMomentos[i].vLeft;
                        reactionZero.push({ mReaction, vReaction });
                    }

                    const nextTramo = tramosReactionMomentos[i + 1];
                    const mReaction = tramosReactionMomentos[i].momentoRight + nextTramo.momentoLeft;
                    const vReaction = tramosReactionMomentos[i].vRight + nextTramo.vLeft;
                    reactionZero.push({ mReaction, vReaction });
                } else {
                    const mReaction = tramosReactionMomentos[i].momentoRight;
                    const vReaction = tramosReactionMomentos[i].vRight;
                    reactionZero.push({ mReaction, vReaction });
                }
                console.log(reactionZero)
            }

            // calculando os demais casos 
            let reactionCasos = [];
            for (let i = 0; i < tramosDeslocamentos.length; i++) {
                // calc o apoio anterior
                let caso = tramosDeslocamentos[i].indiceRefer
                let apoioIndice = tramosDeslocamentos[i].indiceRefer - 1
                let dReaction = tramosDeslocamentos[i].mApoioAnteriorDireito;
                let vReaction = tramosDeslocamentos[i].vApoioAnteriorDireito;
                reactionCasos.push({ apoioIndice, dReaction, vReaction, caso });

                // calc o apoio referencia
                apoioIndice = tramosDeslocamentos[i].indiceRefer
                dReaction = tramosDeslocamentos[i].mApoioReferEsquerdo + tramosDeslocamentos[i].mApoioReferDireito;
                vReaction = tramosDeslocamentos[i].vApoioReferEsquerdo + tramosDeslocamentos[i].vApoioReferDireito;
                reactionCasos.push({ apoioIndice, dReaction, vReaction, caso });

                // calc o apoio posterior
                apoioIndice = tramosDeslocamentos[i].indiceRefer + 1
                dReaction = tramosDeslocamentos[i].mApoioProxEsquerdo;
                vReaction = tramosDeslocamentos[i].vApoioProxEsquerdo;
                reactionCasos.push({ apoioIndice, dReaction, vReaction, caso });
            }
            console.log(reactionCasos)
            let casos = verticaisTotal.length - 2;
            verticaisTotal.forEach((apoio, i) => {
                for (let index = 1; index <= casos; index++) {
                    let arr = reactionCasos.filter(obj => obj.apoioIndice === i && obj.caso === index);
                    if (arr.length === 0) apoio.push(0);
                    if (arr.length !== 0) apoio.push(arr[0].vReaction)
                }
            });
            // verificar cargas em balanço, caso haja adicionar
            if (this.balancoInitial.ok === true) verticaisTotal[0][0] += this.balancoInitial.force * (-1);
            if (this.balancoFinal.ok === true) verticaisTotal[verticaisTotal.length - 1][0] += this.balancoFinal.force * (-1);

            // fazer as equações aqui
            let equations = [];
            let coefficients = [];
            let constants = [];
            for (let i = 1; i < reactionZero.length - 1; i++) {
                let caso0 = reactionZero[i].mReaction;
                constants = [...constants, caso0];
                let casos = [];
                let arr = [];

                reactionCasos.forEach(c => {
                    if (c.apoioIndice === i) {
                        const caso = { apoio: c.apoioIndice, reaction: c.dReaction, D: c.caso };
                        arr[c.caso - 1] = c.dReaction
                        casos.push(caso);
                    }
                });
                for (let a = 0; a < arr.length; a++) {
                    if (arr[a] * 0 !== 0) arr[a] = 0;
                    if (arr[a] === undefined) arr[a] = 0;

                    arr[a] = Number(arr[a].toFixed(3));
                }
                coefficients = [...coefficients, arr];
                equations.push({ caso0, casos });
            }
            for (let i = 0; i < constants.length; i++) {
                if (constants[i] * 0 !== 0) constants[i] = 0;

                constants[i] = Number(constants[i].toFixed(3));
                for (let a = 0; a < constants.length; a++) {
                    if (coefficients[i][a] * 0 !== 0) coefficients[i][a] = 0;
                    if (coefficients[i][a] === undefined) coefficients[i][a] = 0;
                    coefficients[i][a] = Number(coefficients[i][a].toFixed(3));
                    coefficients[i][coefficients.length] = constants[i] * (-1);
                }

            }


            let matriz = new Equations(coefficients);
            if (matriz.variaveis.length === 0) matriz.variaveis[0] = Number((coefficients[0][1] / coefficients[0][0]).toFixed(2));

            let apoioVerticais = [];
            verticaisTotal.forEach((apoio, i) => {
                apoio.forEach((v, index) => {
                    if (index === 0) {
                        apoioVerticais[i] = v;
                    } else {
                        apoioVerticais[i] += v * matriz.variaveis[index - 1];
                    }
                    apoioVerticais[i] = Number(apoioVerticais[i].toFixed(2));
                });
            });
            let arrVerticais = [];
            apoioVerticais.forEach((v, i) => {
                arrVerticais = [...arrVerticais, { type: "force-pontual", x: this.apoios[i].firstx, y: this.apoios[i].firsty, force: v }]
            });
            // verificar se o primeiro apoio é engaste e se for calcular sua reação de momento para envia-la
            if (reactionZero[0].mReaction !== 0) {
                let reacaoMomento = reactionZero[0].mReaction;
                reactionCasos.forEach(apoio => {
                    if (apoio.apoioIndice === 0) {
                        let caso = apoio.caso
                        reacaoMomento += apoio.dReaction * matriz.variaveis[caso - 1]
                    }
                });
                reacaoMomento = Number(reacaoMomento.toFixed(2));
                CalcForces.momentoEngaste = { area: reacaoMomento * -1, x1: 0, x2: 0, y1: 0, y2: 0, type: "engaste", isEngaged: true }
                // new DrawDiagramas().momentoEngaste.reacaoMomento = reacaoMomento            
                // new DrawDiagramas().momentoEngaste.existe = true
            }
            console.log(reactionZero)
            console.log(reactionCasos)
            console.log(matriz.variaveis)
            console.log(arrVerticais)
            return arrVerticais;

        }
    }
    returnReactionMomento() {
        return CalcForces.momentoEngaste;
    }
}














module.exports = { CalcForces };