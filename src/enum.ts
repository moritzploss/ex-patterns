const reduceWhile = (array: any[], accumulator: any, func: Function): any => {
  let proceed: boolean;
  for (let i = 0; i < array.length; i += 1) {
    // eslint-disable-next-line no-param-reassign
    [proceed, accumulator] = func(accumulator, array[i], i, array);
    if (!proceed) {
      return accumulator;
    }
  }
  return accumulator;
};

const ok = true;
const stop = false;

export { ok, stop, reduceWhile };
