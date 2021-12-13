import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { Select, Tabs, Table, Button, message } from 'antd'
import BigNumber from 'bignumber.js'
import { format, parse } from 'date-fns'

// import { TmpTest } from '../TmpTest/index'

import requestCanister from '@/api/http'
import { fetchExchangeCancelOrder } from '@/api/canApi'
import { EXCHANGE_0_CID } from '@/server/local/id'

import "./index.less"


const { Option } = Select;
const { TabPane } = Tabs;

export const OrderOn = React.memo((props) => {
    const exchangeCid = EXCHANGE_0_CID;
    const TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
    const [openOrderDataSource, setOpenOrderDataSource] = useState(props.openOrderDataSource || [])
    const [orderHistoryDataSource, setOrderHistoryDataSource] = useState(props.orderHistoryDataSource || [])
    const [balanceDataSource, setBalanceDataSource] = useState(props.balanceDataSource || [])

    const { shareData, currA, currB } = props
    const [exchangePoolMap, setExchangePoolMap] = useState(shareData?.exchangePoolMap || new Map())
    const [coinMap, setCoinMap] = useState(shareData?.coinMap || new Map())

    const { userOrdersData, userAssetsData } = useSelector((state) => {
        return {
            userOrdersData: state?.apiData?.user_orders,
            userAssetsData: state?.apiData?.user_assets,
        }
    }, shallowEqual)

    const dispatch = useDispatch()
    const openOrderTableColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Pair',
            dataIndex: 'pair',
            key: 'pair',
            // sorter: (a, b) => a.side - b.side,
        },
        {
            title: 'Side',
            dataIndex: 'side',
            key: 'side',
            // sorter: (a, b) => a.side - b.side,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            // sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            // sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            // sorter: (a, b) => parse(a.time, TIME_FORMAT, new Date()) - parse(b.time, TIME_FORMAT, new Date()),
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     // sorter: (a, b) => a.status - b.status,
        // },
        {
            title: 'Acion',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Button className="css_btn_option" onClick={async () => orderOption(record)} >Cancel</Button>
                // <Image></Image>
            )
        },
    ];
    const orderHistoryTableColumns = [
        {
            title: 'Side',
            dataIndex: 'side',
            key: 'side',
            // sorter: (a, b) => a.side - b.side,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            // sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            // sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            // sorter: (a, b) => parse(a.time, TIME_FORMAT, new Date()) - parse(b.time, TIME_FORMAT, new Date()),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // sorter: (a, b) => a.status - b.status,
        },
    ];
    const balanceTableColumns = [
        {
            title: 'Coin',
            dataIndex: 'coin',
            key: 'coin',
            // sorter: (a, b) => a.side - b.side,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Lock',
            dataIndex: 'lock',
            key: 'lock',
        },
        {
            title: 'Available',
            dataIndex: 'available',
            key: 'available',
        },
        {
            title: 'Option',
            dataIndex: 'option',
            key: 'option',
            render: (_, record) => (
                <Button className="css_btn_option" onClick={async () => onCoinOption(record)} type="primary" >Burn</Button>
            )
        },
    ];

    const exchangeCancelOrder = async (orderId) => {
        const params = {
            data: {
                cid: exchangeCid,
                ltype: '',
                args: orderId,
            },
            success(res) {
                console.debug('fetchExchangeCancelOrder:', res)
                dispatch(actions.setUserInfo(res))
            },
            fail(err) {
                console.error('fetchExchangeCancelOrder err:', err)
            }
        }
        await requestCanister(fetchExchangeCancelOrder, params)
    }
    async function onCoinOption(e) {
        console.log('onCoinOption:', e);
        message.info("comming soon..")
    }
    async function orderOption(e) {
        console.log('orderOption:', e);
        let { id } = e
        if (id) {
            await exchangeCancelOrder(e.id)
        }
    }
    function callback(key) {
        console.log(key);
    }
    function convertOrderData(orders) {
        let orderDataArray = []
        orders && orders.map((item) => {
            let id = item.id
            let side = ''
            for (let key in item.side) {
                side = key;
                break
            }
            let status = ''
            for (let key in item.status) {
                status = key;
                break
            }
            let dateTimeStamp = Number(new BigNumber(item.lastUpdateTime || 0).dividedBy(Math.pow(10, 6)))
            orderDataArray.push({
                key: orderDataArray.length,
                id: id,
                side: side,
                price: Number(item.price),
                amount: Number(item.quantity),
                time: format(new Date(dateTimeStamp), TIME_FORMAT),
                option: null,
                status: status,
            })
        })
        return orderDataArray
    }
    function updateOpenOrdersOnView(data) {
        let { orders, ordersDone } = data
        let openOrderData = convertOrderData(orders)
        let orderHistoryData = convertOrderData(ordersDone)
        orderHistoryData.sort(function (a, b) {
            let valA = parse(a.time, TIME_FORMAT, new Date())
            let valB = parse(b.time, TIME_FORMAT, new Date())
            return valB - valA
        })
        setOpenOrderDataSource(openOrderData)
        setOrderHistoryDataSource(orderHistoryData)
    }
    function updateBalanceView(data) {
        if (data) {
            let { uid, currencys } = data
            if (currencys) {
                let tmpCurr = []
                for (const _curr of currencys) {
                    let id = _curr[0]
                    let { coinId, amount, availableAmount, lockAmount } = _curr[1]
                    amount = new BigNumber(amount).toFixed()
                    availableAmount = new BigNumber(availableAmount).toFixed()
                    lockAmount = new BigNumber(lockAmount).toFixed()
                    let coinInfo = coinMap.get(coinId)
                    let _coin = coinId
                    if (coinInfo && coinInfo.symbol) {
                        _coin = coinInfo.symbol
                    }
                    tmpCurr.push({
                        key: tmpCurr.length,
                        coin: _coin,
                        amount: amount,
                        available: availableAmount,
                        lock: lockAmount,
                        option: null,
                    })
                }
                if (tmpCurr.length > 0) {
                    setBalanceDataSource(tmpCurr)
                }
            }
        }
    }

    function orderRowClass(record, index) {
        let className = 'css_order_row_red';
        if (record.side != 'bids') {
            className = 'css_order_row_green'
        }
        return className;
    }
    useEffect(() => {
        console.log('orderon useEffect...');
        updateOpenOrdersOnView(userOrdersData)
        updateBalanceView(userAssetsData)
    }, [userAssetsData, userOrdersData])
    return (
        <Tabs className="css_orderon_tabs" defaultActiveKey="1" onChange={callback} >
            <TabPane tab={<span>&nbsp;Open Orders</span>} key="1">
                <Table
                    size="small"
                    pagination={false}
                    bordered
                    rowClassName={orderRowClass}
                    scroll={{ x: 1000, y: 200 }}
                    dataSource={openOrderDataSource}
                    columns={openOrderTableColumns} />
            </TabPane>
            <TabPane tab="Order History" key="2">
                <Table
                    size="small"
                    pagination={false}
                    bordered
                    rowClassName={orderRowClass}
                    scroll={{ x: 1000, y: 200 }}
                    dataSource={orderHistoryDataSource}
                    columns={orderHistoryTableColumns} />
            </TabPane>
            <TabPane tab="Balance" key="3">
                <Table
                    size="small"
                    pagination={false}
                    bordered
                    // rowClassName={orderRowClass}
                    scroll={{ x: 1000, y: 200 }}
                    dataSource={balanceDataSource}
                    columns={balanceTableColumns} />
            </TabPane>
        </Tabs>
    )
})