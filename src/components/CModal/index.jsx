import React, { useState, memo } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import './index.less'

const CModal = memo((props) => {
  const { title, visible, width, children, handleCancleModal } = props
  const [loading, setLoading] = useState(false)

  const handleCancle = () => {
    handleCancleModal()
  }

  return (
    <Modal
      title={title}
      visible={visible}
      width={width}
      centered
      footer={null}
      closeIcon={<CloseCircleOutlined />}
      onCancel={handleCancle}
    >
      {children}
    </Modal>
  )
})

CModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  width: PropTypes.number,
  handleCancle: PropTypes.func
}

export default CModal
