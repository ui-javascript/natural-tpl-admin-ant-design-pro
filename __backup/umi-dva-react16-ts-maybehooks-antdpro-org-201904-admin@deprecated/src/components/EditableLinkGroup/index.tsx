import React, { createElement } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import Link from 'umi/link';

interface EditableLinkGroupProps {
  links: any[];
  onAdd?: () => void;
  linkElement: typeof Link;
}
const EditableLinkGroup: React.FC<EditableLinkGroupProps> = props => {
  const { links = [], linkElement = 'a', onAdd = () => {} } = props;
  return (
    <div className={styles.linkGroup}>
      {links.map(link =>
        createElement(
          linkElement,
          {
            key: `linkGroup-item-${link.id || link.title}`,
            to: link.href,
            href: link.href,
          },
          link.title,
        ),
      )}
      {
        <Button size="small" type="primary" ghost onClick={onAdd} icon="plus">
          添加
        </Button>
      }
    </div>
  );
};

export default EditableLinkGroup;
