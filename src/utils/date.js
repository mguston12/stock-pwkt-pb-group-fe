import moment from "moment-timezone";

export const formatDateWIB = (date) => {
  return moment(date).format("DD MMM YYYY");
};
