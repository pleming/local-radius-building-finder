const Constants = require("../common/const");

class MenuLoader {
    #browserWindow;
    #dialog;
    #fileService;

    constructor(browserWindow, dialog, fileService) {
        this.#browserWindow = browserWindow;
        this.#dialog = dialog;
        this.#fileService = fileService;
    }

    load() {
        return [
            {
                "label": "File",
                "submenu": [
                    {
                        "label": "Load",
                        "accelerator": "CmdOrCtrl+O",
                        "click": () => {
                            const configFilePath = this.#dialog.showOpenDialogSync({
                                "properties": ["openFile"],
                                "filters": [
                                    {
                                        "name": "Local radius building finder configuration file (*.lrbfc)"
                                    }
                                ]
                            });

                            if (!configFilePath) {
                                return;
                            }

                            const response = this.#dialog.showMessageBoxSync({
                                "type": "question",
                                "buttons": ["YES", "NO"],
                                "message": "It is overwritten with the configuration of the loaded file"
                            });

                            if (response === Constants.ELECTRON_DIALOG.CONFIRM.NO) {
                                return;
                            }

                            this.#browserWindow.webContents.send("loading:start", {
                                "title": "Load configuration",
                                "body": "Loading..."
                            });

                            try {
                                const configData = JSON.parse(this.#fileService.loadFile(configFilePath[0]));
                                this.#browserWindow.webContents.send("menu:load", {configData});
                            } catch (error) {
                                this.#dialog.showMessageBoxSync({
                                    "type": "error",
                                    "message": "Configuration loading failed"
                                });
                            } finally {
                                this.#browserWindow.webContents.send("loading:end", {
                                    "message": "Configuration loading completed"
                                });
                            }
                        }
                    },
                    {
                        "label": "Save As",
                        "accelerator": "CmdOrCtrl+S",
                        "click": () => {
                            const configFilePath = this.#dialog.showSaveDialogSync({
                                "filters": [
                                    {
                                        "name": "Local radius building finder configuration file (*.lrbfc)",
                                        "extensions": ["lrbfc"]
                                    }
                                ]
                            });

                            if (!configFilePath) {
                                return;
                            }

                            this.#browserWindow.webContents.send("menu:saveAs", { configFilePath });
                        }
                    }
                ]
            },
            {
                "label": "Setup",
                "submenu": [
                    {
                        "label": "REST API Key",
                        "accelerator": "CmdOrCtrl+Shift+R",
                        "click": () => {
                            this.#browserWindow.webContents.send("menu:restApiKey", {});
                        }
                    },
                    {
                        "label": "Request delay",
                        "accelerator": "CmdOrCtrl+Shift+D",
                        "click": () => {
                            this.#browserWindow.webContents.send("menu:requestDelay", {});
                        }
                    }
                ]
            },
            {
                "label": "Help",
                "submenu": [
                    {
                        "label": "About",
                        "click": () => {
                            this.#browserWindow.webContents.send("menu:about", {});
                        }
                    }
                ]
            }
        ];
    }
}

exports = module.exports = MenuLoader;
