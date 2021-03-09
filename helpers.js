export const round = (a) => {
  return Number(a.toFixed(4));
}

export const fixed = (a, b = 2) => {
  return Number(a).toFixed(b);
}

export const numberWithSpaces = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}
