/// <reference types="vite/client" />



declare interface Window extends globalThis {
    App: RendererAPI,
    db: IndexDBManager
}
