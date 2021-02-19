import { query_banner_list, add_banner, delete_banner, update_banner } from '@/services/banner';
import { message } from 'antd';

const Model = {
  namespace: 'banner',

  state: {
    bannerList: [],
    bannerListCount: 0,
    bannerLoading: false,
  },

  effects: {
    *fetchBannerList({ payload }, { call, put }) {
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.pagination || {};
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      const response = yield call(query_banner_list, JSON.stringify(query));
      yield put({
        type: 'setBannerList',
        payload: response,
      });
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: false,
        },
      });
    },
    *addBannerList({ payload }, { call, put }) {
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_banner, payload.params);
      if (response.status === 200) {
        yield put({
          type: 'user/successCodeMessage',
          payload: response,
        });

        yield put({
          type: 'fetchBannerList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateBannerList({ payload }, { call, put }) {
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_banner, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchBannerList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteBannerList({ payload }, { call, put }) {
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_banner, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchBannerList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setBannerLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setBannerList(state, { payload }) {
      return {
        ...state,
        bannerList: payload.data || [],
        bannerListCount: payload.total || 0,
      };
    },
    setBannerLoading(state, { payload }) {
      return {
        ...state,
        bannerLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
