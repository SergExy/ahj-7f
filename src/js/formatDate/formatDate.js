export default function formatDate(ms) {
  const date = new Date(ms);

  const dd = date.getDate();
  const MM = date.getMonth() + 1;
  const YY = date.getFullYear();
  const hh = date.getHours();
  const mm = date.getMinutes();

  return `${dd.toString().padStart(2, 0)}.${MM.toString().padStart(2, 0)}.${YY} ${hh}:${mm}`;
}
