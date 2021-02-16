import React, { useEffect } from 'react';
import { connect } from 'umi';
import { ExclamationCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Card, Row, Col, Tooltip as AntdTooltip, Progress } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Chart, Interval, Axis, Geom, Tooltip } from 'bizcharts';
import styles from './Analyze.less';

// import numeral from 'numeral';

const Analyze: React.FC<{}> = (props) => {
  const scale = {
    year: {
      alias: '年份', // 别名
    },
    sales: {
      alias: '销售额', // 别名
    },
  };
  const title = {
    // 设置标题 title 距离坐标轴线的距离
    // offset: ,
    // 文本旋转角度（弧度）
    rotate: 0,
    position: 'end',
  };
  const data = [
    { year: '1951 年', sales: 38 },
    { year: '1952 年', sales: 52 },
    { year: '1956 年', sales: 61 },
    { year: '1957 年', sales: 45 },
    { year: '1958 年', sales: 48 },
    { year: '1959 年', sales: 38 },
    { year: '1960 年', sales: 38 },
    { year: '1962 年', sales: 38 },
  ];

  useEffect(() => {
    // Step 1: 创建 Chart 对象
    // const chart = new Chart({
    //   container: 'c1', // 指定图表容器 ID
    //   width: 100, // 指定图表宽度
    //   height: 100, // 指定图表高度
    // });
    // // Step 2: 载入数据源
    // chart.data(data);
    // // Step 3: 创建图形语法，绘制柱状图
    // chart.interval().position('genre*sold');
    // // Step 4: 渲染图表
    // chart.render();
  });

  return (
    <PageHeaderWrapper content=" 极课学院数据分析">
      <div>
        <div>
          <Row gutter={12}>
            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.analyze_card}>
                <div
                  className={[`${styles.analyze_card_title} `, 'font14', 'c_0_45', 'flex_a_c'].join(
                    ' ',
                  )}
                >
                  <div className="flex_1">总销售额</div>
                  <div>
                    <AntdTooltip title="设置极课课程的总销售额">
                      <ExclamationCircleOutlined />
                    </AntdTooltip>
                  </div>
                </div>
                <div className={[styles.analyze_card_num, 'font30', 'c_0', 'ma_t_b_10'].join(' ')}>
                  ¥ 126,560
                  {/* {numeral(12345).format('0,0')} */}
                </div>
                <div className={styles.analyze_card_info}>
                  <div className="flex flex_a_c">
                    周同比 <span className="ma_l_r_10 in_block">12%</span>
                    <CaretUpOutlined className="c_red font12" />
                  </div>
                  <div className="ma_l_20">
                    日同比 <span className="ma_l_r_10 in_block">10%</span>
                    <CaretDownOutlined className="c_green font12" />
                  </div>
                </div>
                <div className="flex flex_a_c font16 ma_t_10">日销售额￥12,423</div>
              </Card>
            </Col>

            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.analyze_card}>
                <div
                  className={[`${styles.analyze_card_title} `, 'font14', 'c_0_45', 'flex_a_c'].join(
                    ' ',
                  )}
                >
                  <div className="flex_1">访问量</div>
                  <div>
                    <AntdTooltip title="极课学院网站访问量">
                      <ExclamationCircleOutlined />
                    </AntdTooltip>
                  </div>
                </div>
                <div className={[styles.analyze_card_num, 'font30', 'c_0', 'ma_t_b_10'].join(' ')}>
                  8,899
                </div>
                <div className={styles.analyze_card_info}>
                  <Chart
                    // height={200}
                    autoFit
                    data={data}
                    interactions={['active-region']}
                    padding="auto"
                  >
                    <Axis name="year" visible={false} />
                    <Axis name="sales" visible={false} />
                    <Interval position="year*sales" />
                  </Chart>
                </div>
                <div className="flex flex_a_c font16 ma_t_10">日访问量1,234</div>
              </Card>
            </Col>

            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.analyze_card}>
                <div
                  className={[`${styles.analyze_card_title} `, 'font14', 'c_0_45', 'flex_a_c'].join(
                    ' ',
                  )}
                >
                  <div className="flex_1">支付笔数</div>
                  <div>
                    <AntdTooltip title="极课学院网支付笔数">
                      <ExclamationCircleOutlined />
                    </AntdTooltip>
                  </div>
                </div>
                <div className={[styles.analyze_card_num, 'font30', 'c_0', 'ma_t_b_10'].join(' ')}>
                  6,560
                </div>
                <div className={styles.analyze_card_info}>
                  <Chart
                    // height={200}
                    autoFit
                    data={data}
                    interactions={['active-region']}
                    padding="auto"
                  >
                    <Axis name="year" visible={false} />
                    <Axis name="sales" visible={false} />
                    <Geom shape="smooth" type="area" position="year*sales" />
                  </Chart>
                </div>
                <div className="flex flex_a_c font16 ma_t_10">转化率60%</div>
              </Card>
            </Col>

            <Col xs={24} sm={12} xl={6}>
              <Card className={styles.analyze_card}>
                <div
                  className={[`${styles.analyze_card_title} `, 'font14', 'c_0_45', 'flex_a_c'].join(
                    ' ',
                  )}
                >
                  <div className="flex_1">运营活动效果</div>
                  <div>
                    <AntdTooltip title="超级VIP运营活动效果">
                      <ExclamationCircleOutlined />
                    </AntdTooltip>
                  </div>
                </div>
                <div className={[styles.analyze_card_num, 'font30', 'c_0', 'ma_t_b_10'].join(' ')}>
                  78%
                </div>
                <div className={styles.analyze_card_info}>
                  <Progress
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    status="active"
                    // style={{ width: '100%' }}
                    percent={78}
                    showInfo={false}
                  />
                  {/* <Progress percent={30} /> */}
                </div>
                <div className="flex flex_a_c font16 ma_t_10">
                  <div className="flex flex_a_c">
                    周同比 <span className="ma_l_r_10 in_block">12%</span>
                    <CaretUpOutlined className="c_red font12" />
                  </div>
                  <div className="ma_l_20">
                    日同比 <span className="ma_l_r_10 in_block">10%</span>
                    <CaretDownOutlined className="c_green font12" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="" style={{ backgroundColor: '#fff', padding: 20 }}>
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 20 }}>这是表单头部</div>
            <div className="flex" style={{ marginTop: 20 }}>
              <div className="flex_1">
                <div className="font16 ma_b_20">销售趋势</div>
                <Chart
                  height={300}
                  scale={scale}
                  autoFit
                  data={data}
                  interactions={['active-region']}
                  padding="auto"
                >
                  <Axis name="year" />
                  <Axis name="sales" />
                  <Interval position="year*sales" />
                </Chart>
              </div>
              <div style={{ width: '350px', marginLeft: 50 }}>
                <div className="font16 ma_b_20">课程销售额排名</div>
                <div className={['flex flex_a_c ', styles.rank_item].join('')}>
                  <span className={styles.rank_top}>1</span>
                  <span className="flex_1">TypeScript</span>
                  <span>100</span>
                </div>
                <div className={['flex flex_a_c ', styles.rank_item].join('')}>
                  <span className={styles.rank_top}>2</span>
                  <span className="flex_1">JAVA</span>
                  <span>90</span>
                </div>
                <div className={['flex flex_a_c ', styles.rank_item].join('')}>
                  <span className={styles.rank_top}>3</span>
                  <span className="flex_1">C++</span>
                  <span>80</span>
                </div>
                <div className={['flex flex_a_c ', styles.rank_item].join('')}>
                  <span className={styles.rank_fow}>4</span>
                  <span className="flex_1">GO</span>
                  <span>70</span>
                </div>
                <div className={['flex flex_a_c ', styles.rank_item].join('')}>
                  <span className={styles.rank_fow}>5</span>
                  <span className="flex_1">Pyhton</span>
                  <span>60</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
export default connect()(Analyze);
