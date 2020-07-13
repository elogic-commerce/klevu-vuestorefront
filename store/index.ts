import { Module } from 'vuex'
import store from '@vue-storefront/core/store'
import RootState from '@vue-storefront/core/types/RootState'
import { isServer } from '@vue-storefront/core/helpers'
import { state } from './state'
import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

export const module: Module<any, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
