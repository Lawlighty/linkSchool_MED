import {
  query_episode_list,
  query_episode_detail,
  add_episode,
  delete_episode,
  update_episode,
  update_episode_list_course,
} from '@/services/episode';
import { getQueryWhere } from '@/utils/utilFuncs';
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
      console.log('进入fetchEpisodeList');
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: true,
        },
      });
      const query = {};
      const pagination = payload.pagination || {};
      const where = getQueryWhere(payload.queryInfo || {});
      if (Object.keys(pagination).length > 0) {
        query['limit'] = pagination.pageSize;
        query['page'] = pagination.current;
      }
      if (Object.keys(where).length > 0) {
        query['where'] = where;
      }
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
    *getcurrentEpisodeList({ payload }, { call, put, select }) {
      console.log('getcurrentEpisodeList');
      const currentEpisodeList = yield select((state: any) => state.episode.currentEpisodeList);
      console.log('现在的currentEpisodeList', currentEpisodeList);
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
    *updateEpisodeListOfCourse({ payload }, { select, call, put }) {
      yield put({
        type: 'setEpisodeLoading',
        payload: {
          loading: true,
        },
      });
      const currentEpisodeList = yield select((state: any) => state.episode.currentEpisodeList);
      const params = {
        idList: currentEpisodeList,
        course_id: payload.course_id,
      };
      const response = yield call(update_episode_list_course, params);
      if (!response.status) {
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
      console.log('现在的now_currentEpisodeList', now_currentEpisodeList);
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
