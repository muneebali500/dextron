// Function for searching
export const searchFilter = (searchVal, options, key) => {
    var punct = /[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~-]+/g;
    if (Array.isArray(options)) {
        if (key) {
            return options.filter((option) =>
                option[key]?.replace(punct, "").toLowerCase().includes(searchVal.replace(punct, "").toLowerCase())
            );
        }
        return options.filter((option) =>
            option?.replace(punct, "").toLowerCase().includes(searchVal.replace(punct, "").toLowerCase())
        );
    }
};

export const formatDate = (date) => {
    let sDate = new Date(date);
    return `${sDate.getMonth() + 1}-${sDate.getDate()}-${sDate.getFullYear()}`;
};

export const getTimeDifference = (date) => {
    const startDate = new Date(date);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
        return weeks + " week" + (weeks > 1 ? "s" : "") + " ago";
    } else if (days > 0) {
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    } else if (hours > 0) {
        return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
    } else {
        return minutes + " min" + (minutes > 1 ? "s" : "") + " ago";
    }
};
