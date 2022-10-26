/* eslint-disable no-unused-vars */
import { Card as AntdCard, Layout, Tag, Rate, Typography, Progress } from 'antd';
import { intlFormat } from 'date-fns';

import ProgressiveImage from '../ProgressiveImage';
import { MyContextConsumer } from '../MyContext/MyContext';

import styles from './Card.module.css';

const { Paragraph } = Typography;
const { Header, Footer, Sider, Content } = Layout;

const setProgressColor = (value) => {
  if (value > 7) {
    return '#66E900';
  }
  if (value > 5) {
    return '#E9D100';
  }
  if (value > 3) {
    return '#E97E00';
  }
  return '#E90000';
};

function Card({ title, releaseDate, overview, voteAverage, poster, genreIds }) {
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
              <MyContextConsumer>
                {(genres) =>
                  genreIds.map((elem) => {
                    let newElem = <Tag key={elem.id}>Unknown genre</Tag>;
                    genres.forEach((genre) => {
                      if (elem === genre.id) {
                        newElem = <Tag key={genre.id}>{genre.name}</Tag>;
                      }
                    });
                    return newElem;
                  })
                }
              </MyContextConsumer>
            </div>
            <Progress
              type="circle"
              percent={voteAverage * 10}
              format={(percent) => percent / 10}
              width={30}
              className={styles.progress}
              strokeColor={setProgressColor(voteAverage)}
            />
          </Header>
          <Content>
            <Paragraph ellipsis={{ rows: 4 }}>{overview}</Paragraph>
          </Content>
          <Footer>
            <Rate allowHalf defaultValue={0} count={10} className={styles.rate} allowClear />
          </Footer>
        </Layout>
      </Layout>
    </AntdCard>
  );
}

export default Card;
