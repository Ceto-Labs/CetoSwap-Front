/**
 * create agent
 */

import { Storage } from '@/utils'
import axios from 'axios'

import requestCanister from './http'
import { fetchGetTotalSwapFee, fetchGetReserves, fetch_get_icp_to_cycles_conversion_rate } from './canApi'

import BigNumber from 'bignumber.js'

var xdrPriceCallOpt = {
  method: 'get',
  url: '/v7/convert?q=XDR_USD&compact=ultra&apiKey=525137aa937527f317b6',
  baseURL: 'https://free.currconv.com/api'
}
var xdrPrice = 1.421277
var icpListPrice = 64.68
const getXDRPrice = async () => {
  try {
    let response = await axios(xdrPriceCallOpt)
    if (response.status == 200 && response.data) {
      xdrPrice = response.data.XDR_USD
    }
  } catch (e) {
    console.error('[getXDRPrice] catch error:', e)
  }
  return xdrPrice
}
const getIcpPrice = async () => {
  await getXDRPrice()
  const params = {
    success(cyclePrice) {
      console.debug('get_icp_to_cycles_conversion_rate:', cyclePrice)
      if (xdrPrice) {
        icpListPrice = ((Number(cyclePrice) / 1e12) * xdrPrice).toFixed(2)
      }
      Storage.set('icptprice', icpListPrice)
      console.log('[getIcpPrice] icptprice: ', icpListPrice)
    },
    fail(err) {
      console.error('[getIcpPrice] err:', err)
    }
  }
  await requestCanister(fetch_get_icp_to_cycles_conversion_rate, params)
}
const updatePoolListRwTVL = async (arrData) => {
  let UsdtRate0 = 1
  let UsdtRate1 = 1
  for (let item of arrData) {
    const parsReward = {
      data: { cid: item.key, ltype: 'notNeedIdentity' },
      success(resSwapFee) {
        if (resSwapFee && resSwapFee.length) {
          let { 0: reward0, 1: reward1 } = resSwapFee
          let rew0 = new BigNumber(parseInt(reward0)).multipliedBy(UsdtRate0).dividedBy(Math.pow(10, item.list.fromDecimals))
          let rew1 = new BigNumber(parseInt(reward1)).multipliedBy(UsdtRate1).dividedBy(Math.pow(10, item.list.toDecimals))
          item.reward = rew0.plus(rew1).toNumber().toFixed(2)
        }
      },
      fail(err) {
        console.log('resSwapFee', err)
      }
    }
    await requestCanister(fetchGetTotalSwapFee, parsReward)

    const parsReserves = {
      data: { cid: item.key, ltype: 'notNeedIdentity' },
      success(resReserves) {
        if (resReserves && resReserves.length) {
          let { 0: r0, 1: r1 } = resReserves
          let res0 = new BigNumber(parseInt(r0)).multipliedBy(UsdtRate0).dividedBy(Math.pow(10, item.list.fromDecimals))
          let res1 = new BigNumber(parseInt(r1)).multipliedBy(UsdtRate1).dividedBy(Math.pow(10, item.list.toDecimals))
          item.tvl = res0.plus(res1).toFixed(2)
        }
      },
      fail(err) {
        console.log('resReserves', err)
      }
    }
    await requestCanister(fetchGetReserves, parsReserves)

    console.debug('Reward:', item.reward, 'Tvl:', item.tvl)
  }
  // setList(arrData)
  console.debug('updatePoolListRwTVL arrData:', arrData)
  Storage.set('pair_list_cache', { expires: Date.now() + 15 * 60 * 1000, data: arrData })
}

export { updatePoolListRwTVL, getIcpPrice }
