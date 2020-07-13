import { KlevuState, KlevuSettings } from '../types/State'
import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import qs from 'qs'
export const actions: ActionTree<KlevuState, RootState> = {
  async search ({ commit, state, getters }, string: string) {
    commit('search', string)
    if (string.length === 0) {
      commit('setLoading', false)
      return
    }
    const {ticket, cloudSearchHostURL} = getters.options
    /*
    * parameters for request (request payload)
    */
    const options = {
      context: {
        apiKeys: [ticket]
      },
      suggestions: [{
        query: state.searchString,
        ...state.suggestionSetting
      }],
      recordQueries: [{
        ...state.recordQueries,
        settings: {
          query: {
            term: state.searchString
          },
          ...state.settings
        }
      }]
    }
    // Filter unused keys
    Object.keys(options).forEach(key => options[key] === undefined && delete options[key])
    /*
    * API 2 version
    */
    /*
    * search klevu API 2
    */
    const urlSearch = `https://${cloudSearchHostURL}/cs/v2/search`
    try {
      const result = await fetch(urlSearch,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(options)
        })
      const json = await result.json()
      commit('results', json)
      return json
    } catch (e) {
      console.error('Klevu search error:', e)
    }
  }
}
