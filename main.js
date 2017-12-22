const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow,
    addWindow;

process.env.NODE_ENV = 'development';

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function() {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('item:add', function(e, item) {
    mainWindow.webContents.send('item:add', item);

    addWindow.close();
    addWindow = null;
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator: 'Ctrl+N',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                accelerator: 'Ctrl+Shift+Delete',
                click() {
                    mainWindow.webContents.send('items:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darvin' ? 'Command+W' : 'Ctrl+W',
                click() {
                    app.quit();
                }
            }
        ]
    }
]

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 600,
        height: 400,
        title: 'Add Shopping List Item',
        frame: false,
        alwaysOnTop: true,
        transparent: true
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    addWindow.on('close', function() {
        addWindow = null;
    });
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle DevTools',
                accelerator: 'F12',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}