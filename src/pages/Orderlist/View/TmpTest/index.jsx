import React, { useState, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Button, InputNumber, Select, Input } from 'antd'


import requestCanister from '@/api/http'
import { EXCHANGE_0_CID } from '@/server/local/id'

import { fetchExchangeMintAssets, fetchExchangePiarInfo, fetchExchangeUserInfo, fetchExchangePriceListings } from '@/api/canApi'

import "./index.less"

const { Option } = Select;

export const TmpTest = (props) => {
    const [amount, setAmount] = useState(0)
    const [coinid, setCoinid] = useState('0')
    const [btnMint, setBtnMint] = useState(false)
    const [btnUserInfoLoading, setBtnUserInfoLoading] = useState(false)
    const [btnLILoading, setBtnLILoading] = useState(false)
    const exchangeCid = EXCHANGE_0_CID
    
    const dispatch = useDispatch()

    const [intputValue, setIntputValue] = useState(0)
    function callback(key) {
        console.log(key);
    }
    function onChangeInput(value) {
        console.log('onChangeInput:',value.target.value);
        setIntputValue(value)
    }
    function onChange(value) {
        setAmount(value)
    }
    function handleChange(value) {
        console.log(`selected ${value}`);
        setCoinid(value)
    }
    const userMintAssets = async () => {
        setBtnMint(true)
        const params = {
            data: {
                coinId: coinid,
                amount: amount,
                cid: exchangeCid,
                ltype: ''
            },
            success(res) {
                console.debug('fetchExchangeMintAssets:', res)
                // if (xdrPrice) {
                //     icpListPrice = ((Number(cyclePrice) / 1e12) * xdrPrice).toFixed(2)
                // }
                // Storage.set('icptprice', icpListPrice)
                // console.log('[getIcpPrice] icptprice: ', icpListPrice)
            },
            fail(err) {
                console.error('fetchExchangeMintAssets err:', err)
            }
        }
        await requestCanister(fetchExchangeMintAssets, params)
        setBtnMint(false)
    }

    const getExchangePairInfo = async () => {
        const params = {
            data: {
                cid: exchangeCid,
                ltype: ''
            },
            success(res) {
                console.debug('getExchangePairInfo:', res)
                let tmp = coinArray ? coinArray : [];
                tmp.push(res.A, res.B)
                setCoinArray(tmp)
            },
            fail(err) {
                console.error('getExchangePairInfo err:', err)
            }
        }
        await requestCanister(fetchExchangePiarInfo, params)
    }

    const getExchangeUserInfo = async () => {
        setBtnUserInfoLoading(true)
        const params = {
            data: {
                cid: exchangeCid,
                ltype: ''
            },
            success(res) {
                console.debug('getExchangeUserInfo:', res)
                dispatch(actions.setUserInfo(res))
            },
            fail(err) {
                console.error('getExchangeUserInfo err:', err)
            }
        }
        await requestCanister(fetchExchangeUserInfo, params)
        setBtnUserInfoLoading(false)
    }
    const getExchangeListings = async () => {
        setBtnLILoading(true)
        const params = {
            data: {
                cid: exchangeCid,
                ltype: ''
            },
            success(res) {
                console.debug('fetchExchangePriceListings:', res)
            },
            fail(err) {
                console.error('fetchExchangePriceListings err:', err)
            }
        }
        await requestCanister(fetchExchangePriceListings, params)
        setBtnLILoading(false)
    }

    return (
        <div>
            <div>
                ICP/WICP
                01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
            </div>
            <br />
            <div>
                <Button onClick={userMintAssets} loading={btnMint}>mint</Button>
                <InputNumber min={0} defaultValue={0} onChange={onChange}></InputNumber>
                <Select defaultValue="0" style={{ width: 120 }} onChange={handleChange}>
                    <Option value="0">ICP</Option>
                    <Option value="1">WICP</Option>
                </Select>
            </div>
            <br />
            <Button onClick={getExchangeUserInfo} loading={btnUserInfoLoading}>GetUserInfo</Button>
            <br />
            <Button onClick={getExchangeListings} loading={btnLILoading}>GetListingsInfo</Button>
            <div>
                <Input defaultValue={'asdafssdf'} onChange={onChangeInput}></Input>
                <Button>GetOrderInfo </Button>
            </div>
        </div>
    )
}