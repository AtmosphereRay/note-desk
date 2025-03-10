/// <reference types="vite/client" />
import IndexDBManager from "./util/dbStorage"

declare global {
    type EassyTypes = { id: string, type: string, icon: string }[]

    interface Window extends globalThis {
        App: RendererAPI,
        db: IndexDBManager
    }
}

