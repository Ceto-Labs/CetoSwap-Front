import { format, parse } from 'date-fns'
import BigNumber from 'bignumber.js'

import requestCanister from '@/api/http'
import { fetchExchangePiarInfo, fetchExchangePriceListings, fetchExchangeUserInfo, fetchExchangeGetQuotations } from '@/api/canApi'

import { actions } from '@/store/api/index'

const TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
const exchangeCid = 'i3n4m-ciaaa-aaaaa-aac4a-cai'

export const getExchangePairInfo = async () => {
  const params = {
    data: {
      cid: exchangeCid,
      ltype: ''
    },
    success(res) {
      console.debug('[request]getExchangePairInfo:', res)
      if (res) {
        let exchangePairInfoMap = new Map((Storage.get('EXCHANGE_PAIR_INFO') || []).map((el) => [el.id, el]))
        exchangePairInfoMap.set(res.id, res)
        Storage.set('EXCHANGE_PAIR_INFO', Array.from(exchangePairInfoMap.values()))
      }
    },
    fail(err) {
      console.error('[request]getExchangePairInfo err:', err)
    }
  }
  await requestCanister(fetchExchangePiarInfo, params)
}

export const getExchangeUserInfo = async () => {
  return async (dispatch) => {
    const params = {
      data: {
        cid: exchangeCid,
        ltype: ''
      },
      success(res) {
        console.debug('[request]getExchangeUserInfo:', res)
        dispatch(actions.setUserInfo(res))
      },
      fail(err) {
        console.error('[request]getExchangeUserInfo err:', err)
      }
    }
    await requestCanister(fetchExchangeUserInfo, params)
  }
}
export const getExchangePriceListings = async () => {
  return async (dispatch) => {
    const params = {
      data: {
        cid: exchangeCid,
        ltype: ''
      },
      success(res) {
        //   console.debug('[request]fetchExchangeListings:', res)
        dispatch(actions.setPriceListing(res))
      },
      fail(err) {
        console.error('[request]fetchExchangeListings err:', err)
      }
    }
    await requestCanister(fetchExchangePriceListings, params)
  }
}
export const getExchangeGetQuotations = async () => {
  return async (dispatch) => {
    const params = {
      data: {
        cid: exchangeCid,
        ltype: ''
      },
      success(data) {
        if (data) {
          let ret = []
          data.forEach((element) => {
            let dateTimeStamp = Number(new BigNumber(element.date || 0).dividedBy(Math.pow(10, 6)))
            ret.push({
              date: format(new Date(dateTimeStamp), TIME_FORMAT),
              open: Number(element.open),
              high: Number(element.high),
              low: Number(element.low),
              close: Number(element.close),
              volume: Number(element.volume)
            })
          })
          if (ret.length > 0) {
            dispatch(actions.setQuotation(ret))
          }
        }
      },
      fail(err) {
        console.error('[request]fetchExchangeGetQuotations err:', err)
      }
    }
    await requestCanister(fetchExchangeGetQuotations, params)
  }
}
