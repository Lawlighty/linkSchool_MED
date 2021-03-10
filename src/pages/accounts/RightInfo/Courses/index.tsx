import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { StarFilled, LikeOutlined } from '@ant-design/icons';

import { Tag, Card } from 'antd';

import styles from './index.less';
import { timestampToTime } from '@/utils/timestampToTime';

const { Meta } = Card;
const UserCourses: React.FC<any> = (props) => {
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
          <Card
            hoverable
            style={{ width: 200 }}
            cover={
              <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
            }
          >
            <Meta
              title="课程标题"
              description="我的课程测试1我的课程测试1我的课程测试1我的课程测试1我的课程测试1"
            />
          </Card>
        </div>
        <div className={styles.list_item}>
          <Card
            hoverable
            style={{ width: 200 }}
            cover={
              <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
            }
          >
            <Meta
              title="课程标题"
              description="我的课程测试1我的课程测试1我的课程测试1我的课程测试1我的课程测试1"
            />
          </Card>
        </div>
        <div className={styles.list_item}>
          <Card
            hoverable
            style={{ width: 200 }}
            cover={
              <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
            }
          >
            <Meta
              title="课程标题"
              description="我的课程测试1我的课程测试1我的课程测试1我的课程测试1我的课程测试1"
            />
          </Card>
        </div>
        <div className={styles.list_item}>
          <Card
            hoverable
            style={{ width: 200 }}
            cover={
              <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
            }
          >
            <Meta
              title="课程标题"
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
}))(UserCourses);
