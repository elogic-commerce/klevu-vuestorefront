import { KlevuState } from '../types/State'

export const state: KlevuState = {
  settings: {
    limit: 10000,
    typeOfRecords: ['KLEVU_PRODUCT'],
    fields: ['id', 'name', 'salePrice', 'listCategory', 'shortDesc', 'startPrice', 'currency', 'category', 'image', 'swatchesInfo', 'inStock', 'typeOfRecord', 'brand', 'klevu_manual_boosting', 'klevu_bulk_boosting', 'klevu_selflearning_boosting', 'sku', 'url'],
    sort: 'RELEVANCE'
  },
  recordQueries: {
    id: 'productSearch',
    typeOfRequest: 'SEARCH'
  },
  suggestionSetting: {
    id: 'autocompleteQuery',
    typeOfQuery: 'AUTO_SUGGESTIONS',
    limit: 5
  },
  suggestions: [],
  searchString: '',
  products: [],
  categories: [],
  pages: [],
  loading: false
}
