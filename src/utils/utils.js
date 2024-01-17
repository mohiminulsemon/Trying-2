export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (password) => {
  return String(password).match(/^(?=.*?[a-z]).{8,}$/);
};

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

/**
 * rotate points around an origin
 * @param  {Array<object>} ps a list of points
 * @param  {Number} a  angle in degrees
 * @param  {Object} o  origin object
 * @return {Array<object>}    a list of rotated points
 */
export const rotatePoints = (p, a, o) => {
  return {
    x: Math.cos(a) * (p.x - o.x) - Math.sin(a) * (p.y - o.y) + o.x,
    y: Math.sin(a) * (p.x - o.x) + Math.cos(a) * (p.y - o.y) + o.y
  };
};
