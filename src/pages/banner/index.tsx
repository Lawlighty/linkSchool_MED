import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link } from 'umi';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Table,
  Space,
  Select,
  Tooltip as AntdTooltip,
  Button,
  Modal,
  Input,
  Popconfirm,
  message,
  Spin,
  Upload,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import defaultUrl from '@/pages/config';

interface BannerListProps {
  dispatch: Dispatch;
  bannerList: [];
  bannerListCount: 0;
  bannerLoading: false;
}

const { Option } = Select;
const initBanner = {
  name: '',
  type: 'HOME_PAGE',
  img: '',
};

const BannerObj = {
  HOME_PAGE: '首页',
};
const BannersPage: React.FC<BannerListProps> = (props) => {
  const { dispatch, bannerList, bannerListCount, bannerLoading } = props;

  const [currentBanner, setCurrentBanner] = useState<any>(initBanner);
  const [visible, setVisible] = useState<boolean>(false);
  // 图片上传
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: bannerListCount,
  });

  const fetchBanner = (p_pagination = {}) => {
    dispatch({
      type: 'banner/fetchBannerList',
      payload: {
        pagination: p_pagination || pagination,
      },
    });
  };
  useEffect(() => {
    setPagination({ ...pagination, total: bannerListCount });
  }, [bannerListCount]);
  useEffect(() => {
    fetchBanner();
  }, []);
  const changeCurrentTag = (key, value) => {
    setCurrentBanner({ ...currentBanner, [key]: value });
  };
  const handleOk = () => {
    setVisible(false);
    if (currentBanner._id) {
      dispatch({
        type: 'banner/updateBannerList',
        payload: { params: currentBanner, pagination: pagination },
      });
    } else {
      dispatch({
        type: 'banner/addBannerList',
        payload: { params: currentBanner, pagination: pagination },
      });
    }
  };
  const confirm = (e, record) => {
    dispatch({
      type: 'banner/deleteBannerList',
      payload: { id: record._id, pagination: pagination },
    });
  };
  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchBanner(pagination);
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
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      console.log('response', info.file.response.url);
      setCurrentBanner({ ...currentBanner, img: info.file.response.url });
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, (imageUrl) => {
      //   console.log('imageUrl', imageUrl);
      //   setLoading(true);
      //   setCurrentBanner({ ...currentBanner, img: imageUrl });
      // });
    }
  };

  const columns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      render: (text) => {
        return text ? BannerObj[text] : '';
      },
    },
    {
      title: '图片预览',
      key: 'img',
      dataIndex: 'img',
      render: (text) => <img src={text} style={{ height: 100 }} alt="轮播图" />,
    },
    {
      title: '跳转地址',
      key: 'targeturl',
      dataIndex: 'targeturl',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a
            onClick={(e) => {
              e.stopPropagation();
              setCurrentBanner({ ...record });
              setVisible(true);
            }}
          >
            修改
          </a>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={(e) => confirm(e, record)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <div className="pointer c_red">删除</div>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <PageHeaderWrapper>
      <div className="div_w_20">
        <div>
          <Button
            type="primary"
            className="ma_b_10"
            onClick={() => {
              setCurrentBanner(initBanner);
              setVisible(true);
            }}
          >
            新建
          </Button>
        </div>
        <div>
          <Spin tip="Loading..." spinning={bannerLoading}>
            <Table
              columns={columns}
              dataSource={bannerList}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Spin>
        </div>

        <Modal
          title={currentBanner._id ? '编辑图片' : '新建图片'}
          visible={visible}
          onOk={handleOk}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <div className={styles.item}>
            <div className={styles.label}>图片名称</div>
            <div className={styles.info}>
              <Input
                placeholder="请输入图片名称"
                value={currentBanner.name}
                onChange={(e) => changeCurrentTag('name', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>图片类型</div>
            <div className={styles.info}>
              <Select
                value={currentBanner.type}
                style={{ width: 120 }}
                onChange={(e) => changeCurrentTag('type', e)}
              >
                <Option value="HOME_PAGE">首页</Option>
              </Select>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>上传图片</div>
            <div className={styles.info}>
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
                {currentBanner.img ? (
                  <img
                    src={currentBanner.img}
                    alt="图片"
                    style={{ height: '100%', maxWidth: '100%' }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>跳转地址</div>
            <div className={`${styles.info} ${styles.longinfo} `}>
              <Input
                placeholder="无跳转可不填"
                value={currentBanner.targeturl}
                onChange={(e) => changeCurrentTag('targeturl', e.target.value)}
              />
            </div>
          </div>
        </Modal>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ banner }) => ({
  bannerList: banner.bannerList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  bannerListCount: banner.bannerListCount,
  bannerLoading: banner.bannerLoading,
}))(BannersPage);
