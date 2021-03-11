import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { Component, useEffect, useState } from 'react';

// import { CurrentUser } from '../data.d';
import defaultUrl from '@/pages/config';
import styles from './BaseView.less';
import { useForm } from 'antd/lib/form/Form';

const BaseView: React.FC<any> = (props) => {
  const { dispatch, userDetail, currentUser } = props;
  const [nowInfo, setNowInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [form] = useForm();
  const getUserDetails = () => {
    // 根据url 查询信息
    const user_id = JSON.parse(localStorage.getItem('currentUser') || '{}')['_id'];
    if (user_id) {
      dispatch({
        type: 'user/fetchUserDetail',
        payload: { id: user_id, params: {} },
        callback: (res) => {
          if (res) {
            form.setFieldsValue(res);
          }
        },
      });
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  const getAvatarURL = () => {
    if (userDetail) {
      if (userDetail.avatar) {
        return userDetail.avatar;
      }
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  };

  const handleFinish = (values: any) => {
    // message.success(formatMessage({ id: 'accountandsettings.basic.update.success' }));
    dispatch({
      type: 'user/updateUser',
      payload: { id: userDetail._id, params: { ...values, avatar: currentAvatar } },
      callback: (res) => {
        if (res) {
          if (res._id) {
            message.success('更新成功!');
            localStorage.setItem('currentUser', JSON.stringify(res));
            dispatch({
              type: 'user/saveCurrentUser',
              payload: res,
            });
          }
        }
      },
    });
  };
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(true);
      setCurrentAvatar(info.file.response.url);
    }
  };

  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>
        <FormattedMessage id="accountandsettings.basic.avatar" defaultMessage="头像" />
      </div>
      <div className={styles.avatar}>
        {currentAvatar ? (
          <img src={currentAvatar} alt="avatar" />
        ) : (
          <img src={avatar} alt="avatar" />
        )}
      </div>
      <Upload
        showUploadList={false}
        name="file"
        action={defaultUrl.UPLOAD_IMG_URL}
        onChange={handleChange}
      >
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            <FormattedMessage
              id="accountandsettings.basic.change-avatar"
              defaultMessage="修改头像"
            />
          </Button>
        </div>
      </Upload>
    </>
  );
  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={userDetail}
          hideRequiredMark
        >
          <Form.Item name="username" label={formatMessage({ id: '用户名' })}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="nickname"
            label={formatMessage({ id: '昵称' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: '请输入昵称' }, {}),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="introduc" label={formatMessage({ id: '个人简介' })}>
            <Input.TextArea placeholder={formatMessage({ id: '个人简介' })} rows={4} />
          </Form.Item>
          <Form.Item name="email" label={formatMessage({ id: '邮箱' })}>
            <Input />
          </Form.Item>
          <Form.Item name="ref_code" label={formatMessage({ id: '推荐码' })}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              <FormattedMessage
                id="accountandsettings.basic.update"
                defaultMessage="更新基本信息"
              />
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
};

export default connect(({ user }: any) => ({
  userDetail: user.userDetail,
  currentUser: user.currentUser,
}))(BaseView);
