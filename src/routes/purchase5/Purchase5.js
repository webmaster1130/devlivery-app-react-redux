import React from 'react'
import {connect} from 'react-redux'
import {getCards, nextFlowStep, setCard} from '../../reducers/purchase'
import {Button, Col, Layout, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase5.css'
import {Card, Header, PurchaseActions, SectionHeader, Preview, CardDetails} from '../../components'
import cn from 'classnames'
import messages from './messages'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {CARD_IMAGES_PROP} from '../../constants'
import { triggerResizeEvent } from '../../utils';

// TODO remove no cards label
class Purchase5 extends React.Component {
  state = {
    previewCollapsed: false,
    showCardDetails: false
  }

  onPreviewCollapse = (previewCollapsed) => {
    triggerResizeEvent();
    this.setState({previewCollapsed})
  }

  render() {
    const {previewCollapsed} = this.state
    const {occasions,cards, card, setCard, nextFlowStep, intl, flowIndex, loading, getCards, cardColors, cardColor} = this.props
    
    var occasionByCardId = null;
    if (card && occasions)
      occasionByCardId = occasions.filter(item => item.id === card.occasion_id);

    return (
      <React.Fragment>
        <div className={s.container}>
          {previewCollapsed && (
            <Button
              type='primary'
              className={s.previewBtn}
              onClick={() => this.onPreviewCollapse(false)}
            >
              {intl.formatMessage(messages.preview)}
            </Button>
          )}
          <Layout.Content className={cn(s.contentWrapper, card && !previewCollapsed && s.withPreview)}>
            <Header className={s.layoutHeader}/>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
                className={s.header}
                prefixClassName={s.headerPrefix}
              >
                <Select
                  className={s.color}
                  allowClear
                  placeholder={intl.formatMessage(messages.color)}
                  onChange={(cardColor) => getCards({cardColor})}
                  value={cardColor}
                  defaultValue={cardColor}
                >
                  {cardColors.map(item =>
                    <Select.Option key={item.title} value={item.title}>{item.title}</Select.Option>
                  )}
                </Select>
              </SectionHeader>
              {!!cards.length ? (
                <Row className={s.items} gutter={20} type='flex' align='center'>
                  {cards.map((item) =>
                    <Col key={item.id} className={s.itemWrapper} xs={8}>
                      <Card
                        item={item}
                        imagesProp={CARD_IMAGES_PROP}
                        title={
                          <React.Fragment>
                            
                            <span className={s.price}>
                              {item.title}
                            </span>
                          </React.Fragment>
                        }
                        bordered={false}
                        description={item.description}
                        onClick={() => {
                          this.onPreviewCollapse(false)
                          setCard(item)
                        }}
                        active={card && card.id === item.id}
                      />
                    </Col>
                  )}
                </Row>
              ) : !loading.cards ? (
                <div style={{textAlign: 'center'}}>{intl.formatMessage(messages.nocards)}</div>
              ) : null}
            </div>
          </Layout.Content>
          <Preview
            intl = {intl}
            onCollapse={this.onPreviewCollapse}
            collapsed={previewCollapsed}
            header={intl.formatMessage(messages.previewHeader)}
            item={card}
            imagesProp={['front_image','images']}
            onClickMagnifier= {()=>this.setState({showCardDetails:true})}
          />
        </div>
        <PurchaseActions>
          <KeyHandler
            keyEventName={KEYPRESS}
            keyCode={13}
            onKeyHandle={() => card && nextFlowStep()}
          />
          <Button
            type='primary'
            disabled={!card}
            onClick={() => nextFlowStep()}
          >
            {intl.formatMessage(messages.submit)}
          </Button>
        </PurchaseActions>
        {
          this.state.showCardDetails && card &&
          <CardDetails
            intl={intl}
            cardDetails={card}
            occasionTitle={occasionByCardId && occasionByCardId.length > 0 && occasionByCardId[0].title}
            visible={this.state.showCardDetails}
            setVisible={(visible)=>this.setState({showCardDetails:visible})}
            disableMakeOrder={true}
          />
        }
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  cards: state.purchase.cards,
  card: state.purchase.card,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
  cardColors: state.purchase.cardColors,
  cardColor: state.purchase.cardColor,
  occasions: state.purchase.occasions
})

const mapDispatch = {
  setCard,
  nextFlowStep,
  getCards,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase5))
