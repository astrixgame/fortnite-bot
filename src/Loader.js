class Loader {
    constructor(instance) {
        this.mainInstance = instance;
        this.completed = {};
        this.listeners = {};
        this.time = new Date().getTime();
    }

    register(module) {
        this.completed[module] = false;
        this.emit("register", module);
    }

    complete(module) {
        this.completed[module] = true;
        this.emit("complete", module);
        if(Object.values(this.completed).every((val, i, arr) => val === arr[0]))
            this.emit("loaded", new Date().getTime() - this.time);
    }

    on(event, listener) {
        if(typeof listener == "function")
            this.listeners[event] = listener;
    }

    emit(event, data) {
        if(typeof this.listeners[event] == "function")
            this.listeners[event](data);
    }
}

export default Loader
