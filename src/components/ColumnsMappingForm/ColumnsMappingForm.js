import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ColumnsMappingForm.css'
import {Form, Select} from 'antd'
import {injectIntl} from 'react-intl'
import formMessages from '../../formMessages'
import {REQUIRED_FIELDS} from '../../constants'
import {connect} from 'react-redux'
import messages from './messages'
import {contact_map,address_map,MAP_COLUMNS} from '../../constants';

class ColumnsMappingForm extends React.Component {
  render() {
    const {mappingColumns, intl, className, isRequireAddress} = this.props
    const {getFieldDecorator} = this.props.form
    
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    let dataSrc = mappingColumns ? 
                    (Array.isArray(mappingColumns.user_columns) ? 
                        mappingColumns.user_columns
                        : Object.keys(mappingColumns.user_columns)
                                .map(function(key) {
                                  return mappingColumns.user_columns[key];
                                })) 
                        : [];
    return (
      <Form layout='vertical' hideRequiredMark className={className}>
        {contact_map.map(column =>
          <Form.Item
            className={s.row}
            {...formItemLayout}
            key={column}
            label={MAP_COLUMNS[column][intl.locale]}
          >
            {getFieldDecorator(column, {
              rules: [
                {required: REQUIRED_FIELDS.includes(column), message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select
                allowClear
                placeholder={intl.formatMessage(messages.notInFile)}
              >
                {dataSrc.map(item =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        )}
        <h4 className={isRequireAddress? s.requirAddress :s.norequirAddress}>{intl.formatMessage(messages.requireadres)}</h4>
        <h1 className={s.header}>{intl.formatMessage(messages.homeAddress)}</h1>
        {address_map.map(column =>
          <Form.Item
            className={s.row}
            {...formItemLayout}
            key={column}
            label={MAP_COLUMNS[column][intl.locale]}
          >
            {getFieldDecorator('home_'+column, {
              rules: [
                {required: false, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select
                allowClear
                placeholder={intl.formatMessage(messages.notInFile)}
              >
                {dataSrc.map(item =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        )}
        <h1 className={s.header}>{intl.formatMessage(messages.companyAddress)}</h1>
        <Form.Item
            className={s.row}
            {...formItemLayout}
            label={intl.formatMessage(messages.companyname)}
          >
          {getFieldDecorator('company', {
            rules: [
              {required: false, message: intl.formatMessage(formMessages.required)},
            ],
          })(
            <Select
              allowClear
              placeholder={intl.formatMessage(messages.notInFile)}
            >
              {dataSrc.map(item =>
                <Select.Option key={item}>{item}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        {address_map.map(column =>
          <Form.Item
            className={s.row}
            {...formItemLayout}
            key={column}
            label={MAP_COLUMNS[column][intl.locale]}
          >
            {getFieldDecorator('office_'+column, {
              rules: [
                {required: false, message: intl.formatMessage(formMessages.required)},
              ],
            })(
              <Select
                allowClear
                placeholder={intl.formatMessage(messages.notInFile)}
              >
                {dataSrc.map(item =>
                  <Select.Option key={item}>{item}</Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        )}
      </Form>
    )
  }
}

const mapState = state => ({
  mappingColumns: state.contacts.mappingColumns,
})

const mapDispatch = {
}

export default Form.create()(injectIntl(connect(mapState, mapDispatch)(withStyles(s)(ColumnsMappingForm))))
