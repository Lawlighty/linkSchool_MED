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
export { setSubStr, getQueryWhere };
