const puppeteer = require("puppeteer");

const { AXIOS, HTTP_STATUS } = require("../common/const");

class NaverMapClient {
    #browser;
    #page;

    async #prepareDriver() {
        this.#browser = await puppeteer.launch({
            "headless": false,
            "args": ["--ignore-certificate-errors"]
        });

        this.#page = await this.#browser.newPage();
    }

    async #teardownDriver() {
        await this.#browser.close();
    }

    async searchKeyword(keyword, latitude, longitude, latLongRange) {
        await this.#prepareDriver();
        await this.#loadPage(keyword, latitude, longitude, latLongRange);

        const buildingList = await this.#collectFirstPage();
        buildingList.push(...await this.#collectRemainPage());

        await this.#teardownDriver();
        return buildingList;
    }

    async #loadPage(keyword, latitude, longitude, latLongRange) {
        const query = this.#generateQuery(keyword, latitude, longitude, latLongRange);
        await this.#page.goto(`${AXIOS.BASE_URL.NAVER_MAP}?${query}`, { "waitUntil": "networkidle2" });
    }

    #generateQuery(keyword, latitude, longitude, latLongRange) {
        const bounds = [latLongRange.leftTopLongitude, latLongRange.leftTopLatitude, latLongRange.rightBottomLongitude, latLongRange.rightBottomLatitude].join(";");
        return `${AXIOS.PARAM.NAVER_MAP.QUERY}=${keyword}&${AXIOS.PARAM.NAVER_MAP.LONGITUDE}=${longitude}&${AXIOS.PARAM.NAVER_MAP.LATITUDE}=${latitude}&${AXIOS.PARAM.NAVER_MAP.BOUNDS}=${bounds}`;
    }

    async #collectFirstPage() {
        return await this.#page.evaluate(() => {
            const buildingMap = window.__APOLLO_STATE__;
            const buildingList = [];

            for (const key in buildingMap) {
                if (!key.startsWith("PlaceSummary")) {
                    continue;
                }

                buildingList.push({
                    "name": buildingMap[key].name,
                    "normalizedName": buildingMap[key].normalizedName,
                    "category": buildingMap[key].category,
                    "distance": buildingMap[key].distance,
                    "address": buildingMap[key].roadAddress || buildingMap[key].fullAddress,
                    "latitude": buildingMap[key].y,
                    "longitude": buildingMap[key].x
                });
            }

            return buildingList;
        });
    }

    async #collectRemainPage() {
        return new Promise(async (resolve) => {
            const buildingList = [];

            let nextPageButton = await this.#page.$("a.eUTV2[aria-disabled=false]:last-child");

            if (!nextPageButton) {
                resolve(buildingList);
                return;
            }

            await nextPageButton.click();

            this.#page.on("response", async (response) => {
                if (response.url() === AXIOS.BASE_URL.NAVER_MAP_GRAPHQL && response.status() === HTTP_STATUS.OK) {
                    const [responseData] = await response.json();

                    for (const item of responseData.data.businesses.items) {
                        buildingList.push({
                            "name": item.name,
                            "normalizedName": item.normalizedName,
                            "category": item.category,
                            "distance": item.distance,
                            "address": item.roadAddress || item.fullAddress,
                            "latitude": item.y,
                            "longitude": item.x
                        });
                    }

                    const nextPageButton = await this.#page.$("a.eUTV2[aria-disabled=false]:last-child");

                    if (!nextPageButton) {
                        this.#page.off("response");
                        resolve(buildingList);
                        return;
                    }

                    await nextPageButton.click();
                }
            });
        });
    }

    async #delayExpDist(avgDelay, upperLimitDelay) {
        let delay = 0;

        do {
            delay = -1 * (1 / (1 / avgDelay)) * (Math.log(1 - Math.random()));
        } while (upperLimitDelay > 0 && delay > upperLimitDelay);

        return new Promise((resolve) => setTimeout(resolve, delay));
    }
}

exports = module.exports = NaverMapClient;
