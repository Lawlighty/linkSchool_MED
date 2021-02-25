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
import { utc2beijing } from '@/utils/timestampToTime';
import MEDitor from '@uiw/react-md-editor';
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
  const [visibleMEDitor, setVisibleMEDitor] = useState<boolean>(false);

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
      title: '发布时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 200,
      render: (text) => {
        return utc2beijing(text);
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
      title: '内容',
      key: 'content',
      dataIndex: 'content',
      width: 200,
      render: (text, record) => {
        if (text) {
          return (
            <div
              className="pointer c_green"
              onClick={() => {
                setVisibleMEDitor(true);
                setCurrentQuestion(record);
              }}
            >
              查看图文信息
            </div>
          );
        }
      },
    },
    {
      title: '解决状态',
      key: 'accept',
      dataIndex: 'accept',
      width: 100,
      render: (text) => {
        if (text) {
          return (
            <Tag color="#2db7f5" key={text}>
              已解决
            </Tag>
          );
        }
      },
    },
    // {
    //   title: '回答数',
    //   key: 'answer',
    //   dataIndex: 'answer',
    //   width: 100,
    // },
    {
      title: '浏览量',
      key: 'view',
      dataIndex: 'view',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (text: string, record: any) => (
        <Space size="middle">
          {/* <Link to={`/questions/${record._id}`}>修改</Link> */}
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={(e) => confirm(e, record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <div className="pointer c_red">删除</div>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <div className="div_w_20">
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

        <Modal
          title="问题内容"
          destroyOnClose
          visible={visibleMEDitor}
          footer={null}
          onCancel={() => {
            setVisibleMEDitor(false);
          }}
          width={800}
        >
          <div className="steps-content-no-center">
            <MEDitor.Markdown source={currentQuestion.content} />
          </div>
        </Modal>
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
