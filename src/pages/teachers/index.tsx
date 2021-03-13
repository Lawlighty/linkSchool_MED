import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link } from 'umi';
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HistoryOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Table,
  Tag,
  Space,
  Drawer,
  Tooltip as AntdTooltip,
  Badge,
  Input,
  Button,
  Spin,
  Popconfirm,
  Modal,
  Image,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

// import numeral from 'numeral';
import { timestampToTime } from '@/utils/timestampToTime';

interface TeachersProps {
  dispatch: Dispatch;
  match: Math;
  teacherList: [];
  teacherListCount: 0;
  teacherLoading: false;
}
interface queryInfoDto {
  teachername: string;
  nickname: string;
}
const initQueryInfo = {
  teachername: '',
  nickname: '',
  approve: true,
};
const AccountsList: React.FC<TeachersProps> = (props) => {
  const { dispatch, match, teacherList, teacherLoading, teacherListCount } = props;
  const my_id = JSON.parse(localStorage.getItem('currentUser') || '{}')['_id'];

  const [approve, setApprove] = useState(true);
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const [currentDrawerTeacher, setCurrentDrawerTeacher] = useState<any>({});

  const [visibleModal, setVisibleModal] = useState(false);
  const [currentVisible, setCurrentVisible] = useState<any>([]);

  const [queryInfo, setQueryInfo] = useState<queryInfoDto>(initQueryInfo);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: teacherListCount,
  });
  const fetchTeacherList = (p_pagination = {}, newfetched = false, query = {}) => {
    let currentPagination = p_pagination;
    if (newfetched) {
      currentPagination = { current: 1, pageSize: 10 };
      setPagination({ ...pagination, ...currentPagination });
    }
    dispatch({
      type: 'teacher/fetchTeacherList',
      payload: {
        pagination: currentPagination || pagination,
        queryInfo: Object.keys(query).length > 0 ? query : queryInfo,
      },
    });
  };
  useEffect(() => {
    console.log('match', match);
    const nowq = { ...queryInfo };
    if (match.path.indexOf('certificates') >= 0) {
      // 申请
      console.log('mat申请ch');
      nowq['approve'] = false;
      setQueryInfo({ ...nowq });
      setApprove(false);
    }
    fetchTeacherList({}, false, nowq);
  }, []);
  useEffect(() => {
    setPagination({ ...pagination, total: teacherListCount });
  }, [teacherListCount]);

  const changeQueryInfo = (key, value) => {
    setQueryInfo({ ...queryInfo, [key]: value });
  };

  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchTeacherList(pagination);
  };

  const toogleTeacher = (e, record) => {
    dispatch({
      type: 'teacher/updateTeacherList',
      payload: {
        params: {
          _id: record._id,
          approve: record.approve ? false : true,
        },
        pagination: pagination,
        queryInfo,
      },
    });
  };

  const deleteTeacher = (e, record) => {
    dispatch({
      type: 'teacher/deleteTeacherList',
      payload: { id: record._id, pagination: pagination, queryInfo },
    });
  };
  const showModal = (certificates: []) => {
    console.log('showModal', certificates);
    if (certificates.length > 0) {
      console.log('显示');
      setCurrentVisible([...certificates]);
      setVisibleModal(true);
    } else {
      Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: '暂无认证信息',
        okText: '确认',
        cancelText: '取消',
      });
    }
  };

  const columns = [
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text: string, record: any) => (
        <div>
          {my_id !== record.user._id && (
            <a
              onClick={(e) => {
                setVisibleDrawer(true);
                setCurrentDrawerTeacher(record.user);
              }}
            >
              {record.user.nickname}
            </a>
          )}
          {my_id === record.user._id && (
            <AntdTooltip placement="top" title="自己">
              <Badge dot>
                <a
                  onClick={(e) => {
                    setVisibleDrawer(true);
                    setCurrentDrawerTeacher(record.user);
                  }}
                >
                  {record.user.nickname}
                </a>
              </Badge>
            </AntdTooltip>
          )}
        </div>
      ),
    },
    {
      title: '头衔',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`/accounts/account-list/${record.user._id}`}>查看主页</Link>
          <div
            className="pointer c_green"
            onClick={(e) => {
              showModal(record.certificates || []);
            }}
          >
            查看证书信息
          </div>
          <Popconfirm
            title={record.approve ? '确定要取消认证吗?' : '确定要通过认证吗?'}
            onConfirm={(e) => toogleTeacher(e, record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <div className="pointer c_red">{record.approve ? '取消认证' : '通过认证'}</div>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tags = ['JS', 'React', 'Vue.js', 'JAVA', 'Python', 'Go', 'Antd Design'];
  return (
    <PageHeaderWrapper content=" 极课学院用户">
      <div className="div_w_20 ma_b_20">
        <div className={styles.search_items}>
          <div className={styles.search_item}>
            <div className={styles.label}>账号:</div>
            <div className={styles.info}>
              <Input
                value={queryInfo.teachername}
                onChange={(e) => changeQueryInfo('teachername', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.search_item}>
            <div className={styles.label}>昵称:</div>
            <div className={styles.info}>
              <Input
                value={queryInfo.nickname}
                onChange={(e) => changeQueryInfo('nickname', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.search_item}>
            <div className={styles.btns}>
              <Button
                className="ma_r_10"
                onClick={() => {
                  const init = initQueryInfo;
                  init['approve'] = approve;
                  setQueryInfo(init);
                }}
              >
                重置
              </Button>
              <Button type="primary" onClick={() => fetchTeacherList({}, true)}>
                查询
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="div_w_20">
        <div>
          <Spin tip="Loading..." spinning={teacherLoading}>
            <Table
              columns={columns}
              dataSource={teacherList}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Spin>

          <Drawer
            // className="div_w_20"
            width={400}
            title="用户信息"
            placement="right"
            closable={false}
            onClose={() => {
              setVisibleDrawer(false);
            }}
            visible={visibleDrawer}
          >
            <div>
              <div className={styles.avatarHolder}>
                <img
                  className="borderR50"
                  alt=""
                  src={
                    currentDrawerTeacher.avatar ||
                    'https://static-dev.roncoo.com/course/0948d9f30817454ea5386118fe1ac20a.jpg'
                  }
                />
                <div className={styles.name}>
                  <AntdTooltip placement="topLeft" title="前往用户主页" className="">
                    <Link to={`/accounts/account-list/${currentDrawerTeacher._id}`}>
                      <HomeOutlined className="pointer ma_l_r_10" />
                    </Link>
                  </AntdTooltip>
                  {currentDrawerTeacher.nickname || '暂无昵称'}
                  <Tag style={{ marginLeft: 10 }} color="gold">
                    SVIP
                  </Tag>
                </div>
                <div> {currentDrawerTeacher.introduc || '暂无简介'}</div>
              </div>
              <div className={styles.detail}>
                <p>
                  <IdcardOutlined className={styles.icon} />
                  注册时间:
                  <span className={styles.value}>
                    {timestampToTime(currentDrawerTeacher.createdAt) || '暂无注册时间'}
                  </span>
                </p>
                <p>
                  <PhoneOutlined className={styles.icon} />
                  联系方式:<span className={styles.value}>{currentDrawerTeacher.teachername}</span>
                </p>
                <p>
                  <MailOutlined className={styles.icon} />
                  电子邮箱:<span className={styles.value}>{currentDrawerTeacher.email}</span>
                </p>
                {false && (
                  <p>
                    <HistoryOutlined className={styles.icon} />
                    最近登录:<span className={styles.value}>2020/11/26 14:55 </span>
                  </p>
                )}
              </div>
              <div>
                <div className={styles.tagsTitle}>标签</div>
                <div>
                  {tags.map((item) => (
                    <Tag
                      style={{ marginBottom: 10 }}
                      color={item.length > 3 ? 'geekblue' : 'green'}
                      key={item}
                    >
                      {item.toUpperCase()}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </Drawer>
          <Modal
            width={1000}
            title="查看认证信息"
            visible={visibleModal}
            onOk={() => {
              setVisibleModal(false);
            }}
            onCancel={() => {
              setVisibleModal(false);
            }}
          >
            <div>
              {currentVisible.map((item, index) => (
                <Image
                  key={index + item}
                  width={200}
                  src={item}
                  style={{ margin: '0 10px', cursor: 'pointer' }}
                />
              ))}
              {/* <Image.PreviewGroup>
                {currentVisible.map((item, index) => (
                  <Image key={index + item} width={200} src={item} />
                ))}
              </Image.PreviewGroup> */}
            </div>
          </Modal>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ teacher }) => ({
  teacherList: teacher.teacherList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  teacherListCount: teacher.teacherListCount,
  teacherLoading: teacher.teacherLoading,
}))(AccountsList);
