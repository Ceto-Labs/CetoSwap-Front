import React, { useState, useEffect } from 'react'
import { Row, Col, Tag, Select, message, Image, Input, Pagination} from 'antd';
import './index.less'
import { SearchOutlined, TransactionOutlined } from '@ant-design/icons';
import {buyNft, wicpApprove, getWicpBalanceOf} from '@/api/exchange'
import { useSelector, shallowEqual , useDispatch} from 'react-redux'
import { actions } from '../../components/Auth/store'
import CAlert from '../../components/Alert'
import { Principal } from '@dfinity/principal'
import {getExchangeInfo} from '@/api/config'
import dfinityIcon from '@assets/images/dfinity.png'

const NftMarket = (props) =>{
    const [cols , setCols] = useState([])
    const [gutter, setGutter] = useState(20)
    const [vgutter, setVgutter] = useState(16)
    const [colCount, setColCount] = useState(6)
    const [pageSize, setPageSize] = useState(15)
    const [pageNumber, setPageNumber] = useState(1)
    const [orders, setOrders] = useState([])
    const [sortMethod, setSortMethod] = useState("Price:Low to Hight")
    const [alertvisible, setAlertvisible] = useState(false)
    const [currentOrder, setCurrentOrder] = useState({})
    const [provider, setProvider] = useState("")
    const dispatch = useDispatch()
    const [providersInfo, setProvidersInfo] = useState([])

    const { isAuth, authToken, accountId, wicpAmount} = useSelector((state) =>{
        return {
          isAuth: state.auth.isAuth,
          authToken: state.auth.authToken,
          accountId: state.auth.accountId,
          wicpAmount: state.auth.wicpAmount,
        }
      }, shallowEqual)
   
    const onChange = (pageNumber) =>{
        let from = (pageNumber-1) * pageSize;
        console.log("onchage", "from",from, "to",pageSize+from, "length", cols.length)

        setPageNumber(pageNumber)
    }

    const updateCols = (orders) => {
        let from = (pageNumber-1)*pageSize
        let to = from + pageSize

        const path = 'http://192.168.19.40:8453/nft/'
       
        let cols=[]

        console.log("updateCols orders length:", orders.length)  
        for (let i = from; i < to && i<orders.length; i++) { 
            let order = orders[i]
            //const imgUrl = path + order.id 
            order.imgUrl = "https://dknxi-2iaaa-aaaah-qceuq-cai.raw.ic0.app/?tokenid=qavhy-2akor-uwiaa-aaaaa-b4arf-eaqca-aadoa-a"

            cols.push(
                <Col key={Math.random()} span={24 / colCount}>
                    <div  key={Math.random()} className={'css_divStyleMiddleImg'}>
                       
                        <a >
                            <img  
                                // width={210} 
                                // height={250} 
                                src={order.imgUrl}  
                                //alt="#20001" 
                                onClick={() => buyBtnOnClick(order)}
                            />
                        </a>
                        <div key={Math.random()} className='number_div'>
                            <font size={3}>system number #{order.id} </font>
                        </div>
                        <div key={Math.random()} className='nft_props_div'>
                            <font size={1}>Rarity:{order.rarity}</font>
                            <div className='nft_props_ce_div'>
                                <font size={1}>CE:{order.ce}</font>
                            </div>
                          
                        </div>
                       
                        <div key={Math.random()} className='price_div'>
                            <img width={15} height={15} className='class_head_menu_icon' src={dfinityIcon} />
                            &nbsp;
                            <text><font size={1}>{parseFloat(order?.price||0)} ICP </font></text> 
                        </div>                       
                    </div>
                </Col>,
            );
        };

        setCols(cols)
        console.log("cols length:", cols.length)  
    }
     
    const componentDidMount = async(provider) =>{
        let {exchange,cid} = getExchangeInfo(provider)
        let os = await exchange.getAllOrders()
        os.sort(function(a,b){return parseInt(a.start) - parseInt(b.start)})

        {
            let tmp = [];
            for (let index = 1; index <= 30; index++) {
                tmp.push({rarity:123.45, ce : 124, price : 222, id: index})
            }
            os = tmp
        }

        updateCols(os)
        setOrders([...os])
    }

    const handleLittleClick =() => {
        setGutter(20)
        setImgBigger(true)
        setPageSize(15)
    }

    const handleMuchClick = () => {
        setGutter(16)
        setImgBigger(false)
        setPageSize(21)
    }

    const handleSelectChange = (value) =>{
        switch(value){
            case "addTime":{               
                let nftInfos = [...orders];
                nftInfos.sort(function(a,b){return parseInt(a[1]) - parseInt(b[1])})
                setOrders(nftInfos)
                setSortMethod(value)
                break
            }
            case "lowToHight":{
                let nftInfos = [...orders];
                nftInfos.sort(function(a,b){return parseInt(a[2]) - parseInt(b[2])})
                setOrders(nftInfos)
                setSortMethod(value)
                break
            }
            case "hightToLow" : {
                let nftInfos = [...orders]
                nftInfos.sort(function(a,b){return (parseInt(b[2]) - parseInt(a[2]))})
                setOrders(nftInfos)
                setSortMethod(value)
                break
            }
        }
    }

    // CAlert
    const handleAlertCancle = async() => {
        setAlertvisible(false)
    }

    const handleAlertConfirm = async(order) => {
          // 3 检查钱是否够,并且转币到交易所
        if (order.price > wicpAmount){
            message.error("Insufficient wicp", wicpAmount)
            console.log("Insufficient wicp")
            // 跳转到充值页面
            return 
        }

        // 4 授权
        let {cid} = providerMapExchange[provider]
        var ret = wicpApprove(Principal.fromText(cid), parseInt(order.price))
        if (!ret){
            return
        }

        // 5 购买
        ret = await buyNft(order)
        if(ret == true){
            setAlertvisible(false)

            let left = orders.filter(function(o){
                return o.id != order.id
            })
            setOrders([...left])

            console.log("left -----", left)
            updateCols(left)

            let amount = await getWicpBalanceOf(authToken)
            dispatch(actions.setWicpAmount(amount))
        }
    }
 
    const buyBtnOnClick =async (order) =>{
        if (!isAuth){
            message.error("log in first !!!!!")
            return
        }

        if (wicpAmount == 0){
            let amount = await getWicpBalanceOf(authToken)
            dispatch(actions.setWicpAmount(amount))
        }
    
        // 1 检查有没有登录
        if (!isAuth){
            message.error("please log in first!!!")
            console.log("please log in first")
            return
        }
      
        // 2 弹出交易细节
        console.log("buy btn on click :::",order)
        setAlertvisible(true)
        setCurrentOrder(order)
    }

    const onSearch = () =>{

    }
  
    useEffect(async() => {
        let index = 1+props.location.pathname.indexOf("/", 1)
        let provider = props.location.pathname.substring(index)

        setProvidersInfo(props.location.state)
        setProvider(provider)
        await componentDidMount(provider)
    }, []);

    return (
        <div  key={Math.random()} className='all_div'> 
            <Image 
                preview = {false}
                width = {"100%"}
                height = {150}
                src={'https://img9.51tietu.net/pic/2019-091311/it2oyi4g3i1it2oyi4g3i1.jpg'}>
            </Image>
        
            <div key={Math.random()} className ='css_meta'>
                 <div key={Math.random()}> 
                    <font size={10} color='#4f4f4f'>
                        {providersInfo?.title}
                    </font>
                    <br />
                    <font  size={5} color='#a0a0a0'>
                        {providersInfo?.describe}
                    </font>
                 </div>
                 <div key={Math.random()} className='info-div'>
                    <div key={Math.random()}  className='items-div'>
                        <font size={5}>{providersInfo?.volume}</font>
                        <br />
                        <font size={3}>items </font>
                    </div>
                    <div key={Math.random()}  className='owners-div'>
                        <font size={5}>{200}</font>
                        <br />
                        <font size={3}>owners</font>
                    </div>
                    <div key={Math.random()}  className='volume-div'>
                        <font size={5}>{providersInfo?.volume}</font>
                        <br />
                        <font size={3}>volume traded</font>
                    </div>
                    <div key={Math.random()}  className='average-div'>
                        <font size={5}>{200}</font>
                        <br />
                        <font size={3}>average price (24th)</font>
                    </div>
                    <div key={Math.random()}  className='floor-div'>
                        <font size={5}>{providersInfo?.floorPrice}</font>
                        <br />
                        <font size={3}>floor price (24th)</font>
                    </div>
                   
                 </div>
                
            </div>
            <div className='css_market'>
                <div className='css_market_props'>
                    <div  className="total-div">
                        <font size={5}>Total: {10000}</font>
                    </div>
                   
                    <div className='style_select_div'> 
                        <Select defaultValue={sortMethod} style={{ width: 200}} size={'large'} onChange={handleSelectChange}>
                            <Select.Option value="lowToHight">Price:Low to Hight</Select.Option>
                            <Select.Option value="hightToLow">Price:Hight to Low</Select.Option>
                            <Select.Option value="addTime">AddTime</Select.Option>
                        </Select>
                    </div>  

                    <div className='search_input'>
                        <Input prefix={<SearchOutlined />} placeholder="input search text" allowClear onChange={onSearch} style={{ width: 200, height :40 }} />
                    </div>
    
                </div>
                <div key="cols_div" className='cols_div'>
                    <div className='nft_list_div' key={"cols"}>
                        <Row gutter={[gutter, vgutter]} >
                            {cols}
                        </Row>
                    </div>
                    <div className='page_div'>
                        <Pagination 
                            size="small"
                            showQuickJumper
                            defaultCurrent={1} 
                            current={pageNumber}
                            total={orders.length} 
                            onChange={onChange} 
                            pageSize={pageSize} 
                            hideOnSinglePage={true}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </div>
    
            {/* <CAlert 
                visible={alertvisible} 
                handleCancleAlert={handleAlertCancle} 
                handleConfirmAlert={handleAlertConfirm} 
                order={currentOrder}
            /> */}
        </div>            
    );        
        
}
  
export {NftMarket} 

