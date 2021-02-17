import { history, Reducer, Effect } from 'umi';

import { query_tag_list, add_tag, delete_tag, update_tag } from '@/services/tag';
import { message } from 'antd';

const Model = {
  namespace: 'tag',

  state: {
    tagList: [],
    tagListCount: 0,
  },

  effects: {
    *fetchTagList({ payload }, { call, put }) {
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.query || {};
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      const response = yield call(query_tag_list, JSON.stringify(query));
      yield put({
        type: 'setTagList',
        payload: response,
      });
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: false,
        },
      });
    },
    *addTagList({ payload }, { call, put }) {
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_tag, payload.params);
      if (response.status === 200) {
        yield put({
          type: 'user/successCodeMessage',
          payload: response,
        });

        yield put({
          type: 'fetchTagList',
          payload: {},
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateTagList({ payload }, { call, put }) {
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_tag, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchTagList',
          payload: {},
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteTagList({ payload }, { call, put }) {
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_tag, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchTagList',
          payload: {},
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setTagLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setTagList(state, { payload }) {
      return {
        ...state,
        tagList: payload.data || [],
        tagListCount: payload.total || 0,
      };
    },
    setTagLoading(state, { payload }) {
      return {
        ...state,
        tagLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
