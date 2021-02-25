import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link } from 'umi';
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HistoryOutlined,
  HomeOutlined,
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
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './AccountsList.less';
import { ConnectState } from '@/models/connect';
// import numeral from 'numeral';
import { timestampToTime } from '@/utils/timestampToTime';

interface AccountsListProps {
  dispatch: Dispatch;
  userList?: [];
  userLoading: boolean;
  userListCount: number;
}
interface currentDrawerUserDto {
  username?: string;
  ref_code?: string;
  auth?: string;
  nickname?: string;
  gender?: number;
  avatar?: string;
  introduc?: string;
  tags?: [];
  email?: string;
  other1?: string;
  other2?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface queryInfoDto {
  username: string;
  nickname: string;
}
const initQueryInfo = {
  username: '',
  nickname: '',
};
const genderList = ['男', '女', '未知'];
const AccountsList: React.FC<AccountsListProps> = (props) => {
  const { dispatch, userList, userLoading, userListCount } = props;
  const my_id = JSON.parse(localStorage.getItem('currentUser') || '{}')['_id'];

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [currentDrawerUser, setCurrentDrawerUser] = useState<currentDrawerUserDto>({});

  const [queryInfo, setQueryInfo] = useState<queryInfoDto>(initQueryInfo);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: userListCount,
  });
  const fetchUserList = (p_pagination = {}, newfetched = false) => {
    let currentPagination = p_pagination;
    if (newfetched) {
      currentPagination = { current: 1, pageSize: 10 };
      setPagination({ ...pagination, ...currentPagination });
    }
    dispatch({
      type: 'user/fetchUserList',
      payload: {
        pagination: currentPagination || pagination,
        queryInfo,
      },
    });
  };
  useEffect(() => {
    fetchUserList();
  }, []);
  useEffect(() => {
    setPagination({ ...pagination, total: userListCount });
  }, [userListCount]);

  const changeQueryInfo = (key, value) => {
    setQueryInfo({ ...queryInfo, [key]: value });
  };

  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchUserList(pagination);
  };

  const deleteUser = (e, record) => {
    dispatch({
      type: 'user/deleteUserList',
      payload: { id: record._id, pagination: pagination, queryInfo },
    });
  };
  const columns = [
    {
      title: '手机号/账号',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => (
        <div>
          {my_id !== record._id && (
            <a
              onClick={(e) => {
                setVisibleDrawer(true);
                setCurrentDrawerUser(record);
              }}
            >
              {text}
            </a>
          )}
          {my_id === record._id && (
            <AntdTooltip placement="top" title="自己">
              <Badge dot>
                <a
                  onClick={(e) => {
                    setVisibleDrawer(true);
                    setCurrentDrawerUser(record);
                  }}
                >
                  {text}
                </a>
              </Badge>
            </AntdTooltip>
          )}
        </div>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    // {
    //   title: '年龄',
    //   dataIndex: 'age',
    //   key: 'age',
    // },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: number) => {
        let color = text === 0 ? 'blue' : 'magenta';
        if (text === 2) {
          color = 'purple';
        }
        return <Tag color={color}>{genderList[text]}</Tag>;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 3 ? 'geekblue' : 'green';
            if (tag === 'JAVA') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`/accounts/account-list/${record._id}`}>查看主页</Link>
          <a>禁言</a>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={(e) => deleteUser(e, record)}
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

  const tags = ['JS', 'React', 'Vue.js', 'JAVA', 'Python', 'Go', 'Antd Design'];
  return (
    <PageHeaderWrapper content=" 极课学院用户">
      <div className="div_w_20 ma_b_20">
        <div className={styles.search_items}>
          <div className={styles.search_item}>
            <div className={styles.label}>账号:</div>
            <div className={styles.info}>
              <Input
                value={queryInfo.username}
                onChange={(e) => changeQueryInfo('username', e.target.value)}
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
                  setQueryInfo(initQueryInfo);
                }}
              >
                重置
              </Button>
              <Button type="primary" onClick={() => fetchUserList({}, true)}>
                查询
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="div_w_20">
        <div>
          <Spin tip="Loading..." spinning={userLoading}>
            <Table
              columns={columns}
              dataSource={userList}
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
                    currentDrawerUser.avatar ||
                    'https://static-dev.roncoo.com/course/0948d9f30817454ea5386118fe1ac20a.jpg'
                  }
                />
                <div className={styles.name}>
                  <AntdTooltip placement="topLeft" title="前往用户主页" className="">
                    <Link to={`/accounts/account-list/${currentDrawerUser._id}`}>
                      <HomeOutlined className="pointer ma_l_r_10" />
                    </Link>
                  </AntdTooltip>
                  {currentDrawerUser.nickname || '暂无昵称'}
                  <Tag style={{ marginLeft: 10 }} color="gold">
                    SVIP
                  </Tag>
                </div>
                <div> {currentDrawerUser.introduc || '暂无简介'}</div>
              </div>
              <div className={styles.detail}>
                <p>
                  <IdcardOutlined className={styles.icon} />
                  注册时间:
                  <span className={styles.value}>
                    {timestampToTime(currentDrawerUser.createdAt) || '暂无注册时间'}
                  </span>
                </p>
                <p>
                  <PhoneOutlined className={styles.icon} />
                  联系方式:<span className={styles.value}>{currentDrawerUser.username}</span>
                </p>
                <p>
                  <MailOutlined className={styles.icon} />
                  电子邮箱:<span className={styles.value}>{currentDrawerUser.email}</span>
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
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ user }) => ({
  userList: user.userList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  userListCount: user.userListCount,
  userLoading: user.userLoading,
}))(AccountsList);
