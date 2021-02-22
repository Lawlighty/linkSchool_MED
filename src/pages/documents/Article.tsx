import React, { useEffect, useState } from 'react';
import { connect, Link, history } from 'umi';
import { LoadingOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  Tooltip as AntdTooltip,
  Steps,
  Button,
  message,
  Input,
  Select,
  Upload,
  InputNumber,
  Radio,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './Article.less';
import MEDitor from '@uiw/react-md-editor';
import { mk_inti_string } from '../../../config/mk_init';
// import numeral from 'numeral';
import defaultUrl from '@/pages/config';
import { doc } from 'prettier';

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
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

const initDocument = {
  content: mk_inti_string,
};
const Article: React.FC<{}> = (props) => {
  const { dispatch, currentDocument, userList } = props;
  // const [value, setValue] = useState('**Hello world!!!**');
  // markdown 内容
  // const [value, setValue] = useState(mk_inti_string);

  // 步骤
  const [current, setCurrent] = React.useState(0);

  // 文档
  const [document, setDocument] = useState<any>(initDocument);
  // 图片上传
  const [loading, setLoading] = useState<boolean>(false);

  const clearDocumentDetail = () => {
    dispatch({
      type: 'document/setDocumentDetail',
      payload: {},
    });
  };
  const fetchDocumentDetail = (id = '') => {
    dispatch({
      type: 'document/fetchDocumentDetail',
      payload: {
        _id: id,
      },
    });
  };
  const fetchUserList = (nickname: string, isInit = false) => {
    console.log('查询用户');
    const payload = {};
    if (isInit) {
      payload['pagination'] = { current: 1, pageSize: 10 };
    } else {
      const queryInfo = {
        nickname,
      };
      payload['queryInfo'] = queryInfo;
    }
    console.log('payload==>', payload);
    dispatch({
      type: 'user/fetchUserList',
      payload: payload,
    });
  };
  const addDocument = () => {
    const nowdocument = document;
    nowdocument['cover'] =
      nowdocument['cover'] || 'https://a1.jikexueyuan.com/home/201507/22/ff2e/55af4bf0d4eed.jpg';
    dispatch({
      type: 'document/addDocumentList',
      payload: {
        params: document,
      },
    });
  };
  const updateDocument = () => {
    dispatch({
      type: 'document/updateDocumentList',
      payload: {
        params: { ...document, content: JSON.stringify(document.content) },
      },
    });
  };
  useEffect(() => {
    if (history.location.pathname.indexOf('create') < 0) {
      // 编辑-->查询 文档信息
      fetchDocumentDetail(history.location.pathname.split('/').pop());
    } else {
      clearDocumentDetail();
    }
    fetchUserList('', true);
  }, []);
  useEffect(() => {
    if (history.location.pathname.indexOf('create') < 0) {
      setDocument({ ...currentDocument });
    }
  }, [currentDocument]);

  const next = () => {
    if (!document.name) {
      message.info('请输入标题');
      return;
    }

    if (current === 1) {
      if (document._id) {
        updateDocument();
      } else {
        addDocument();
      }
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const changeDocument = (key, value) => {
    setDocument({ ...document, [key]: value });
  };

  const toContinue = () => {
    setCurrent(0);
    setDocument(initDocument);
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
      setDocument({ ...document, cover: info.file.response.url });
      // getBase64(info.file.originFileObj, (imageUrl) => {
      //   setLoading(true);
      //   setDocument({ ...document, cover: imageUrl });
      // });
    }
  };
  const onSearch = (val) => {
    // console.log('val: ', val);
    fetchUserList(val, false);
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
                      <img src={document.cover} alt="图片" style={{ height: '100%' }} />
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
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>价格:</div>
                <div className={`${styles.input_input} flex_a_c`}>
                  <InputNumber
                    className="flex_1"
                    formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    value={document.price}
                    onChange={(e) => {
                      changeDocument('price', e);
                    }}
                  />
                  <div className="ma_r_20">(普通)</div>
                  <InputNumber
                    className="flex_1"
                    formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    value={document.sprice}
                    onChange={(e) => {
                      changeDocument('sprice', e);
                    }}
                  />
                  <div>(VIP)</div>
                </div>
              </div>
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>设置:</div>
                <div className={`${styles.input_input} flex_a_c`}>
                  <Radio.Group
                    onChange={(e) => {
                      changeDocument('stick', e.target.value);
                    }}
                    value={document.stick}
                  >
                    <Radio value={true}>置顶</Radio>
                    <Radio value={false}>不置顶</Radio>
                  </Radio.Group>

                  <Radio.Group
                    onChange={(e) => {
                      changeDocument('recommend', e.target.value);
                    }}
                    value={document.recommend}
                  >
                    <Radio value={true}>推荐</Radio>
                    <Radio value={false}>不推荐</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>作者:</div>
                <div className={`${styles.input_input} flex_a_c`}>
                  <Select
                    showSearch
                    onSearch={onSearch}
                    onChange={(e) => {
                      changeDocument('author', [e]);
                    }}
                    style={{ minWidth: 200 }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {userList.map((item) => (
                      <Option value={item._id}>{`${item.nickname}(${item.username})`}</Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          ) : null}
          {current === 1 ? (
            <div className="steps-content">
              <MEDitor
                height={600}
                value={document.content}
                onChange={(e) => {
                  setDocument({ ...document, content: e });
                }}
              />
              <div style={{ padding: '50px 0 0 0' }} />
              {/* <MEDitor.Markdown source={value} /> */}
            </div>
          ) : null}
          {current === 2 ? (
            <div className="steps-content">
              <div>
                <CheckCircleOutlined className="font56 c_green margin_b_20" />
                <div className="font24 c_0 margin_10">发布成功</div>
                <div className="font24  margin_10">
                  <Button
                    className="ma_r_10"
                    type="primary"
                    onClick={() => {
                      if (history.location.pathname.indexOf('create') < 0) {
                        history.push('/documents/create');
                      } else {
                        toContinue();
                      }
                    }}
                  >
                    继续发布
                  </Button>
                  <Button
                    onClick={() => {
                      history.push('/documents');
                    }}
                  >
                    返回列表
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                {current === 1 ? '提交' : '下一步'}

                {/* 下一步 */}
              </Button>
            )}
            {/* {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                完成
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
export default connect(({ document, user }) => ({
  currentDocument: document.currentDocument,
  userList: user.userList,
}))(Article);
