const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
export function friendlyDate(timestamp) {
  const date = new Date(timestamp);
  return `${monthNames[date.getMonth()]}, ${date.getDate()}`;
}
