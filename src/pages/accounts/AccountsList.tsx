import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link } from 'umi';
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HistoryOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Table, Tag, Space, Drawer, Tooltip as AntdTooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './AccountsList.less';
import { ConnectState } from '@/models/connect';
// import numeral from 'numeral';
import { timestampToTime } from '@/utils/timestampToTime';

interface AccountsListProps {
  dispatch: Dispatch;
  userList?: [];
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

const genderList = ['男', '女', '未知'];
const AccountsList: React.FC<AccountsListProps> = (props) => {
  const { dispatch, userList } = props;
  console.log('userList===>', userList);
  useEffect(() => {
    dispatch({
      type: 'user/fetchUserList',
    });
  }, []);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [currentDrawerUser, setCurrentDrawerUser] = useState<currentDrawerUserDto>({});

  const columns = [
    {
      title: '手机号/账号',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => (
        <a
          onClick={(e) => {
            setVisibleDrawer(true);
            setCurrentDrawerUser(record);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    // {
    //   title: '性别',
    //   dataIndex: 'gender',
    //   key: 'gender',
    //   render: (text: number) => {
    //     let color = text === 0 ? 'blue' : 'magenta';
    //     if (text === 2) {
    //       color = 'purple';
    //     }
    //     return <Tag color={color}>{genderList[text].toUpperCase()}</Tag>;
    //   },
    // },
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
          <Link to={`/accounts/account-list/${`adasdas`}`}>查看主页</Link>
          <a>禁言</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      phone: '13616565676',
      nickname: 'John',
      age: 19,
      gender: 1,
      address: 'New York No. 1 Lake Park',
      tags: ['JAVA', 'JS'],
    },
    {
      key: '2',
      phone: '13616565676',
      nickname: 'Snow',
      age: 32,
      gender: 2,
      address: 'New York No. 1 Lake Park',
      tags: ['React', 'JS'],
    },
    {
      key: '3',
      phone: '13616565676',
      nickname: '张三李四',
      age: 21,
      gender: 0,
      address: 'New York No. 1 Lake Park',
      tags: ['PHP', 'Mysql'],
    },
  ];

  const tags = ['JS', 'React', 'Vue.js', 'JAVA', 'Python', 'Go', 'Antd Design'];
  return (
    <PageHeaderWrapper content=" 极课学院用户">
      <div className="div_w_20">
        <div>
          <Table columns={columns} dataSource={userList} />
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
export default connect(({ user }: ConnectState) => ({
  userList: user.userList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
}))(AccountsList);
