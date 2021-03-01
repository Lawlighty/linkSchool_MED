// 将时间戳转换成日期格式
function setSubStr(str: string, length: number = 50) {
  if (!str) {
    return '';
  }
  if (str.length <= length) {
    return str;
  }
  return `${str.substring(0, length)}...`;
}

// 遍历对象构造查询对象
function getQueryWhere(query: object) {
  const currentQuery = {};
  Object.keys(query).forEach((key) => {
    if (query[key]) {
      currentQuery[key] = query[key];
    }
  });
  return currentQuery;
}

//  根据字符串长度返回颜色
function getColorByStrLength(str: string) {
  const color = str.length <= 4 ? 'geekblue' : str.length <= 6 ? 'green' : 'volcano';
  return color;
}
// 视频时长字符串

function time_To_hhmmss(seconds: number) {
  let hh;
  let mm;
  let ss;

  if (seconds == null || seconds <= 0) {
    return '00:00:00';
  }
  hh = (seconds / 3600) | 0;
  seconds = parseInt(seconds) - hh * 3600;
  if (parseInt(hh) < 10) {
    hh = `0${hh}`;
  }

  mm = (seconds / 60) | 0;

  ss = parseInt(seconds) - mm * 60;
  if (parseInt(mm) < 10) {
    mm = `0${mm}`;
  }
  if (ss < 10) {
    ss = `0${ss}`;
  }
  return `${hh}:${mm}:${ss}`;
}
export { setSubStr, getQueryWhere, getColorByStrLength, time_To_hhmmss };
