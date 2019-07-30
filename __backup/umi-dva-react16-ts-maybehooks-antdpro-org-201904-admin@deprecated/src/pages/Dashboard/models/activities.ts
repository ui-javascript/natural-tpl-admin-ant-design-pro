import { queryActivities } from '@/services/api';
import { Effect } from '@/models/connect';
import { Reducer } from 'redux';

export interface ActivitiesListItem {
  id: string;
  updatedAt: string;
  user: {
    name: string;
    avatar: string;
  };
  group: {
    name: string;
    link: string;
  };
  project: {
    name: string;
    link: string;
  };
  template: string;
}

export interface ActivitiesModelState {
  list: ActivitiesListItem[];
}

export interface ActivitiesModel {
  namespace: 'activities';
  state: ActivitiesModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    saveList: Reducer<ActivitiesModelState>;
  };
}

const ActivitiesModel: ActivitiesModel = {
  namespace: 'activities',

  state: {
    list: [],
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

export default ActivitiesModel;
