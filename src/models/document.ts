import {
  query_document_list,
  query_document_detail,
  add_document,
  delete_document,
  update_document,
} from '@/services/document';
import { message } from 'antd';

const Model = {
  namespace: 'document',

  state: {
    currentDocument: {},
    documentList: [],
    documentListCount: 0,
    documentLoading: false,
  },

  effects: {
    *fetchDocumentList({ payload }, { call, put }) {
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: true,
        },
      });
      const pagination = payload.pagination || {};
      const query = {
        limit: pagination.pageSize || 10,
        page: pagination.current || 1,
      };
      const response = yield call(query_document_list, JSON.stringify(query));
      yield put({
        type: 'setDocumentList',
        payload: response,
      });
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchDocumentDetail({ payload }, { call, put }) {
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: true,
        },
      });
      const id = payload._id;
      const response = yield call(query_document_detail, id);
      yield put({
        type: 'setDocumentDetail',
        payload: response,
      });
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: false,
        },
      });
    },
    *addDocumentList({ payload }, { call, put }) {
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(add_document, payload.params);
      if (response._id) {
        yield put({
          type: 'user/successCodeMessage',
          payload: { message: '添加成功' },
        });

        yield put({
          type: 'fetchDocumentList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: false,
        },
      });
    },
    *updateDocumentList({ payload }, { call, put }) {
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(update_document, payload.params);
      if (response._id) {
        message.success('修改成功!');

        yield put({
          type: 'fetchDocumentList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: false,
        },
      });
    },
    *deleteDocumentList({ payload }, { call, put }) {
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(delete_document, payload.id);
      if (response._id) {
        message.success('删除成功!');

        yield put({
          type: 'fetchDocumentList',
          payload: payload,
        });
      } else {
        yield put({
          type: 'user/errorCodeMessage',
          payload: response,
        });
      }
      yield put({
        type: 'setDocumentLoading',
        payload: {
          loading: false,
        },
      });
    },
  },

  reducers: {
    setDocumentList(state, { payload }) {
      return {
        ...state,
        documentList: payload.data || [],
        documentListCount: payload.total || 0,
      };
    },
    setDocumentDetail(state, { payload }) {
      return {
        ...state,
        currentDocument: payload || {},
      };
    },
    setDocumentLoading(state, { payload }) {
      return {
        ...state,
        documentLoading: payload.loading || false,
      };
    },
  },
};

export default Model;
