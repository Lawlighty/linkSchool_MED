import { history, Reducer, Effect } from 'umi';
import { getQueryWhere } from '@/utils/utilFuncs';
import { query_teacher_list, delete_teacher, update_teacher } from '@/services/teacher';
import { message } from 'antd';

const Model = {
  namespace: 'teacher',

  state: {
    teacherList: [],
    teacherListCount: 0,
    teacherLoading: false,
  },

  effects: {
    *fetchTeacherList({ payload }, { call, put }) {
      yield put({
        type: 'setTeacherLoading',
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
      const response = yield call(query_teacher_list, JSON.stringify(query));
      yield put({
        type: 'setTeacherList',
        payload: response,
      });
      yield put({
        type: 'setTeacherLoading',
        payload: {
          loading: false,
        },
      });
    },
    *addTeacherList({ payload }, { call, put }) {
      yield put({
        type: 'setTeacherLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_teacher, payload.params);
      if (response.status === 200) {
        yield put({
          type: 'user/successCodeMessage',
          payload: response,
        });

        yield put({
          type: 'fetchTeacherList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setTeacherLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateTeacherList({ payload }, { call, put }) {
      yield put({
        type: 'setTeacherLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_teacher, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchTeacherList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setTeacherLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteTeacherList({ payload }, { call, put }) {
      yield put({
        type: 'setTeacherLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_teacher, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchTeacherList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setTeacherLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setTeacherList(state, { payload }) {
      return {
        ...state,
        teacherList: payload.data || [],
        teacherListCount: payload.total || 0,
      };
    },
    setTeacherLoading(state, { payload }) {
      return {
        ...state,
        teacherLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
