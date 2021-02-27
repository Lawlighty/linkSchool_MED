import React, { useEffect, useState } from 'react';
import { connect, Link, history } from 'umi';
import {
  LoadingOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
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
  Card,
  Collapse,
  Popconfirm,
  Progress,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import MEDitor from '@uiw/react-md-editor';
import { mk_inti_string } from '../../../../config/mk_init';
import defaultUrl from '@/pages/config';

const { Panel } = Collapse;
const { Meta } = Card;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const steps = [
  {
    title: '课程信息',
    // content: 'First-content',
  },
  {
    title: '课时内容',
    // content: 'Second-content',
  },
  {
    title: '发布课程',
    // content: 'Last-content',
  },
];

const initCourse = {
  price:0,
  sprice:0,
  content: mk_inti_string,
  stick: false,
  recommend: false,
};
const initEpisode = {
  course: null,
};
const CreateCourse: React.FC<{}> = (props) => {
  const {
    dispatch,
    currentCourse,
    userList,
    categoryParentList,
    currentEpisodeList,
    episodeList,
  } = props;

  // 步骤
  const [current, setCurrent] = React.useState(0);

  // 课程
  const [course, setCourse] = useState<any>(initCourse);
  // 课时
  const [episode, setEpisode] = useState<any>(initEpisode);
  // 图片上传
  const [loading, setLoading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  const clearCourseDetail = () => {
    dispatch({
      type: 'course/setCourseDetail',
      payload: {},
    });
  };
  const fetchCourseDetail = (id = '') => {
    dispatch({
      type: 'course/fetchCourseDetail',
      payload: {
        _id: id,
      },
    });
  };
  const fetchUserList = (nickname: string, isInit = false) => {
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
  const fetchByCurrentEpisodeList = () => {
    console.log('fetchByCurrentEpisodeList');
    const payload = {};
    const queryInfo = {
      _id: { $in: currentEpisodeList },
    };
    payload['queryInfo'] = queryInfo;
    console.log('payload', payload);
    dispatch({
      type: 'episode/fetchEpisodeList',
      payload,
    });
  };

  const fetchParentCategorys = (name: string, isInit = false) => {
    const payload = {};
    if (isInit) {
      payload['pagination'] = { current: 1, pageSize: 10 };
    } else {
      const queryInfo = {
        name,
      };
      payload['queryInfo'] = queryInfo;
    }
    dispatch({
      type: 'category/fetchParentCategoryList',
      payload: payload,
    });
  };

  useEffect(() => {
    if (history.location.pathname.indexOf('create') < 0) {
      // 编辑-->查询 文档信息
      fetchCourseDetail(history.location.pathname.split('/').pop());
    } else {
      clearCourseDetail();
    }
    fetchUserList('', true);
    fetchParentCategorys('');
    // fetchByCurrentEpisodeList();
  }, []);
  useEffect(() => {
    if (history.location.pathname.indexOf('create') < 0) {
      if (currentCourse.category) {
        fetchParentCategorys(currentCourse.category.name, false);
      }
      if (currentCourse.author) {
        fetchUserList(currentCourse.author.nickname, false);
      }
      setCourse({ ...currentCourse });
    }
  }, [currentCourse]);

  const addCourse = () => {
    const nowcourse = course;
    nowcourse['cover'] = nowcourse['cover'] || defaultUrl.default_cover;
    nowcourse['episodes'] = currentEpisodeList || [];
    dispatch({
      type: 'course/addCourseList',
      payload: {
        params: nowcourse,
        updateEpisode: true,
      },
    }).then(() => {
      fetchByCurrentEpisodeList();
    });
  };
  const updateCourse = () => {
    const nowcourse = course;
    dispatch({
      type: 'course/updateCourseList',
      payload: {
        // params: { ...nowcourse, content: JSON.stringify(nowcourse.content) },
        params: { ...nowcourse },
      },
    });
  };

  const addEpisode = () => {
    const nowepisode = episode;
    dispatch({
      type: 'episode/addEpisodeList',
      payload: {
        params: nowepisode,
        returnList: true,
      },
    });
  };
  const updateEpisode = () => {
    const nowepisode = episode;
    dispatch({
      type: 'episode/updateEpisodeList',
      payload: {
        params: { ...nowepisode },
      },
    });
  };
  const saveEpisode = () => {
    if (episode._id) {
      updateEpisode();
    } else {
      addEpisode();
    }
  };

  const next = () => {
    if (!course.name) {
      message.info('请输入标题');
      return;
    }

    if (current === 1) {
      if (course._id) {
        updateCourse();
      } else {
        addCourse();
      }
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const changeCourse = (key, value) => {
    setCourse({ ...course, [key]: value });
  };

  const changeeEpisode = (key, value) => {
    setEpisode({ ...episode, [key]: value });
  };
  const toContinue = () => {
    setCurrent(0);
    setPercent(0);
    setCourse(initCourse);
    dispatch({
      type: 'episode/clearCurrentEpisodeLis',
    });
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
  const handleChange = (info) => {
    console.log('handleChange', info);

    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setLoading(false);
      setCourse({ ...course, cover: info.file.response.url });
      // getBase64(info.file.originFileObj, (imageUrl) => {
      //   setLoading(true);
      //   setCourse({ ...course, cover: imageUrl });
      // });
    }
  };
  const handleChangeFile = (info) => {
    console.log('handleChangeFile', info);
    const currentpercent = info.file.percent ? parseInt(info.file.percent, 10) : 0;
    setPercent(currentpercent);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setEpisode({ ...episode, file: info.file.response.url });
      // getBase64(info.file.originFileObj, (imageUrl) => {
      setLoading(false);
      //   setCourse({ ...course, cover: imageUrl });
      // });
    }
  };
  const onSearch = (val) => {
    fetchUserList(val, false);
  };
  const onSearchCate = (val) => {
    fetchParentCategorys(val);
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
                <div className={styles.input_title}>课程名称:</div>
                <div className={styles.input_input}>
                  <Input
                    className="flex_1"
                    value={course.name}
                    onChange={(e) => {
                      changeCourse('name', e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex margin_20">
                <div className={styles.input_title}>课程封面图:</div>
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
                    {course.cover ? (
                      <img src={course.cover} alt="图片" style={{ height: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </div>
              </div>
              <div className="flex flex_a_s margin_20">
                <div className={styles.input_title}>课程介绍:</div>
                <div className={styles.input_input}>
                  <TextArea
                    rows={4}
                    value={course.introduce}
                    onChange={(e) => {
                      changeCourse('introduce', e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>课程价格:</div>
                <div className={`${styles.input_input} flex_a_c`}>
                  <InputNumber
                    defaultValue={0}
                    className="flex_1"
                    formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    value={course.price}
                    onChange={(e) => {
                      changeCourse('price', e);
                    }}
                  />
                  <div className="ma_r_20">(普通)</div>
                  <InputNumber
                    defaultValue={0}
                    className="flex_1"
                    formatter={(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    value={course.sprice}
                    onChange={(e) => {
                      changeCourse('sprice', e);
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
                      changeCourse('stick', e.target.value);
                    }}
                    value={course.stick}
                  >
                    <Radio value>置顶</Radio>
                    <Radio value={false}>不置顶</Radio>
                  </Radio.Group>

                  <Radio.Group
                    onChange={(e) => {
                      changeCourse('recommend', e.target.value);
                    }}
                    value={course.recommend}
                  >
                    <Radio value>推荐</Radio>
                    <Radio value={false}>不推荐</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>课程作者:</div>
                <div className={`${styles.input_input} flex_a_c`}>
                  <Select
                    showSearch
                    onSearch={onSearch}
                    onChange={(e) => {
                      changeCourse('author', e);
                    }}
                    value={
                      course.author ? (course.author._id ? course.author._id : course.author) : null
                    }
                    style={{ minWidth: 200 }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {userList.map((item) => (
                      <Option
                        key={item._id}
                        value={item._id}
                      >{`${item.nickname}(${item.username})`}</Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>所属分类:</div>
                <div className={`${styles.input_input} flex_a_c`}>
                  <Select
                    showSearch
                    onSearch={onSearchCate}
                    onChange={(e) => {
                      changeCourse('category', e);
                    }}
                    value={
                      course.category
                        ? course.category._id
                          ? course.category._id
                          : course.category
                        : null
                    }
                    style={{ minWidth: 200 }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {categoryParentList.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          ) : null}
          {current === 1 ? (
            <div className="steps-content">
              <div>
                <div className="flex flex_a_c margin_20">
                  <div className={styles.input_title}>课时名称:</div>
                  <div className={styles.input_input}>
                    <Input
                      className="flex_1"
                      value={episode.name}
                      onChange={(e) => {
                        changeeEpisode('name', e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex margin_20">
                  <div className={styles.input_title}>视频文件:</div>
                  <div className={`${styles.input_input} text_a_l flex flex_a_c`}>
                    <Upload
                      name="file"
                      listType="picture"
                      className=""
                      showUploadList={false}
                      // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      action={defaultUrl.UPLOAD_IMG_URL}
                      // beforeUpload={beforeUpload}
                      onChange={handleChangeFile}
                      method="post"
                    >
                      <Button icon={<UploadOutlined />} loading={loading}>
                        Upload
                      </Button>
                    </Upload>
                    {percent ? (
                      <div className="ma_l_20 flex_1">
                        <Progress percent={percent} />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex margin_20">
                  {episode.file ? (
                    <video
                      style={{ width: '100%' }}
                      src={episode.file}
                      controlswidth="600"
                      height="300"
                      controls="controls"
                      type="video/mp4"
                    >
                      <track default kind="captions" srcLang="en" />
                      暂不支持
                    </video>
                  ) : null}
                </div>
              </div>
              <div className="flex margin_20 width_1">
                <div className={styles.row_title}>课时图文</div>
              </div>

              <MEDitor
                style={{ minWidth: 1000 }}
                height={600}
                value={episode.textfile}
                onChange={(e) => {
                  setEpisode({ ...episode, textfile: e });
                }}
              />
              <div style={{ padding: '50px 0 0 0' }} />
              {/* <MEDitor.Markdown source={course.content} /> */}

              <div>
                <Button
                  disabled={loading}
                  type="primary"
                  className="ma_r_10"
                  onClick={() => {
                    saveEpisode();
                  }}
                >
                  保存课时
                </Button>
                <Button
                  onClick={() => {
                    setEpisode(initEpisode);
                    setPercent(0);
                  }}
                >
                  新建课时
                </Button>
              </div>
            </div>
          ) : null}
          {current === 2 ? (
            <div className="steps-content">
              <div>
                <CheckCircleOutlined className="font56 c_green margin_b_20" />
                <div className="font24 c_0 margin_10">发布成功</div>
                <div className="flex_a_s flex">
                  <Card
                    hoverable
                    style={{ width: 400 }}
                    cover={
                      <img
                        alt="example"
                        src={course.cover ? course.cover : defaultUrl.default_cover}
                      />
                    }
                  >
                    <Meta title={course.name} description={course.introduce} />
                  </Card>

                  {episodeList.length > 0 && (
                    <Collapse
                      style={{ width: 400, marginLeft: 20, maxHeight: 350, overflowY: 'auto' }}
                      className="site-collapse-custom-collapse"
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                      onChange={(e) => {
                        console.log(e);
                      }}
                    >
                      {episodeList.map((item) => (
                        <Panel
                          header={item.name}
                          key={item._id}
                          className="site-collapse-custom-panel"
                        >
                          <p>也许有简介</p>
                        </Panel>
                      ))}
                    </Collapse>
                  )}
                </div>

                <div className="font24  margin_10">
                  <Button
                    className="ma_r_10"
                    type="primary"
                    onClick={() => {
                      if (history.location.pathname.indexOf('create') < 0) {
                        history.push('/courses/create');
                      } else {
                        toContinue();
                      }
                    }}
                  >
                    继续发布
                  </Button>
                  <Button
                    onClick={() => {
                      history.push('/courses');
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
              <>
                {current === 1 ? (
                  <Popconfirm
                    title="如有课时请确认保存课时!"
                    onConfirm={() => next()}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="primary">提交</Button>
                  </Popconfirm>
                ) : (
                  <Button type="primary" onClick={() => next()}>
                    下一步
                  </Button>
                )}
              </>
            )}

            {current === 0 && (
              <Button
                style={{ margin: '0 8px' }}
                onClick={() => {
                  history.push('/courses');
                }}
              >
                返回
                {/* 下一步 */}
              </Button>
            )}
            {current === 1 && (
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
export default connect(({ course, user, category, episode }) => ({
  currentCourse: course.currentCourse,
  userList: user.userList,
  categoryParentList: category.categoryParentList,
  currentEpisodeList: episode.currentEpisodeList,
  episodeList: episode.episodeList,
}))(CreateCourse);
