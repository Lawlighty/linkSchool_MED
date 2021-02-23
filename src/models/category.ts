import { history, Reducer, Effect } from 'umi';

import {
  query_category_list,
  add_category,
  delete_category,
  update_category,
} from '@/services/category';
import { message } from 'antd';
import { getQueryWhere } from '@/utils/utilFuncs';

const Model = {
  namespace: 'category',

  state: {
    categoryList: [],
    categoryParentList: [],
    categoryListCount: 0,
    categoryLoading: false,
  },

  effects: {
    *fetchCategoryList({ payload }, { call, put }) {
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.pagination || {};
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      const response = yield call(query_category_list, JSON.stringify(query));
      yield put({
        type: 'setCategoryList',
        payload: response,
      });
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchParentCategoryList({ payload }, { call, put }) {
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.pagination || {};
      const where = getQueryWhere(payload.queryInfo || {});
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      if (Object.keys(where).length > 0) {
        query['where'] = where;
      }
      const response = yield call(query_category_list, JSON.stringify(query));
      yield put({
        type: 'setCategoryParentList',
        payload: response,
      });
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: false,
        },
      });
    },

    *addCategoryList({ payload }, { call, put }) {
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_category, payload.params);
      if (response.status === 200) {
        yield put({
          type: 'user/successCodeMessage',
          payload: response,
        });

        yield put({
          type: 'fetchCategoryList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateCategoryList({ payload }, { call, put }) {
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_category, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchCategoryList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteCategoryList({ payload }, { call, put }) {
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_category, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchCategoryList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setCategoryLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setCategoryList(state, { payload }) {
      return {
        ...state,
        categoryList: payload.data || [],
        categoryListCount: payload.total || 0,
      };
    },
    setCategoryParentList(state, { payload }) {
      return {
        ...state,
        categoryParentList: payload.data || [],
      };
    },
    setCategoryLoading(state, { payload }) {
      return {
        ...state,
        categoryLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
