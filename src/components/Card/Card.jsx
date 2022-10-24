import { Card as AntdCard, Layout, Tag, Rate, Typography } from 'antd';
import { intlFormat } from 'date-fns';

import ProgressiveImage from '../ProgressiveImage';

import styles from './Card.module.css';

const { Paragraph } = Typography;
const { Header, Footer, Sider, Content } = Layout;

function Card({ title, releaseDate, overview, voteAverage, poster }) {
  let releaseDateDecrypted = 'no data';
  if (releaseDate !== '') {
    releaseDateDecrypted = intlFormat(
      new Date(releaseDate),
      { year: 'numeric', month: 'long', day: 'numeric' },
      {
        locale: 'en-EN',
      }
    );
  }

  return (
    <AntdCard className={styles.card} bordered={false}>
      <Layout>
        <Sider className={styles.aside}>
          <ProgressiveImage path={poster} />
        </Sider>
        <Layout className={styles.layout}>
          <Header>
            <h2>{title}</h2>
            <time>{releaseDateDecrypted}</time>
            <div>
              <Tag>Tag 1</Tag>
              <Tag>Tag 2</Tag>
              <Tag>Tag 3</Tag>
            </div>
          </Header>
          <Content>
            <Paragraph ellipsis={{ rows: 4 }}>{overview}</Paragraph>
          </Content>
          <Footer>
            <Rate allowHalf defaultValue={voteAverage} count={10} disabled className={styles.rate} />
          </Footer>
        </Layout>
      </Layout>
    </AntdCard>
  );
}

export default Card;
