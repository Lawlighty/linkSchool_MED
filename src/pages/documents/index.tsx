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
import { setSubStr } from '@/utils/utilFuncs';
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

  const updateStick = (record) => {
    const document = record;
    document['stick'] = !record['stick'];
    dispatch({
      type: 'document/updateDocumentList',
      payload: {
        params: { ...document },
        pagination: pagination,
      },
    });
  };
  const updateRecommend = (record) => {
    const document = record;
    document['recommend'] = !record['recommend'];
    dispatch({
      type: 'document/updateDocumentList',
      payload: {
        params: { ...document },
        pagination: pagination,
      },
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
      width: 200,
      fixed: 'left',
    },
    {
      title: '作者',
      key: 'author',
      dataIndex: 'author',
      width: 100,
    },
    {
      title: '文档简介',
      key: 'introduce',
      dataIndex: 'introduce',
      width: 400,
      render: (text) => {
        return setSubStr(text, 80);
      },
    },

    {
      title: '封面预览',
      key: 'cover',
      dataIndex: 'cover',
      width: 200,
      render: (text) => <img src={text} style={{ height: 100 }} alt="封面预览" />,
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: '置顶',
      key: 'stick',
      dataIndex: 'stick',
      width: 100,
      render: (text) => {
        return text ? '置顶' : '否';
      },
    },
    {
      title: '推荐',
      key: 'recommend',
      dataIndex: 'recommend',
      width: 100,
      render: (text) => {
        return text ? '推荐' : '否';
      },
    },
    {
      title: '价格(普通)',
      key: 'price',
      dataIndex: 'price',
      width: 100,
      render: (text) => {
        return text ? `￥${text}` : '免费';
      },
    },
    {
      title: '价格(SVIP)',
      key: 'sprice',
      dataIndex: 'sprice',
      width: 100,
      render: (text) => {
        return text ? `￥${text}` : '免费';
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`/documents/${record._id}`}>修改</Link>
          <Popconfirm
            title={record.stick ? '确定要取消吗?' : '确定要置顶吗'}
            onConfirm={(e) => updateStick(record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <div className={`pointer  ${!record.stick ? 'c_green' : 'c_red'}`}>
              {record.stick ? '取消置顶' : '置顶'}
            </div>
          </Popconfirm>
          <Popconfirm
            title={record.stick ? '确定要取消吗?' : '确定要推荐吗'}
            onConfirm={(e) => updateRecommend(record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <div className={`pointer  ${!record.recommend ? 'c_green' : 'c_red'}`}>
              {record.recommend ? '取消推荐' : '推荐'}
            </div>
          </Popconfirm>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={(e) => confirm(e, record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消"
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
              scroll={{ x: 1300 }}
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
