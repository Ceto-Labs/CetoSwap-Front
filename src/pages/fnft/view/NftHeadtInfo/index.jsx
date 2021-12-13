
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Divider, Button, Avatar, Row, Col, Image, Card, Collapse, Input, Slider, Statistic, Table } from 'antd';


import './index.less'

import OwnerIconImg from '@/assets/images/fnft/owner.png'
import TotalIconImg from '@/assets/images/fnft/total.png'
import ViewsIconImg from '@/assets/images/fnft/views.png'
import UnFavoriteImg from '@/assets/images/fnft/unfavorite.png'
import FavoriteImg from '@/assets/images/fnft/favorite.png'
import WicpIconImg from '@/assets/images/wicp_logo.png'


export const NftHeadtInfo = (props) => {
    const { isAuth, authToken } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            authToken: state.auth.authToken
        }
    }, shallowEqual)
    const [isFavorite, setIsFavorite] = useState(false)
    const [ownerNum, setOwnerNum] = useState(123456)
    const [totalNum, setTotalNum] = useState(9876)
    const [viewsNum, setViewsNum] = useState(555)
    const [favoriteNum, setFavoriteNum] = useState(888)
    const [fnftName, setFnftName] = useState('#M-0')
    // const fnftName = '#M-0'

    const onFavoriteClick = () => {
        console.log('onFavoriteClick');
        setIsFavorite(!isFavorite)
    }
    const onOwnerClick = () => {
        console.log('onOwnerClick');
    }
    useEffect(() => {

    }, [])
    return (
        <div>
            <a className="fnft_right_nft_type_ref" >ccc</a>
            <div className='fnft_right_nft_id' >{fnftName}</div>
            <div className="fnft_right_icon_msg">
                <div className='fnft_right_coin_msg_cell' >
                    <img className="fnft_right_icon_css" src={OwnerIconImg} onClick={onOwnerClick} ></img>
                    {ownerNum} owners
                </div>
                <div className='fnft_right_coin_msg_cell'>
                    <img className="fnft_right_icon_css" src={TotalIconImg} />{totalNum} total
                </div>
                <div className='fnft_right_coin_msg_cell'>
                    <img className="fnft_right_icon_css" src={ViewsIconImg} />{viewsNum} views
                </div>
                <div className='fnft_right_coin_msg_cell' >
                    <img className="fnft_right_icon_css" src={isFavorite ? FavoriteImg : UnFavoriteImg} onClick={onFavoriteClick}></img>{favoriteNum} favorite
                </div>
            </div>
            <div className='fnft_right_trans_24h_count'>
                <Col span={6}>
                    <img className='fnft_24h_wicp_icon' src={WicpIconImg} />
                    0.4337
                </Col>
                <Col span={4} className='fnft_24h_cell'>
                    <Statistic title="24h High" value={'0.0032'} />
                </Col>
                <Col span={4} className='fnft_24h_cell'>
                    <Statistic title="24h Low" value={'0.0002'} />
                </Col>
                <Col span={5} className='fnft_24h_cell'>
                    <Statistic title="24H Vol.(#M-0)" value={'3,271,384'} />
                </Col>
                <Col span={5} className='fnft_24h_cell'>
                    <Statistic title="24H Amt.(WICP)" value={'87,372,696'} />
                </Col>
            </div>
        </div>
    )
}
