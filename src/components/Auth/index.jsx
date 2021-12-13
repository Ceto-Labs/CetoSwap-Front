import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { Divider, Button, Typography, Image, message } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'


import { initIILoginStatus, IILogin, IILogout, plugLogin, plugLogout, fetchUserReg } from '@/api/canApi'
import { isConnected, getPrincipalId } from '@/api/plug'
import { Storage, principalToAccountId } from '@/utils'
import { SideWallet } from '@/pages/SideWallet'
import DfinityLogo from '@/assets/images/dfinity.png'
import PlugLogo from '@/assets/images/plug.svg'
import StoicLogo from '@/assets/images/stoic.png'
import AuthIcon from '@assets/images/auth0.png'
import LogoutIcon from '@assets/images/icon-logout.png'



import Assets from '@/pages/Assets'

import { actions } from './store'

import './index.less'

const { Paragraph } = Typography

const Auth = React.memo(() => {
  const dispatch = useDispatch()
  const { isAuth, authToken, accountId } = useSelector((state) => {
    return {
      isAuth: state.auth.isAuth,
      authToken: state.auth.authToken,
      accountId: state.auth.accountId
    }
  }, shallowEqual)

  const handlerAuthInfo = async (authClient, cb) => {
    const loginType = Storage.get('loginType') || ''
    if (loginType === 'ii') {
      const identity = await authClient.getIdentity()
      const principal = identity.getPrincipal()
      const boolean = await authClient.isAuthenticated()
      const authToken = principal.toText()
      dispatch(actions.setAuthStatus(boolean))
      dispatch(actions.setIdentity(identity))
      dispatch(actions.setAuthToken(authToken))
      dispatch(actions.setAccountId(principalToAccountId(principal)))
      cb && cb()
    } else if (loginType === 'plug') {
      if (window.ic) {
        const connected = await isConnected()
        console.log('auth component plug is connect status:', connected)
        dispatch(actions.setAuthStatus(connected))
        cb && cb()
        if (window.ic.plug.agent) {
          const principalId = await getPrincipalId()
          const plugPId = principalId.toText()
          const plugAId = principalToAccountId(principalId)
          console.log('auth aid:', plugAId)
          dispatch(actions.setAuthToken(plugPId))
          dispatch(actions.setAccountId(plugAId))
          Storage.set('plugPId', plugPId)
          Storage.set('plugAId', plugAId)
        } else {
          if (connected) {
            const plugPId = Storage.get('plugPId')
            const plugAId = Storage.get('plugAId')
            dispatch(actions.setAuthToken(plugPId))
            dispatch(actions.setAccountId(plugAId))
          } else {
            Storage.set('plugPId', '')
            Storage.set('plugAId', '')
            dispatch(actions.setAuthToken(''))
            dispatch(actions.setAccountId(''))
          }
        }
      }
    } else {
      dispatch(actions.setAuthStatus(false))
    }
  }
  // init identity
  const init = async () => {
    const loginType = Storage.get('loginType') || 'ii'
    if (loginType === 'ii') {
      const authClient = await initIILoginStatus()
      handlerAuthInfo(authClient)
    } else {
      handlerAuthInfo()
    }
  }

  // internet identity
  const iiLogin = async () => {
    IILogin((authClient) => {
      handlerAuthInfo(authClient,)
    })
  }

  // plug login
  const pLogin = async () => {
    plugLogin(() => handlerAuthInfo('',))
  }

  const handleSetLoginType = (type) => {
    Storage.set('loginType', type)
    if (type === 'ii') {
      iiLogin()
    } else {
      // pLogin()
      message.info('comming soon...')
    }
  }

  const logout = async () => {
    const loginType = Storage.get('loginType') || ''
    if (loginType === 'ii') {
      const authClient = await IILogout()
      handlerAuthInfo(authClient)
    } else {
      plugLogout()
      handlerAuthInfo('', () => {
        dispatch(actions.setAuthStatus(false))
      })
    }
    Storage.clear()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <div className='wallet_auth' style={{ display: 'flex' }}>
        <div className="wallet_auth_icon" style={{ flex: '1' }}>
          <img className="wallet_auth_icon" src={AuthIcon} style={{ height: '30px' }} /> <span>&nbsp;My Wallet</span>
        </div>
        {isAuth ? (<img className="wallet_auth_icon" src={LogoutIcon} style={{ height: '30px' }} onClick={logout} />) : (<></>)}
      </div>
      {isAuth ? (<div>
        <div style={{ display: 'flex' }}>Principal&nbsp;ID:&nbsp;&nbsp;<Paragraph ellipsis={{ rows: 0 }} copyable>{authToken}</Paragraph></div>
        <div style={{ display: 'flex' }}>Account&nbsp;&nbsp;ID:&nbsp;&nbsp;<Paragraph ellipsis={{ rows: 0 }} copyable>{accountId}</Paragraph></div>
      </div>) : (<></>)}
      <Divider />
      {isAuth ? (<SideWallet />) : (
        <div className="no-login">
          <div>
            Connect your wallet to buy and sell NFTs directly from the marketplace.
          </div>
          <Button className="ant-btn-auth" icon={<img src={DfinityLogo} style={{ width: '40px', minHeight: '40px', maxHeight: '40px' }} />} onClick={() => handleSetLoginType('ii')}>
            <span>&nbsp;&nbsp;Internet Identity</span>
          </Button>
          <Button className="ant-btn-auth" icon={<img src={StoicLogo} style={{ width: '40px', maxHeight: '40px' }} />} onClick={() => handleSetLoginType('stoic')}>
            <span>&nbsp;&nbsp;Stoic Wallet</span>
          </Button>
          <Button className="ant-btn-auth" icon={<img src={PlugLogo} style={{ width: '40px', maxHeight: '40px' }} />} onClick={() => handleSetLoginType('plug')}>
            <span>&nbsp;&nbsp;Plug Wallet</span>
          </Button>
        </div>
      )}
    </>
  )
})

Auth.propTypes = {
  isBlock: PropTypes.bool
}

export default Auth
