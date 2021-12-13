import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Divider, Button, Avatar, Row, Col, Image, Card, Collapse, Input, Slider, Statistic, Table } from 'antd';


import CCCM0 from '@assets/images/ccc_m_0.png'
import IconTwiter from '@assets/images/link_ico_02.png'
import IconMedium from '@assets/images/link_ico_03.png'
import IconGithub from '@assets/images/link_ico_04.png'

import './index.less'
import { el } from 'date-fns/locale';

const { Panel } = Collapse;

export const NftBaseInfos = (props) => {
    const { isAuth, authToken } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            authToken: state.auth.authToken
        }
    }, shallowEqual)

    const [imageList, setImageList] = useState([])
    const [displayImg, setDisplayImg] = useState()

    const genDisplayElement = (item) => {
        return item.vType == 'video' ?
            <video className='fnft_image_big' key={'fnft_info_video_display'} autoPlay={true} src={item.src} />
            : <Image className='fnft_image_big' key={'fnft_info_image_display'} src={item.src} />
    }
    const smallImgClick = (item) => {
        console.log('smallImgClick:', item);
        setDisplayImg(genDisplayElement(item))
    }

    useEffect(() => {
        let tmp = [
            {
                vType: 'image',
                src: CCCM0,
            },
            {
                vType: 'image',
                src: 'http://www.mimajike.com/wp-content/uploads/2021/09/5645337-1.png',
            },
            {
                vType: 'video',
                src: 'http://gateway.filedrive.io/ipfs/Qmajnq3qeZeUnrjq1zKkV2UMUgXfJwtmkjYRETxFzwyKj4',
            },
        ]
        setImageList(tmp)
        for (const imgSrc of tmp) {
            console.log('imgSrc:', imgSrc);
            setDisplayImg(genDisplayElement(imgSrc))
            break
        }
    }, [])
    return (
        <div >
            <div className='fnft_left_image'>
                {displayImg}
            </div>
            <div className='fnft_image_small_list'>
                {imageList && imageList.map((item, index) => (
                    item.vType == 'video' ?
                        <video className='fnft_image_small' key={'fnft_info_video' + index} autoPlay={false} src={item.src} onClick={() => smallImgClick(item)} />
                        : <Image className='fnft_image_small' key={'fnft_info_image' + index} preview={false} src={item.src} onClick={() => smallImgClick(item)} />
                ))}
            </div>
            <Collapse className='fnft_des_collapse' defaultActiveKey={['1', '2', '3']} >
                <Panel header="Description" key="1">
                    Crowd Created Canvas is the first-ever collectible, collaborative pixel artwork to be created by the Dfinity community. Each canvas is at least 100x100 pixels in size  and has multiple authors who create a unique piece of art by collaborating. Those who participate in the completion of the artwork will have the opportunity to obtain  great benefits.
                </Panel>
                <Panel header="About CCC" key="2">
                    <p>CCC is good</p>
                </Panel>
                <Panel className='fnft_des_panel_details' header="Details" key="3">
                    Contract Address
                    <br />
                    unpp3-aiwel…1234-2q57g
                    <br />
                    Token ID

                    9828004204714307...
                    <br />
                    Blockchain

                    Dfinity
                </Panel>
            </Collapse>
        </div>
    )
}
