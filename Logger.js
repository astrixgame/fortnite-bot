import Formatter from './Formatter.js';

class Logger {
    constructor(mainInstance, module) {
        this.mainInstance = mainInstance;
        this.module = module;
        this.formatter = new Formatter("HH:MM:SS.II NN-AA-YY");
    }

    
    log(level, text) {
        var str = "["+this.formatter.date(new Date())+"] ["+["Info","Warning","Error"][level]+"] ["+this.module+"] "+text;
        console.log(str);
        this.mainInstance.log.push(str);
    }
}

export default Logger