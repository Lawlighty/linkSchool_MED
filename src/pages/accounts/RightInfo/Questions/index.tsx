import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { StarFilled, EyeOutlined } from '@ant-design/icons';

import { Tag } from 'antd';

import styles from './index.less';
import { timestampToTime } from '@/utils/timestampToTime';

const UserQuestions: React.FC<any> = (props) => {
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
          <div className={styles.item_meta}>
            <div className={styles.title}>马叉虫是给222</div>
            <div className={styles.tag}>
              <Tag color="#2db7f5">REACT.JS</Tag>
            </div>
          </div>
          <div className={styles.account}>
            <div className={styles.info}>2021-03-10 21:11</div>
          </div>
          <div className={styles.footer}>
            <StarFilled />
            112
            <em className={styles.split} />
            <EyeOutlined />
            19
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ user }: any) => ({
  userDetail: user.userDetail,
}))(UserQuestions);
