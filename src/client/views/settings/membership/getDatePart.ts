export default function getDatePart(dateTime: string) {
  return dateTime.split(/\s+/)[0];
}
