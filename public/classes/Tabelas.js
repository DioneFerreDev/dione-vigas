
class Tabelas {

    static simples = [
        { kmd: 0.000, kz: 1.000 },
        { kmd: 0.005, kz: 0.997 },
        { kmd: 0.010, kz: 0.994 },
        { kmd: 0.015, kz: 0.991 },
        { kmd: 0.020, kz: 0.988 },
        { kmd: 0.025, kz: 0.985 },
        { kmd: 0.030, kz: 0.982 },
        { kmd: 0.035, kz: 0.979 },
        { kmd: 0.040, kz: 0.976 },
        { kmd: 0.045, kz: 0.973 },
        { kmd: 0.050, kz: 0.970 },
        { kmd: 0.055, kz: 0.967 },
        { kmd: 0.060, kz: 0.963 },
        { kmd: 0.065, kz: 0.960 },
        { kmd: 0.070, kz: 0.957 },
        { kmd: 0.075, kz: 0.954 },
        { kmd: 0.080, kz: 0.950 },
        { kmd: 0.085, kz: 0.947 },
        { kmd: 0.090, kz: 0.944 },
        { kmd: 0.095, kz: 0.941 },
        { kmd: 0.100, kz: 0.937 },
        { kmd: 0.105, kz: 0.934 },
        { kmd: 0.110, kz: 0.930 },
        { kmd: 0.115, kz: 0.927 },
        { kmd: 0.120, kz: 0.924 },
        { kmd: 0.125, kz: 0.920 },
        { kmd: 0.130, kz: 0.917 },
        { kmd: 0.135, kz: 0.913 },
        { kmd: 0.140, kz: 0.909 },
        { kmd: 0.145, kz: 0.906 },
        { kmd: 0.150, kz: 0.902 },
        { kmd: 0.155, kz: 0.899 },
        { kmd: 0.158, kz: 0.896 },
        { kmd: 0.160, kz: 0.895 },
        { kmd: 0.165, kz: 0.891 },
        { kmd: 0.170, kz: 0.887 },
        { kmd: 0.175, kz: 0.883 },
        { kmd: 0.180, kz: 0.880 },
        { kmd: 0.185, kz: 0.876 },
        { kmd: 0.190, kz: 0.872 },
        { kmd: 0.195, kz: 0.868 },
        { kmd: 0.200, kz: 0.864 },
        { kmd: 0.205, kz: 0.860 },
        { kmd: 0.210, kz: 0.856 },
        { kmd: 0.215, kz: 0.851 },
        { kmd: 0.220, kz: 0.847 },
        { kmd: 0.225, kz: 0.843 },
        { kmd: 0.230, kz: 0.839 },
        { kmd: 0.235, kz: 0.834 },
        { kmd: 0.240, kz: 0.830 },
        { kmd: 0.245, kz: 0.825 },
        { kmd: 0.246, kz: 0.824 },
        { kmd: 0.250, kz: 0.821 },
        { kmd: 0.255, kz: 0.816 },
        { kmd: 0.260, kz: 0.812 },
        { kmd: 0.265, kz: 0.807 },
        { kmd: 0.270, kz: 0.802 },
        { kmd: 0.275, kz: 0.797 },
        { kmd: 0.280, kz: 0.792 },
        { kmd: 0.285, kz: 0.787 },
        { kmd: 0.290, kz: 0.782 },
        { kmd: 0.295, kz: 0.777 },
        { kmd: 0.300, kz: 0.771 },
        { kmd: 0.305, kz: 0.766 },
        { kmd: 0.310, kz: 0.760 },
        { kmd: 0.315, kz: 0.754 },
        { kmd: 0.320, kz: 0.749 },
        { kmd: 0.325, kz: 0.743 },
        { kmd: 0.330, kz: 0.736 },
        { kmd: 0.335, kz: 0.730 },
        { kmd: 0.340, kz: 0.724 },
        { kmd: 0.345, kz: 0.717 },
        { kmd: 0.350, kz: 0.710 },
        { kmd: 0.355, kz: 0.703 },
        { kmd: 0.360, kz: 0.696 },
        { kmd: 0.362, kz: 0.692 },
        { kmd: 0.365, kz: 0.688 },
        { kmd: 0.370, kz: 0.680 },
        { kmd: 0.375, kz: 0.671 },
        { kmd: 0.380, kz: 0.663 },
        { kmd: 0.385, kz: 0.653 },
        { kmd: 0.390, kz: 0.643 },
        { kmd: 0.395, kz: 0.633 },
        { kmd: 0.400, kz: 0.621 },
        { kmd: 0.405, kz: 0.608 },
        { kmd: 0.408, kz: 0.600 }
    ];
    static dupla = [
        { d: 0.15, tensao: 435 },
        { d: 0.20, tensao: 408.4 },
        { d: 0.25, tensao: 326.7 },
        { d: 0.30, tensao: 247 }
    ]
    static armadura = [
        { diametro: 5.0, area: 0.2 },
        { diametro: 6.3, area: 0.315 },
        { diametro: 8.0, area: 0.50 },
        { diametro: 10.0, area: 0.80 },
        { diametro: 12.5, area: 1.25 },
        { diametro: 16.0, area: 2.0 },
        { diametro: 20.0, area: 3.15 },
        { diametro: 25.0, area: 5.0 },
        { diametro: 32.0, area: 8.0 },
        { diametro: 40.0, area: 12.5 }
    ]

    constructor(kmd) {
        this.kmd = kmd
    }
    acharKzSimples() {
        let kz = Tabelas.simples[Tabelas.simples.length - 1].kz;
        for (let i = Tabelas.simples.length - 1; i >= 0; i--) {
            if (this.kmd <= Tabelas.simples[i].kmd) kz = Tabelas.simples[i].kz
        }

        return kz;
    }
    acharTensaoDupla(razao) {
        let tensao = Tabelas.dupla[Tabelas.dupla.length - 1].tensao;
        for (let i = Tabelas.dupla.length - 1; i >= 0; i--) {
            if (razao <= Tabelas.dupla[i].d) tensao = Tabelas.dupla[i].tensao
        }

        return tensao;
    }
    bitolas(diametro, area) {
        const bitola = Tabelas.armadura.filter(obj => obj.diametro === diametro)[0];

        let bitolas = 1
        let areaTotal = area;
        if (bitola.area <= area) {
            bitolas = Math.ceil(area / bitola.area);
            areaTotal = (bitolas * bitola.area).toFixed(2);
            areaTotal = Number(areaTotal)
        }else{
            areaTotal = bitola.area;
        }
        return { bitolas, areaTotal }
    }

}












module.exports = { Tabelas }