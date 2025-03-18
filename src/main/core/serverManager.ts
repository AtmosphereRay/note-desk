import { Db, MongoClient, ServerApiVersion } from "mongodb"
import SystemManager from "./systemManager";
import { Demo, Essay } from "~/config/enmu";
import { MainLogger } from "../utils/logs";

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
    db: Db

    constructor() {
        this.connectUrl = `mongodb+srv://${process.env.VITE_MG_NAME}:${process.env.VITE_MG_PWD}@notes.obrtd.mongodb.net/?retryWrites=true&writeConcern=majority`
    }

    isConnect() {
        return !!this.db
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
                // console.log(res)
                SystemManager.getInstance().sendMessageToRender(Demo.onMessage, { type: "success", msg: "Pinged your deployment. You successfully connected to MongoDB!" })
                this.db = this.mongoClient.db(Essay.dbName);
                this.initIndex()
                console.log('connect success!')
                // this.addData()

            }).catch(e => {
                console.log('connect failed', e.message, this.connectUrl)
                SystemManager.getInstance().sendMessageToRender(Demo.onMessage, { type: "error", msg: e.message || e })

                this.mongoClient.close();
                this.mongoClient = null;
                this.db = null;
            })
        })
    }

    async initIndex() {
        new Promise(async () => {
            const collect = this.db.collection(Essay.typeKey)
            const collect2 = this.db.collection(Essay.contentKey);
            await collect.createIndex({ type: 1 }, { unique: true })
            await collect2.createIndex({ type: 1, title: -1 }, { unique: true })
            // const indexes = await collect.indexes();
            // const indexes2 = await collect2.indexes()
        }).catch(e => {
            console.log('创建失败', e)
        })
    }

    async syncRemoteData() {
        MainLogger.info('syns remote start');
    }

    async addData(collectionName: string, data: object[] | object) {
        const collection = this.db.collection(collectionName);
        (Array.isArray(data) ? collection.insertMany(data) : collection.insertOne(data))
            .then(res => {
                console.log('操作完成', res, data, collectionName)
                SystemManager.getInstance().sendMessageToRender(Demo.onMessage, { type: "success", msg: "add successfully!" })
            }).catch(e => {
                console.log('操作失败', e.message || e, data, collectionName)
                SystemManager.getInstance().sendMessageToRender(Demo.onMessage, { type: "error", msg: `add failed:${e.message || e}` })

            })
    }



    delData() {

    }

    udpData() {

    }

    queryData() {

    }
}

export default ServerManager; 