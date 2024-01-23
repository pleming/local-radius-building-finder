const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const path = require("path");

const MenuLoader = require("./src/common/menu-loader");
const { ACTIVE_PROFILE } = require("./src/common/const");

const KakaoLocalInstance = require("./src/axios/instance/kakao-local-instance");
const KakaoLocalClient = require("./src/axios/client/kakao-local-client");
const NaverMapClient = require("./src/puppeteer/naver-map-client");
const LocalMapSearchService = require("./src/service/local-map-search-service");
const FileService = require("./src/service/file-service");
const SearchListener = require("./src/listener/search-listener");
const ConfigListener = require("./src/listener/config-listener");
const DialogListener = require("./src/listener/dialog-listener");

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

    const kakaoLocalInstance = new KakaoLocalInstance();
    const kakaoLocalClient = new KakaoLocalClient(kakaoLocalInstance);
    const naverMapClient = new NaverMapClient();
    const localMapSearchService = new LocalMapSearchService(kakaoLocalClient, naverMapClient);
    const fileService = new FileService(dialog);
    const searchListener = new SearchListener(ipcMain, browserWindow, localMapSearchService, fileService);
    const configListener = new ConfigListener(ipcMain, browserWindow, fileService);
    const dialogListener = new DialogListener(ipcMain, dialog);

    Menu.setApplicationMenu(Menu.buildFromTemplate(new MenuLoader(browserWindow, dialog, fileService).load()));

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    searchListener.registerListener();
    configListener.registerListener();
    dialogListener.registerListener();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
