
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Col, Row, Tag, Image , Button} from 'antd';
import './index.less'
import dfinityIcon from '@assets/images/dfinity.png'

const { CheckableTag } = Tag;

const Assets = (props) => {
    const [cols , setCols] = useState([])
    const [gutter, setGutter] = useState(20)
    const [vgutter, setVgutter] = useState(16)
    const [colCount, setColCount] = useState(8)
    const [pageSize, setPageSize] = useState(15)
    const [pageNumber, setPageNumber] = useState(1)
    const [nfts, setNfts] = useState([])
    const [selectedTags, setSelectedTags] = useState('Collected')
    const tagsData = ['Collected ', 'Favorited'];

    const { isAuth, authToken, apiData } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            authToken: state.auth.authToken,
            apiData: state.apiData,
        }
    }, shallowEqual)
    
    const onChangeTab = (tag, checked) =>{
        setSelectedTags([tag])
  
        console.log("-------------", checked, tag)
    }

    const sellClick = (nft) =>{

    }

    const updateCols = (nfts) => {
        let from = (pageNumber-1)*pageSize
        let to = from + pageSize

        const path = 'http://192.168.19.40:8453/nft/'
       
        let cols=[]

        console.log("updateCols orders length:", nfts.length)  
        for (let i = from; i < to && i<nfts.length; i++) { 
            let nft = nfts[i]
            //const imgUrl = path + order.id 
            nft.imgUrl = "https://dknxi-2iaaa-aaaah-qceuq-cai.raw.ic0.app/?tokenid=qavhy-2akor-uwiaa-aaaaa-b4arf-eaqca-aadoa-a"

            cols.push(
                <Col span={24 / colCount}>
                    <div className={'img-div'}>
                        <img
                            src={nft.imgUrl}
                            //style={{width:'100%', height:'100px'}}
                        />
                    
                        <div className='provider_div'>
                            <font size={3}>{nft.provider} </font>
                        </div>
                        <div className='nft_props_div'>
                            <font size={1}>{nft.desc} #{nft.id}</font>
                        </div>
                       
                        <div className='price_div'>
                            <img width={15} height={15} className='class_head_menu_icon' src={dfinityIcon} />
                            &nbsp;
                            <text><font size={1}>{parseFloat(nft?.price||0)} ICP </font></text> 
                        </div>

                        <div className='button_sell_div'>
                            <Button type='primary' 
                                style={{ backgroundColor:'#b4b4b4',borderColor:'#b4b4b4'}}
                                block 
                                width={60} 
                                height={20}
                                onClick={()=>{sellClick(nft)}}
                                >
                                {nft.status }
                            </Button>    
                        </div>                       
                    </div>
                </Col>,
            );
        };

        setCols(cols)
        console.log("cols length:", cols.length)  
    }

    useEffect(async() => {
        let nfts = []
        {
            let tmp = [];
            for (let index = 1; index <= 10; index++) {
                tmp.push({provider:'CCC', desc:'Crazy Zombie', price : 222, id: index, status:"cancel"})
            }
            nfts = tmp
        }

        {
            let tmp = [];
            for (let index = 1; index <= 10; index++) {
                tmp.push({provider:'CCC', desc:'Crazy Zombie', price : 0, id: index, status:"sell"})
            }
            nfts = nfts.concat(tmp)
        }

        updateCols(nfts)
    }, []);

    return (
        <div className='assets_div'>
         
            <Image 
                preview = {false}
                width = {"100%"}
                height = {150}
                src={'https://img9.51tietu.net/pic/2019-091311/it2oyi4g3i1it2oyi4g3i1.jpg'}>
            </Image>
        
            <div className='account_id_div'>
                <font>Account ID : {authToken}</font>
                <br />
                <font>Principal ID : {authToken}</font>

                <div className='static_info_div'>
                    {tagsData.map(tag => (
                        <CheckableTag
                            key={tag}
                            checked={selectedTags.indexOf(tag) > -1}
                            onChange={checked => onChangeTab(tag, checked)}
                        >
                            <font size={4}>{tag}  {100}</font>
                        </CheckableTag>
                    ))}
                </div>
            </div>
            <div className='collected_div'>
                <Row gutter={[gutter, vgutter]} >
                    {cols}
                </Row>
            </div>
        </div>
    )
}

export default Assets