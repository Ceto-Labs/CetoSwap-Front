
import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Divider, Button, Avatar, Row, Col, Image, Card, Collapse, Input, Slider, Statistic, Table } from 'antd';

import "./index.less"

const { Panel } = Collapse;
export const OrderBookCollapse = (props) => {
    const { shareData, currA, currB } = props
    const { onRowAsks, onRowBids } = props;
    const [bestPrice, SetBestPrice] = useState(props?.bestPrice)
    const [asksDataSource, SetAsksDataSource] = useState(props?.asksDataSource || [])
    const [bidsDataSource, SetBidsDataSource] = useState(props?.asksDataSource || [])
    const [price, setPrice] = useState(0)
    // const [amount, setAmount] = useState(0)

    const { priceListingData } = useSelector((state) => {
        return {
            priceListingData: state?.apiData?.pricelisting,
            // bestPrice: state?.apiData?.bestPrice,
        }
    }, shallowEqual)

    const marks = {
        0: '',
        25: '',
        50: '',
        75: '',
        100: '',
    };

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
    const onFnftDesCallback = (key) => {
        console.log(key);
    }
    const onPriceChange = (value) => {
    }
    useEffect(async () => {
        console.log('orderbook cards useEffect');
        updateOrderBookView(priceListingData);

        let orderTableBidsData = []
        let orderTableAsksData = []
        let num = 20;
        for (let idx = 1; idx <= num; idx++) {
            orderTableBidsData[idx] = {
                price: 0.1234 * (idx + num),
                amount: idx,
                key: idx,
            }
            orderTableAsksData[idx] = {
                price: 0.1234 * (num - idx),
                amount: idx,
                key: idx,
            }
        }
        SetAsksDataSource(orderTableAsksData)
        SetBidsDataSource(orderTableBidsData)
    }, [priceListingData])

    return (
        <div>
            <div className='fnft_buy_sell'>
                <Col span={12} className='fnft_buy_cell'>
                    <div className="fnft_text_amount" >
                        <div className='css_label'>Available： </div>
                        <div className='css_val'>0 WICP</div>
                    </div>
                    <Input className="css_price_amount_input" prefix="Price:" suffix={currB || 'WICP'} value={price} onChange={onPriceChange} />
                    <Input className="css_price_amount_input" prefix="Amount:" suffix={currB || 'ICP'} value={price} onChange={onPriceChange} />
                    <Slider className="fnft_buy_cell_slider" marks={marks} step={1} defaultValue={0} />
                    <div className="fnft_text_amount">
                        <div className='css_label'>Total: </div>
                        <div className='css_val'>0 WICP</div>
                    </div>
                    <Button className='css_btn_buy'>BUY</Button>
                </Col>
                <Col span={12} className='fnft_sell_cell'>
                    <div className="fnft_text_amount" >
                        <div className='css_label'>Available： </div>
                        <div className='css_val'>0 WICP</div>
                    </div>
                    <Input className="css_price_amount_input" prefix="Price:" suffix={currB || 'WICP'} value={price} onChange={onPriceChange} />
                    <Input className="css_price_amount_input" prefix="Amount:" suffix={currB || 'ICP'} value={price} onChange={onPriceChange} />
                    <Slider className="fnft_buy_cell_slider" marks={marks} step={1} defaultValue={0} />
                    <div className="fnft_text_amount">
                        <div className='css_label'>Total: </div>
                        <div className='css_val'>0 WICP</div>
                    </div>
                    <Button className='css_btn_sell'>SELL</Button>
                </Col>
            </div>
            <Collapse className='fnft_order_book_collapse' defaultActiveKey={['1']} >
                <Panel className='fnft_orderbook_panel' header="Order Book" key="1">
                    <Table size="small" pagination={false} bordered scroll={{ x: 100, y: 200 }} dataSource={asksDataSource} columns={orderTableColumnsAsks}
                        onRow={onRowAsks} />
                    <div className="css_order_book_bestprice">{0}</div>
                    <Table size="small" pagination={false} bordered scroll={{ x: 100, y: 200 }} dataSource={bidsDataSource} columns={orderTableColumnsBids}
                        onRow={onRowBids} showHeader={false} />
                </Panel>
            </Collapse>
        </div>

    )
}