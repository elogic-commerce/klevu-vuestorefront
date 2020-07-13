import { KlevuState } from '../types/State'
import { GetterTree } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import config from 'config'

export const getters: GetterTree<KlevuState, any> = {
  products: (state: KlevuState) => state.products,
  categories: (state: KlevuState) => state.categories,
  pages: (state: KlevuState) => state.pages,
  searchString: (state: KlevuState) => state.searchString,
  loading: (state: KlevuState) => state.loading,
  suggestions: (state: KlevuState) => state.suggestions,
  emptyResults: (state: KlevuState) => state.searchString.length > 0 && state.products.length < 1 && !state.loading,
  options: (state: KlevuState) => {
    const {storeCode} = currentStoreView()
    const {ticket, cloudSearchHostURL} = storeCode && config.klevu.storeViews[storeCode]
      ? config.klevu.storeViews[storeCode]
      : config.klevu
    return {
      ticket, cloudSearchHostURL
    }
  }
}
