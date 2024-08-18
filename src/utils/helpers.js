import { format, formatDistance, formatISO, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns/esm';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();

  // export const getToday = function (options = {}) {
  //   const today = new Date();

  //   // Menggunakan UTC atau zona waktu yang sesuai dengan format timestamp di Supabase
  //   if (options?.end) {
  //     today.setHours(23, 59, 59, 999);
  //   } else {
  //     today.setHours(0, 0, 0, 0);
  //   }

  //   // Menggunakan metode toISOString() dengan format YYYY-MM-DDTHH:mm:ss.sssZ
  //   return today.toISOString().slice(0, 10);
  // };
};


export const formatCurrency = (value) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
    value
  );

export const formatDateToNumber = (dateString) => {
  const formattedDate = format(dateString, 'yyyyMMdd'); // Format menjadi 'YYYYMMDD'
  return Number(formattedDate);
};

export const convertToCustomTimestamp = (dateString) => {
  const customDate = new Date(dateString);
  customDate.setUTCHours(0, 0, 0, 0); // Mengatur jam, menit, detik, dan milidetik ke 00 (dalam zona waktu UTC)
  return customDate.toISOString();
};
export const formattedInitialDate = (initialTimestamp) =>
  formatISO(parseISO(initialTimestamp), { representation: 'date' });
