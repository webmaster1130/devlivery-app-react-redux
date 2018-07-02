import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './UploadedContacts.css'
import {Modal, Table} from 'antd'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import {changeSelectedContacts, closeUploadedContactsModal} from '../../reducers/contacts'
import messages from './messages'

class UploadedContacts extends React.Component {
  render() {
    const {uploadedContacts, closeUploadedContactsModal, intl, selectedContacts, changeSelectedContacts} = this.props

    const columnsNames = uploadedContacts[0] ? Object.keys(uploadedContacts[0]) : []
    const columns = columnsNames.map(column => ({
      title: column,
      dataIndex: column,
      key: column,
      render: (item) => JSON.stringify(item)
    }))

    return (
      <Modal
        visible
        title={intl.formatMessage(messages.header)}
        onOk={closeUploadedContactsModal}
        onCancel={closeUploadedContactsModal}
        width={900}
      >
        <Table
          className={s.table}
          columns={columns}
          dataSource={uploadedContacts}
          rowKey={(record, i) => i}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedContacts,
            onChange: changeSelectedContacts,
          }}
        />
      </Modal>
    )
  }
}

const mapState = state => ({
  uploadedContacts: state.contacts.uploadedContacts,
  selectedContacts: state.contacts.selectedContacts,
})

const mapDispatch = {
  closeUploadedContactsModal,
  changeSelectedContacts,
}

export default connect(mapState, mapDispatch)(injectIntl(withStyles(s)(UploadedContacts)))