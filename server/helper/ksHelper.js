var ksHelper = {
    getModelId: getModelId,
    getMonthDetails: getMonthDetails,
    getDate: getDate
}
module.exports = ksHelper;
//To get the model id using count of data in the collection and Model Key
function getModelId(modelKey, count) {
    var suffix = "000";
    count = count + 1;
    suffix = suffix.substring(0, suffix.length - count.toString().length) + count;
    return modelKey.concat(suffix);
}
//To Get the current and previous month and year details
function getMonthDetails() {
    var date = new Date(),
        month = date.getMonth(),
        year = date.getFullYear(),
        filterParams = {};

    filterParams.toYear = year;

    if (month == 0) {
        filterParams.fromMonth = 12;
        filterParams.fromYear = (year) - 1;
        filterParams.toMonth = 1;
    } else {
        filterParams.fromMonth = (month) + 1;
        filterParams.fromYear = parseInt(year);
        filterParams.toMonth = month;
    }
    return filterParams;
}
//Get the today date
function getDate(date) {
    var date = new Date();
    date.setHours(00, 00, 00, 00);
    return date;
}