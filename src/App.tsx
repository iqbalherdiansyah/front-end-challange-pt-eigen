import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Col, Row, Carousel, Card, Input, Radio, DatePicker, Space, Pagination, Image } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {SearchOutlined, ExpandOutlined} from '@ant-design/icons';
import type { DatePickerProps } from 'antd';

function App() {
  const { Content } = Layout;

  const [data, setData] = useState([]);
    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(false);
    const [valueSearch, setValueSearch] = useState('sports');
    const [sort, setSort] = useState('relevancy');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [dateCards, setDateCards] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    window.addEventListener('resize', () => {
        setWindowWidth(window.innerWidth)
    })

    const fetchData = async() => {
        await axios.get(`${process.env.REACT_APP_API_LINK}top-headlines`, {
            params : {
                apiKey : process.env.REACT_APP_API_KEY,
                pageSize : 4,
                country : 'us'
            }
        }).then(result => {
            setData(result.data.articles);
        })
    }

    const fetchDataCard = async() => {
        await axios.get(`${process.env.REACT_APP_API_LINK}everything`, {
            params : {
                apiKey : process.env.REACT_APP_API_KEY,
                q : valueSearch.length > 1 ? valueSearch : 'apple',
                sortBy : sort,
                pageSize : Number(pageSize),
                to : dateCards.length > 1 ? dateCards : dateNow(),
                page : Number(page)
            }
        }).then(result => {
            setCards(result.data.articles);
            setLoadingCards(true);
        })
    }

    const contentStyle: React.CSSProperties = {
        height: '50vh',
        width : '100%',
        textAlign: 'center',
        background: '#364d79',
        backgroundSize: 'cover',
        display : 'flex',
        alignItems : 'end'
    };

    const { Meta } = Card;
    const { Search } = Input;

    const dateNow = () => {
        let date = new Date().toLocaleDateString()
        const dateSplit = String(date).split('')
        let resultDate = ''

        dateSplit.map((e, i) => {
            if (dateSplit[i] === '/') {
                dateSplit[i] = '-'
                resultDate = dateSplit.join('')
            }
        })

        return resultDate
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDateCards(dateString);
      };

    useEffect(() => {
        fetchData()
        fetchDataCard()
        setLoadingCards(false)
    }, [valueSearch, sort, dateCards, page, pageSize])

  return (
    <Layout style={{ backgroundColor : 'var(--black)' }}>
      <Content>
        <section id="home">
              <Row align='middle'>
                  <Col className='home-welcome' span={windowWidth > 1100 ? 12 : 24}>
                      <h1>Welcome</h1>
                      <h3>in news daily</h3>
                  </Col>
                  <Col span={windowWidth > 1100 ? 12 : 24}>
                      <Carousel className='home-carousel' autoplay>
                          {data.map(result => {
                              const {urlToImage, url, title} = result
                              return (
                                  <div>
                                      <a href={url} target="_blank">
                                          <div style={{ ...contentStyle, backgroundImage: `url(${urlToImage})` }}>
                                              <p className='home-carousel-title'>{String(title).substring(0, 15)}...</p>
                                          </div>
                                      </a>
                                  </div>
                              )
                          })}
                      </Carousel>
                  </Col>
                  <Col span={24} style={{ display : 'flex' , flexWrap : 'wrap', justifyContent: 'center', padding: '20px', backgroundColor: 'var(--black)'}}>
                          
                      <Col span={24}>
                          <Col span={windowWidth > 1100 ? 8 : 24}>
                              <Search 
                              placeholder="News" 
                              allowClear
                              onSearch={(e) => {setValueSearch(e)}} 
                              style={{ width: '100%', margin: '20px 0' }}
                              data-testid = "search-input"
                              />
                          </Col>

                          <Col span={windowWidth > 1100 ? 8 : 24} style={{ margin : '20px 0' }}>
                              <Space direction="vertical">
                                  <DatePicker 
                                  onChange={onChange}
                                  />
                              </Space>
                          </Col>

                          <Col span={windowWidth > 1100 ? 8 : 24}>
                              <Radio.Group defaultValue="a" buttonStyle="solid" style={{ margin : '20px 0', width: '100%'}} onChange={(e) => {
                                  setSort(e.target.value)
                              }}>
                                  <Radio.Button value="relevancy">Relevancy</Radio.Button>
                                  <Radio.Button value="popularity">Popularity</Radio.Button>
                                  <Radio.Button value="publishedAt">PublishedAt</Radio.Button>
                              </Radio.Group>
                          </Col>
                      </Col>

                      {loadingCards ? 
                      cards.map(result => { 
                          const {author, urlToImage, description, url} = result
                          return (
                              <Card
                                  className='card-home'
                                  style={{ width: 250 }}
                                  cover={
                                  urlToImage ? 
                                  <img
                                  alt={url}
                                  src={urlToImage}
                                  style={{ height : '150px', objectFit : 'cover'}}
                                  />
                                  :
                                  <Image
                                  width={250}
                                  height={150}
                                  src="error"
                                  fallback="data:image/png;base64,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"
                                  />
                                  }
                                  actions={[
                                      <a href={url} target="_blank" className='card-href'><SearchOutlined /></a>,
                                      <a href={urlToImage} target="_blank" className='card-href'><ExpandOutlined /></a>
                                  ]}
                                  >
                                  <Meta
                                  title={author ? author : 'sorry author not found'}
                                  description={`${String(description).substring(0, 40)}...`}
                                  />
                              </Card>
                          )
                      })
                      :
                      <p>loading</p>
                      }   
                  </Col>
                  <Col span={24} style={{ display : 'flex', justifyContent: 'center', alignItems : 'center', margin : '30px 0' }}>
                      <Pagination 
                      defaultCurrent={1} 
                      total={100} 
                      onChange={(e, pageSize) => {
                          setPage(e)
                          setPageSize(pageSize)
                      }}
                      />
                  </Col>
              </Row>
          </section>
      </Content>
    </Layout>
  );
}

export default App;