import moment from 'moment-timezone'

export const formatDateWIB = (date) => {
  return moment(date.replace('Z', '')).format('DD MMM YYYY')
}
