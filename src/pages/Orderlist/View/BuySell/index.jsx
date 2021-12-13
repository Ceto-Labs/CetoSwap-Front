import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { Card, Button, InputNumber, Radio, Slider, Row, Col, Input } from 'antd'


import requestCanister from '@/api/http'
import { EXCHANGE_0_CID } from '@/server/local/id'
import { fetchExchangeNewOrder } from '@/api/canApi'
import { actions } from '@/store/api/index'

import "./index.less"

export const BuySell = forwardRef((props, ref) => {
    const { isAuth, userOrdersData, userAssetsData } = useSelector((state) => {
        return {
            isAuth: state?.auth?.isAuth,
            userOrdersData: state?.apiData?.user_orders,
            userAssetsData: state?.apiData?.user_assets,
        }
    }, shallowEqual)
    const dispatch = useDispatch()

    const exchangeCid = EXCHANGE_0_CID
    const { shareData, currA, currB } = props
    // const [exchangePoolMap, setExchangePoolMap] = useState(shareData.exchangePoolMap || new Map())
    // const [coinMap, setCoinMap] = useState(shareData.coinMap || new Map())

    const argSide = new Map([["BUY", { 'bids': null }], ["SELL", { 'asks': null }]]);
    const [side, setSide] = useState('BUY')
    const [price, setPrice] = useState(0)
    const [amount, setAmount] = useState(0)
    const [persentVal, setPersentVal] = useState('')
    const [totalVal, setTotalVal] = useState(0)
    const [btnOKLoading, setBtnOKloading] = useState(false)

    function onBuySellSideChange(e) {
        setSide(e.target.value)
    };
    function onBuySellPercentChange(e) {
        console.log('onBuySellPercentChange', e.target.value);
        setPersentVal(e.target.value)
    };
    function clearPercentSelect() {
        setPersentVal('')
    }
    function calcAndUpdateTotalVal(inPrice, inAmount) {
        let _val = (inPrice || 0) * (inAmount || 0)
        setTotalVal(_val)
        clearPercentSelect()
    }
    function onPriceChange(value) {
        setPrice(value)
        calcAndUpdateTotalVal(value, amount)
    }
    function onAmountChange(value) {
        setAmount(value)
        calcAndUpdateTotalVal(price, value)
    }
    function onTotalChange(value) {
        clearPercentSelect()
        setTotalVal(value)
    };
    async function onClickOk() {
        try {
            setBtnOKloading(true)
            await newExchangeOrder()
        } catch (error) {
            console.log('[BuySell]onClickOk error:', error);
        } finally {
            setBtnOKloading(false)
        }
    }
    const newExchangeOrder = async () => {
        let argsSide = argSide.get(side)
        const params = {
            data: {
                cid: exchangeCid,
                ltype: '',
                args: {
                    side: argsSide,
                    quantity: amount,
                    price: price,
                    poolID: '01',
                }
            },
            success(res) {
                console.debug('newExchangeOrder:', res)
                if (res && res.userinfo) {
                    dispatch(actions.setUserInfo(res.userinfo))
                }
            },
            fail(err) {
                console.error('newExchangeOrder err:', err)
            }
        }
        console.log('newExchangeOrder:', params.data);
        await requestCanister(fetchExchangeNewOrder, params)
    }
    useImperativeHandle(ref, () => ({
        updateBuySellInfo: (data) => {
            let { price, amount, side } = data
            if (side === 'BUY' || side === 'SELL') {
                setSide(side)
                setPrice(price)
                setAmount(amount)
                calcAndUpdateTotalVal(price, amount)
                clearPercentSelect()
            }
        }
    }))

    useEffect(() => {
    }, [])

    return (
        <Card className="css_card" title="BUY/SELL" bordered={false}>
            {/* <div className="css_info_display">
                <img src="https://i.loli.net/2021/11/03/mPBdlDM5IGazTFn.png" />
            </div> */}
            <Radio.Group className="css_buy_sell_radio" onChange={onBuySellSideChange} value={side} buttonStyle="solid" >
                <Radio.Button className="css_buy_btn" value="BUY">BUY</Radio.Button>
                <Radio.Button className="css_sell_btn" value="SELL">SELL</Radio.Button>
            </Radio.Group>
            {/* <div className="css_side_title">{sideTitle} {currA} -- {currB}</div> */}
            <div className="css_price_amount_input">
                <label className="css_label">Price</label>
                <InputNumber className="css_input" addonAfter={currB || 'WICP'} value={price} onChange={onPriceChange} />
            </div>
            <div className="css_price_amount_input">
                <label className="css_label">Amount</label>
                <InputNumber className="css_input" addonAfter={currA || 'ICP'} value={amount} onChange={onAmountChange} />
            </div>
            <Radio.Group className="css_buy_sell_persent" onChange={onBuySellPercentChange} buttonStyle="solid" value={persentVal}>
                <Radio.Button className="css_buy_sell_persent_cell" value="25">25%</Radio.Button>
                <Radio.Button className="css_buy_sell_persent_cell" value="50">50%</Radio.Button>
                <Radio.Button className="css_buy_sell_persent_cell" value="75">75%</Radio.Button>
                <Radio.Button className="css_buy_sell_persent_cell" value="100">100%</Radio.Button>
            </Radio.Group>
            <div className="css_total">
                <label className="css_total_label">Total</label>
                <InputNumber
                    className="css_total_input"
                    addonAfter={currB || 'WICP'}
                    min={0}
                    value={totalVal}
                    onChange={onTotalChange}
                ></InputNumber>
            </div>
            <div className="css_confirm_op">
                <Button className="css_confirm_btn" type="primary" loading={btnOKLoading} onClick={onClickOk} >OK</Button>
            </div>
        </Card>
    )
})