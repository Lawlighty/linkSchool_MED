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
  Radio,
  InputNumber,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import defaultUrl from '@/pages/config';
import { setSubStr, getColorByStrLength } from '@/utils/utilFuncs';
import styles from './index.less';

const { TextArea } = Input;
interface CourseListProps {
  dispatch: Dispatch;
  courseList: [];
  courseListCount: 0;
  courseLoading: false;
  userList: [];
  categoryParentList: [];
}

const { Option } = Select;
const CoursesPage: React.FC<CourseListProps> = (props) => {
  const {
    dispatch,
    courseList,
    courseListCount,
    courseLoading,
    userList,
    categoryParentList,
  } = props;

  const [currentCourse, setCurrentCourse] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
  const fetchUserList = (nickname: string, isInit = false) => {
    const payload = {};
    if (isInit) {
      payload['pagination'] = { current: 1, pageSize: 10 };
    } else {
      const queryInfo = {
        nickname,
      };
      payload['queryInfo'] = queryInfo;
    }
    console.log('payload==>', payload);
    dispatch({
      type: 'user/fetchUserList',
      payload: payload,
    });
  };

  const fetchParentCategorys = (name: string, isInit = false) => {
    const payload = {};
    if (isInit) {
      payload['pagination'] = { current: 1, pageSize: 10 };
    } else {
      const queryInfo = {
        name,
      };
      payload['queryInfo'] = queryInfo;
    }
    dispatch({
      type: 'category/fetchParentCategoryList',
      payload: payload,
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

  const changeCourse = (key: string, value: any) => {
    setCurrentCourse({ ...currentCourse, [key]: value });
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      setCurrentCourse({ ...currentCourse, cover: info.file.response.url });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onSearch = (val) => {
    fetchUserList(val);
  };
  const onSearchCate = (val) => {
    fetchParentCategorys(val);
  };
  const updateCourse = () => {
    const nowcourse = currentCourse;
    dispatch({
      type: 'course/updateCourseList',
      payload: {
        // params: { ...nowcourse, content: JSON.stringify(nowcourse.content) },
        params: { ...nowcourse },
        pagination,
      },
    }).then(() => setVisible(false));
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
          <a
            onClick={(e) => {
              e.stopPropagation();

              if (record.author) {
                fetchUserList(record.author.nickname, false);
              } else {
                fetchUserList('', true);
              }
              if (record.category) {
                fetchParentCategorys(record.category.name, false);
              } else {
                fetchParentCategorys('', true);
              }
              setVisible(true);
              setCurrentCourse({ ...record });
            }}
          >
            修改课程
          </a>
          <Link to={`/courses/course/${record._id}`}>查看课时</Link>
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

        <Modal
          destroyOnClose
          title="修改课程"
          visible={visible}
          onOk={updateCourse}
          confirmLoading={courseLoading}
          onCancel={() => {
            setVisible(false);
            setCurrentCourse({});
          }}
          okText="修改"
          cancelText="取消"
          width={800}
        >
          <div>
            <div className="flex flex_a_c margin_20">
              <div className={styles.input_title}>课程名称:</div>
              <div className={styles.input_input}>
                <Input
                  className="flex_1"
                  value={currentCourse.name}
                  onChange={(e) => {
                    changeCourse('name', e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex margin_20">
              <div className={styles.input_title}>课程封面图:</div>
              <div className={`${styles.input_input} text_a_l`}>
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader-200"
                  showUploadList={false}
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  action={defaultUrl.UPLOAD_IMG_URL}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  method="post"
                >
                  {currentCourse.cover ? (
                    <img src={currentCourse.cover} alt="图片" style={{ height: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
            </div>
            <div className="flex flex_a_s margin_20">
              <div className={styles.input_title}>课程介绍:</div>
              <div className={styles.input_input}>
                <TextArea
                  rows={4}
                  value={currentCourse.introduce}
                  onChange={(e) => {
                    changeCourse('introduce', e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex_a_c margin_20">
              <div className={styles.input_title}>课程价格:</div>
              <div className={`${styles.input_input} flex_a_c`}>
                <InputNumber
                  defaultValue={0}
                  className="flex_1"
                  formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  value={currentCourse.price}
                  onChange={(e) => {
                    changeCourse('price', e);
                  }}
                />
                <div className="ma_r_20">(普通)</div>
                <InputNumber
                  defaultValue={0}
                  className="flex_1"
                  formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  value={currentCourse.sprice}
                  onChange={(e) => {
                    changeCourse('sprice', e);
                  }}
                />
                <div>(VIP)</div>
              </div>
            </div>
            <div className="flex flex_a_c margin_20">
              <div className={styles.input_title}>设置:</div>
              <div className={`${styles.input_input} flex_a_c`}>
                <Radio.Group
                  onChange={(e) => {
                    changeCourse('stick', e.target.value);
                  }}
                  value={currentCourse.stick}
                >
                  <Radio value>置顶</Radio>
                  <Radio value={false}>不置顶</Radio>
                </Radio.Group>

                <Radio.Group
                  onChange={(e) => {
                    changeCourse('recommend', e.target.value);
                  }}
                  value={currentCourse.recommend}
                >
                  <Radio value>推荐</Radio>
                  <Radio value={false}>不推荐</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className="flex flex_a_c margin_20">
              <div className={styles.input_title}>课程作者:</div>
              <div className={`${styles.input_input} flex_a_c`}>
                <Select
                  showSearch
                  onSearch={onSearch}
                  onChange={(e) => {
                    changeCourse('author', e);
                  }}
                  value={
                    currentCourse.author
                      ? currentCourse.author._id
                        ? currentCourse.author._id
                        : currentCourse.author
                      : null
                  }
                  style={{ minWidth: 200 }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {userList.map((item) => (
                    <Option
                      key={item._id}
                      value={item._id}
                    >{`${item.nickname}(${item.username})`}</Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex_a_c margin_20">
              <div className={styles.input_title}>所属分类:</div>
              <div className={`${styles.input_input} flex_a_c`}>
                <Select
                  showSearch
                  onSearch={onSearchCate}
                  onChange={(e) => {
                    changeCourse('category', e);
                  }}
                  value={
                    currentCourse.category
                      ? currentCourse.category._id
                        ? currentCourse.category._id
                        : currentCourse.category
                      : null
                  }
                  style={{ minWidth: 200 }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {categoryParentList.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ course, episode, user, category }) => ({
  courseList: course.courseList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  courseListCount: course.courseListCount,
  courseLoading: course.courseLoading,
  userList: user.userList,
  categoryParentList: category.categoryParentList,
}))(CoursesPage);
