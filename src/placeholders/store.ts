import { Map } from 'immutable';
import { createStore } from 'redux';

import { namedPlaceholders } from '../symbols';
import { Placeholder } from '../types';

interface ReducerAction {
  type: string;
  key: string;
  value?: Placeholder;
}

enum ActionTypes {
  ADD = 'ADD',
  // REMOVE = 'REMOVE',
}

const placeholders = namedPlaceholders.reduce(
  (acc, placeholder) => acc.set(placeholder.lookupName, placeholder),
  Map<string, Placeholder>(),
);

const reducer = (state = placeholders, { type, key, value }: ReducerAction) => {
  if (type === ActionTypes.ADD) {
    return state.set(key, value);
  }
  return state;
};

const store = createStore(reducer);

const get = (key: string): Placeholder | undefined => (
  store.getState().get(key)
);

const add = (key: string, value: Placeholder) => (
  store.dispatch({ type: ActionTypes.ADD, key, value })
);

// const remove = (key: string) => (
//   store.dispatch({ type: actionTypes.REMOVE, key })
// );

export { add, get };
