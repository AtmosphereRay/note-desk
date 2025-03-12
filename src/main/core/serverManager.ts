import { MongoClient, ServerApiVersion } from "mongodb"
class ServerManager {

    static instance: ServerManager;
    static getInstance() {
        if (!this.instance) {
            this.instance = new ServerManager()
        }
        return this.instance
    }

    connectUrl: string
    mongoClient: MongoClient;

    constructor() {
        console.log(process.env)
        // @ts-ignore
        this.connectUrl = `mongodb+srv://${process.env.VITE_MG_NAME}:${process.env.VITE_MG_PWD}@notes.obrtd.mongodb.net/?retryWrites=true&writeConcern=majority`
    }

    connectMongo() {
        return new Promise((r, j) => {
            this.mongoClient = new MongoClient(this.connectUrl, {
                connectTimeoutMS: 10000,
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            })

            this.mongoClient.connect().then(res => {
                console.log("Pinged your deployment. You successfully connected to MongoDB!");
            }).catch(e => {
                console.log('connect failed', e.message, this.connectUrl)
                this.mongoClient.close();
            })
        })
    }
}

export default ServerManager;