const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800
    })

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