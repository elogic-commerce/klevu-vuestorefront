import { MutationTree } from 'vuex'
import { KlevuSettings, KlevuState } from '../types/State'

const stripDomain = (item) => ({
  ...item,
  url: item.url.replace(/^.*\/\/[^\/]+/, '')
})

export const mutations: MutationTree<KlevuState> = {
  results (state: KlevuState, json: any = {}) {
    const filters = ['categories', 'pages']
    state.products = json.queryResults[0].records
      .filter(({category}) => !filters.includes(category))
      .map((product: any) => {
        const sku = product.sku.split(';').reverse()[0];
        const category = product.category.split(';;').map((item) => {
          return {name: item};
        });
        return {
          id: sku,
          sku,
          url_path: product.url.split('/').reverse()[0],
          name: product.name,
          price_incl_tax: product.startPrice,
          price: product.salePrice,
          final_price: product.salePrice,
          image: product.imageUrl.split(/klevu_images\/\d+X\d+/)[1],
          category: category,
          originalProduct: {
            id: product.id
          },
          klevu: product
        }
      })
    state.loading = false
    state.suggestions = json.suggestionResults[0].suggestions.map(suggestion => suggestion.suggest)
  },
  settings (state: KlevuState, settings: Partial<KlevuSettings>) {
    state.settings = {
      ...state.settings,
      ...settings
    }
  },
  search (state: KlevuState, searchString: string) {
    if (searchString.length === 0) {
      state.categories = []
      state.pages = []
      state.products = []
      state.suggestions = []
    }
    state.loading = true
    state.searchString = searchString
  },
  setLoading (state: KlevuState, loading: boolean) {
    state.loading = loading
  }
}
