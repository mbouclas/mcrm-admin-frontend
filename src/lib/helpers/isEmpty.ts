export default (value: any) => { 
  if (typeof value === "string" && value! == "") {
    return true;
  } else if (Array.isArray(value) && value.length) {
    return true;
  } else if (typeof value === 'object' && Object.keys(value).length) {
    return true;
  }
  return false;
};