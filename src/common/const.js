const ACTIVE_PROFILE = {
    "LOCAL": "local",
    "DEV": "dev",
    "STG": "stg",
    "PRD": "prd"
};

const SYMBOL = {
    "NEW_LINE": "\n",
    "MS_EXCEL": {
        "BOM": "\uFEFF"
    }
};

const HTTP_METHOD = {
    "GET": "get"
};

const HTTP_STATUS = {
    "OK": 200
};

const HEADER = {
    "AUTHORIZATION": "Authorization",
    "KAKAO_AUTHORIZATION_VALUE": "KakaoAK "
};

const AXIOS = {
    "BASE_URL": {
        "KAKAO_LOCAL": "https://dapi.kakao.com/v2/local",
        "NAVER_MAP": "https://pcmap.place.naver.com/place/list",
        "NAVER_MAP_GRAPHQL": "https://pcmap-api.place.naver.com/graphql"
    },
    "CONFIG": {
        "KAKAO_LOCAL_TIMEOUT": 60000,
        "NAVER_MAP_TIMEOUT": 60000
    },
    "URI": {
        "KAKAO_LOCAL": {
            "SEARCH_ADDRESS": "/search/address.json"
        }
    },
    "PARAM": {
        "KAKAO_LOCAL": {
            "QUERY": "query",
            "PAGE": "page",
            "PAGE_VALUE": 1
        },
        "NAVER_MAP": {
            "QUERY": "query",
            "LATITUDE": "y",
            "LONGITUDE": "x",
            "BOUNDS": "bounds"
        }
    }
};

const LAT_LONG = {
    "EARTH_RADIUS": 6371
};

const LOCAL_STORAGE = {
    "REST_API_KEY": "restApiKey"
};

exports = module.exports = {
    ACTIVE_PROFILE,
    SYMBOL,
    HTTP_METHOD,
    HTTP_STATUS,
    HEADER,
    AXIOS,
    LAT_LONG,
    LOCAL_STORAGE
};
