import React from 'react'
import {AppLayout} from '../../components'
import Login from './Verify'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({params, query, store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['login'],
    title: intl.formatMessage(messages.title),
    component: (
      <AppLayout>
        <Login redirectUrl={query.next} intl={intl} token={params.token}/>
      </AppLayout>
    ),
  }
}

export default action
