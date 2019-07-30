import queryError from '@/services/error';
import { Effect } from '@/models/connect';
import { Reducer } from 'redux';

export interface ErrorModelState {
  error: string;
  isloading: boolean;
}

export interface ErrorModel {
  namespace: 'error';
  state: ErrorModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    trigger: Reducer<any>;
  };
}

const ErrorModel: ErrorModel = {
  namespace: 'error',

  state: {
    error: '',
    isloading: false,
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield call(queryError, payload.code);
      yield put({
        type: 'trigger',
        payload: payload.code,
      });
    },
  },

  reducers: {
    trigger(state, action) {
      return {
        error: action.payload,
      };
    },
  },
};

export default ErrorModel;
