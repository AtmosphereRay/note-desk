/// <reference types="vite/client" />
import IndexDBManager from "./util/dbStorage"



declare global {
    type EssayType = { id: string, type: string, icon: string } 
    type EssayTypes = EssayType[]

    interface Window extends globalThis {
        App: RendererAPI,
        db: IndexDBManager
    }
}

