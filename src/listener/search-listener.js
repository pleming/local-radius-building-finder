class SearchListener {
    #ipcMain;
    #browserWindow;
    #localMapSearchService;
    #fileService;

    constructor(ipcMain, browserWindow, localMapSearchService, fileService) {
        this.#ipcMain = ipcMain;
        this.#browserWindow = browserWindow;
        this.#localMapSearchService = localMapSearchService;
        this.#fileService = fileService;
    }

    registerListener() {
        this.#listenKeywordSearch();
    }

    #listenKeywordSearch() {
        this.#ipcMain.handle("search:keyword", async (event, message) => {
            const filePath = this.#fileService.saveAs();

            if (!filePath) {
                return {
                    "status": false,
                    "message": "File path is not defined"
                };
            }

            this.#browserWindow.webContents.send("loading:start", {
                "title": "Extract buildings data",
                "body": "Loading..."
            });

            try {
                const { query, restApiKey } = message;
                const buildingList = await this.#localMapSearchService.searchKeyword(query, restApiKey);

                const csvRecordData = this.#localMapSearchService.convertCSVRecords(buildingList);
                this.#fileService.saveFile(filePath, csvRecordData);

                return {
                    "status": true,
                    "message": "File extraction completed"
                };
            } catch (error) {
                return {
                    "status": false,
                    "message": error.message
                };
            } finally {
                this.#browserWindow.webContents.send("loading:end", {
                    "message": "File extraction completed"
                });
            }
        });
    }
}

exports = module.exports = SearchListener;
