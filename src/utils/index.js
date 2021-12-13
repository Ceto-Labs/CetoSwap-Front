/**
 * common function
 */
import { blobFromUint8Array, blobToHex } from '@dfinity/candid'
import crc32 from 'crc-32'
import { sha224 } from 'js-sha256'
import {useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'


const History = () =>{
   return useHistory();
}


const to32bits = (num) => {
  let b = new ArrayBuffer(4)
  new DataView(b).setUint32(0, num)
  return Array.from(new Uint8Array(b))
}
const principalToAccountId = function (principal, subaccount) {
  const shaObj = sha224.create()
  shaObj.update('\x0Aaccount-id')
  shaObj.update(principal.toUint8Array())
  shaObj.update(subaccount ? subaccount : new Uint8Array(32))
  const hash = new Uint8Array(shaObj.array())
  const crc = to32bits(crc32.buf(hash))
  const blob = blobFromUint8Array(new Uint8Array([...crc, ...hash]))
  return blobToHex(blob)
}
const getSubAccountArray = (s) => {
  if (Array.isArray(s)) {
    return s.concat(Array(32 - s.length).fill(0))
  } else {
    //32 bit number only
    return Array(28)
      .fill(0)
      .concat(to32bits(s ? s : 0))
  }
}

const deDuplicationArr = (arr) => {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].tokenId == arr[j].tokenId) {
        arr.splice(j, 1)
        //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
        j--
      }
    }
  }
  return arr
}

const uint8arrayToBase64 = (buffer) => {
  if (!buffer || !buffer.length) {
    return
  }
  try {
    let view = new Uint8Array(new ArrayBuffer(buffer.length))
    for (let i = 0; i < view.length; i++) {
      view[i] = buffer[i]
    }
    let dec = new TextDecoder('utf-8')
    let dataStr = dec.decode(view)
    return dataStr
  } catch (e) {
    console.log('uint8arrayToBase64 e:', e)
  }
}
// 获取小数点后的位数
const getPointNum = function (num) {
  let x = String(num).indexOf('.') + 1
  if (x == 0) {
    return 0
  }
  return String(num).length - x
}
const formatNumMinPoint = (num, ...values) => {
  // console.log('formatNumMinPoint ')
  return num.toFixed(Math.min(getPointNum(num), 8, ...values))
}
const isValueNull = (exp) => {
  return !exp && typeof exp == 'undefined'
}
const bignumberFormat = (num) => {
  return num.toFormat(1, { groupSeparator: '', decimalSeparator: '.' }).split('.')[0]
}
const bignumberToBigInt = (num) => {
  return BigInt(bignumberFormat(num))
}
const getValueDivide8 = (num) => {
  let res = new BigNumber(num || 0).dividedBy(Math.pow(10, 8))
  return res.toFixed()
}

// const gData = {
//   tokens: new Map(),
//   pools: new Map(),
//   userTokens: new Map(),
//   userLiquidList: new Map(),
//   pools__expires__: 0,
//   tokens__expires__: 0,
//   userLiquid__expires__: 0,
//   userInfos__expires__: 0,
//   updateTokensFromTokenList: function (tokenList) {
//     tokenList.map((item, index) => {
//       let key = item.canisterId.toText()
//       if (this.isTokenDataEmpty(key)) {
//         let value = {
//           isDataFull: false,
//           cid: item.canisterId.toText(),
//           name: item.name,
//           symbol: item.symbol.toUpperCase(),
//           icon: uint8arrayToBase64(item.icon[0]),
//           owner: item.owner.toText(),
//           totalSupply: parseInt(item.totalSupply) / Math.pow(10, parseInt(item.decimals)),
//           decimals: parseInt(item.decimals)

//           // fee: parseInt(item.fee), //lose fee
//           // deployTime:0, //lose
//         }
//         this.tokens.set(key, value)
//       }
//     })
//   },
//   isTokenDataEmpty: function (key) {
//     let value = this.tokens.get(key)
//     return !value || !value.length
//   },
//   isTokenDataFull: function (key) {
//     console.debug('token cid:', key, 'data is not full..')
//     let value = this.tokens.get(key)
//     if (!value || !value.length || !value.isDataFull) {
//       return false
//     } else {
//       return true
//     }
//   },
//   updateTokensFromTokenMeta: function (cidText, tokenMeta) {
//     let key = cidText
//     // 数据不完整，则更新数据
//     if (!this.isTokenDataFull(key)) {
//       let value = {
//         isDataFull: true,
//         cid: cidText,
//         name: tokenMeta.name,
//         symbol: tokenMeta.symbol.toUpperCase(),
//         icon: uint8arrayToBase64(tokenMeta.icon[0]),
//         owner: tokenMeta.owner.toText(),
//         totalSupply: parseInt(tokenMeta.totalSupply) / Math.pow(10, parseInt(tokenMeta.decimals)),
//         decimals: parseInt(tokenMeta.decimals),
//         //more than token-list
//         fee: parseInt(tokenMeta.fee),
//         userNumber: parseInt(tokenMeta.userNumber),
//         cycleBalance: parseInt(tokenMeta.cycle),
//         deployTime: tokenMeta.deployTime
//       }
//       this.tokens.set(key, value)
//     }
//   }
// }

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
const Storage = {
  set(key, value) {
    if (window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  },
  get(key) {
    if (window.localStorage) {
      return JSON.parse(window.localStorage.getItem(key))
    }
  },
  remove(key) {
    if (window.localStorage) {
      window.localStorage.removeItem(key)
    }
  },
  clear() {
    if (window.localStorage) {
      window.localStorage.clear()
    }
  }
}

export {
  Storage,
  // gData,
  arraysEqual,
  bignumberFormat,
  bignumberToBigInt,
  isValueNull,
  principalToAccountId,
  deDuplicationArr,
  uint8arrayToBase64,
  getSubAccountArray,
  getPointNum,
  formatNumMinPoint,
  History,
  getValueDivide8,
}
