import { history, Reducer, Effect } from 'umi';

import { query_tag_list } from '@/services/tag';
import { message } from 'antd';

const Model = {
  namespace: 'tag',

  state: {
    tagList: [],
  },

  effects: {
    *fetchTagList({ payload }, { call, put }) {
      const response = yield call(query_tag_list, payload);
      yield put({
        type: 'setTagList',
        payload: response,
      });
    },
  },

  reducers: {
    setTagList(state, { payload }) {
      return {
        ...state,
        tagList: payload.data || [],
      };
    },
  },
};

export default Model;
