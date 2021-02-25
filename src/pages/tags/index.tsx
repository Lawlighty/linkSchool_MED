import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link } from 'umi';
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HistoryOutlined,
  HomeOutlined,
} from '@ant-design/icons';
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
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { getColorByStrLength } from '@/utils/utilFuncs';

interface TagListProps {
  dispatch: Dispatch;
  tagList?: [];
  tagListCount?: 0;
  tagLoading?: false;
}
interface currentDrawerUserDto {
  username?: string;
  ref_code?: string;
  auth?: string;
  nickname?: string;
  gender?: number;
  avatar?: string;
  introduc?: string;
  tags?: [];
  email?: string;
  other1?: string;
  other2?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TagsPage: React.FC<TagListProps> = (props) => {
  const { dispatch, tagList, tagListCount, tagLoading } = props;

  const [currentTag, setCurrentTag] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: tagListCount,
  });

  const fetchTags = (p_pagination = {}) => {
    dispatch({
      type: 'tag/fetchTagList',
      payload: {
        pagination: p_pagination || pagination,
      },
    });
  };
  useEffect(() => {
    setPagination({ ...pagination, total: tagListCount });
  }, [tagListCount]);
  useEffect(() => {
    // dispatch({
    //   type: 'tag/fetchTagList',
    //   payload: {
    //     query: pagination,
    //   },
    // });
    fetchTags();
  }, []);
  const changeCurrentTag = (key, value) => {
    setCurrentTag({ ...currentTag, [key]: value });
  };
  const handleOk = () => {
    setVisible(false);
    if (currentTag._id) {
      dispatch({
        type: 'tag/updateTagList',
        payload: { params: currentTag, pagination: pagination },
      });
    } else {
      dispatch({
        type: 'tag/addTagList',
        payload: { params: currentTag, pagination: pagination },
      });
    }
  };
  const confirm = (e, record) => {
    dispatch({
      type: 'tag/deleteTagList',
      payload: { id: record._id, pagination: pagination },
    });
  };
  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchTags(pagination);
  };

  const columns = [
    {
      title: '标签',
      key: 'name',
      dataIndex: 'name',
      render: (text) => {
        const color = getColorByStrLength(text);
        return (
          <Tag color={color} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a
            onClick={(e) => {
              e.stopPropagation();
              setCurrentTag({ ...record });
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
            <div className="pointer c_red">删除</div>
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
              setCurrentTag({});
              setVisible(true);
            }}
          >
            新建
          </Button>
        </div>
        <div>
          <Spin tip="Loading..." spinning={tagLoading}>
            <Table
              columns={columns}
              dataSource={tagList}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Spin>
        </div>

        <Modal
          title={currentTag._id ? '编辑标签' : '新建标签'}
          visible={visible}
          onOk={handleOk}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <div className={styles.item}>
            <div className={styles.label}>标签名称</div>
            <div className={styles.info}>
              <Input
                placeholder="请输入标签名称"
                value={currentTag.name}
                onChange={(e) => changeCurrentTag('name', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>预览效果</div>
            <div className={styles.info}>
              {currentTag.name && (
                <Tag color={getColorByStrLength(currentTag.name)}>
                  {currentTag.name.toUpperCase()}
                </Tag>
              )}
              {!currentTag.name && (
                <Tag color="geekblue" size="large">
                  标签
                </Tag>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ tag }) => ({
  tagList: tag.tagList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  tagListCount: tag.tagListCount,
  tagLoading: tag.tagLoading,
}))(TagsPage);
