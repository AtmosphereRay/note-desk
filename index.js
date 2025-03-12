// const { app, BrowserWindow } = require('electron');
import { app } from 'electron'

console.log(app)

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // win.loadFile('index.html');
    win.loadURL('https://www.baidu.com')
}

app?.whenReady()?.then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
app?.on('window-all-closed', () => {
    app.quit()
})