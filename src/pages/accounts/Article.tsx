import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip as AntdTooltip, Steps, Button, message, Input, Select, Upload } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './Article.less';
import MEDitor from '@uiw/react-md-editor';
import { mk_inti_string } from '../../../config/mk_init';
// import numeral from 'numeral';
import defaultUrl from '@/pages/config';

const { Step } = Steps;
const { TextArea } = Input;

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

  // 文档
  const [document, setDocument] = useState<any>({});
  // 图片上传
  const [loading, setLoading] = useState<boolean>(false);

  const next = () => {
    setCurrent(current + 1);
    if (current === 1) {
      console.log('document==>', document);
      console.log('value==>', value);
      console.log('value==>', typeof value);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const changeDocument = (key, value) => {
    setDocument({ ...document, [key]: value });
  };

  const beforeUpload = (file) => {
    console.log('beforeUpload', file);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleChange = (info) => {
    console.log('handleChange', info);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(true);
        setDocument({ ...document, cover: imageUrl });
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
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
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>文章标题:</div>
                <div className={styles.input_input}>
                  <Input
                    className="flex_1"
                    value={document.name}
                    onChange={(e) => {
                      changeDocument('name', e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex margin_20">
                <div className={styles.input_title}>文章图片:</div>
                <div className={`${styles.input_input} text_a_l`}>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader-200"
                    showUploadList={false}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    action={defaultUrl.UPLOAD_IMG_URL}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    method="post"
                  >
                    {document.cover ? (
                      <img src={document.cover} alt="图片" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </div>
              </div>
              <div className="flex flex_a_s margin_20">
                <div className={styles.input_title}>文章简介:</div>
                <div className={styles.input_input}>
                  <TextArea
                    rows={4}
                    value={document.introduce}
                    onChange={(e) => {
                      changeDocument('introduce', e.target.value);
                    }}
                  />
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
          {current === 2 ? <div className="steps-content">操作成功!</div> : null}

          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                {current === 1 ? '提交' : '下一步'}

                {/* 下一步 */}
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
