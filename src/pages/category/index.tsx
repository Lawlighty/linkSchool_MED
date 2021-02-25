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
  Select,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { getColorByStrLength } from '@/utils/utilFuncs';

const { Option } = Select;
const { TextArea } = Input;
interface CategoryListProps {
  dispatch: Dispatch;
  categoryList?: [];
  categoryParentList: [];
  categoryListCount?: 0;
  categoryLoading?: false;
}

const CategorysPage: React.FC<CategoryListProps> = (props) => {
  const { dispatch, categoryList, categoryListCount, categoryLoading, categoryParentList } = props;

  const [currentCategory, setCurrentCategory] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: categoryListCount,
  });

  const fetchCategorys = (p_pagination = {}) => {
    dispatch({
      type: 'category/fetchCategoryList',
      payload: {
        pagination: p_pagination || pagination,
      },
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
  const onSearch = (val) => {
    // console.log('val: ', val);
    fetchParentCategorys(val);
  };
  useEffect(() => {
    setPagination({ ...pagination, total: categoryListCount });
  }, [categoryListCount]);
  useEffect(() => {
    // dispatch({
    //   type: 'category/fetchTagList',
    //   payload: {
    //     query: pagination,
    //   },
    // });
    fetchCategorys();
  }, []);
  const changeCurrentCategory = (key, value) => {
    setCurrentCategory({ ...currentCategory, [key]: value });
  };
  const handleOk = () => {
    setVisible(false);
    if (currentCategory._id) {
      dispatch({
        type: 'category/updateCategoryList',
        payload: { params: currentCategory, pagination: pagination },
      });
    } else {
      dispatch({
        type: 'category/addCategoryList',
        payload: { params: currentCategory, pagination: pagination },
      });
    }
  };
  const confirm = (e, record) => {
    dispatch({
      type: 'category/deleteCategoryList',
      payload: { id: record._id, pagination: pagination },
    });
  };
  const handleTableChange = (pagination) => {
    // console.log('pagination', pagination);
    setPagination({ ...pagination });
    fetchCategorys(pagination);
  };

  const columns = [
    {
      title: '类别名称',
      key: 'name',
      dataIndex: 'name',
      render: (text) => {
        const color = getColorByStrLength(text);
        // if (text === 'JAVA') {
        //   color = 'volcano';
        // }
        return (
          <Tag color={color} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: '父级类别',
      key: 'parentid',
      dataIndex: 'parentid',
      render: (text) => {
        if (text) {
          const p_name = text.name || '';
          const color = getColorByStrLength(p_name);
          // if (text === 'JAVA') {
          //   color = 'volcano';
          // }
          return (
            <Tag color={color} key={p_name}>
              {p_name.toUpperCase()}
            </Tag>
          );
        }
        return '';
      },
    },
    {
      title: '描述',
      key: 'describe',
      dataIndex: 'describe',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a
            onClick={(e) => {
              e.stopPropagation();
              setCurrentCategory({ ...record });
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
              setCurrentCategory({});
              setVisible(true);
              fetchParentCategorys('', true);
            }}
          >
            新建
          </Button>
        </div>
        <div>
          <Spin tip="Loading..." spinning={categoryLoading}>
            <Table
              columns={columns}
              dataSource={categoryList}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Spin>
        </div>

        <Modal
          destroyOnClose
          title={currentCategory._id ? '编辑类别' : '新建类别'}
          visible={visible}
          onOk={handleOk}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <div className={styles.item}>
            <div className={styles.label}>类别名称</div>
            <div className={styles.info}>
              <Input
                placeholder="请输入类别名称"
                value={currentCategory.name}
                onChange={(e) => changeCurrentCategory('name', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>父级类别</div>
            <div className={styles.info}>
              <Select
                showSearch
                onSearch={onSearch}
                onChange={(e) => {
                  changeCurrentCategory('parentid', e);
                }}
                style={{ minWidth: 200 }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {categoryParentList.map((item) => {
                  if (item.name !== currentCategory.name) {
                    if (
                      !item.parentid ||
                      (item.parentid && item.parentid !== currentCategory._id)
                    ) {
                      return (
                        <Option key={item._id} value={item._id}>
                          {item.name}
                        </Option>
                      );
                    }
                  }
                })}
              </Select>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>类别描述</div>
            <div className={styles.info}>
              <TextArea
                rows={2}
                style={{ minWidth: 300 }}
                value={currentCategory.describe}
                onChange={(e) => changeCurrentCategory('describe', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.label}>预览效果</div>
            <div className={styles.info}>
              {currentCategory.name && (
                <Tag
                  color={
                    currentCategory.name.length <= 4
                      ? 'geekblue'
                      : currentCategory.name.length <= 6
                      ? 'green'
                      : 'volcano'
                  }
                >
                  {currentCategory.name.toUpperCase()}
                </Tag>
              )}
              {!currentCategory.name && (
                <Tag color="geekblue" size="large">
                  类别
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
export default connect(({ category }) => ({
  categoryList: category.categoryList.map((item: any) => {
    item.key = item._id;
    return item;
  }),
  categoryParentList: category.categoryParentList,
  categoryListCount: category.categoryListCount,
  categoryLoading: category.categoryLoading,
}))(CategorysPage);
