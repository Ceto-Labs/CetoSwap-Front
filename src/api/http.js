import { message } from 'antd'
import { isLogin } from './canApi'
const errorMessage = {
  network: 'The network is not good, please refresh the page!',
  notLogin: 'Please sign in first'
}
const requestCanister = async (reqFunc, params, hasLogin = false) => {
  const { success, fail, close } = params
  try {
    if (hasLogin && !(await isLogin())) {
      console.log('hasLogin: ', hasLogin)
      throw errorMessage.notLogin
    }
    const res = await reqFunc(params)
    if (res.ok || res.ok >= 0) {
      close && close()
      success && success(res.ok)
    } else if (res.err) {
      // console.warn('response error: ', res.err)
      fail && fail(errorMessage[res.err] || res.err)
      close && close()
    } else {
      close && close()
      success && success(res)
    }
  } catch (err) {
    if (err === errorMessage.notLogin) {
      message.error(err, 5)
    }
    close && close()
    let index = err.toString().indexOf('Reject text')
    if (index) {
      const str = err.toString().substring(index + 11 + 1)
      fail && fail(str)
    }
    console.error('catch error:', err)
  }
}

export default requestCanister
