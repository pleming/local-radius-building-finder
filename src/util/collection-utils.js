const isEmpty = (collection) => {
    if (Array.isArray(collection)) {
        return collection.length <= 0;
    } else {
        const errorMessage = "Unknown collection type";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

exports = module.exports = {
    isEmpty
};
