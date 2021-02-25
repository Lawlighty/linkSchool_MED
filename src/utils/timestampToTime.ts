// 将时间戳转换成日期格式
function timestampToTime(timestamp: any) {
  if (!timestamp) {
    return '-';
  }
  const str = `${timestamp}`;
  const date = new Date(str.length === 10 ? timestamp * 1000 : timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = `${date.getFullYear()}-`;
  const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
  const D = `${date.getDate()} `;
  // const h = date.getHours().leng<2?date.getHours() + ':';
  // const h =
  //     (date.getHours().toString().length < 2
  //         ? '0' + date.getHours() + ':'
  //         : date.getHours()) + ':';
  // const m =
  //     (date.getMinutes().toString().length < 2
  //         ? '0' + date.getMinutes() + ':'
  //         : date.getMinutes()) + ':';
  // const s =
  //     date.getSeconds().toString().length < 2
  //         ? '0' + date.getSeconds()
  //         : date.getSeconds();
  const h = addZero(date.getHours());
  const m = addZero(date.getMinutes());
  const s = addZero(date.getSeconds());
  return `${Y + M + D + h}:${m}:${s}`;
}
function addZero(t) {
  if (t.toString().length < 2) {
    return `0${t}`;
  }
  return t;
}

// 世界时间转换成北京时间
function utc2beijing(utc_datetime: any) {
  if (!utc_datetime) {
    return '';
  }
  const a = new Date(utc_datetime).getTime();
  const beijing_datetime = timestampToTime(new Date(a));
  return beijing_datetime;
}
export { timestampToTime, utc2beijing };
