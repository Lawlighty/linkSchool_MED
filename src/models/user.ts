import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
  queryCurrent,
  query as queryUsers,
  query_user_list,
  query_user_detail,
} from '@/services/user';

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
  currentUser?: CurrentUser;
  userList?: any;
  userDetail?: any;
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
  };
}

// const UserModel: UserModelType = {
const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    userList: [],
    userDetail: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchUserList(_, { call, put }) {
      const response = yield call(query_user_list);
      yield put({
        type: 'setUserList',
        payload: response,
      });
    },

    *fetchUserDetail({ payload }, { call, put }) {
      const response = yield call(query_user_detail, payload.id, payload.params);
      yield put({
        type: 'setUserDetail',
        payload: response,
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
      };
    },
    setUserDetail(state, action) {
      return {
        ...state,
        userDetail: action.payload || {},
      };
    },
  },
};

export default UserModel;
