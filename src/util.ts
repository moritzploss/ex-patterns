export const hasKey = (object: Object, key: string) => (
  Object.prototype.hasOwnProperty.call(object, key)
);

export const isArray = (value) => Array.isArray(value);

export const isObject = (value) => typeof value === 'object' && value !== null;
