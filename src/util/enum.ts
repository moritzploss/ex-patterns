const reduceWhile = <T>(func: Function, accumulator: T, array: any[]): T => {
  let proceed: boolean;
  const { length } = array;

  for (let i = 0; i < length; i += 1) {
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
