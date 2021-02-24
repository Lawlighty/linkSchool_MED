import {
  query_course_list,
  query_course_detail,
  add_course,
  delete_course,
  update_course,
} from '@/services/course';
import { message } from 'antd';

const Model = {
  namespace: 'course',

  state: {
    currentCourse: {},
    courseList: [],
    courseListCount: 0,
    courseLoading: false,
  },

  effects: {
    *fetchCourseList({ payload }, { call, put }) {
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.pagination || {};
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      const response = yield call(query_course_list, JSON.stringify(query));
      yield put({
        type: 'setCourseList',
        payload: response,
      });
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchCourseDetail({ payload }, { call, put }) {
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: true,
        },
      });
      const id = payload._id;
      const response = yield call(query_course_detail, id);
      yield put({
        type: 'setCourseDetail',
        payload: response,
      });
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: false,
        },
      });
    },
    *addCourseList({ payload }, { call, put }) {
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_course, payload.params);
      if (response._id) {
        yield put({
          type: 'user/successCodeMessage',
          payload: { message: '添加成功' },
        });

        if (payload.updateEpisode) {
          yield put({
            type: 'episode/updateEpisodeListOfCourse',
            payload: { course_id: response._id },
          });
        }
        yield put({
          type: 'fetchCourseList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateCourseList({ payload }, { call, put }) {
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_course, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchCourseList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteCourseList({ payload }, { call, put }) {
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_course, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchCourseList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setCourseLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setCourseList(state, { payload }) {
      return {
        ...state,
        courseList: payload.data || [],
        courseListCount: payload.total || 0,
      };
    },
    setCourseDetail(state, { payload }) {
      return {
        ...state,
        currentCourse: payload || {},
      };
    },
    setCourseLoading(state, { payload }) {
      return {
        ...state,
        courseLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
