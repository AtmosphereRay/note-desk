interface DBEventTarget {
    target: {
        result: any
        error: string
    }
}

type DBEvents = DBEventTarget & Event & EventTarget;

type DBVersionChangeEvent = DBEventTarget & IDBVersionChangeEvent

class IndexDBManager {
    request: IDBOpenDBRequest;
    db: IDBDatabase;
    version: number;
    dbName: string

    constructor(dbName: string) {
        this.request = null;
        this.version = +localStorage.getItem('dv') || 3;
        this.dbName = dbName ?? "db";
        if ('indexedDB' in window) {
            this.request = window.indexedDB.open(this.dbName, this.version);

            this.request.onerror = (event) => {
                console.log(event, 'error event!')
            };

            this.request.onsuccess = (event: Event & { target: { result: IDBDatabase } }) => {
                var db = (event.target.result) as IDBDatabase;
                this.db = db;
            };

            this.request.onupgradeneeded = (event: IDBVersionChangeEvent & { target: { result: IDBDatabase } }) => {
                console.log('upgrade success!')
                const db = event.target.result;
                this.db = db;
            }
        }
    }

    checkSupport() {
        if (!this.request) {
            throw ('Your device not support!')
        }
        if (!this.db) {
            console.log('db not exist!')
            return false;
        }
        return true;
    }

    getObjectStore(store_name: string, mode: IDBTransactionMode, autoCreate: boolean = false) {
        const store_nameExist = this.db?.objectStoreNames.contains(store_name);
        return store_nameExist ? this.db.transaction(store_name, mode).objectStore(store_name) : null;
    }

    add(key, data) {
        return new Promise((r, j) => {
            if (this.checkSupport()) {
                console.log(key, this.db.objectStoreNames, data);
                let store = this.getObjectStore(key, 'readwrite');
                // try {

                if (store === null) {
                    this.createTable(key)
                        .then((store: IDBObjectStore) => {
                            store = this.getObjectStore(key, 'readwrite');
                            const req = store.add(data);
                            req.onsuccess = (e) => {
                                console.log('add success:', e)
                                r('')
                            }
                            req.onerror = (e) => {
                                console.log('add failed:', e)
                                j(e)
                            }
                        }).catch(e => {
                            console.log('ADD FAILED', e)
                            j(e)
                        })
                } else {
                    const req = store.add(data);
                    req.onsuccess = (e) => {
                        console.log('add success:', e)
                        r('')
                    }
                    req.onerror = (e) => {
                        console.log('add failed:', e)
                        j(e)
                    }
                }
            } else {
                j('add failed!')
            }
        })
    }

    del(key, id) {
        return new Promise((r, j) => {
            if (this.checkSupport()) {
                const store = this.getObjectStore(key, 'readwrite');

                if (store === null) {
                    j(`store "${key}" not exist!`)
                }

                const delReq = store.delete(id);

                delReq.onsuccess = e => {
                    console.log(`del ${id} ok!`)
                    r(e)
                }

                delReq.onerror = e => {
                    console.log(`del ${id} failed!`)
                    j(e)
                }
            } else {
                j('db not exist or not support!')
            }
        })
    }

    update(key, id, data) {
        return new Promise((r, j) => {
            if (this.checkSupport()) {
                const store = this.getObjectStore(key, 'readwrite');
                if (store === null) {
                    j('store not exist!')
                }

                const req = store.get(id);
                req.onsuccess = (e: any) => {
                    console.log(e, 'udp get ok');
                    const udpReq = store.put(Object.assign(e.target.result, { update_time: Date.now(), ...data }))
                    udpReq.onsuccess = (e) => {
                        console.log('udp ok!', e)
                        r(e);
                    }
                    udpReq.onerror = (e) => {
                        console.warn('update failed', e);
                        j(e)
                    }
                }
                req.onerror = (e) => {
                    console.warn('update failed', e);
                    j(e)
                }

            } else {
                j('db not exist or not support!')
            }
        })
    }

    get(key) {
        return new Promise((r, j) => {
            const result = [];
            if (this.checkSupport()) {
                const store = this.getObjectStore(key, 'readonly');
                if (store === null) {
                    console.log(1)
                    r(result)
                    return;
                }
                let req = store.openCursor();

                req.onsuccess = (e: any) => {
                    // console.log(e.target.result,'result');
                    const cursor = e.target.result as any;
                    if (cursor) {
                        req = store.get(cursor.key)
                        req.onsuccess = function (evt: any) {
                            var value = evt.target.result;
                            result.push(value);
                            console.log(value, result.length)
                        }
                        req.onerror = function (e) {
                            console.log('store get failed', e)
                            j(e);
                        }
                        cursor.continue();
                    } else {
                        r(result);
                    }
                }

                req.onerror = (e) => {
                    console.log('get failed', e)
                    console.log(2)

                    j(e);
                }


            } else {
                r([])
            }
        })
    }


    clear(key) {
        return new Promise((r, j) => {
            if (this.checkSupport()) {
                const store = this.getObjectStore(key, 'readwrite');

                if (store === null) {
                    j(`store "${key}" not exist!`)
                }

                const delReq = store.clear();

                delReq.onsuccess = (e: DBEvents) => {
                    console.log(`clear ${key} ok!`)
                    r(e)
                }

                delReq.onerror = (e: DBEvents) => {
                    console.log(`clear ${key} failed!`)
                    j(e.target.error)
                }
            } else {
                j('db not exist or not support!')
            }
        })
    }

    pageQuery(key) {
        if (this.checkSupport()) {

        }
        return []
    }

    fuzzySearch(query) {
        if (this.checkSupport()) {

        }
    }


    /**
     * @param store_name table name
     * @description 
     **/
    async createTable(store_name: string) {
        return new Promise((r, j) => {
            if (this.checkSupport() && !this.db.objectStoreNames.contains(store_name)) {
                this.version += 1;
                this.db?.close()
                localStorage.setItem('dv', this.version.toString());
                console.log('new Version', this.version, this.request, this.db)
                this.request = window.indexedDB.open(this.dbName, this.version);

                this.request.onerror = (e) => {
                    console.log('create error', e)
                    j(e);
                }

                this.request.onsuccess = (event: Event & { target: { result: IDBDatabase } }) => {
                    console.log('db success ok!', this.version, event)
                    this.db = (event.target.result) as IDBDatabase;
                }
                this.request.onupgradeneeded = (event: IDBVersionChangeEvent & { target: { result: IDBDatabase } }) => {
                    const db = event.target.result;
                    var store = db.createObjectStore(store_name, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('titleIdx', 'title', { unique: true });
                    store.createIndex('contentIdx', 'content', { unique: false });
                    this.db = db;
                    console.log('onupgradeneeded ok!', this.version, event)
                    r(store)
                }
            } else {
                j(`store ${store_name} exist!`)
            }
        })
    }

    async removeTable(store_name: string) {
        return new Promise((r, j) => {
            if (this.checkSupport() && this.db.objectStoreNames.contains(store_name)) {
                this.version += 1;
                this.db?.close()
                localStorage.setItem('dv', this.version.toString());
                console.log('new Version', this.version, this.request, this.db)
                this.request = window.indexedDB.open(this.dbName, this.version);
                this.request.onsuccess = (event: Event & { target: { result: IDBDatabase } }) => {
                    console.log('update version ok!', this.version, event)
                    this.db = (event.target.result) as IDBDatabase;
                }

                this.request.onupgradeneeded = (e: DBVersionChangeEvent) => {
                    e.target.result.deleteObjectStore(store_name);
                    r(`remove table ${store_name} ok!`)
                }

                this.request.onerror = (e) => {
                    console.log('removeTable failed!', this.version, e)
                    j(e)
                }

            } else {
                j(`store ${store_name} not exist!`)
            }
        })
    }
}



window.db = new IndexDBManager('notes');

// export default IndexDBManager;

