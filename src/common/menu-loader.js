class MenuLoader {
    #browserWindow;

    constructor(browserWindow) {
        this.#browserWindow = browserWindow;
    }

    load() {
        return [
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
