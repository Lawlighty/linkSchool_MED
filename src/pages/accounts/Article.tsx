import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HistoryOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Tooltip as AntdTooltip, Steps, Button, message, Form, Input, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './Article.less';
import MEDitor from '@uiw/react-md-editor';
import { mk_inti_string } from '../../../config/mk_init';
// import numeral from 'numeral';

const { Step } = Steps;

const steps = [
  {
    title: '标题信息',
    // content: 'First-content',
  },
  {
    title: '主要内容',
    // content: 'Second-content',
  },
  {
    title: '完成发布',
    // content: 'Last-content',
  },
];

const Article: React.FC<{}> = (props) => {
  useEffect(() => {});
  // const [value, setValue] = useState('**Hello world!!!**');
  // markdown 内容
  const [value, setValue] = useState(mk_inti_string);

  // 步骤
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <PageHeaderWrapper>
      <div className="div_w_20">
        <div className="container">
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          {current === 0 ? (
            <div className="steps-content">
              <div className="flex">
                <div className={styles.input_title}>标题:</div>
                <div className={styles.input_input}>
                  <Input className="flex_1" />
                </div>
              </div>
            </div>
          ) : null}
          {current === 1 ? (
            <div className="steps-content">
              <MEDitor height={600} value={value} onChange={setValue} />
              <div style={{ padding: '50px 0 0 0' }} />
              {/* <MEDitor.Markdown source={value} /> */}
            </div>
          ) : null}
          {current === 2 ? <div className="steps-content">aaa</div> : null}

          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                完成
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
export default connect()(Article);
