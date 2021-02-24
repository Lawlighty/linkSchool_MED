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
import defaultUrl from '@/pages/config';
import { setSubStr } from '@/utils/utilFuncs';
import { getColorByStrLength } from '@/utils/utilFuncs';
interface CourseListProps {
  dispatch: Dispatch;
  courseList: [];
  courseListCount: 0;
  courseLoading: false;
}

const { Option } = Select;
const CoursesPage: React.FC<CourseListProps> = (props) => {
  const { dispatch, courseList, courseListCount, courseLoading } = props;

  const [currentCourse, setCurrentCourse] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: courseListCount,
  });

  const fetchCourse = (p_pagination = {}) => {
    dispatch({
      type: 'course/fetchCourseList',
      payload: {
        pagination: p_pagination || pagination,
      },
    });
  };
  useEffect(() => {
    setPagination({ ...pagination, total: courseListCount });
  }, [courseListCount]);
  useEffect(() => {
    fetchCourse();
  }, []);

  const confirm = (e, record) => {
    dispatch({
      type: 'course/deleteCourseList',
      payload: { id: record._id, pagination: pagination },
    });
  };

  const updateStick = (record) => {
    const course = record;
    course['stick'] = !record['stick'];
    dispatch({
      type: 'course/updateCourseList',
      payload: {
        params: { ...course },
        pagination: pagination,
      },
    });
  };
  const updateRecommend = (record) => {
    const course = record;
    course['recommend'] = !record['recommend'];
    dispatch({
      type: 'course/updateCourseList',
      payload: {
        params: { ...course },
        pagination: pagination,
      },
    });
  };
  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchCourse(pagination);
  };

  const columns = [
    {
      title: '课程名称',
      key: 'name',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: '作者',
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
      title: '课程简介',
      key: 'introduce',
      dataIndex: 'introduce',
      width: 400,
      render: (text) => {
        return setSubStr(text, 80);
      },
    },

    {
      title: '课程封面',
      key: 'cover',
      dataIndex: 'cover',
      width: 200,
      render: (text) => <img src={text} style={{ height: 100 }} alt="封面预览" />,
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
      title: '置顶',
      key: 'stick',
      dataIndex: 'stick',
      width: 100,
      render: (text) => {
        return text ? '置顶' : '否';
      },
    },
    {
      title: '推荐',
      key: 'recommend',
      dataIndex: 'recommend',
      width: 100,
      render: (text) => {
        return text ? '推荐' : '否';
      },
    },
    {
      title: '价格(普通)',
      key: 'price',
      dataIndex: 'price',
      width: 100,
      render: (text) => {
        return text ? `￥${text}` : '免费';
      },
    },
    {
      title: '价格(SVIP)',
      key: 'sprice',
      dataIndex: 'sprice',
      width: 100,
      render: (text) => {
        return text ? `￥${text}` : '免费';
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 350,
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`/courses/${record._id}`}>修改</Link>
          <Link to={`/courses/courses/${record._id}`}>查看课时</Link>
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
              history.push('/courses/create');
              dispatch({
                type: 'episode/clearCurrentEpisodeLis',
              });
            }}
          >
            新建课程
          </Button>
        </div>
        <div>
          <Spin tip="Loading..." spinning={courseLoading}>
            <Table
              columns={columns}
              dataSource={courseList}
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
export default connect(({ course, episode }) => ({
  courseList: course.courseList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  courseListCount: course.courseListCount,
  courseLoading: course.courseLoading,
}))(CoursesPage);
