class MenuLoader {
    #browserWindow;

    constructor(browserWindow) {
        this.#browserWindow = browserWindow;
    }

    load() {
        return [
            {
                "label": "Setup",
                "submenu": [
                    {
                        "label": "REST API Key",
                        "accelerator": "CmdOrCtrl+Shift+R",
                        "click": () => {
                            this.#browserWindow.webContents.send("menu:restApiKey", {});
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
