import {canisterId as Nft721OrderCID} from '../canister/local/canisters/nft721_order/index.js'
import {canisterId as Nft721CID} from '../canister/local/canisters/nft721/index.js';
import {canisterId as WICPCID} from '../canister/local/canisters/WICP_motoko/index.js'
import { Principal } from '@dfinity/principal'


import {
    fetchMintNft721, 
    fetchAuthorize, 
    fetchNftsFromExchange, 
    fetchNft721OrderRecord,
    fetchNft721OrderWithdrawNft,
    fetchNft721OrderRechargeICP,
    fetchNft721PreOrder,
    fetchNft721OrderGetUserOrder,
    fetchNft721OrderAddOrder,
    fetchNft721OrderBuy,
    fetchNft721OrderPauseOrder,
    fetchNft721BalanceOf,
    fetchNft721TokenByIndex,
    fetchWicpBalanceOf,
    fetchWicpApprove,
} from '@/api/canApi'

import requestCanister from './http'


const getNft721BalanceOf = async(authToken) =>{
    let ret = {}
    const params = {
        data: {
            cid : Nft721CID,
            canisterParams :Principal.fromText(authToken),
            ltype : '',
        },
        success(res) {
            console.debug('fetchNft721BalanceOf:', res)   
            ret = res
        },
        fail(err) { 
            console.error('fetchNft721BalanceOf err:', err)
        }
    }
    await requestCanister(fetchNft721BalanceOf, params)
    return ret
}


const getNftsFromExchange = async() =>{
    let ids = {}
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :false,
            ltype : '',
        },
        success(res) {
            console.debug('getNftsFromExchange:', res)
            ids = res
        },
        fail(err) {
            console.error('getNftsFromExchange err:', err)
        }
    }
    await requestCanister(fetchNftsFromExchange, params)
    return ids
}

const getMyRecord = async() =>{
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :false,
            ltype : '',
        },
        success(res) {
            console.debug('getMyRecord:', res)
        },
        fail(err) {
            console.error('getMyRecord err:', err)
        }
    }
    return  await requestCanister(fetchNft721OrderRecord, params)
}

const mintNft = async(nftEgg) =>{

    const params = {
        data: {
            cid : Nft721CID,
            canisterParams :nftEgg,
            ltype : '',
        },
        success(res) {
            console.debug('mintNft:', res)
        },
        fail(err) {
            console.error('mintNft err:', err)
        }
    }
    return await requestCanister(fetchMintNft721, params)
}

const cancelOrder = async(id) =>{
    let ret = false
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :id,
            ltype : '',
        },
        success(res) {
            console.debug('cancelOrder:', res)
            ret = true
        },
        fail(err) {   
            console.error('cancelOrder err:', err)
            ret = false
        }
    }
    await requestCanister(fetchNft721OrderPauseOrder, params)

    return ret
}

const withdrawNft = async(belongCID, id) =>{
    let ret = false
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :{belongCID:Principal.fromText(belongCID), id:id},
            ltype : '',
        },
        success(res) {
            console.debug('withdrawNft:', res)
            ret = true
        },
        fail(err) {
            console.error('withdrawNft err:', err)
            ret = false
        }
    }
    await requestCanister(fetchNft721OrderWithdrawNft, params)

    return ret
}

const getMyOrder = async() =>{
    let ret = []
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :'',
            ltype : '',
        },
        success(res) {
            console.debug('getMyOrder:', res)
            ret = res
        },
        fail(err) {
            console.error('getMyOrder err:', err)
        }
    }
    await requestCanister(fetchNft721OrderGetUserOrder, params)
    return ret
}

const rechargeICP = async(number) =>{
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :number,
            ltype : '',
        },
        success(res) {
            console.debug('rechargeICP success')
        },
        fail(err) {
            console.error('rechargeICP err:', err)
        }
    }
    await requestCanister(fetchNft721OrderRechargeICP, params)
} 

const wicpApprove = async (user, amount) =>{
    console.log("wicp approve :::", amount, user)
    let ret = false
    const params = {
        data: {
            cid : WICPCID,
            canisterParams :{user:user, amount:amount},
            ltype : '',
        },
        success(res) {
            console.debug('wicp approve', res)
            ret = true
        },
        fail(err) {
            console.error('wicp approve err:', err)
        }
    }
    await requestCanister(fetchWicpApprove, params)

    return ret
}

const buyNft = async (order) =>{
    let ret = false
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :order.id,
            ltype : '',
        },
        success(res) {
            console.debug('buyNft success')
            ret = true
        },
        fail(err) {
            console.error('buyNft err:', err)
        }
    }
    await requestCanister(fetchNft721OrderBuy, params)

    return ret
}

const preOrder = async(belongCID, id) => {
    var belongCID = Principal.fromText(belongCID)
    let authed = false
    var params = {
        data: {
            cid : Nft721CID,
            canisterParams :{
                id           : id,
                p            : Principal.fromText(Nft721OrderCID),
                isAuthorized : true,
            },
            ltype : '',
        },
        success(res) {
            console.debug('authorize success')
            authed = true
        },
        fail(err) {
            console.error('preOrder err:', err)
        }
    }
    await requestCanister(fetchAuthorize, params)
    
    if (!authed){
        return false
    }

    var params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :{belongCID, id},
            ltype : '',
        },
        success(res) {
            console.debug('fetchNft721PreOrder success')
            authed = true
        },
        fail(err) {
            console.error('fetchNft721PreOrder err:', err)
        }
    }
    await requestCanister(fetchNft721PreOrder, params)

    return authed
}

const addOrder = async(order) =>{
    
    order.belongCID = Principal.fromText(order.belongCID)
    let ret = false
    const params = {
        data: {
            cid : Nft721OrderCID,
            canisterParams :order,
            ltype : '',
        },
        success(res) {
            console.debug('addOrder:', res)
            ret = true
        },
        fail(err) {
            console.error('addOrder err:', err)
        }
    }
    await requestCanister(fetchNft721OrderAddOrder, params)

    return ret
}

const getNft721TokenByIndex = async(id) =>{
    let ret = {}
    const params = {
        data: {
            cid : Nft721CID,
            canisterParams :id,
            ltype : '',
        },
        success(res) {
            console.debug('fetchNft721TokenByIndex:', res)
            ret = res
        },
        fail(err) {
            console.error('fetchNft721TokenByIndex err:', err)
            ret = false
        }
    }
    await requestCanister(fetchNft721TokenByIndex, params)
    return ret
}

const getWicpBalanceOf = async(user) =>{
    let ret = {}
    const params = {
        data: {
            cid : WICPCID,
            canisterParams : Principal.fromText(user),
            ltype : '',
        },
        success(res) {
            console.debug('getWicpBalanceOf:', res)
            ret = parseFloat(res)
        },
        fail(err) {
            console.error('getWicpBalanceOf err:', err)
            ret = false
        }
    }
    await requestCanister(fetchWicpBalanceOf, params)
    return ret
}

export  {
    addOrder, 
    buyNft, 
    rechargeICP, 
    getMyOrder, 
    cancelOrder, 
    mintNft, 
    getMyRecord, 
    getNftsFromExchange, 
    withdrawNft,
    preOrder,
    getNft721BalanceOf,
    getNft721TokenByIndex,
    getWicpBalanceOf,
    wicpApprove,
}