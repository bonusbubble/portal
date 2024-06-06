class PortalNode {
    #port

    constructor(port) {
        this._isRunning = false;

        if (typeof port !== "number") throw new TypeError(`Expected "port" to be of type "number" but instead received ${JSON.stringify(port)}`);

        this.#port = port;
    }

    get port() {
        return this.#port;
    }

    async close() {
        this._isRunning = false;
    }

    isRunning() {
        return this._isRunning;
    }
}

module.exports = { PortalNode };
