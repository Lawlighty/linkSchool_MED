import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link } from 'umi';
import {
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HistoryOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Table, Tag, Space, Drawer, Tooltip as AntdTooltip, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

interface TagListProps {
  dispatch: Dispatch;
  tagList?: [];
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
  const { dispatch, tagList } = props;
  useEffect(() => {
    dispatch({
      type: 'tag/fetchTagList',
      param: {},
    });
  }, []);

  const columns = [
    {
      title: '标签',
      key: 'name',
      dataIndex: 'name',
      render: (text) => {
        let color = text.length > 3 ? 'geekblue' : 'green';
        if (text === 'JAVA') {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a>修改</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <div className="div_w_20">
        <div>
          <Table columns={columns} dataSource={tagList} />
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ tag }) => ({
  tagList: tag.tagList.map((item: any) => {
    tag.key = tag._id;
    return item;
  }),
}))(TagsPage);
