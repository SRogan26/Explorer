const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1440,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname,'preload.js')
        }
    })
    ipcMain.handle('ping', ()=>'pong')
    win.loadFile('index.html')
}

app.whenReady().then(() =>{
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', ()=>{
    //quit if all windows closed if not on macOS
    if(process.platform !== 'darwin') app.quit()
})