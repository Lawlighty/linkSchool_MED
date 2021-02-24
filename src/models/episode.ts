import {
  query_episode_list,
  query_episode_detail,
  add_episode,
  delete_episode,
  update_episode,
} from '@/services/episode';
import { message } from 'antd';

const Model = {
  namespace: 'episode',

  state: {
    currentEpisode: {},
    episodeList: [],
    episodeListCount: 0,
    episodeLoading: false,
    currentEpisodeList: [],
  },

  effects: {
    *fetchEpisodeList({ payload }, { call, put }) {
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.pagination || {};
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      const response = yield call(query_episode_list, JSON.stringify(query));
      yield put({
        type: 'setEpisodeList',
        payload: response,
      });
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchEpisodeDetail({ payload }, { call, put }) {
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: true,
        },
      });
      const id = payload._id;
      const response = yield call(query_episode_detail, id);
      yield put({
        type: 'setEpisodeDetail',
        payload: response,
      });
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: false,
        },
      });
    },
    *addEpisodeList({ payload }, { call, put }) {
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_episode, payload.params);
      if (response._id) {
        yield put({
          type: 'user/successCodeMessage',
          payload: { message: '添加成功' },
        });
        if (payload.returnList) {
          yield put({
            type: 'setCurrentEpisodeList',
            payload: {
              id: response._id,
            },
          });
        }

        yield put({
          type: 'fetchEpisodeList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateEpisodeList({ payload }, { call, put }) {
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_episode, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchEpisodeList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteEpisodeList({ payload }, { call, put }) {
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_episode, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchEpisodeList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setEpisodeList(state, { payload }) {
      return {
        ...state,
        episodeList: payload.data || [],
        episodeListCount: payload.total || 0,
      };
    },
    setEpisodeDetail(state, { payload }) {
      return {
        ...state,
        currentEpisode: payload || {},
      };
    },
    setCurrentEpisodeList(state, { payload }) {
      const now_currentEpisodeList = state.currentEpisodeList;
      now_currentEpisodeList.push(payload.id);
      return {
        ...state,
        currentEpisodeList: now_currentEpisodeList,
      };
    },
    clearCurrentEpisodeLis(state, { payload }) {
      console.log('清空clearCurrentEpisodeLis');
      return {
        ...state,
        currentEpisodeList: [],
      };
    },
    setEpisodeLoading(state, { payload }) {
      return {
        ...state,
        episodeLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
