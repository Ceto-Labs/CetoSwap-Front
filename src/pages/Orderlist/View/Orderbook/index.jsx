
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Table, Card, } from 'antd'

import "./index.less"

export const OrderBookCards = (props) => {
    const { onRowAsks, onRowBids } = props;
    const [bestPrice, SetBestPrice] = useState(props.bestPrice)
    const [asksDataSource, SetAsksDataSource] = useState(props.asksDataSource || [])
    const [bidsDataSource, SetBidsDataSource] = useState(props.asksDataSource || [])
    const { priceListingData } = useSelector((state) => {
        return {
            priceListingData: state?.apiData?.pricelisting,
            // bestPrice: state?.apiData?.bestPrice,
        }
    }, shallowEqual)

    const orderTableColumnsAsks = [
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            className: 'css_asks_front'
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
    ];
    const orderTableColumnsBids = [
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            className: 'css_bids_front'
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
    ];

    function updateOrderBookView(_data) {
        let { asks, bids, bestPrice } = _data
        if (asks) {
            let data = asks
            let count = 0
            let arrTmp = data.map(v => {
                return {
                    key: count++,
                    price: Number(v.price),
                    amount: Number(v.quantity),
                }
            })
            SetAsksDataSource(arrTmp)
        }
        if (bids) {
            let data = bids
            let count = 0
            let arrTmp = data.map(v => {
                return {
                    key: count++,
                    price: Number(v.price),
                    amount: Number(v.quantity),
                }
            })
            SetBidsDataSource(arrTmp)
        }
        SetBestPrice(Number(bestPrice))
    }
    useEffect(async () => {
        console.log('orderbook cards useEffect');
        updateOrderBookView(priceListingData);
    }, [priceListingData])

    return (
        <Card className="css_card" title="Order Book" bordered={false}>
            <Table size="small" pagination={false} bordered scroll={{ x: 100, y: 200 }} dataSource={asksDataSource} columns={orderTableColumnsAsks}
                onRow={onRowAsks} />
            <div className="css_order_book_bestprice">{bestPrice || 0}</div>
            <Table size="small" pagination={false} bordered scroll={{ x: 100, y: 200 }} dataSource={bidsDataSource} columns={orderTableColumnsBids}
                onRow={onRowBids} showHeader={false} />
            <br />
            <div>todo : add Trading History</div>
        </Card>
    )
}