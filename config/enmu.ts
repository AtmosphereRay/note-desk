export enum DownloadState {
    'downloading' = 2,
    'completed' = 1,
    'initial' = 0,
    error = 3
}

export type IsSuccessful = DownloadState.completed;

export type StatusUnion = DownloadState.completed | DownloadState.downloading | DownloadState.initial;

export enum ShellEvent {

}

export enum BrowserViewEvent {
    addBrowserView = "addBrowserView",
    delBrowserView = "delBrowserView",
}

export enum Demo {
    onBeforeQuit = "onBeforeQuit",
    onBeforeDestroy = "onBeforeDestroy",
    destroy = "destroyApp",
    reloadApp = "reloadApp",
    refreshApp = "refreshApp"
}

export enum Essay {
    dbName = "notes",
    contentKey = "content",
    titleKey = "title",
    typeKey = "type",
}
