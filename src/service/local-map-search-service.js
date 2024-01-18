const StringUtils = require("../util/string-utils");
const CollectionUtils = require("../util/collection-utils");
const { LAT_LONG, SYMBOL } = require("../common/const");

class LocalMapSearchService {
    #kakaoLocalClient;
    #naverMapClient;

    constructor(kakaoLocalClient, naverMapClient) {
        this.#kakaoLocalClient = kakaoLocalClient;
        this.#naverMapClient = naverMapClient;
    }

    async searchKeyword(query, restApiKey, requestDelay) {
        if (query.baseAddress) {
            query = await this.#convertBaseAddress(query, restApiKey);
        }

        const radius = Number(query.radius);
        const latLongRange = this.#calcLatLongRangeByRadius(Number(query.latitude), Number(query.longitude), radius);
        const buildingList = await this.#naverMapClient.searchKeyword(query.keyword, query.latitude, query.longitude, latLongRange, requestDelay);

        const convertedBuildingList = this.#convertDistanceUnitToMeter(buildingList);
        return this.#filterByDistance(convertedBuildingList, radius);
    }

    convertCSVRecords(dataList) {
        const csvRecordList = [];

        csvRecordList.push("Name;Normalized name;Category;Distance(Unit : meter);Address;Latitude;Longitude");

        for (const data of dataList) {
            const { name, normalizedName, category, distance, address, latitude, longitude } = data;
            csvRecordList.push(`${name};${normalizedName};${category};${distance};${address};${latitude};${longitude}`);
        }

        return this.#attachMSExcelBOM(csvRecordList.join(SYMBOL.NEW_LINE));
    }

    async #convertBaseAddress(query, restApiKey) {
        const { data: addressDTO } = await this.#kakaoLocalClient.searchAddress(query.baseAddress, restApiKey);

        if (CollectionUtils.isEmpty(addressDTO.documents)) {
            throw new Error("No search results for base address");
        }

        const { y: latitude, x: longitude } = addressDTO.documents[0];

        return {
            ...query,
            latitude,
            longitude
        };
    }

    #calcLatLongRangeByRadius(latitude, longitude, radius) {
        const diffPerMeterLatitude = (1 / (LAT_LONG.EARTH_RADIUS * (Math.PI / 180))) / 1000;
        const diffPerMeterLongitude = (1 / (LAT_LONG.EARTH_RADIUS * (Math.PI / 180) * Math.cos(latitude * Math.PI / 180))) / 1000;

        return {
            "leftTopLatitude": latitude - (radius * diffPerMeterLatitude),
            "leftTopLongitude": longitude - (radius * diffPerMeterLongitude),
            "rightBottomLatitude": latitude + (radius * diffPerMeterLatitude),
            "rightBottomLongitude": longitude + (radius * diffPerMeterLongitude)
        };
    }

    #attachMSExcelBOM(csvString) {
        return StringUtils.hasText(csvString) ? `${SYMBOL.MS_EXCEL.BOM}${csvString}` : csvString;
    }

    #convertDistanceUnitToMeter(buildingList) {
        return buildingList.map((building) => {
            const { distance } = building;
            let convertedDistance = 0;

            if (distance.substring(distance.length - 2) === "km") {
                convertedDistance = Number(distance.slice(0, -2)) * 1000;
            } else if (distance.substring(distance.length - 1) === "m") {
                convertedDistance = Number(distance.slice(0, -1));
            } else {
                const errorMessage = "Unknown distance unit";
                console.error(errorMessage);
                throw new Error(errorMessage);
            }

            return {
                ...building,
                "distance": convertedDistance
            };
        });
    }

    #filterByDistance(buildingList, distance) {
        return buildingList.filter((building) => building.distance <= distance);
    }
}

exports = module.exports = LocalMapSearchService;
