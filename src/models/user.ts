import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
  queryCurrent,
  query as queryUsers,
  query_user_list,
  query_user_detail,
  delete_user,
  update_user_info,
} from '@/services/user';
import { getQueryWhere } from '@/utils/utilFuncs';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: any;
  userList?: any;
  userDetail?: any;
  // userListCount: number;
  // userLoading: boolean;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  // state: any;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchUserList: Effect; // 获取用户列表
    fetchUserDetail: Effect; // 获取某用户信息
    errorCodeMessage: Effect; // 错误信息提示
    successCodeMessage: Effect; // 信息提示
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    setUserList: Reducer; // 更新用户列表
    setUserDetail: Reducer; // 更新用户列表
    setUserLoading: Reducer; // 设置loading
  };
}

// const UserModel: UserModelType = {
const UserModel = {
  namespace: 'user',

  state: {
    currentUser: {},
    userList: [],
    userDetail: {},
    userListCount: 0,
    userLoading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchUserList({ payload }, { call, put }) {
      yield put({
        type: 'setUserLoading',
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
      const response = yield call(query_user_list, JSON.stringify(query));
      console.log('response', response);
      yield put({
        type: 'setUserList',
        payload: response,
      });
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: false,
        },
      });
    },

    *fetchUserDetail({ payload, callback }, { call, put }) {
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(query_user_detail, payload.id, payload.params);
      if (callback && typeof callback === 'function') {
        callback(response);
      }
      yield put({
        type: 'setUserDetail',
        payload: response,
      });
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateUser({ payload, callback }, { call, put }) {
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_user_info, payload.id, payload.params);

      if (callback && typeof callback === 'function') {
        callback(response);
      }
      yield put({
        type: 'fetchUserDetail',
        payload: { id: payload.id, params: {} },
      });
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteUserList({ payload }, { call, put }) {
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_user, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchUserList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setUserLoading',
        payload: {
          loading: false,
        },
      });
    },
    errorCodeMessage({ payload }, { call, put }) {
      // 获取token\
      // 判断status
      message.error(payload.message);
    },
    successCodeMessage({ payload }, { call, put }) {
      message.success(payload.message);
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    setUserList(state, action) {
      return {
        ...state,
        userList: action.payload.data || [],
        userListCount: action.payload.total || 0,
      };
    },
    setUserDetail(state, action) {
      return {
        ...state,
        userDetail: action.payload || {},
      };
    },
    setUserLoading(state, { payload }) {
      return {
        ...state,
        userLoading: payload.loading || false,
      };
    },
  },
};

export default UserModel;
