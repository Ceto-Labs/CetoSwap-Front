import React, { useState, useEffect } from 'react'
import { Divider, Button, Avatar, Row, Col, Image, Card } from 'antd';
import { useHistory } from "react-router-dom";

import Link01 from '@assets/images/link_ico_02.png'
import Link02 from '@assets/images/link_ico_03.png'
import Link03 from '@assets/images/link_ico_04.png'
import DfinityIcon from '@assets/images/dfinity.png'
import SwapLogoIcon from '@assets/images/auth0.png'


import './index.less'

const { Meta } = Card;

const Home = (props) => {
  const [linkArray] = useState([
    { icon: Link01, url: 'https://twitter.com/CetoSwap/' },
    { icon: Link02, url: 'https://cetoswap.medium.com/' },
    { icon: Link03, url: 'https://github.com/Ceto-Labs/' }
  ])
  const [nftList, setNftList] = useState()
  const [fnftList, setFnftList] = useState()
  const history = useHistory();
  const onCoverClick = (e) => {
    console.log('onCoverClick:', e);
    // history.push('/orderlist')
  }

  useEffect(() => {
    let tmp = [];
    for (let index = 1; index <= 10; index++) {
      tmp[index] = index;
    }
    setNftList(tmp)
    setFnftList(tmp)
  }, [])

  return (
    <div className='class_home'>
      <div className='class_home_body'>
        <div className='class_home_info'>
          <Row justify="space-between" align="middle">
            <Col span={12}>
              <div>
                <h1>CetoSwap unites the world</h1>
                <p>Mint, swap and earn on the first decentralized IC trading platform</p>
                <Button>Explore</Button> <Button>Swap</Button>
              </div>
            </Col>
            <Col span={12} className='class_home_info_img'>
              <Image height={400} width={600} src={DfinityIcon} preview={false}></Image>
              {/* <Avatar shape="square" size={400} src={DfinityIcon} /> */}
            </Col>
          </Row>
        </div>
        <Divider />
        <div className='class_home_nft'>
          <div>
            <p className='title'>Popular NFT</p>
          </div>

          <div className='class_home_nft_fnft'>
            <Row wrap={true} gutter={[16, 16]}>
              {nftList && nftList.map((item, index) => (
                <Col span={4} key={'nft-col' + index}>
                  <Card hoverable key={'nft-card' + index} cover={<Image preview={false} src={DfinityIcon} />}
                  >
                    <Meta title="721 NFT" description="https://twitter.com/CetoSwap/" />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <Divider />
        <div className='class_home_fnft'>
          <p className='title'>FNFT Collection</p>
          <div className='class_home_nft_fnft'>
            <Row wrap={true} gutter={[16, 16]}>
              {fnftList && fnftList.map((item, index) => (
                <Col span={4} key={'fnft-col' + index}>
                  <Card hoverable key={'fnft-card' + index} cover={<Image preview={false} src={SwapLogoIcon} onClick={() => onCoverClick(item)} />}
                  >
                    <Meta title="1155 FNFT" description="https://twitter.com/CetoSwap/" />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <Divider />
        <div className='class_home_swap'>
          <p className='title'>CetoSwap Info & Analytics</p>
        </div>
      </div>
      <Divider ></Divider>
      <div className='class_home_footer'>
        <div>
          John Us
        </div>
        {linkArray.map((item, index) => (
          <a key={'connect-ref' + index} href={item.url} target="_blank" rel="noopener noreferrer">
            <Avatar key={'connect' + index} shape="square" size={30} src={item.icon} />
          </a>
        ))}
      </div>
    </div>
  )
}

export default Home
