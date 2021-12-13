
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Row, Col } from 'antd';

import { OrderOn } from './view/OrderOn/index'
import { OrderBookCollapse } from './view/Orderbook'
import { TradingHistory } from './view/TradingHistory'
import { NftBaseInfos } from './view/NftBaseInfos'
import { NftHeadtInfo } from './view/NftHeadtInfo'

import './index.less'


const FNFTInfo = (props) => {
    const { isAuth, authToken } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            authToken: state.auth.authToken
        }
    }, shallowEqual)

    useEffect(() => {
        console.log('fnft info props:',props);
    }, [])
    return (
        <div className='css_fnft'>
            <div className='css_fnft_content'>
                <Row className='fnft_nft_img_count' justify="space-between" >
                    <Col span={7} >
                        <NftBaseInfos></NftBaseInfos>
                    </Col>
                    <Col span={17} className='fnft_right_infos'>
                        <NftHeadtInfo></NftHeadtInfo>
                        <OrderBookCollapse className="css_card" />
                    </Col>
                </Row>
                <div className='css_order_on'>
                    <OrderOn></OrderOn>
                </div>
                <div className='css_trading_history'>
                    <TradingHistory></TradingHistory>
                </div>
            </div>
        </div >
    )
}

export default FNFTInfo