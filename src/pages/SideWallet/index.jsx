import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { InputNumber, Button, Form, Input, message } from 'antd'
import BigNumber from 'bignumber.js'

import { balanceICP } from '@/api/canApi'
import requestCanister from '@/api/http'
import CModal from '@/components/CModal'

import DfinityLogo from '@/assets/images/dfinity.png'
import TransferIcon from '@assets/images/icon-transfer.png'
import WicpIconImg from '@/assets/images/wicp_logo.png'
import DownIconImg from '@/assets/images/icons8-down.gif'

import './index.less'

const { Item } = Form
const TRANS_TYPE_ICP_ICP = 1
const TRANS_TYPE_WICP_WICP = 2
const TRANS_TYPE_ICP_WICP = 3
const TRANS_TYPE_WICP_ICP = 4

export const SideWallet = (props) => {
    const { isAuth, authToken } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            authToken: state.auth.authToken
        }
    }, shallowEqual)
    const [wicpBalance, setWicpBalance] = useState(0)
    const [icpBalance, setIcpBalance] = useState(0)
    const [address, setAddress] = useState()
    const [amount, setAmount] = useState()
    const [transType, setTransType] = useState(-1) //1:icp2icp,2、wicp2wicp,3、icp2wicp,4、wicp2icp

    const [sendVisible, setSendVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [transferLoading, setTransferLoading] = useState(false)
    const handlerClose = () => {
        setTransFerVisible(false)
        setTransType(-1)
        setTransAmount(null)
        setTrans2Address('')
    }
    const getTransTypeStr = (type) => {
        let ret = 'Transfer'
        switch (type) {
            case TRANS_TYPE_ICP_ICP:
                ret = 'Transfer';
                break;
            case TRANS_TYPE_WICP_WICP:
                ret = 'Transfer'
                break
            case TRANS_TYPE_ICP_WICP:
                ret = 'Wrapped(ICP->WICP)'
                break
            case TRANS_TYPE_WICP_ICP:
                ret = 'De-Wrapped(WICP->ICP)'
                break
            // default:
            //     ret = ''
        }
        return ret
    }
    const showTransferModal = (type) => {
        console.log('showTransferModal:', type);
        setTransType(type)
        setSendVisible(true)
    }
    const handleSetToAddress = (e) => {
        setAddress(e.target.value)
    }
    const handleSetTransferAmount = (e) => {
        setAmount(e - 0)
    }
    const handlerTransfer = async () => {
        // setTransferLoading(true)
        // setTransferLoading(false)
        // if (transfering) {
        //     message.error('The previous transaction is still in progress, please wait a moment and resubmit')
        //     return
        // }
        // if (transAmount > icp && (transType === 1 || transType === 3)) {
        //     message.error('Insufficient ICP')
        //     return
        // }
        // if (transAmount > wicp && (transType === 2 || transType === 4)) {
        //     message.error('Insufficient WICP')
        //     return
        // }
        // if (transAmount <= 0.0001 && (transType === 1 || transType === 3)) {
        //     message.error('At least 0.0001 ICP is required in this transation')
        //     return
        // }
        // if (transAmount < 0.1 && transType === 4) {
        //     message.error('At least 0.1 WICP is required in this transation')
        //     return
        // }
        // setTransfering(true)
        // let txt
        // transType === 1 && (txt = 'Transfering...')
        // transType === 2 && (txt = 'Transfering...')
        // transType === 3 && (txt = 'Wrapping...')
        // transType === 4 && (txt = 'De-Wrapping...')
        // let notice = Toast.loading(txt, 0)
        // let address = trans2Address.replace(/\s+/g, '')
        // let data = {
        //     amount: parseFloat(transAmount),
        //     address: address,
        //     success: (res) => {
        //         if (res) {
        //             setTransfering(false)
        //             PubSub.publish(UpdateTransaction, { type: transType })
        //             handlerClose()
        //         }
        //     },
        //     fail: (error) => {
        //         setTransfering(false)
        //         if (error) message.error(error)
        //     },
        //     error: (error) => {
        //         setTransfering(false)
        //     },
        //     notice: notice
        // }
        // transType === 1 && requestCanister(transferIcp2Icp, data)
        // transType === 2 && requestCanister(transferWIcp2WIcp, data)
        // transType === 3 && requestCanister(transferIcp2WIcp, data)
        // transType === 4 && requestCanister(transferWIcp2Icp, data)
    }
    const handleCancleSendModal = useCallback(() => {
        setSendVisible(false)
    }, [sendVisible])
    useEffect(async () => {
        if (isAuth) {
            console.log('authToken:', authToken);
            const params = {
                data: {
                    curPrinId: authToken,
                    ltype: '',
                },
                success(res) {
                    console.debug('balanceICP:', res)
                    setIcpBalance(new BigNumber(res).toFixed(2))
                },
                fail(err) {
                    console.error('balanceICP err:', err)
                }
            }
            await requestCanister(balanceICP, params)
        }
    }, [])
    return (
        <div>
            <div className='css_wallet_balance'>
                <div style={{ display: 'flex', }}>
                    <img src={DfinityLogo} style={{ height: '30px', flex: '1' }} />
                    <span style={{ flex: '8' }}>&nbsp;{icpBalance} ICP</span>
                    <img src={TransferIcon} style={{ height: '30px' }} onClick={(e) => {
                        e.stopPropagation()
                        showTransferModal(TRANS_TYPE_ICP_ICP)
                    }} />
                </div>
            </div>
            <div style={{ display: 'flex', height: '50px', malignItems: 'center', justifyContent: 'center' }}>
                <img src={DownIconImg} style={{ flex: '1', cursor: 'pointer' }} onClick={(e) => {
                    e.stopPropagation()
                    showTransferModal(TRANS_TYPE_ICP_WICP)
                }} />
                <span style={{ flex: '3' }} />
                <img src={DownIconImg} style={{ flex: '1', cursor: 'pointer', transform: 'rotate(180deg)' }} onClick={(e) => {
                    e.stopPropagation()
                    showTransferModal(TRANS_TYPE_WICP_ICP)
                }} />
            </div>
            <div className='css_wallet_balance'>
                <div style={{ display: 'flex', }}>
                    <img src={WicpIconImg} style={{ height: '30px', flex: '1', marginRight: '20px' }} />
                    <span style={{ flex: '80' }}>&nbsp;{wicpBalance} WICP</span>
                    <img src={TransferIcon} style={{ height: '30px' }} onClick={(e) => {
                        e.stopPropagation()
                        showTransferModal(TRANS_TYPE_WICP_WICP)
                    }} />
                </div>
            </div>
            { }
            <CModal title={getTransTypeStr(transType)}
                visible={sendVisible}
                width={728}
                handleCancleModal={handleCancleSendModal}>
                <Form size="large" onFinish={handlerTransfer} autoComplete="off">
                    {transType === 1 || transType === 2 ?
                        <div>
                            <Item>
                                <Input type="text" value={transType === 1 ? 'ICP' : 'WICP'} />
                            </Item>
                            <Item name="address" rules={[{ required: true, message: 'Please input to address' }]}>
                                <Input type="text" placeholder={transType === 1 ? 'Enter Account ID' : 'Enter Principal ID'} value={address} onChange={(e) => handleSetToAddress(e)} />
                            </Item>
                        </div>
                        : <></>}
                    <Item name="transfer-amount" rules={[{ required: true, message: 'Please input amount' }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            keyboard={false}
                            stringMode={true}
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => handleSetTransferAmount(e)}
                        />
                    </Item>
                    <div className="fee-actually">
                        {/* <div>
                            Fee: {tokenItem.fee / Math.pow(10, tokenItem.decimals)} {symbol}
                        </div>
                        <div>
                            Actually: {handleTransferFee} {symbol}
                        </div> */}
                    </div>
                    <Button block type="primary" htmlType="submit" loading={transferLoading} disabled={!isAuth} size="large">
                        {isAuth ? (loading ? 'Confirm...' : 'Confirm') : 'Connect'}
                    </Button>
                </Form>
            </CModal>
        </div>
    )
}