import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useIntl, FormattedMessage, Link, history } from 'umi';
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

interface DocumentListProps {
  dispatch: Dispatch;
  documentList: [];
  documentListCount: 0;
  documentLoading: false;
}

const { Option } = Select;
const DocumentsPage: React.FC<DocumentListProps> = (props) => {
  const { dispatch, documentList, documentListCount, documentLoading } = props;

  const [currentDocument, setCurrentDocument] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: documentListCount,
  });

  const fetchDocument = (p_pagination = {}) => {
    dispatch({
      type: 'document/fetchDocumentList',
      payload: {
        pagination: p_pagination || pagination,
      },
    });
  };
  useEffect(() => {
    setPagination({ ...pagination, total: documentListCount });
  }, [documentListCount]);
  useEffect(() => {
    fetchDocument();
  }, []);

  const confirm = (e, record) => {
    dispatch({
      type: 'document/deleteDocumentList',
      payload: { id: record._id, pagination: pagination },
    });
  };
  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchDocument(pagination);
  };

  const columns = [
    {
      title: '文档名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '文档简介',
      key: 'introduce',
      dataIndex: 'introduce',
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '封面预览',
      key: 'cover',
      dataIndex: 'cover',
      render: (text) => <img src={text} style={{ height: 100 }} alt="封面预览" />,
    },

    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`/documents/${record._id}`}>修改</Link>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={(e) => confirm(e, record)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">删除</a>
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
              history.push('/documents/create');
            }}
          >
            新建
          </Button>
        </div>
        <div>
          <Spin tip="Loading..." spinning={documentLoading}>
            <Table
              columns={columns}
              dataSource={documentList}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Spin>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
// export default connect()(AccountsList);
export default connect(({ document }) => ({
  documentList: document.documentList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  documentListCount: document.documentListCount,
  documentLoading: document.documentLoading,
}))(DocumentsPage);
