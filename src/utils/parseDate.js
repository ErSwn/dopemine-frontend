
function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('en-US', { month: 'short' });
}

export default function parseDate(date){
  var dt = new Date(date)

  const year = dt.getFullYear();
  const month = getMonthName(dt.getMonth()+1);
  const day = dt.getDate();
  const hour = dt.getHours();
  const minute = dt.getMinutes();

  const displayedDate = [hour, minute].join(":") +"  "+  [day, month, year].join(" ");
  return displayedDate
}