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
    onMessage = "onMessage",
    destroy = "destroyApp",
    reloadApp = "reloadApp",
    refreshApp = "refreshApp",
    MongoEvent = "mongo",
    SQlEvent = "sql",
}

export enum Essay {
    dbName = "notes",
    contentKey = "content",
    titleKey = "title",
    typeKey = "type",
    pullReq = "pullReq",
    pullRes = "pullRes",
    pushReq = "pushReq",
    pushRes = "pushRes",


}


export enum HttpCode {
    Error = -1,
    Success = 200,
    AuthFailed = 401,
    ResponseError = 500,
    PathNotExist = 404,
    Forbidden = 403,
    RoomNotExist = 2022,
    UserNotExist = 2023,
}

