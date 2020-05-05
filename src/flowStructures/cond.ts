import { end, End } from '../symbols';

const _cond = (done = false, result = null) => (
  (value: any | End, returnValue?: any): any => {
    if (value === end) {
      if (done) {
        return result;
      }
      throw Error('No matching clause found. ');
    }

    if (done) {
      return _cond(true, result);
    }

    if (value) {
      return _cond(true, returnValue);
    }

    return _cond();
  }
);

function cond(value: any, returnValue: any) {
  return _cond()(value, returnValue);
}

export { cond };
