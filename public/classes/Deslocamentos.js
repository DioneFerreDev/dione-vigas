

class Deslocamentos {

    // tipo de apoio no anterior ,tipo de apoio esquerdo, tipo de apoio direito,
    // ponto do x no anterior ,ponto do x na esquerda, ponto do x na direita, indice do apoio referencia
    constructor(oldApoio, referApoio, rightApoio, oldEdge, referEdge, rightEdge, indice) {
        this.oldApoio = oldApoio;
        this.referApoio = referApoio;
        this.rightApoio = rightApoio;
        this.oldEdge = oldEdge;
        this.referEdge = referEdge;
        this.rightEdge = rightEdge;
        this.indice = indice;
    }

    calcDeformation() {
        let mOldApoioRight = 0;
        let mApoioLeft = 0;
        let mApoioRight = 0;
        let mNextApoioLeft = 0

        let vOldApoioRight = 0;
        let vApoioLeft = 0;
        let vApoioRight = 0;
        let vNextApoioLeft = 0


        if (this.oldApoio === "free" || this.oldApoio === "fixed") {
            // calculando a deformação da viga anterior e suas verticais caso o apoio anterior for fixo ou livre
            const l = Math.abs(this.referEdge - this.oldEdge);
            mOldApoioRight = 0;
            vOldApoioRight = 3 / (l * l);
            mApoioLeft = 3 / l;
            vApoioLeft = - 3 / (l * l);
        } else {
            // calculando a deformação da viga anterior e suas verticais caso o apoio anterior for engastado
            const l = Math.abs(this.referEdge - this.oldEdge);
            mOldApoioRight = 2 / l;
            vOldApoioRight = 6 / (l * l);
            mApoioLeft = 4 / l;
            vApoioLeft = - 6 / (l * l);
        }

        if (this.rightApoio === "free" || this.rightApoio === "fixed") {
            // calculando a deformação da viga posterior e suas verticais caso o apoio anterior for fixo ou livre
            const l = Math.abs(this.referEdge - this.rightEdge);
            mNextApoioLeft = 0;
            vNextApoioLeft = -3 / (l * l);
            mApoioRight = 3 / l;
            vApoioRight = 3 / (l * l);
        } else {
            // calculando a deformação da viga posterior e suas verticais caso o apoio anterior for fixo ou livre
            const l = Math.abs(this.referEdge - this.rightEdge);
            mNextApoioLeft = 2 / l;
            vNextApoioLeft = -6 / (l * l);
            mApoioRight = 4 / l;
            vApoioRight = 6 / (l * l);
        }

        return {
            indiceRefer: this.indice,
            mApoioAnteriorDireito: mOldApoioRight, mApoioReferEsquerdo: mApoioLeft, mApoioReferDireito: mApoioRight, mApoioProxEsquerdo: mNextApoioLeft,
            vApoioAnteriorDireito: vOldApoioRight, vApoioReferEsquerdo: vApoioLeft, vApoioReferDireito: vApoioRight, vApoioProxEsquerdo: vNextApoioLeft
        }
    }

}







module.exports = { Deslocamentos };