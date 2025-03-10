/// <reference types="vite/client" />
import IndexDBManager from "./util/dbStorage"

declare global {
    interface Window extends globalThis {
        App: RendererAPI,
        db: IndexDBManager
    }
}

