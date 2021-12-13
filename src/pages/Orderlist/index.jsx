
import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Select, Col, Row, Tabs } from 'antd'


import requestCanister from '@/api/http'
import { fetchExchangePiarInfo,  } from '@/api/canApi'

import { QuotationsCard } from "./View/QuotationsCard"
import { OrderBookCards } from "./View/Orderbook"
import { BuySell } from './View/BuySell/index'
import { OrderOn } from './View/OrderOn/index'
import { Storage } from '@/utils'

import "./index.less"

const { Option } = Select;
const { TabPane } = Tabs;

const Orderlist = (props) => {
    const exchangePoolId = '01'
    const { isAuth, authToken ,apiData} = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            // authToken: state.auth.authToken,
            apiData : state.apiData,
        }
    }, shallowEqual)
    const [exchangePoolMap, setExchangePoolMap] = useState(new Map((Storage.get("EXCHANGE_PAIR_INFO") || []).map(el => [el.id, el])))
    const [coinMap, setCoinMap] = useState(filterCoin(exchangePoolMap))
    const exchangeCid = 'i3n4m-ciaaa-aaaaa-aac4a-cai'
    const buySellRef = useRef()

    function filterCoin(exchangepoolMap) {
        let coinMap = new Map()
        exchangePoolMap.forEach(element => {
            console.log('exchangePoolMap each:', element);
            coinMap.set(element.A.id, element.A)
            coinMap.set(element.B.id, element.B)
        });
        return coinMap
    }

    function orderTableOnRowAsks(record) {
        return {
            onClick: event => {
                console.log("asks onClick:", record);
                let data = {
                    price: record.price,
                    amount: record.amount,
                    side: 'BUY'
                }
                buySellRef.current.updateBuySellInfo(data)
            },
            onDoubleClick: event => { },
            onContextMenu: event => { },
            onMouseEnter: event => { },
            onMouseLeave: event => { },
        };
    }
    function orderTableOnRowBids(record) {
        return {
            onClick: event => {
                console.log("bids onClick:", record);
                let data = {
                    price: record.price,
                    amount: record.amount,
                    side: 'SELL'
                }
                buySellRef.current.updateBuySellInfo(data)
            },
            onDoubleClick: event => { },
            onContextMenu: event => { },
            onMouseEnter: event => { },
            onMouseLeave: event => { },
        };
    }
    const getExchangePairInfo = async () => {
        const params = {
            data: {
                cid: exchangeCid,
                ltype: ''
            },
            success(res) {
                console.debug('getExchangePairInfo:', res)
                if (res) {
                    let exchangePairInfoMap = new Map((Storage.get("EXCHANGE_PAIR_INFO") || []).map(el => [el.id, el]))
                    exchangePairInfoMap.set(res.id, res)
                    Storage.set("EXCHANGE_PAIR_INFO", Array.from(exchangePairInfoMap.values()))
                    setExchangePoolMap(exchangePairInfoMap)
                    setCoinMap(filterCoin(exchangePairInfoMap))
                }
            },
            fail(err) {
                console.error('getExchangePairInfo err:', err)
            }
        }
        await requestCanister(fetchExchangePiarInfo, params)
    }

    useEffect(async () => {
        console.log('orderlist useEffect:', isAuth);
        let pairInfo = exchangePoolMap.get(exchangePoolId)
        if (pairInfo) {
            console.log('pairInfo:', pairInfo);
        } else {
            await getExchangePairInfo()
        }
    }, [isAuth])

    return (
        <div className="css_orderlist">
            <div className="css_order_pair">
                <Row gutter={[4, 0]}>
                    <Col span={10}>
                        <QuotationsCard
                            className="css_card"
                            shareData={{
                                exchangePoolMap: exchangePoolMap,
                                coinMap: coinMap,
                            }}
                        />
                    </Col>
                    <Col span={7}>
                        <OrderBookCards
                            className="css_card"
                            shareData={{
                                exchangePoolMap: exchangePoolMap,
                                coinMap: coinMap,
                            }}
                            onRowAsks={orderTableOnRowAsks}
                            onRowBids={orderTableOnRowBids}
                        />
                    </Col>
                    <Col span={7}>
                        <BuySell
                            ref={buySellRef}
                            className="css_card"
                            shareData={{
                                exchangePoolMap: exchangePoolMap,
                                coinMap: coinMap,
                            }}
                        />
                    </Col>
                </Row>
            </div>
            <div className="css_order_on">
                <OrderOn
                    shareData={{
                        exchangePoolMap: exchangePoolMap,
                        coinMap: coinMap,
                    }}
                />
            </div>
        </div>
    )
}

export default Orderlist