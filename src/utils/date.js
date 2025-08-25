import moment from "moment-timezone";

export const formatDateWIB = (date) => {
  return moment(date).tz("Asia/Jakarta").format("DD MMM YYYY");
};
