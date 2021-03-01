import React, { useEffect, useState } from 'react';
import { connect, Dispatch, Link, history } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import {
  Table,
  Tag,
  Space,
  Drawer,
  Tooltip as AntdTooltip,
  Badge,
  Button,
  Modal,
  Input,
  Popconfirm,
  message,
  Spin,
  Upload,
  Progress,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { getColorByStrLength, time_To_hhmmss } from '@/utils/utilFuncs';
import MEDitor from '@uiw/react-md-editor';
import defaultUrl from '@/pages/config';
interface EpisodeListProps {
  dispatch: Dispatch;
  match: any;
  episodeList?: [];
  episodeListCount?: 0;
  episodeLoading?: false;
}

const EpisodesPage: React.FC<EpisodeListProps> = (props) => {
  const { dispatch, match, episodeList, episodeListCount, episodeLoading } = props;

  const [currentEpisode, setCurrentEpisode] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleMEDitor, setVisibleMEDitor] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: episodeListCount,
  });

  const [percent, setPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEpisodes = (p_pagination = {}) => {
    dispatch({
      type: 'episode/fetchEpisodeList',
      payload: {
        pagination: p_pagination || pagination,
        queryInfo: {
          course: match.params.id,
        },
      },
    });
  };
  useEffect(() => {
    setPagination({ ...pagination, total: episodeListCount });
  }, [episodeListCount]);
  useEffect(() => {
    fetchEpisodes();
  }, []);
  const changeCurrentEpisode = (key, value) => {
    setCurrentEpisode({ ...currentEpisode, [key]: value });
  };
  const handleOk = () => {
    setVisible(false);
    if (currentEpisode._id) {
      dispatch({
        type: 'episode/updateEpisodeList',
        payload: {
          params: currentEpisode,
          pagination,
          queryInfo: {
            course: match.params.id,
          },
        },
      });
    } else {
      const nowcurrentEpisode = currentEpisode;
      nowcurrentEpisode.course = match.params.id;
      dispatch({
        type: 'episode/addEpisodeList',
        payload: {
          params: nowcurrentEpisode,
          pagination,
          queryInfo: {
            course: match.params.id,
          },
        },
      });
    }
  };
  const confirm = (e, record) => {
    dispatch({
      type: 'episode/deleteEpisodeList',
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        id: record._id,
        pagination,
        queryInfo: {
          course: match.params.id,
        },
      },
    });
  };
  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchEpisodes(pagination);
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
      // setCurrentEpisode({ ...currentEpisode, file: info.file.response.url });
      // // getBase64(info.file.originFileObj, (imageUrl) => {
      // setLoading(false);
      // 获取视频时长
      const { url } = info.file.response;
      const audioElement = new Audio(url);
      let dur = 0;
      audioElement.addEventListener('loadedmetadata', function (_event) {
        dur = audioElement.duration;
        const duration = time_To_hhmmss(dur);
        console.log('duration', duration);
        setCurrentEpisode({ ...currentEpisode, file: info.file.response.url, duration });
        setLoading(false);
      });
      //   setCourse({ ...course, cover: imageUrl });
      // });
    }
  };

  const columns = [
    {
      title: '课时名称',
      key: 'name',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '所属课程',
      key: 'course',
      dataIndex: 'course',
      width: 200,
      render: (text) => {
        if (text) {
          const color = getColorByStrLength(text.name || '');
          return (
            <Tag color={color} key={text._id}>
              {text.name.toUpperCase()}
            </Tag>
          );
        }
        return '';
      },
    },
    {
      title: '视频地址',
      key: 'file',
      dataIndex: 'file',
      // width: 200,
      render: (text) => {
        return (
          <a href={text} target="_blank">
            {text}
          </a>
        );
      },
    },
    {
      title: '图文信息',
      key: 'textfile',
      dataIndex: 'textfile',
      width: 200,
      render: (text, record) => {
        if (text) {
          return (
            <div
              className="pointer c_green"
              onClick={() => {
                setVisibleMEDitor(true);
                setCurrentEpisode(record);
              }}
            >
              查看图文信息
            </div>
          );
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      // fixed: 'right',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a
            onClick={(e) => {
              e.stopPropagation();
              setCurrentEpisode({ ...record });
              setVisible(true);
            }}
          >
            修改
          </a>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={(e) => confirm(e, record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <div className="c_red pointer">删除</div>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <div className="div_w_20">
        <div>
          <Button
            type="primary"
            className="ma_b_10"
            onClick={() => {
              setCurrentEpisode({});
              setVisible(true);
            }}
          >
            新建课时
          </Button>
          <Button
            className="ma_b_10 ma_l_10"
            onClick={() => {
              // console.log('history', history);
              history.goBack();
              // history.push('/courses');
            }}
          >
            返回课程列表
          </Button>
        </div>
        <div>
          <Spin tip="Loading..." spinning={episodeLoading}>
            <Table
              columns={columns}
              dataSource={episodeList}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Spin>
        </div>

        <Modal
          destroyOnClose
          title="编辑课时"
          visible={visible}
          onOk={handleOk}
          onCancel={() => {
            setVisible(false);
          }}
          okText="保存课时"
          okButtonProps={{ disabled: loading }}
          width={1200}
        >
          <div className="steps-content">
            <div>
              <div className="flex flex_a_c margin_20">
                <div className={styles.input_title}>课时名称:</div>
                <div className={styles.input_input}>
                  <Input
                    className="flex_1"
                    value={currentEpisode.name}
                    onChange={(e) => {
                      changeCurrentEpisode('name', e.target.value);
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
                {currentEpisode.file ? (
                  <video
                    style={{ width: '100%' }}
                    src={currentEpisode.file}
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
              value={currentEpisode.textfile}
              onChange={(e) => {
                setCurrentEpisode({ ...currentEpisode, textfile: e });
              }}
            />
            <div style={{ padding: '50px 0 0 0' }} />
          </div>
        </Modal>

        <Modal
          title="课时图文"
          destroyOnClose
          visible={visibleMEDitor}
          footer={null}
          onCancel={() => {
            setVisibleMEDitor(false);
          }}
          width={800}
        >
          <div className="steps-content-no-center">
            <MEDitor.Markdown source={currentEpisode.textfile} />
          </div>
        </Modal>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ episode }) => ({
  episodeList: episode.episodeList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  episodeListCount: episode.episodeListCount,
  episodeLoading: episode.episodeLoading,
}))(EpisodesPage);
