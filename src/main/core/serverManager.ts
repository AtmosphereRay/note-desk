class ServerManager {
    static instance: ServerManager;
    static getInstance() {
        if (!this.instance) {
            this.instance = new ServerManager()
        }
        return this.instance
    }

}

export default ServerManager;