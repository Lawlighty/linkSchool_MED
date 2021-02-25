import {
  query_question_list,
  query_question_detail,
  add_question,
  delete_question,
  update_question,
} from '@/services/question';
import { message } from 'antd';

const Model = {
  namespace: 'question',

  state: {
    currentQuestion: {},
    questionList: [],
    questionListCount: 0,
    questionLoading: false,
  },

  effects: {
    *fetchQuestionList({ payload }, { call, put }) {
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.pagination || {};
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      const response = yield call(query_question_list, JSON.stringify(query));
      yield put({
        type: 'setQuestionList',
        payload: response,
      });
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchQuestionDetail({ payload }, { call, put }) {
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: true,
        },
      });
      const id = payload._id;
      const response = yield call(query_question_detail, id);
      yield put({
        type: 'setQuestionDetail',
        payload: response,
      });
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: false,
        },
      });
    },
    *addQuestionList({ payload }, { call, put }) {
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_question, payload.params);
      if (response._id) {
        yield put({
          type: 'user/successCodeMessage',
          payload: { message: '添加成功' },
        });

        yield put({
          type: 'fetchQuestionList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateQuestionList({ payload }, { call, put }) {
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_question, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchQuestionList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteQuestionList({ payload }, { call, put }) {
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_question, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchQuestionList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setQuestionLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setQuestionList(state, { payload }) {
      return {
        ...state,
        questionList: payload.data || [],
        questionListCount: payload.total || 0,
      };
    },
    setQuestionDetail(state, { payload }) {
      return {
        ...state,
        currentQuestion: payload || {},
      };
    },
    setQuestionLoading(state, { payload }) {
      return {
        ...state,
        questionLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
