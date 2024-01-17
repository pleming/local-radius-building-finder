const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const path = require("path");

const MenuLoader = require("./src/common/menu-loader");
const DialogListener = require("./src/listener/dialog-listener");

const { ACTIVE_PROFILE } = require("./src/common/const");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 640,
        height: 560,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    if (process.env.NODE_ENV === ACTIVE_PROFILE.DEV) {
        win.webContents.openDevTools();
    }

    win.loadFile("./view/index.html");

    return win;
};

app.whenReady().then(() => {
    const browserWindow = createWindow();

    Menu.setApplicationMenu(Menu.buildFromTemplate(new MenuLoader(browserWindow).load()));

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    const dialogListener = new DialogListener(ipcMain, dialog);

    dialogListener.registerListener();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
