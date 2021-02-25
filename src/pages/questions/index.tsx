import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link, history } from 'umi';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Table,
  Space,
  Select,
  Tag,
  Button,
  Modal,
  Input,
  Popconfirm,
  message,
  Spin,
  Upload,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import defaultUrl from '@/pages/config';
import { setSubStr } from '@/utils/utilFuncs';
import { getColorByStrLength } from '@/utils/utilFuncs';
interface QuestionListProps {
  dispatch: Dispatch;
  questionList: [];
  questionListCount: 0;
  questionLoading: false;
}

const { Option } = Select;
const QuestionsPage: React.FC<QuestionListProps> = (props) => {
  const { dispatch, questionList, questionListCount, questionLoading } = props;

  const [currentQuestion, setCurrentQuestion] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: questionListCount,
  });

  const fetchQuestion = (p_pagination = {}) => {
    dispatch({
      type: 'question/fetchQuestionList',
      payload: {
        pagination: p_pagination || pagination,
      },
    });
  };
  useEffect(() => {
    setPagination({ ...pagination, total: questionListCount });
  }, [questionListCount]);
  useEffect(() => {
    fetchQuestion();
  }, []);

  const confirm = (e, record) => {
    dispatch({
      type: 'question/deleteQuestionList',
      payload: { id: record._id, pagination: pagination },
    });
  };

  const updateStick = (record) => {
    const question = record;
    question['stick'] = !record['stick'];
    dispatch({
      type: 'question/updateQuestionList',
      payload: {
        params: { ...question },
        pagination: pagination,
      },
    });
  };
  const updateRecommend = (record) => {
    const question = record;
    question['recommend'] = !record['recommend'];
    dispatch({
      type: 'question/updateQuestionList',
      payload: {
        params: { ...question },
        pagination: pagination,
      },
    });
  };
  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchQuestion(pagination);
  };

  const columns = [
    {
      title: '标题',
      key: 'name',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: '发布人',
      key: 'author',
      dataIndex: 'author',
      width: 200,
      render: (text, record) => {
        let author = '';
        if (text && text.nickname) {
          author = `${text.nickname}(${text.username})`;
        } else if (text && text.username) {
          author = `(${text.username})`;
        }

        return !text ? (
          <div>未知</div>
        ) : (
          <Link to={`/accounts/account-list/${text._id}`}>{author}</Link>
        );
      },
    },
    {
      title: '文档简介',
      key: 'introduce',
      dataIndex: 'introduce',
      width: 400,
      render: (text) => {
        return setSubStr(text, 80);
      },
    },
    {
      title: '发布时间',
      key: 'introduce',
      dataIndex: 'introduce',
      width: 400,
      render: (text) => {
        return setSubStr(text, 80);
      },
    },

    {
      title: '类型',
      key: 'category',
      dataIndex: 'category',
      width: 100,
      render: (text) => {
        if (text) {
          const p_name = text.name || '';
          const color = getColorByStrLength(p_name);
          // if (text === 'JAVA') {
          //   color = 'volcano';
          // }
          return (
            <Tag color={color} key={p_name}>
              {p_name.toUpperCase()}
            </Tag>
          );
        }
        return '';
      },
    },
    {
      title: '解决',
      key: 'accept',
      dataIndex: 'accept',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`/questions/${record._id}`}>修改</Link>
          <Popconfirm
            title={record.stick ? '确定要取消吗?' : '确定要置顶吗'}
            onConfirm={(e) => updateStick(record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <div className={`pointer  ${!record.stick ? 'c_green' : 'c_red'}`}>
              {record.stick ? '取消置顶' : '置顶'}
            </div>
          </Popconfirm>
          <Popconfirm
            title={record.stick ? '确定要取消吗?' : '确定要推荐吗'}
            onConfirm={(e) => updateRecommend(record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <div className={`pointer  ${!record.recommend ? 'c_green' : 'c_red'}`}>
              {record.recommend ? '取消推荐' : '推荐'}
            </div>
          </Popconfirm>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={(e) => confirm(e, record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <div className="div_w_20">
        <div>
          <Button
            type="primary"
            className="ma_b_10"
            onClick={() => {
              history.push('/questions/create');
            }}
          >
            新建
          </Button>
        </div>
        <div>
          <Spin tip="Loading..." spinning={questionLoading}>
            <Table
              columns={columns}
              dataSource={questionList}
              pagination={pagination}
              onChange={handleTableChange}
              scroll={{ x: 1300 }}
            />
          </Spin>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ question }) => ({
  questionList: question.questionList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  questionListCount: question.questionListCount,
  questionLoading: question.questionLoading,
}))(QuestionsPage);
