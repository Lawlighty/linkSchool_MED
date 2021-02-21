import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';

// import { CurrentUser } from '../data.d';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';

const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>
      <FormattedMessage id="accountandsettings.basic.avatar" defaultMessage="头像" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          <FormattedMessage id="accountandsettings.basic.change-avatar" defaultMessage="修改头像" />
        </Button>
      </div>
    </Upload>
  </>
);
interface SelectItem {
  label: string;
  key: string;
}

const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

interface BaseViewProps {
  currentUser?: CurrentUser;
}

class BaseView extends Component<any> {
  view: HTMLDivElement | undefined = undefined;

  getAvatarURL = () => {
    // const { currentUser } = this.props;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish = () => {
    message.success(formatMessage({ id: 'accountandsettings.basic.update.success' }));
  };

  render() {
    const { currentUser } = this.props;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >
            <Form.Item name="username" label={formatMessage({ id: '用户名' })}>
              <Input />
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
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default connect()(BaseView);
// ({ accountAndsettings }: { accountAndsettings: { currentUser: CurrentUser } }) => ({
//   currentUser: accountAndsettings.currentUser,
// }),
