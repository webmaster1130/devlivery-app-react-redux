import React from 'react'
import {Select, Row, Col, Input, Button} from 'antd'
import {getRole} from '../../reducers/permissions'
import {addBudget, reduceAmountBudget, addAmountBudget, deleteBudget, updateTeamMemberRole} from '../../reducers/team'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './TeamExpandedRow.css'

class TeamExpandedRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      picked: [],
      budget: this.props.record.budget ? this.props.record.budget.budget : '',
      amountAdd: '',
      amountReduce: '',
    }
  }
  componentWillReceiveProps(nextprops){
    if(!this.state.load && nextprops.record)
      this.setState({
        load:true,
        picked:nextprops.record.groups ? nextprops.record.groups.map(item=>item.id+"") :[]
      })
  }
  componentDidMount() {
    this.props.getRole()
  }

  selectChange = (value) => {
    this.setState({picked: value})
    this.props.updateTeamMemberRole(this.props.record.id ,value)
  }

  budgetInput = (e) => {
    this.setState({budget: e.target.value})
  }

  addAmountInput = (e) => {
    this.setState({amountAdd: e.target.value})
  }

  reduceAmountInput = (e) => {
    this.setState({amountReduce: e.target.value})
  }

  deleteBudgetHendler = (id) => {
    this.props.deleteBudget(id)
    this.setState({budget: ''})
  }

  addAmountBudgetHandler = (id, amount) => {
    this.props.addAmountBudget(id, amount)
    this.setState({amountAdd: ''})
  }

  reduceAmountBudgetHandler = (id, amount) => {
    this.props.reduceAmountBudget(id, amount)
    this.setState({amountReduce: ''})
  }

  render() {
    const {record, roles, addBudget} = this.props
    return (
      <Row className={s.container}>
        <Col md={12} className={s.column}>
          <div className={s.leftInputRow}>
            <Select
              //mode='multiple'
              placeholder='Select groups'
              style={{width: '100%'}}
              onChange={this.selectChange}
              value={this.state.picked}
            >
              {roles && roles.map((role) =>
                <Select.Option className={s.multiple} key={role.id} title={role.name}>
                  {role.name}
                  </Select.Option>)}
            </Select>
          </div>
          {!record.budget && <div className={s.leftInputRow}>
            <Input
              className={s.amountInput}
              onChange={this.budgetInput}
              value={this.state.budget}
              type='text'
              placeholder='budget'
            />
            <Button
              onClick={() => addBudget(record.id, this.state.budget)}
              type='primary'
            >
              Add budget
            </Button>
          </div>}
        </Col>
        <Col md={12} className={s.column}>
          {record.budget &&
          <React.Fragment>
            <div className={s.leftInputRow}>
              <Input
                className={s.amountInput}
                onChange={this.addAmountInput}
                value={this.state.amountAdd}
                type='text'
                placeholder='Add amount'
              />
              <Button
                onClick={() => this.addAmountBudgetHandler(record.budget.id, this.state.amountAdd)}
                type='primary'
              >
                Add amount
              </Button>
            </div>
            <div className={s.leftInputRow}>
              <Input
                className={s.amountInput}
                onChange={this.reduceAmountInput}
                type='text'
                placeholder='Reduce amount'
              />
              <Button
                value={this.state.amountReduce}
                onClick={() => this.reduceAmountBudgetHandler(record.budget.id, this.state.amountReduce)}
                type='primary'
              >
                Reduce amount
              </Button>
            </div>
            <Button
              onClick={() => this.deleteBudgetHendler(record.budget.id)}
              type='primary'
              ghost
            >
              Delete budget
            </Button>
          </React.Fragment>}
        </Col>
      </Row>
    )
  }
}

const mapState = state => ({
  roles: state.permission.groups,
})

const mapDispatch = {
  addBudget,
  updateTeamMemberRole,
  addAmountBudget,
  reduceAmountBudget,
  deleteBudget,
  getRole,
}

export default connect(mapState, mapDispatch)(withStyles(s)(TeamExpandedRow))
