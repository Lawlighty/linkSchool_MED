import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { StarFilled, LikeOutlined } from '@ant-design/icons';

import { Tag, Card, Avatar } from 'antd';

import styles from './index.less';
import { timestampToTime } from '@/utils/timestampToTime';

const { Meta } = Card;
const UserFocus: React.FC<any> = (props) => {
  const { dispatch, match } = props;

  useEffect(() => {
    // // 根据url 查询信息
    // const user_id =
    //   match.params.id || JSON.parse(localStorage.getItem('currentUser') || '{}')['_id'];
    // if (user_id) {
    //   dispatch({
    //     type: 'user/fetchUserDetail',
    //     payload: { id: user_id, params: {} },
    //   });
    // }
  }, []);

  return (
    <div>
      <div className={styles.list_items}>
        <div className={styles.list_item}>
          <Card hoverable style={{ width: 200 }}>
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="用户昵称"
              description="我的课程测试1我的课程测试1我的课程测试1我的课程测试1我的课程测试1"
            />
          </Card>
        </div>
        <div className={styles.list_item}>
          <Card hoverable style={{ width: 200 }}>
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="用户昵称"
              description="从教二十六年，始终怀揣对教育事业的热爱执着。 教学如和风细雨，润物无声，滋润着每个学生的心田，对数学课堂教学的研究有着独特的见解， 课"
            />
          </Card>
        </div>
        <div className={styles.list_item}>
          <Card hoverable style={{ width: 200 }}>
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="用户昵称"
              description="从教二十六年，始终怀揣对教育事业的热爱执着。 教学如和风细雨，润物无声，滋润着每个学生的心田，对数学课堂教学的研究有着独特的见解， 课"
            />
          </Card>
        </div>
        <div className={styles.list_item}>
          <Card hoverable style={{ width: 200 }}>
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="用户昵称"
              description="我的课程测试1我的课程测试1我的课程测试1我的课程测试1我的课程测试1"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
export default connect(({ user }: any) => ({
  userDetail: user.userDetail,
}))(UserFocus);
