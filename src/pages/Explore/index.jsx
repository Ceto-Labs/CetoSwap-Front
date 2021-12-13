
import React, { useState, useEffect } from 'react'
import { Divider, Button, Avatar, Row, Col, Image, Card, Radio } from 'antd';
import { useHistory } from "react-router-dom";
import SwapLogoIcon from '@assets/images/auth0.png'
import { Storage } from '@/utils'
import { getProviderNames, getProviderProps } from '../../api/config'
import './index.less'

const { Meta } = Card;
const MAEKET_TYPE_KEY = 'market_type'
const Explore = (props) => {
    const optionsWithDisabled = [
        { label: 'NFT', value: 'nft' },
        { label: 'FNFT', value: 'FNFT' },
    ];
    const [nftList, setNftList] = useState()
    const [fnftList, setFnftList] = useState()
    const [cols, setCols] = useState()
    const [marketType, setMarketType] = useState(Storage.get(MAEKET_TYPE_KEY) || 'nft');
    const history = useHistory();

    const onCoverClickNft721 = (name, providerInfo) => {
        const location = {
            pathname: '/nft/' + name,
            state: providerInfo,
        }
        history.push(location)
    }

    const onCoverClick = (e) => {
        console.log('[explore] onCoverClick:', e);
        const location = {
            pathname: '/fnft/excid/exid',
            state: { aaa: 1, bbb: 3 },
        }
        history.push(location)
    }

    const onMarketTypeChange = (e) => {
        console.log('radio4 checked', e.target.value);
        Storage.set(MAEKET_TYPE_KEY, e.target.value)
        setMarketType(e.target.value)
    };

    const constructCards = async (names) => {

        //const path = 'http://192.168.19.40:8453/nft/'
        let cols = []

        console.log("updateCols orders length:", names.length)
        for (let i = 0; i < names.length; i++) {
            var providerInfo = getProviderProps(names[i])

            cols.push(
                <Col span={7} key={'nft-col' + i}>
                    <div className='unit-provider-div' >
                        <Card
                            hoverable={true}
                            key={'nft-card' + i}
                            cover={<Image width={346} height={200} preview={false} src={providerInfo.imgUrl} />}
                            onClick={() => onCoverClickNft721(names[i], providerInfo)}
                        >
                            <Meta
                                title={providerInfo.title}
                                description={providerInfo.describe}
                            />
                        </Card>

                        <div key='2' className='unit-provide-info-div'>
                            <div key='2-0' className='volume-div'>
                                <font color='green'>Volume</font>
                                <br />
                                {providerInfo.volume} ICP
                            </div>
                            <div key='2-1' className='listings-div'>
                                <font color='green'>Listings</font>
                                <br />
                                {providerInfo.listings}

                            </div>
                            <div key='2-2' className='floorprice-div'>
                                <font color='green'>Floor Price</font>
                                <br />
                                {providerInfo.floorPrice}

                            </div>

                        </div>

                    </div>
                </Col>,
            );
        };

        setCols(cols)
        console.log("cols length:", cols.length)
    }

    useEffect(() => {
        let keys = getProviderNames()
        constructCards([...keys])

        let tmp = [];
        for (let index = 1; index <= 10; index++) {
            tmp[index] = index;
        }
        setNftList(tmp)
        setFnftList(tmp)
    }, [])
    return (
        <div className='class_explore'>
            <div className='class_explore_content'>
                <div className='class_explore_title'>
                    Explore Collections
                </div>
                <Divider></Divider>
                <Radio.Group className="class_explore_radio_select" onChange={onMarketTypeChange} value={marketType} buttonStyle="solid" >
                    <Radio.Button className='radioButton' value="nft">NFT</Radio.Button>
                    <Radio.Button className='radioButton' value="fnft">FNFT</Radio.Button>
                </Radio.Group>
                <Divider></Divider>
                <div className='class_explore_nft_display'>
                    {marketType == 'nft' ? (
                        <Row wrap={true} gutter={[16, 16]}>
                            {cols}
                            {/* {nftList && nftList.map((item, index) => (
                             <Col span={4} key={'nft-col' + index}>
                                 <Card hoverable key={'nft-card' + index} cover={<Image preview={false} src={DfinityIcon} />}
                                 >
                                     <Meta title="721 NFT" description="https://twitter.com/CetoSwap/" />
                                 </Card>
                             </Col>
                         ))} */}
                        </Row>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    )
}

export default Explore