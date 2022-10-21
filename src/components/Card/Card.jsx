import { Card as AntdCard, Layout, Tag, Rate } from 'antd';

import styles from './Card.module.css';

const { Header, Footer, Sider, Content } = Layout;

function Card({ title, releaseDate, overview, voteAverage, poster }) {
  return (
    <AntdCard className={styles.card} bordered={false}>
      <Layout>
        <Sider className={styles.aside}>
          <img alt="film preview" src={`https://image.tmdb.org/t/p/w500${poster}`} />
        </Sider>
        <Layout className={styles.layout}>
          <Header>
            <h2>{title}</h2>
            <time>{releaseDate}</time>
            <div>
              <Tag>Tag 1</Tag>
              <Tag>Tag 2</Tag>
              <Tag>Tag 3</Tag>
            </div>
          </Header>
          <Content>{overview}</Content>
          <Footer>
            <Rate allowHalf defaultValue={voteAverage} count={10} disabled className={styles.rate} />
          </Footer>
        </Layout>
      </Layout>
    </AntdCard>
  );
}

export default Card;
