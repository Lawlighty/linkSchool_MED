import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HistoryOutlined,
  VideoCameraOutlined,
  ReadOutlined,
  CoffeeOutlined,
  HeartOutlined,
  StarFilled,
  SketchOutlined,
} from '@ant-design/icons';

import { Tag, Tooltip as AntdTooltip, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './Center.less';
import { timestampToTime } from '@/utils/timestampToTime';

const { TabPane } = Tabs;

const UserCenter: React.FC<any> = (props) => {
  const { dispatch, match, userDetail } = props;
  const tags = ['JS', 'React', 'Vue.js', 'JAVA', 'Python', 'Go', 'Antd Design'];
  const callback = (key) => {
    console.log(key);
  };
  console.log('userDetail', userDetail);
  useEffect(() => {
    // 根据url 查询信息
    const user_id = match.params.id;
    dispatch({
      type: 'user/fetchUserDetail',
      payload: { id: user_id, params: {} },
    });
  }, []);

  return (
    <PageHeaderWrapper>
      <div className="flex flex_a_s">
        <div className={styles.left_info}>
          <div className={styles.avatarHolder}>
            <img
              className="borderR50"
              alt=""
              src={
                userDetail.avatar ||
                'https://static-dev.roncoo.com/course/0948d9f30817454ea5386118fe1ac20a.jpg'
              }
            />
            <div className={styles.name}>
              {userDetail.nickname || '暂无昵称'}
              <Tag style={{ marginLeft: 10 }} color="gold">
                SVIP
              </Tag>
            </div>
            <div>{userDetail.introduc || '暂无简介'}</div>
          </div>
          <div className={styles.detail}>
            <p>
              <IdcardOutlined className={styles.icon} />
              注册时间:
              <span className={styles.value}>
                {timestampToTime(userDetail.createdAt) || '暂无注册时间'}
              </span>
            </p>
            <p>
              <PhoneOutlined className={styles.icon} />
              联系方式:<span className={styles.value}>{userDetail.username}</span>
            </p>
            <p>
              <MailOutlined className={styles.icon} />
              电子邮箱:<span className={styles.value}>{userDetail.email}</span>
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

        <div className={styles.right_info}>
          <Tabs onChange={callback} type="card">
            <TabPane
              tab={
                <span>
                  <VideoCameraOutlined />
                  视频(5)
                </span>
              }
              key="1"
            >
              Content of Tab Pane 1
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ReadOutlined />
                  文档(1)
                </span>
              }
              key="2"
            >
              Content of Tab Pane 2
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CoffeeOutlined />
                  帖子(3)
                </span>
              }
              key="3"
            >
              Content of Tab Pane 3
            </TabPane>
            <TabPane
              tab={
                <span>
                  <HeartOutlined />
                  收藏(7)
                </span>
              }
              key="4"
            >
              Content of Tab Pane 3
            </TabPane>
            <TabPane
              tab={
                <span>
                  <StarFilled />
                  关注(12)
                </span>
              }
              key="5"
            >
              Content of Tab Pane 3
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SketchOutlined />
                  SVIP
                </span>
              }
              key="6"
            >
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
export default connect(({ user }: any) => ({
  userDetail: user.userDetail,
}))(UserCenter);
