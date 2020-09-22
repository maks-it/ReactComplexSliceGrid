export default function UtcToTimezone (dateTimeUtcString) {
  const dateTimeUtc = new Date(dateTimeUtcString)
  dateTimeUtc.setMinutes(dateTimeUtc.getMinutes() - (new Date()).getTimezoneOffset())
  return dateTimeUtc
}
