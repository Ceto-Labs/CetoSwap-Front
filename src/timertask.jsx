
import React, { useState, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { getExchangeGetQuotations, getExchangeUserInfo ,getExchangePriceListings} from "@/api/storeRequest"

const TimerTask = (props) => {
    const { isAuth } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            // authToken: state.auth.authToken
        }
    }, shallowEqual)
    const dispatch = useDispatch()

    // 定时任务-----------------------------------begin
    var isLock = false
    async function asyncFnGetuserInfo() {
        if (!isLock) {
            try {
                isLock = true
                if (isAuth) {
                    dispatch(await getExchangeUserInfo())
                }
            } catch (error) {
                console.warn('asyncFnGetuserInfo error:', error);
            } finally {
                isLock = false
            }
        }
    }
    var isLockQuotation = false
    async function asyncFnGetQuotations() {
        if (!isLockQuotation) {
            isLockQuotation = true
            dispatch(await getExchangeGetQuotations())
            isLockQuotation = false
        }
    }
    var isLockPriceListing = false
    async function asyncFnGetPriceListing() {
        if (!isLockPriceListing) {
            isLockPriceListing = true
            dispatch(await getExchangePriceListings())
            isLockPriceListing = false
        }
    }
    function createInterVal() {
        for (var i = 1; i < 99999; i++) {
            clearInterval(i);
        };
        asyncFnGetuserInfo()
        setInterval(asyncFnGetuserInfo, 10000)
        asyncFnGetQuotations()
        setInterval(asyncFnGetQuotations, 10000)

        asyncFnGetPriceListing()
        setInterval(asyncFnGetPriceListing, 5000)
    }
    // 定时任务-----------------------------------end
    useEffect(() => {
        console.log('TimerTask useEffect ... ');
        createInterVal()
    }, [isAuth])
    return (<React.Fragment></React.Fragment>)
}

export default TimerTask