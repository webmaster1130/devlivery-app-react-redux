import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import has from 'lodash/has'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_GIFTS_REQUEST = 'Gifts.GET_GIFTS_REQUEST'
export const GET_GIFTS_SUCCESS = 'Gifts.GET_GIFTS_SUCCESS'
export const GET_GIFTS_FAILURE = 'Gifts.GET_GIFTS_FAILURE'

export const CLEAR_FILTERS = 'Gifts.CLEAR_FILTERS'
export const CLEAR = 'Gifts.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getGifts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_GIFTS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {page, pageSize, search, giftType} = getState().gifts
  return fetch(`/gifts?${qs.stringify({
    filters: JSON.stringify({
      ...search ? {
        title: search,
      } : {},
      ...giftType ? {
        type: giftType,
      } : {},
    }),
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_GIFTS_SUCCESS, res}),
    failure: () => dispatch({type: GET_GIFTS_FAILURE}),
  })
}

export const clearFilters = () => (dispatch, getState) => {
  dispatch({type: CLEAR_FILTERS})
  dispatch(getGifts())
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    gifts: false,
  },
  gifts: [],
  giftsCount: 0,
  page: 1,
  pageSize: 15,
  search: undefined,
  giftType: undefined,
}

export default createReducer(initialState, {
  [GET_GIFTS_REQUEST]: (state, {params}) => ({
    page: params.pagination ? params.pagination.current : 1,
    search: has(params, 'search') ? params.search : state.search,
    giftType: has(params, 'giftType') ? params.giftType : state.giftType,
    loading: {
      ...state.loading,
      gifts: true,
    },
  }),
  [GET_GIFTS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    gifts: data,
    giftsCount: total,
    loading: {
      ...state.loading,
      gifts: false,
    },
  }),
  [GET_GIFTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      gifts: false,
    },
  }),
  [CLEAR_FILTERS]: (state, action) => ({
    giftType: undefined,
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
