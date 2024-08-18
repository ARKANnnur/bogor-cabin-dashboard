import { eachDayOfInterval, parseISO } from 'date-fns';

export const getDisabledDates = (bookedDates) => {
  let allDisabledDates = [];
  bookedDates?.forEach(({ startDate, endDate }) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const dates = eachDayOfInterval({ start, end });
    allDisabledDates = [...allDisabledDates, ...dates];
  });
  return allDisabledDates;
};
