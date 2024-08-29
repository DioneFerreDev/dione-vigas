

class Element {

    static currentId = 0;

    constructor(data) {
        this.id = Element.currentId;
        this.idCanvas = 0;
        this.data = data;
        this.type = data.type;
        this.create();
        Element.currentId++;
    }
    create() {
        return { id: this.id, type: this.type, data: this.data, elCanvas: {} }
    }
}


module.exports = { Element };