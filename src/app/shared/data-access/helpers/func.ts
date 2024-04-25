import * as moment from 'moment-timezone';

export function getCurrentDateInKiev() {
  return moment.tz(new Date(), 'Europe/Kiev').toDate();
}

export function getKievOffset() {
  const kievDate = getCurrentDateInKiev();

  const offsetMinutes = kievDate.getTimezoneOffset();

  return offsetMinutes;
}

export function getCorrectDate(date: Date) {
  const kievOffset = getKievOffset();
  const offsetMillisecond = kievOffset * 60 * 1000;
  return new Date(date.getTime() - offsetMillisecond);
}
