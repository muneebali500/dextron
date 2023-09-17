import moment from "moment";

// check all the roles are available or not
export const containsAllRoles = (rolesWeWantToCheck, rolesUserHave) => {
  return rolesWeWantToCheck?.every((i) =>
    rolesUserHave?.includes(i?.toLowerCase())
  );
};

export const generateUID = () => {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart + "";
};

// copy text
export const copyToClipBoard = async (copyMe) => {
  try {
    await navigator.clipboard.writeText(copyMe);
  } catch (err) {
    console.log("error while copying something", err);
  }
};

// Formate 1st letter of string into capitalize
export const capitalFirstLetter = (str = "") => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
};

// convert string into capitalize
export const capitalizeString = (str = "") => {
  return str?.toUpperCase();
};

// convert string into lowercase
export const lowerString = (str = "") => {
  return str?.toString()?.toLocaleLowerCase();
};

// formate file size
export const formatBytes = (a, b = 2) => {
  if (!+a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  }`;
};

// count words
export const wordCount = (text = "") => {
  var count = 0;
  var split = text?.split(" ") || "";
  for (var i = 0; i < split?.length; i++) {
    if (split[i] !== "") {
      count++;
    }
  }
  return count;
};

// Sort Data who's added recently
export const getSortByTransactionDate = (a, b, key) => {
  if (a && b) {
    return new Date(b[key]).valueOf() - new Date(a[key]).valueOf();
  } else {
    console.log(
      "Did not get array of objects to sorting data check your data and also sorting method...."
    );
  }
};

// email validator function
export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateField = (val = "", length) => {
  length = length || 0;
  return val.toString().trim().replace(/\s/g, "").length > length;
};

//
export const pluralizeWord = (singularWord, pluralWord, count) => {
  return count > 1 ? pluralWord : singularWord;
};

//
export const formateUsersList = (list = [], obj, key) => {
  let mySelf = list?.find((v) => v[key] === obj[key]);
  list = list.filter((v) => v[key] !== obj[key]);
  return [mySelf, ...list];
};

export const getFutureDate = (e) => {
  // let num = 1;
  let d = moment().add(1, "days");
  switch (e) {
    case "Tomorrow":
      d = moment().add(1, "days");
      // num = 1
      break;
    case "Within the next week":
      d = moment().add(1, "weeks");
      // num = 7
      break;
    case "Within the next month":
      d = moment().add(1, "months");
      // num = 30
      break;
    case "Within the next 6 months":
      d = moment().add(6, "months");
      // num = 180
      break;
    case "Within the next year":
      d = moment().add(1, "years");
      // num = 365
      break;
    default:
      d = moment().add(1, "days");
  }
  // var d = new Date();
  // d.setDate(d.getDate() + num)
  return d;
};

export const getPastDate = (e) => {
  let d = moment().add(-1, "days");
  switch (e) {
    case "Yesterday":
      d = moment().add(-1, "days");
      break;
    case "Last week":
      d = moment().add(-1, "weeks");
      break;
    case "Last Month":
      d = moment().add(-1, "months");
      break;
    case "Last 6 Months":
      d = moment().add(-6, "months");
      break;
    case "Last Year":
      d = moment().add(-1, "years");
      break;
    default:
      d = moment().add(-1, "days");
  }
  return d;
};

export const getExactDate = (
  dateString = [""],
  listToCheck = [],
  type = "future"
) => {
  let dt = dateString || [];
  let thatObj = listToCheck?.find((opt) => opt?.name === dt[0]);
  let resp = dt[0];
  if (dt && thatObj?.name) {
    if (type === "past") {
      resp = getPastDate(thatObj?.value).format("YYYY-MM-DD");
    } else {
      resp = getFutureDate(thatObj?.value).format("YYYY-MM-DD");
    }
  }
  return resp || "";
};

export const formatDate = (date) => {
  const newDate = new Date(date);

  const formatD = newDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatD;
};

export const extractFileExtension = (fileName) => {
  return fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
};
