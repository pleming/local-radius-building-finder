class ConfigListener {
    #ipcMain;
    #browserWindow;
    #fileService;

    constructor(ipcMain, browserWindow, fileService) {
        this.#ipcMain = ipcMain;
        this.#browserWindow = browserWindow;
        this.#fileService = fileService;
    }

    registerListener() {
        this.#listenSaveConfiguration();
    }

    #listenSaveConfiguration() {
        this.#ipcMain.handle("config:save", async (event, message) => {
            const { configFilePath, configData } = message;

            this.#browserWindow.webContents.send("loading:start", {
                "title": "Save configuration",
                "body": "Loading..."
            });

            try {
                this.#fileService.saveFile(configFilePath, JSON.stringify(configData, null, 4));

                return {
                    "status": true,
                    "message": "Configuration save completed"
                };
            } catch (error) {
                return {
                    "status": false,
                    "message": error.message
                };
            } finally {
                this.#browserWindow.webContents.send("loading:end", {
                    "message": "Configuration save completed"
                });
            }
        });
    }
}

exports = module.exports = ConfigListener;
