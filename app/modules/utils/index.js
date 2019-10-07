import * as ERROR from './error';

export const $required = (key, value) => {
  if (value === 'undefined' || value === '') {
    throw new Error(`Expect to have ${key} property.`);
  }
};

export const $checkResponse = (response) => {
  if (response.code !== 200) {
    throw new Error(`${response.message}(${response.errMsg})`);
  }
  return response.data;
};

export const utcTolocaleTime = (utcTime) => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  let localeTime = utcTime.getTime();
  if (Math.abs(offset) <= 0) {
    localeTime += 28800000;
  }
  localeTime = new Date(localeTime);
  return localeTime;
};

export const formatTime = (date, time = true) => {
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  if (time) {
    return `${date.getFullYear()}-${month}-${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  return `${date.getFullYear()}-${month}-${date.getDate()}`;
};

export const formatStringTime = (date) => {
  const year = date.substr(0, 4);
  const month = date.substr(4, 2);
  const day = date.substr(date.length - 2, 2);
  return `${year}-${month}-${day}`;
};

export default ERROR;
