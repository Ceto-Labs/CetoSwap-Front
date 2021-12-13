import React, { useState, memo } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Statistic, Image } from 'antd'
import './index.less'
import './time.js'

const CAlert = memo((props) => {
  const {order, visible, handleConfirmAlert, handleCancleAlert} = props
  var [confirmBtn, setConfirm]=useState(false)
  const handleConfirm = () => {
    setConfirm(!confirmBtn)
    handleConfirmAlert(order)
  }

  const handleCancle = () =>{
    handleCancleAlert()
  }

  function timeCreate(utcLen){
    const date = new Date(parseInt(utcLen)/1000000)
    return date.format('d-m-Y H:i:s')
  }

  return (
    <Modal
      title="Confirm to buy nft"
      wrapClassName="cs-alert"
      visible={visible}
      width="610px"
      hight="600px"
      centered
      footer={null}
      closable={false}
      confirmLoading = {true}
      //onCancle={handleCancle}
      destroyOnClose={true}
    >
      <div className="content">
        <div className="divImg">
          <Image className="img" preview={false} src={order.imgUrl} />
        </div>
      
        <div className="divDetals">
          <label>Nft details</label>
          <br />
          <lable>Price :{parseFloat(order.price)}</lable>
          <br />
          <lable>Create time:{timeCreate(order.start)}</lable>
          <br />
          <lable>UUID:{order.id}</lable>
          <br />
          <lable>exchange count: 30</lable>
        </div>
        <div className="divBtn">
          <Button size="small" onClick={handleCancle}>
            Cancel
          </Button> &nbsp;
          <Button disabled={confirmBtn} size="small" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>       
      </div>
    </Modal>
  )
})

CAlert.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  handleCancle: PropTypes.func,
  //nftInfo : PropTypes.nftInfo,
}

export default CAlert
