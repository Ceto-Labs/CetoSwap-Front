/**
 * canister api
 */
import { message } from 'antd'
import { Principal } from '@dfinity/principal'
import BigNumber from 'bignumber.js'


import { principalToAccountId, Storage, getValueDivide8 } from '@/utils'
import { isConnected, reqConnect } from './plug'
import CanManager from './canManager'
import { II_URL, HOST_URL, REGISTRY_ID, FACTORY_ID, LEDGER_CID, NNS_UI_CID, CSPT_CID, CYCLES_MINTING_CID, IC_CANISTER_ID } from '@/server/local/id'

const canManager = new CanManager()

export const initIILoginStatus = async () => {
  return await canManager.getAuthClient()
}

export async function isLogin() {
  const loginType = Storage.get('loginType') || 'ii'
  if (loginType === 'ii') {
    const authClient = await canManager.getAuthClient()
    return await authClient.isAuthenticated()
  } else {
    return await isConnected()
  }
}

export const IILogin = async (callback) => {
  const authClient = await canManager.getAuthClient()
  console.log('IILogin ', II_URL)
  authClient.login({
    maxTimeToLive: BigInt(24 * 60 * 60 * 1000000000),
    identityProvider: II_URL,
    onSuccess: () => {
      callback && callback(authClient)
      canManager.updateIdentity()
    }
  })
}

export const IILogout = async () => {
  const authClient = await canManager.getAuthClient()
  authClient.logout()
  canManager.updateIdentity()
  return authClient
}
const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
export const plugLogin = async (cb) => {
  if (!window.ic) {
    Storage.clear()
    message.warn('Please Install Plug', 5)
    return
  }
  const whitelist = [REGISTRY_ID, FACTORY_ID, LEDGER_CID, NNS_UI_CID, CSPT_CID, CYCLES_MINTING_CID, IC_CANISTER_ID]
  await reqConnect(whitelist)
  try {
    const maxTryTime = 300
    let times = 1
    let connected = await isConnected()
    while (!connected && times < maxTryTime) {
      connected = await isConnected()
      await sleep(100)

      console.log('Plug connection is inside:', connected)
      times++
    }
    if (times >= maxTryTime) {
      const TXT = 'The Plug link timed out, please try again'
      message.warn(TXT, 5)
      throw TXT
    }
    console.log('Plug connection is outside:', connected)
    cb && cb()
    canManager.updateIdentity()
  } catch (err) {
    console.log('Plug connection catch:', err)
    Storage.clear()
  }
}

export const plugLogout = () => {
  window.ic.plug.agent = null
  canManager.updateIdentity()
}

export const fetchUserReg = async () => {
  const fetch = await canManager.getFactoryFactory()
  const res = await fetch.registerUser()
  console.log('registerUser res:', res)
}

export const fetchTokenList = async (params) => {
  const ltype = params.data && params.data.ltype
  const fetch = await canManager.getRegistryFactory(ltype)
  const res = await fetch.getTokenList()
  console.log('fetchTokenList res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchMintToken = async (params) => {
  const { tokenName, tokenSymbol, decimals, totalSupply, tokenIcon } = params.data
  const fetch = await canManager.getRegistryFactory()
  const res = await fetch.createToken(tokenName, tokenSymbol, decimals, totalSupply, tokenIcon)
  console.log('fetchMintToken res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchPairList = async (params) => {
  const { ltype } = params.data || { ltype: '' }
  const fetch = await canManager.getFactoryFactory(ltype)
  const res = await fetch.getPairList()
  console.log('getPairList res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchApprove = async (params) => {
  const { pairAddress, liquidity, cid } = params.data
  const fetch = await canManager.getPairFactory(cid)
  const res = await fetch.approve(pairAddress, liquidity)
  console.log('pair approve res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchTokenApprove = async (params) => {
  const { pairCidAccountId, bignumber, cid } = params.data
  const fetch = await canManager.getTokenFactory(cid)
  const res = await fetch.approve(pairCidAccountId, bignumber)
  console.log('token approve res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchAddLiquidity = async (params) => {
  const { token0Id, bignumber0, token1Id, bignumber1, pairRecTokenAccId, cid } = params.data
  const fetch = await canManager.getPairFactory(cid)
  const res = await fetch.addLiquidity(token0Id, bignumber0, token1Id, bignumber1, pairRecTokenAccId, 0, 0)
  console.log('addLiquidity res:', res)
  return res
}

export const fetchRemoveLiquidity = async (params) => {
  const { userAddress, liquidity, cid } = params.data
  const fetch = await canManager.getPairFactory(cid)
  const res = await fetch.removeLiquidity(userAddress, liquidity, userAddress, 0, 0)
  console.log('removeLiquidity res:', res)
  return res
}

export const fetchGetAllData = async (params) => {
  const { userPid, cid, ltype } = params.data
  const fetch = await canManager.getPairFactory(cid, ltype)
  const res = await fetch.getAllData(userPid)
  // console.log('getAllData res:', res)
  return {
    ok: res
  }
}

export const fetchCreatePair = async (params) => {
  const { pid1, pid2 } = params.data
  const fetch = await canManager.getFactoryFactory()
  const res = await fetch.createPair(pid1, pid2)
  console.log('create pair res:', res)
  return res
}

export const fetchAddTokenSub = async (params) => {
  const { pid } = params.data
  const fetch = await canManager.getFactoryFactory()
  const res = await fetch.addTokenSub(pid)
  console.log('addTokenSub res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: 'network'
    }
  }
}

export const fetchRemoveTokenSub = async (params) => {
  const { pid } = params.data
  const fetch = await canManager.getFactoryFactory()
  const res = await fetch.removeTokenSub(pid)
  console.log('removeTokenSub res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchSendDfx = async (params) => {
  const fetch = await canManager.getLedgerFactory()
  const res = await fetch.send_dfx(params.data)
  console.log('send_dfx res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchAccountBalanceDfx = async (params) => {
  // console.log('fetchAccountBalanceDfx:', params.data)
  const fetch = await canManager.getLedgerFactory()
  const res = await fetch.account_balance_dfx(params.data)
  console.log('account_balance_dfx res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchTokenBalanceOf = async (params) => {
  const { cid, accountId } = params.data
  const fetch = await canManager.getTokenFactory(cid)
  const res = await fetch.balanceOf(accountId)
  console.log('token balanceOf res:', res)
  return {
    ok: res
  }
}

export const fetchUserInfo = async () => {
  const fetch = await canManager.getFactoryFactory()
  const res = await fetch.getUserInfo([])
  console.log('user info res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchSwapWithTransferTokens = async (params) => {
  const { cid, token0Id, bignumber, token1Id, authToken } = params.data
  const fetch = await canManager.getPairFactory(cid)
  const res = await fetch.swapWithTransferTokens(token0Id, bignumber, token1Id, 0, authToken)
  console.log('fetchSwapWithTransferTokens res:', res)
  return res
}

export const fetchGetTotalSwapFee = async (params) => {
  const { cid } = params.data
  const ltype = params.data.ltype && params.data.ltype
  const fetch = await canManager.getPairFactory(cid, ltype)
  const res = await fetch.getTotalSwapFee()
  console.log('fetchGetTotalSwapFee res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchGetReserves = async (params) => {
  const { cid } = params.data
  const ltype = params.data.ltype && params.data.ltype
  const fetch = await canManager.getPairFactory(cid, ltype)
  const res = await fetch.getReserves()
  console.log('fetchGetReserves res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetch_get_icp_to_cycles_conversion_rate = async () => {
  const fetch = await canManager.getNnsuiFactory()
  const res = await fetch.get_icp_to_cycles_conversion_rate()
  console.log('fetch_get_icp_to_cycles_conversion_rate res:', res)
  if (res) {
    return {
      ok: res
    }
  } else {
    return {
      err: { network: 1 }
    }
  }
}

export const fetchExchangeMintAssets = async (params) => {
  const { coinId, amount, cid, ltype } = params.data
  const fetch = await canManager.getExchangeActor(cid, ltype)
  const args = {
    coinId: coinId,
    amount: amount
  }
  const res = await fetch.mint(args)
  return res
}

export const fetchExchangePiarInfo = async (params) => {
  const { cid } = params.data
  const fetch = await canManager.getExchangeActor(cid, 'notNeedIdentity')
  const res = await fetch.exchangepair()
  return res
}

export const fetchExchangeUserInfo = async (params) => {
  const { cid } = params.data
  const fetch = await canManager.getExchangeActor(cid)
  const res = await fetch.getUserInfo()
  return res
}

// getPriceLevelListing
export const fetchExchangePriceListings = async (params) => {
  const { cid } = params.data
  const fetch = await canManager.getExchangeActor(cid, 'notNeedIdentity')
  const res = await fetch.getPriceLevelListing()
  return res
}
// getQuotations
export const fetchExchangeGetQuotations = async (params) => {
  const { cid } = params.data
  const fetch = await canManager.getExchangeActor(cid, 'notNeedIdentity')
  const res = await fetch.getQuotations()
  return res
}

export const fetchExchangeNewOrder = async (params) => {
  const { cid, args } = params.data
  const fetch = await canManager.getExchangeActor(cid)
  const res = await fetch.newOrder(args)
  return res
}

//
export const fetchExchangeCancelOrder = async (params) => {
  const { cid, args } = params.data
  const fetch = await canManager.getExchangeActor(cid)
  const res = await fetch.calcelOrder(args)
  return res
}

// nft 721

export const fetchAuthorize = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721Actor(cid, ltype)

  const res = await fetch.authorize(canisterParams)
  return res
}

export const fetchNft721BalanceOf = async (params) => {
  const { cid, canisterParams, ltype } = params.data

  const fetch = await canManager.getNft721Actor(cid, ltype)
  const res = await fetch.balanceOf(canisterParams)
  return res
}

export const fetchNft721TokenByIndex = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721Actor(cid, ltype)

  const res = await fetch.tokenByIndex(canisterParams)
  return res
}

// nft721 order
export const fetchNftsFromExchange = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  console.log('fetch nfts from change ', cid, canisterParams, ltype)
  const fetch = await canManager.getNft721OrderActor(cid, ltype)

  const res = await fetch.getUserNfts(canisterParams)
  return res
}

export const fetchNft721PreOrder = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721OrderActor(cid, ltype)

  const res = await fetch.preOrder(canisterParams.belongCID, canisterParams.id)
  return res
}

export const fetchNft721OrderRecord = async (params) => {
  const { cid, ltype } = params.data
  const fetch = await canManager.getNft721OrderActor(cid, ltype)

  const res = await fetch.orderRecord()
  return res
}
export const fetchNft721OrderPauseOrder = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721OrderActor(cid, ltype)
  const res = await fetch.pauseOrder(canisterParams)
  return res
}

export const fetchNft721OrderWithdrawNft = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721OrderActor(cid, ltype)

  const res = await fetch.withdrawNft(canisterParams.belongCID, canisterParams.id)
  return res
}

export const fetchNft721OrderGetUserOrder = async (params) => {
  const { cid, ltype } = params.data
  const fetch = await canManager.getNft721OrderActor(cid, ltype)

  const res = await fetch.getUserOrders()
  return res
}

export const fetchNft721OrderRechargeICP = async (params) => {
  const { cid, canisterParams, ltype } = params.data

  console.log('recharge icp =====:', cid, canisterParams, ltype)
  const fetch = await canManager.getNft721OrderActor(cid, ltype)
  const res = await fetch.rechargeICP(canisterParams)
  return res
}

export const fetchNft721OrderAddOrder = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721OrderActor(cid, ltype)

  const res = await fetch.addOrder(canisterParams)
  return res
}

export const fetchWicpApprove = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getWicpActor(cid, ltype)
  const res = await fetch.approve(canisterParams.user, canisterParams.amount)
  return res
}

export const fetchNft721OrderBuy = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721OrderActor(cid, ltype)

  const res = await fetch.buy(canisterParams)
  return res
}

export const fetchWicpBalanceOf = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  console.log('fetch nft 721 order', cid, canisterParams, ltype)
  const fetch = await canManager.getWicpActor(cid, ltype)

  const res = await fetch.balanceOf(canisterParams)
  return res
}

export const fetchMintNft721 = async (params) => {
  const { cid, canisterParams, ltype } = params.data
  const fetch = await canManager.getNft721Actor(cid, ltype)
  const res = await fetch.mint(canisterParams)
  return res
}

export async function balanceWICP(data) {
  let { curPrinId } = data
  let fetch = await canManager.getWICPMotoko(false)
  let count = await fetch.balanceOf(Principal.fromText(curPrinId))
  return count || 0
}

export async function balanceICP(params) {
  let { curPrinId } = params?.data
  console.log('data:', curPrinId)
  let account = principalToAccountId(Principal.fromText(curPrinId))
  let ledgercanister = await canManager.getLedgerFactory('notNeedIdentity')
  let icpBalance = await ledgercanister.account_balance_dfx({ account: account })
  return icpBalance ? getValueDivide8(icpBalance.e8s) : 0 // 接口拿
}

export async function transferWIcp2WIcp(data) {
  let { amount, address } = data
  let fetch = await canManager.getWICPMotoko(true)
  let res = await fetch.transfer(Principal.fromText(address), parseInt(getValueMultiplied8(amount)))
  return res
}

export async function transferWIcp2Icp(data) {
  let { amount } = data
  let fetch = await canManager.getWICPMotoko(true)
  let res = await fetch.burn(parseInt(getValueMultiplied8(amount)))
  return res
}

export async function transferIcp2WIcp(data) {
  let fetch = await canManager.getWICPMotoko(true)
  let toAddr = await fetch.getReceiveICPAcc()
  data['address'] = toAddr[0]
  let blockHeight = await transferIcp2Icp(data)
  if (blockHeight) {
    console.log('blockHeight =' + blockHeight)
    let subaccount = [getSubAccountArray(0)]
    let result = await fetch.mint({ from_subaccount: subaccount, blockHeight: blockHeight })
    // approveWICPNat(NFT_ALONE_FACTORY_ID)
    // approveWICPNat(NFT_MULTI_FACTORY_ID)
    // approveWICPNat(NFT_ZOMBIE_FACOTRY_ID)
    // approveWICPNat(NFT_THEME_FACTORY_ID)
    return result
  } else {
    return null
  }
}
