

class Ask {
    constructor(query) {
        this.text = query;        
    }
    respond() {
        if (confirm(this.text) === true)
            this.answer = true;
        else
            this.answer = false;

       return this.answer;
    }
}





module.exports = {Ask};