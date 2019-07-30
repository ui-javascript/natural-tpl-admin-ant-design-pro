import { Pie } from '@/components/Charts';
import Yuan from '@/utils/Yuan';
import { Card, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import React, { memo } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';

export interface SalesPieDataItem {
  x: string | number;
  y: number;
}

interface ProportionSalesProps {
  dropdownGroup: JSX.Element;
  salesType: string;
  loading: boolean;
  salesPieData: SalesPieDataItem[];
  handleChangeSalesType: (ev: RadioChangeEvent) => void;
}

const ProportionSales: React.FC<ProportionSalesProps> = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={
      <FormattedMessage
        id="app.analysis.the-proportion-of-sales"
        defaultMessage="The Proportion of Sales"
      />
    }
    bodyStyle={{ padding: 24 }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value="all">
              <FormattedMessage id="app.analysis.channel.all" defaultMessage="ALL" />
            </Radio.Button>
            <Radio.Button value="online">
              <FormattedMessage id="app.analysis.channel.online" defaultMessage="Online" />
            </Radio.Button>
            <Radio.Button value="stores">
              <FormattedMessage id="app.analysis.channel.stores" defaultMessage="Stores" />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
    style={{ marginTop: 24 }}
  >
    <h4 style={{ marginTop: 10, marginBottom: 32 }}>
      <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
    </h4>
    <Pie
      hasLegend
      subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
      total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
      data={salesPieData}
      valueFormat={(value: any) => <Yuan>{value}</Yuan>}
      height={270}
      lineWidth={4}
      style={{ padding: '8px 0' }}
    />
  </Card>
);

export default memo(ProportionSales);
