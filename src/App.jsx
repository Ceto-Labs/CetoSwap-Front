import React, { useState, useEffect } from 'react'
import { Layout, Menu, Button, Drawer } from 'antd';
import { HashRouter, Route, Switch, Redirect, useHistory, NavLink } from 'react-router-dom'
import './App.less'
import TimerTask from './timertask'

import Home from '@/pages/Home'
import Explore from '@/pages/Explore'
import FNFTInfo from './pages/fnft/index';
import Orderlist from '@/pages/Orderlist'
import Swap from '@/pages/Swap'
import { About } from '@/pages/About'
import { NftMarket } from '@/pages/NftMarket'
import Auth from './components/Auth/index';
import Logo from '@assets/images/logo.png'
import AuthIcon from '@assets/images/auth0.png'
import WalletIcon from '@assets/images/wallet0.png'
import { getProviderNames } from '@/api/config'
import Asset from '@/pages/Assets'
import { createHashHistory } from "history";
// import {History} from './utils'
// import {history} from './pages/Explore'

const { Header, Footer, Sider, Content } = Layout
const { Item } = Menu

const App = () => {
  const [nav] = useState([
    { text: 'Explore', key: 'explore' },
    { text: 'NFT Sales', key: 'nftsales' },
    { text: 'Swap', key: 'swap' }])
  const [walletVisible, setWalletVisible] = useState(false);
  const [providersName, setProvidersName] = useState([])

  const onAssets = () => {
    let history = createHashHistory();
    const location = {
      pathname: '/assets',
    }
    history.push(location)
  }

  const walletOnClick = (e) => {
    let { key, keyPath, domEvent } = e
    console.log('walletOnClick:', e)
    if (key == 'key_wallet') {
      setWalletVisible(!walletVisible)
      console.log('walletVisible:', walletVisible)
    }

    if (key == 'assets') {
      onAssets()
    }
  }

  useEffect(() => {
    let keys = getProviderNames()
    setProvidersName([...keys])
  }, []);

  return (
    <HashRouter>
      {/* <TimerTask></TimerTask> */}
      <Layout className="class_home_head">
        <Header className="head_fixed">
          <div className="logo">
            <NavLink to={'/'}>
              <img src={Logo} alt="" />
            </NavLink>
          </div>
          <Menu mode="horizontal" onClick={(e) => walletOnClick(e)}>
            {nav.map((item, index) => (
              <Item key={index + 1}>
                <NavLink to={'/' + item.key}>{item.text}</NavLink>
              </Item>
            ))}
            <Item key='assets' icon={<img className='class_head_menu_icon' src={AuthIcon} />} >
      {/* <NavLink to={"/" + item.key}>{item.text}</NavLink> */}
    </Item>
    <Item key="key_wallet" icon={<img className="class_head_menu_icon" src={WalletIcon} />}></Item>
  </Menu>
        </Header >
  <Layout className="class_home_contents">
    <Content className="home_content">
      <Route path="/" exact component={Home}></Route>
      <Route path="/explore" exact component={Explore}></Route>
            {providersName.map((item, index) => (
              <Route key ={index} path={`/nft/${item}`} component={NftMarket} />
            ))}

            {/* <Route path="/nft" exact component={NFTSales}></Route> */}
            <Route path="/fnft/:exCid?/:exId?" exact component={FNFTInfo}></Route>
            {/* <Route path="/orderlist" exact component={Orderlist}></Route> */}
            <Route path="/swap" exact component={Swap}></Route>
            <Route path="/about" exact component={About}></Route>
            <Route path="/assets" exact component={Asset}></Route>

          </Content >
  <Drawer
    zIndex={1}
    getContainer={document.querySelector('.home_content')}
    placement="right"
    closable={false}
    onClose={() => {
      setWalletVisible(false)
    }}
    visible={walletVisible}
    // getContainer={false}
    style={{ paddingTop: 64 }}
  >
    <Auth />
  </Drawer>
        </Layout >
      </Layout >
    </HashRouter >
  )
}
export default App
