const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');






function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 700,          
        resizable:false,      
        webPreferences: {            
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        autoHideMenuBar:true,    
        icon: path.join(__dirname, 'images//piicon.png')
    });
    if (isDev) {
        win.loadFile(path.join(__dirname, 'public/index.html'));
    } else {
        win.loadFile(path.join(__dirname, 'public/index.html'));
    }
    // win.loadURL(isDev ? path.join(__dirname,"/public/index.html") : win.loadFile(path.join(__dirname, '../public/index.html')));
    //   win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
}


app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});