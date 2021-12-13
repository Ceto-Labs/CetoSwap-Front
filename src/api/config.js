import {nft721_order, canisterId as icapesExchangeCID} from '../canister/local/canisters/nft721_order'

// 1 提供第三方罐子id
// 2 提供对应的主图 主题 描述
// 3 从交易所获取属性
// 4 在以下结构体中添加 对应的action / canister id

const providerMapExchange = {
    "icapes" :{exchange: nft721_order, 'exchangeCID': icapesExchangeCID},
    "icpunks":{exchange: nft721_order, 'exchangeCID': icapesExchangeCID},
    "imagination":{exchange: nft721_order, 'exchangeCID': icapesExchangeCID},
}

const providerProps ={
    "icapes" :{imageUrl :'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/2948', title :'icpes ok', desc : 'flsh  djfl ll llih vvyty good bye ' },
    "icpunks" :{imageUrl :'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/6361', title :'icpunks ok', desc : 'uuu dfll  hhhh nnn' },
    "imagination" :{imageUrl :'https://oeee4-qaaaa-aaaak-qaaeq-cai.raw.ic0.app/?tokenid=cos5e-3ikor-uwiaa-aaaaa-cuaab-eaqca-aaah2-a',title :'imagination', desc : 'JJJJJJJJJdsldlfdf lfjdl' },
}


const getProviderNames =() => {
    var keys = [];
    for (var p in providerMapExchange){
        keys.push(p)
    }
    return  keys
}

const getExchangeInfo = (providerName) => {
    console.log("llllllllllllllllllllllllllllll", providerMapExchange[providerName])
    return providerMapExchange[providerName]
}

const getProviderProps = (providerName) => {
    let props = providerProps[providerName]
    // todo 从交易所获取交易信息数据
    return {
        imgUrl : props.imageUrl,
        describe : props.desc,
        title : props.title,
        volume : 205,
        listings : 1000,
        floorPrice : 4,
    }
}

export {getProviderNames, getExchangeInfo, getProviderProps}
