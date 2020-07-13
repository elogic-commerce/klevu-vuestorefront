<h1 align="center">Welcome to klevu-module 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/klevu-module" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/klevu-module.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> klevu module for vuestorefront

## Integrate klevu in your project
Clone this repository by instructions bellow.<br>
In <i><b>vue-storefront</b></i> directory: 
```sh
cd src/modules
```
```shell script
git clone https://gitlab.com/igornikolayev/klevu-vuestorefront.git 
```
```shell script
cd klevu-vuestorefront 
```
```shell script
npm install
```
## Add klevu-search to search panel
By default search component located in this path:
`vue-storefront/src/themes/default/components/core/blocks/SearchPanel/SearchPanel.vue` <br>
You should import installed klevu-module to this component in script area  
```shell script
import {KlevuSearch} from 'src/modules/klevu-vuestorefront/components/KlevuSearch'
```
Then need to add vue mixins:
````shell script
mixins: [KlevuSearch]
````  

Add for your search input <b>v-model</b>  attribute: 

```shell script
v-model="search"
```
##
##
## Analytics
##
## Analytic search term
If you want to send analytic of search term add this **method** to search component:
```shell script
 searchTermAnalytic () {
      const optionsAnalyticsSearch = {
        apiKey: config.klevu.ticket,
        term: this.search,
        klevu_totalResults: this.productList.length,
        klevu_typeOfQuery: 'WILDCARD_AND'
      }
      const urlAnalyticsSearch = `https://stats.klevu.com/analytics/n-search/search?${qs.stringify(optionsAnalyticsSearch)}`
      if (this.search.length > 0) {
        try {
          fetch(urlAnalyticsSearch,
            {
              method: 'POST'
            })
        } catch (e) {
          console.error('Klevu analytic search error:', e)
        }
      }
    }
```
This method must be call in **vue-watcher** for **search** like this:
```shell script
  watch: {
        search () {
          setTimeout(this.searchTermAnalytic, 1000)
      }
  }
```
## Product analytic (search page)
To send product analytic after clicking on product on search page add following **method** to search component:
```shell script
   async sendProductAnalytic (product) {
      const optionsAnalyticsProductSearch = {
        klevu_apiKey: config.klevu.ticket,
        klevu_keywords: this.search,
        klevu_type: 'clicked',
        klevu_productId: product.klevu.id,
        klevu_productName: product.klevu.name,
        klevu_productUrl: product.klevu.url
      }
      const urlAnalyticProductSearch = `https://stats.klevu.com/analytics/productTracking?${qs.stringify(optionsAnalyticsProductSearch)}`
      try {
        await fetch(urlAnalyticProductSearch,
          {
            method: 'POST'
          })
      } catch (e) {
        console.error('Klevu analytic product search error:', e)
      }
    }
``` 
_Call this method on product clicking_

## Category analytic
For sending analytic after clicking on categories need to add following **method** to category page:
```shell script
  sendCategoryAnalytics () {
      let categories
      let productIds
      if (this.getCategoryProducts.length > 0) {
        categories = this.$store.state.breadcrumbs.routes.map(item => item.name).concat(this.$store.state.breadcrumbs.current).join(';')
        productIds = this.getCategoryProducts.map(item => item.id).join(',')
      }
      const optionsAnalyticsCategory = {
        klevu_apiKey: config.klevu.ticket,
        klevu_categoryPath: categories,
        klevu_categoryName: this.getCurrentCategory.name,
        klevu_productIds: productIds,
        klevu_pageStartsFrom: 0
      }
      const urlAnalyticProductSearch = `https://stats.ksearchnet.com/analytics/categoryProductViewTracking?${qs.stringify(optionsAnalyticsCategory)}`
      try {
        fetch(urlAnalyticProductSearch,
          {
            method: 'POST'
          })
      } catch (e) {
        console.error('Klevu analytic product search error:', e)
      }
    }
```   
Add method to call method which was described before:
```shell script
  callAnalytic () {
      setTimeout(this.sendCategoryAnalytics, 1000)
    }
```
Call method `callAnalytic()` after mount of category page

## Product analytic (category page)
For sending analytic after clicking on products on category page add this method to productlist component:

```shell script
  async sendProductAnalytic (product, index) {
      const productCategoryAll = product.category.map(item => item.name)
      const productCategoryPath = productCategoryAll.join(';')
      const optionsAnalyticsProductSearch = {
        klevu_apiKey: config.klevu.ticket,
        klevu_categoryPath: productCategoryPath,
        klevu_categoryName: productCategoryAll[0],
        klevu_productId: product.id,
        klevu_productName: product.name,
        klevu_salePrice: product.price,
        klevu_productSku: product.sku,
        klevu_productUrl: config.backend.url + product.url_path,
        klevu_productPosition: index + 1
      }
      const urlAnalyticProductSearch = `https://stats.ksearchnet.com/analytics/categoryProductClickTracking?${qs.stringify(optionsAnalyticsProductSearch)}`
      try {
        await fetch(urlAnalyticProductSearch,
          {
            method: 'POST'
          })
      } catch (e) {
        console.error('Klevu analytic product search error:', e)
      }
    }
```
_Call this method on product clicking_
##
## Suggestion
##
Add suggestion block to template.  
```shell script
<ul class="suggest-box">
  <li class="suggest-box__item" @click="getSuggestToSearch($event)" v-for="(suggest, index) in suggestions" :key="index" v-html="suggest" />
</ul>
```
To put suggestion in input search add method:
```shell script
  getSuggestToSearch (event) {
      this.search = event.target.textContent
      this.showSuggestionBox = false
  }
``` 
##
##
## Filters


## Price range
Install vue slider for price range 
```shell script
$ yarn add vue-slider-component
``` 
Import slider to component:
```shell script
import VueSlider from 'vue-slider-component'
``` 
Initialize price filter in template:
```shell script
<vue-slider
  class="search-range__slider"
  ref="slider"
  :lazy="true"
  v-model="valuePriceRange"
  v-bind="optionsPriceRange"
/>
``` 
Add data for a price filter:
```shell script
data(){  
  return {
    valuePriceRange: [],
    optionsPriceRange: {
        dotSize: 20,
        width: '200px',
        height: 4,
        interval: 0.01,
        tooltip: 'always',
        tooltipPlacement: 'bottom',
        silent: true,
        clickable: false
    }
  }
}
```
Add methods for a price filter: 
```shell script
  priceRangeInit (product) {
      let priceList = product.map(valueList => {
        return valueList.price
      })
      this.valuePriceRange = []
      this.valuePriceRange[1] = Math.max(...priceList)
      this.valuePriceRange[0] = Math.min(...priceList)
      this.optionsPriceRange.max = Math.max(...priceList)
      this.optionsPriceRange.min = Math.min(...priceList)
  },
  resetPriceFilter () {
      let priceList
      priceList = this.products.map(valueList => {
        return valueList.price
      })
      if (this.selectedCategoryNames.length) {
        let priceListObject = this.products.filter(product => product.category.some(categoryItem => {
          const categoryName = categoryItem.name
          return this.selectedCategoryNames.includes(categoryName)
        }))
        priceList = priceListObject.map(item => item.price)
      }
      this.valuePriceRange = []
      this.valuePriceRange[1] = Math.max(...priceList)
      this.valuePriceRange[0] = Math.min(...priceList)
      this.optionsPriceRange.max = Math.max(...priceList)
      this.optionsPriceRange.min = Math.min(...priceList)
   }
```
Also, necessary to change **visibleProducts** computed property like this:
```shell script
  visibleProducts () {
      let priceProduct = []
      this.productList = this.products || []

      if (this.optionsPriceRange.min !== this.valuePriceRange[0] || this.optionsPriceRange.max !== this.valuePriceRange[1]) {
        priceProduct = this.productList.filter(product => {
          if (product.price <= this.valuePriceRange[1] && product.price >= this.valuePriceRange[0]) { return product }
        })
        this.productList = priceProduct
      }
      if (this.selectedCategoryNames.length) {
        return this.productList.filter(product => product.category.some(categoryItem => {
          const categoryName = categoryItem.name;
          return this.selectedCategoryNames.includes(categoryName)
        }))
      }
      return this.productList
  }
```
Then add **created** hook and **watchers** for _search()_ and _selectedCategoryNames ()_: 
```shell script
created () {
  this.priceRangeInit(this.visibleProducts)
}
watch: {
  search () {
    setTimeout(this.resetPriceFilter, 1000)
  } 
  selectedCategoryNames () {
    this.resetPriceFilter()
  }
}
```

## Sorting
There are 3 types of sorting: sort by relevance, sort by price(low to high) and sort by price(high to low).<br>

Template for sorting:
```shell script
 <select name="sort-order" @change="chooseSortOrder($event.target.value)">
      <option value="relevance">
        Relevance
      </option>
      <option value="priceLowToHigh">
        Price low to high
      </option>
      <option value="priceHighToLow">
        Price high to low
      </option>
</select>
```
Methods for sorting:
```shell script
sortRelevance () {
  this.$store.state.klevu.settings.sort = 'RELEVANCE'
  this.search = this.search
},
sortPriceLowToHigh () {
  this.$store.state.klevu.settings.sort = 'PRICE_ASC'
  this.search = this.search
},
sortPriceHighToLow () {
  this.$store.state.klevu.settings.sort = 'PRICE_DESC'
  this.search = this.search
},
chooseSortOrder (typeSort) {
  switch (typeSort) {
    case 'priceLowToHigh' :
      this.sortPriceLowToHigh()
      break
    case 'priceHighToLow' :
      this.sortPriceHighToLow()
      break
    case 'relevance' :
      this.sortRelevance()
      break
  }
}
```
## Showing product per page
Template:
```shell script
<select name="items-page" @change="chooseItemPage($event.target.value)">
  <option value="9">
    9
  </option>
  <option value="15">
    15
  </option>
  <option value="30">
    30
  </option>
</select>
```
Method: 
```shell script
chooseItemPage (itemsPage) {
  this.perPage = parseInt(itemsPage)
  this.currentPage = 1
}
```
Variable `perPage` is 9 by default:
```shell script
 data () {
    return {
      perPage: 9
    }
}
```
##
## Pagination
##
For pagination need to crate new component `SearchPagination` and import this component to search panel:
SearchPagination.vue: 
```shell script
<template>
  <div class="pagination cl-accent">
    <div class="pagination__left">
      <a href="#" v-if="hasPrev()" @click.prevent="changePage(prevPage)"> &larr; </a>
    </div>
    <div class="pagination__mid">
      <ul>
        <li v-if="hasFirst()">
          <a href="#" @click.prevent="changePage(1)">1</a>
        </li>
        <li v-if="hasFirst()">
          ...
        </li>
        <li v-for="(page, index) in pages" :key="index">
          <a href="#" @click.prevent="changePage(page)" :class="{ current: current == page }">
            {{ page }}
          </a>
        </li>
        <li v-if="hasLast()">
          ...
        </li>
        <li v-if="hasLast()">
          <a href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
        </li>
      </ul>
    </div>
    <div class="pagination__right">
      <a href="#" v-if="hasNext()" @click.prevent="changePage(nextPage)">&rarr;</a>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 9
    },
    pageRange: {
      type: Number,
      default: 1
    }
  },
  computed: {
    pages: function () {
      let pages = []

      for (let i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i)
      }

      return pages
    },
    rangeStart: function () {
      let start = this.current - this.pageRange

      return (start > 0) ? start : 1
    },
    rangeEnd: function () {
      let end = this.current + this.pageRange

      return (end < this.totalPages) ? end : this.totalPages
    },
    totalPages: function () {
      return Math.ceil(this.total / this.perPage)
    },
    nextPage: function () {
      return this.current + 1
    },
    prevPage: function () {
      return this.current - 1
    }
  },
  methods: {
    hasFirst: function () {
      return this.rangeStart !== 1
    },
    hasLast: function () {
      return this.rangeEnd < this.totalPages
    },
    hasPrev: function () {
      return this.current > 1
    },
    hasNext: function () {
      return this.current < this.totalPages
    },
    changePage: function (page) {
      this.$emit('page-changed', page)
    }
  }
}
</script>
<style lang="scss">
  .pagination {
    display: flex;
    justify-content: space-between;
  }

  .pagination a, .pagination span {
    display: block;
    text-align: center;
    font-weight: 300;
    font-size: 14px;
    height: 18px;
  }

  .pagination a {
    padding: 5px 5px;
    max-width: 40px;
    background-color: transparent;
    border-radius: 4px;
    border: 2px solid #333;
    text-decoration: none;
    margin: 0 6px 0 0;
    transition: all .2s ease-in-out;
  }

  .pagination a.current {
    background: #333;
    color: #fff;
  }

  .pagination__mid {
    display: flex;
    justify-content: center;
  }

  .pagination__mid ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pagination__mid li {
    display: inline-block;
  }
</style>

```
```shell script
 import Pagination from './SearchPagination'
```
Use pagination in the template:
```shell script
 <pagination
  v-if="visibleProducts.length>perPage"
  :current="currentPage"
  :total="visibleProducts.length"
  :per-page="perPage"
  @page-changed="showProductsOnPage"
  class="pagination"
/>
```  
Method: 
```shell script
showProductsOnPage (page) {
  this.currentPage = page
},
```
Also, need to change showing products with computed property and then output ProductsOnPage in productListing: 
```shell script
ProductsOnPage () {
  let currentPage = this.currentPage
  let perPage = this.perPage
  let startPoint = (currentPage - 1) * perPage
  let endPoint = startPoint + perPage
  return this.visibleProducts.slice(startPoint, endPoint)
}
``` 
Add watchers:
```shell script
  watch: {
    search () {
      this.showProductsOnPage()
    },
    selectedCategoryNames () {
      this.showProductsOnPage()
    },
    visibleProducts () {
      this.showProductsOnPage()
      this.currentPage = 1
    }
  }
```

## Bellow you can see all content of SearchPanel.vue:
```shell script
<template>
  <div
    class="searchpanel fixed mw-100 bg-cl-primary cl-accent"
    data-testid="searchPanel"
  >
    <div class="close-icon-row">
      <i
        class="material-icons pointer cl-accent close-icon"
        @click="closeSearchpanel"
        data-testid="closeSearchPanel"
      >
        close
      </i>
    </div>
    <div class="container">
      <div class="row" v-click-outside.prevent="showSuggestionOutFocus">
        <div class="col-md-12 end-xs">
          <label for="search" class="visually-hidden">
            {{ $t('Search') }}
          </label>
          <div class="search-input-group">
            <i class="material-icons search-icon">search</i>
            <input
              ref="search"
              id="search"
              v-model="search"
              @blur="$v.search.$touch()"
              class="search-panel-input"
              :placeholder="$t('Type what you are looking for...')"
              type="search"
              autocomplete="off"
              @focusin="showSuggestionInFocus()"
            >
          </div>
        </div>
        <ul class="suggest-box" v-if="showSuggestion && showSuggestionBox">
          <li class="suggest-box__item" @click="getSuggestToSearch($event)" v-for="(suggest, index) in suggestions" :key="index" v-html="suggest" />
        </ul>
      </div>
      <div class="search-amount" v-if="search.length>0">
        <h4> {{ visibleProducts.length }} products found for "{{ search }}" </h4>
        <button class="mobile p15 mobile-filters-button bg-cl-th-accent brdr-none cl-white h3 sans-serif fs-medium-small" @click="showMobileFilters = true">
          Filters
        </button>
        <div class="price-filter-label" v-if="filterLabel">
          <button @click="resetPriceFilter" class="button">
            X
          </button>
          <span>{{ valuePriceRange[0] }}</span> - <span>{{ valuePriceRange[1] }}</span>
        </div>
      </div>
      <!--desktop-filters -->
      <div class="filters-desktop desktop">
        <div v-if="products.length && categories.length > 0" class="categories search-categories">
          <category-panel :categories="categories" v-model="selectedCategoryNames" />
        </div>
        <div class="sort-wrap" v-if="products.length > 0 && search.length > 0">
          <div class="search-range mb20" v-if="(valuePriceRange[1] - valuePriceRange[0]) >= 1">
            <h4>Price range</h4>
            <vue-slider
              class="search-range__slider"
              ref="slider"
              :lazy="true"
              v-model="valuePriceRange"
              v-bind="optionsPriceRange"
            />
          </div>
          <div class="sort-order">
            <h4>Sort by</h4>
            <select name="sort-order" @change="chooseSortOrder($event.target.value)">
              <option value="relevance">
                Relevance
              </option>
              <option value="priceLowToHigh">
                Price low to high
              </option>
              <option value="priceHighToLow">
                Price high to low
              </option>
            </select>
          </div>
        </div>
      </div>
      <!-- mobile filters -->
      <div class="filters-mobile mobile" v-if="showMobileFilters">
        <div class="close-icon-row">
          <i
            class="material-icons pointer cl-accent close-icon"
            @click="showMobileFilters = false"
            data-testid="closeSearchPanel"
          >
            close
          </i>
        </div>
        <div class="search-amount" v-if="search.length>0">
          <h4> {{ visibleProducts.length }} products found for "{{ search }}" </h4>
          <div class="price-filter-label" v-if="filterLabel">
            <button @click="resetPriceFilter" class="button">
              X
            </button>
            <span>{{ valuePriceRange[0] }}</span> - <span>{{ valuePriceRange[1] }}</span>
          </div>
        </div>
        <div v-if="products.length && categories.length > 0" class="categories search-categories">
          <category-panel :categories="categories" v-model="selectedCategoryNames" />
        </div>
        <div class="sort-wrap" v-if="products.length > 0 && search.length > 0">
          <div class="search-range mb20" v-if="(valuePriceRange[1] - valuePriceRange[0]) >= 1">
            <h4>Price range</h4>
            <vue-slider
              class="search-range__slider"
              ref="slider"
              :lazy="true"
              v-model="valuePriceRange"
              v-bind="optionsPriceRange"
            />
          </div>
          <div class="sort-order">
            <h4>Sort by</h4>
            <select name="sort-order" @change="chooseSortOrder($event.target.value)">
              <option value="relevance">
                Relevance
              </option>
              <option value="priceLowToHigh">
                Price low to high
              </option>
              <option value="priceHighToLow">
                Price high to low
              </option>
            </select>
          </div>
        </div>
        <div class="sort-wrap wrap-sort-page" v-if="products.length > 0 && search.length > 0">
          <div class="sort-order">
            <h4 class="mt30 mb10">Items per page</h4>
            <select name="items-page" @change="chooseItemPage($event.target.value)">
              <option value="9">
                9
              </option>
              <option value="15">
                15
              </option>
              <option value="30">
                30
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="sort-wrap wrap-sort-page" v-if="products.length > 0 && search.length > 0">
        <div class="sort-order desktop">
          <h4 class="mt30 mb10">Items per page</h4>
          <select name="items-page" @change="chooseItemPage($event.target.value)">
            <option value="9">
              9
            </option>
            <option value="15">
              15
            </option>
            <option value="30">
              30
            </option>
          </select>
        </div>
        <pagination
          v-if="visibleProducts.length>perPage"
          :current="currentPage"
          :total="visibleProducts.length"
          :per-page="perPage"
          @page-changed="showProductsOnPage"
          class="pagination"
        />
      </div>
      <div class="product-listing row">
        <product-tile
          v-for="product in ProductsOnPage"
          :key="product.id"
          :product="product"
          @click.native="sendProductAnalytic(product)"
        />
        <transition name="fade">
          <div
            v-if="getNoResultsMessage"
            class="no-results relative center-xs h4 col-md-12"
          >
            {{ $t(getNoResultsMessage) }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import ProductTile from 'theme/components/core/ProductTile'
import VueOfflineMixin from 'vue-offline/mixin'
import CategoryPanel from 'theme/components/core/blocks/Category/CategoryPanel'
import {minLength} from 'vuelidate/lib/validators'
import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock'
import {KlevuSearch} from 'src/modules/klevu/components/KlevuSearch'
import qs from 'qs'
import VueSlider from 'vue-slider-component'
import Pagination from './SearchPagination'
import config from 'config'
export default {
  components: {
    ProductTile,
    CategoryPanel,
    VueSlider,
    Pagination
  },
  mixins: [KlevuSearch, VueOfflineMixin],
  validations: {
    search: {
      minLength: minLength(3)
    }
  },
  data () {
    return {
      productList: [],
      selectedCategoryNames: [],
      readMore: false,
      showSuggestionBox: true,
      valuePriceRange: [],
      optionsPriceRange: {
        dotSize: 20,
        width: '200px',
        height: 4,
        interval: 0.01,
        tooltip: 'always',
        tooltipPlacement: 'bottom',
        silent: true,
        clickable: false
      },
      perPage: 9,
      currentPage: 1,
      showMobileFilters: false
    }
  },
  methods: {
    showProductsOnPage (page) {
      this.currentPage = page
    },
    // get max and min prices from product's list
    priceRangeInit (product) {
      let priceList = product.map(valueList => {
        return valueList.price
      })
      this.valuePriceRange = []
      this.valuePriceRange[1] = Math.max(...priceList)
      this.valuePriceRange[0] = Math.min(...priceList)
      this.optionsPriceRange.max = Math.max(...priceList)
      this.optionsPriceRange.min = Math.min(...priceList)
    },
    resetPriceFilter () {
      let priceList
      priceList = this.products.map(valueList => {
        return valueList.price
      })
      if (this.selectedCategoryNames.length) {
        let priceListObject = this.products.filter(product => product.category.some(categoryItem => {
          const categoryName = categoryItem.name
          return this.selectedCategoryNames.includes(categoryName)
        }))
        priceList = priceListObject.map(item => item.price)
      }
      this.valuePriceRange = []
      this.valuePriceRange[1] = Math.max(...priceList)
      this.valuePriceRange[0] = Math.min(...priceList)
      this.optionsPriceRange.max = Math.max(...priceList)
      this.optionsPriceRange.min = Math.min(...priceList)
    },
    getSuggestToSearch (event) {
      this.search = event.target.textContent
      this.showSuggestionBox = false
    },
    showSuggestionOutFocus () {
      this.showSuggestionBox = false
    },
    showSuggestionInFocus () {
      this.showSuggestionBox = true
    },
    // klevu send product analytic request
    async sendProductAnalytic (product) {
      this.closeSearchpanel()
      const optionsAnalyticsProductSearch = {
        klevu_apiKey: config.klevu.ticket,
        klevu_keywords: this.search,
        klevu_type: 'clicked',
        klevu_productId: product.klevu.id,
        klevu_productName: product.klevu.name,
        klevu_productUrl: product.klevu.url
      }
      const urlAnalyticProductSearch = `https://stats.klevu.com/analytics/productTracking?${qs.stringify(optionsAnalyticsProductSearch)}`
      try {
        await fetch(urlAnalyticProductSearch,
          {
            method: 'POST'
          })
      } catch (e) {
        console.error('Klevu analytic product search error:', e)
      }
    },
    /*
      * klevu analytic search term
    */
    searchTermAnalytic () {
      const optionsAnalyticsSearch = {
        apiKey: config.klevu.ticket,
        term: this.search,
        klevu_totalResults: this.productList.length,
        klevu_typeOfQuery: 'WILDCARD_AND'
      }
      const urlAnalyticsSearch = `https://stats.klevu.com/analytics/n-search/search?${qs.stringify(optionsAnalyticsSearch)}`
      if (this.search.length > 0) {
        try {
          fetch(urlAnalyticsSearch,
            {
              method: 'POST'
            })
        } catch (e) {
          console.error('Klevu analytic search error:', e)
        }
      }
    },
    // sort order
    sortRelevance () {
      this.$store.state.klevu.settings.sort = 'RELEVANCE'
      this.search = this.search
    },
    sortPriceLowToHigh () {
      this.$store.state.klevu.settings.sort = 'PRICE_ASC'
      this.search = this.search
    },
    sortPriceHighToLow () {
      this.$store.state.klevu.settings.sort = 'PRICE_DESC'
      this.search = this.search
    },
    chooseSortOrder (typeSort) {
      switch (typeSort) {
        case 'priceLowToHigh' :
          this.sortPriceLowToHigh()
          break
        case 'priceHighToLow' :
          this.sortPriceHighToLow()
          break
        case 'relevance' :
          this.sortRelevance()
          break
      }
    },
    chooseItemPage (itemsPage) {
      this.perPage = parseInt(itemsPage)
      this.currentPage = 1
    }
  },
  computed: {
    ProductsOnPage () {
      let currentPage = this.currentPage
      let perPage = this.perPage
      let startPoint = (currentPage - 1) * perPage
      let endPoint = startPoint + perPage
      return this.visibleProducts.slice(startPoint, endPoint)
    },
    filterLabel () {
      if (this.optionsPriceRange.min !== this.valuePriceRange[0] || this.optionsPriceRange.max !== this.valuePriceRange[1]) {
        return true
      } else {
        return false
      }
    },
    categories () {
      const categories = this.products
        .filter(p => p.category)
        .map(p => p.category)
        .flat()
      const discinctCategoriesProduct = Array.from(
        new Set(categories.map(c => c.name))
      ).map(catName => categories.find(c => c.name === catName))
      return discinctCategoriesProduct
    },
    visibleProducts () {
      let priceProduct = []
      this.productList = this.products || []

      if (this.optionsPriceRange.min !== this.valuePriceRange[0] || this.optionsPriceRange.max !== this.valuePriceRange[1]) {
        priceProduct = this.productList.filter(product => {
          if (product.price <= this.valuePriceRange[1] && product.price >= this.valuePriceRange[0]) { return product }
        })
        this.productList = priceProduct
      }
      if (this.selectedCategoryNames.length) {
        return this.productList.filter(product => product.category.some(categoryItem => {
          const categoryName = categoryItem.name;
          return this.selectedCategoryNames.includes(categoryName)
        }))
      }
      return this.productList
    },
    getNoResultsMessage () {
      let msg = ''
      if (this.emptyResults) {
        msg = 'No results were found.'
      }
      return msg
    },
    showSuggestion () {
      if (this.suggestions.length > 0) {
        return true
      }
    }
  },
  watch: {
    search () {
      setTimeout(this.resetPriceFilter, 1000)
      setTimeout(this.searchTermAnalytic, 1000)
      this.selectedCategoryNames = []
      this.showProductsOnPage()
    },
    selectedCategoryNames () {
      this.resetPriceFilter()
      this.showProductsOnPage()
    },
    visibleProducts () {
      this.showProductsOnPage()
      this.currentPage = 1
    }
  },
  created () {
    this.priceRangeInit(this.visibleProducts)
  },
  mounted () {
    // add autofocus to search input field
    this.$refs.search.focus()
    disableBodyScroll(this.$el)
  },
  destroyed () {
    clearAllBodyScrollLocks()
  },
  directives: {
    clickOutside: {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event)
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  @import "~theme/css/animations/transitions";
  @import "~theme/css/variables/grid";
  @import "~theme/css/variables/typography";
  .mobile{
    @media(min-width: 768px){
      display: none;
    }
  }
  .filters-mobile{
    position: fixed;
    background-color: #FFF;
    z-index: 5;
    padding: 0 40px;
    overflow-y: scroll;
    min-height: 100vh;
    top: 0;
    bottom: 0;
    .close-button{
      position: absolute;
      top: 25px;
      right: 25px;
      background: none;
      border: none;
      width: unset;
      font-size: 18px;
    }
    .wrap-sort-page{
      margin-bottom: 100px;
    }
  }
  .desktop{
    @media(max-width: 767px){
      display: none;
    }
  }
  /deep/ .vue-slider-dot-tooltip{
    visibility: visible;
  }
  .sort-wrap{
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    font-size: 18px;
    .sort-order {
      select {
        font-size: 16px;
        background: none;
        border: 2px solid #333;
        padding: 0 15px;
        min-width: 100px;
      }
    }
    @media (max-width: 767px){
      flex-wrap: wrap;
    }
  }
  .wrap-sort-page{
    .sort-order {
      select {
        padding: 0 5px;
        height: 35px;
      }
    }
    @media (max-width: 767px){
      flex-direction: column;
      align-items: flex-start;
      select{
        margin-bottom: 30px;
      }
    }
  }
  .pagination{
    @media (max-width: 767px) {
      margin-top: 30px;
    }
  }
  .search-amount{
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 767px){
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .price-filter-label{
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid #333;
    padding: 10px 20px;

    span{
      padding-right: 5px;
      padding-left: 5px;
    }
    button{
      background: none;
      border: none;
      margin-bottom: 0 !important;
      margin-right: 10px;
    }
  }
  .suggest-box{
    position: absolute;
    top: 105px;
    background: #fff;
    padding: 20px;
    min-width: 600px;
    z-index: 5;
    list-style: none;
    letter-spacing: 0.5px;
    box-shadow: 0 10px 10px rgba(0,0,0,0.5);

    @media (min-width: 768px) {
      left: 60px;
    }
    @media (max-width: 995px) {
      min-width: 75%;
    }
    @media (max-width: 767px) {
      min-width: 70%;
    }
    @media (max-width: 600px) {
      min-width: 75%;
    }
    &__item{
      margin-bottom: 5px;
      cursor: pointer
    }
  }
  .searchpanel {
    height: 100vh;
    width: 800px;
    top: 0;
    right: 0;
    z-index: 3;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    .close-icon-row {
      display: flex;
      justify-content: flex-end;
    }

    .container {
      padding-left: 40px;
      padding-right: 40px;

      @media #{$media-xs} {
        padding-left: 30px;
        padding-right: 30px;
      }
    }

    .row {
      margin-left: - map-get($grid-gutter-widths, lg) / 2;
      margin-right: - map-get($grid-gutter-widths, lg) / 2;

      @media #{$media-xs} {
        margin-right: - map-get($grid-gutter-widths, xs) / 2;
        margin-left: - map-get($grid-gutter-widths, xs) / 2;
      }
    }

    .col-md-12 {
      padding-left: map-get($grid-gutter-widths, lg) / 2;
      padding-right: map-get($grid-gutter-widths, lg) / 2;

      @media #{$media-xs} {
        padding-left: map-get($grid-gutter-widths, xs) / 2;
        padding-right: map-get($grid-gutter-widths, xs) / 2;
      }
    }

    .product-listing {
      padding-top: 30px;
    }

    .product {
      box-sizing: border-box;
      width: 50%;
      padding-left: map-get($grid-gutter-widths, lg) / 2;
      padding-right: map-get($grid-gutter-widths, lg) / 2;

      @media #{$media-xs} {
        width: 100%;
        padding-left: map-get($grid-gutter-widths, xs) / 2;
        padding-right: map-get($grid-gutter-widths, xs) / 2;
      }
    }

    .close-icon {
      padding: 18px 8px;
    }

    .search-input-group {
      display: flex;
      border-bottom: 1px solid #bdbdbd;
    }

    .search-icon {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-panel-input {
      width: 100%;
      height: 60px;
      padding-bottom: 0;
      padding-top: 0;
      border: none;
      outline: 0;
      font-size: 18px;
      font-family: map-get($font-families, secondary);

      @media #{$media-xs} {
        font-size: 16px;
      }
    }

    .no-results {
      top: 80px;
      width: 100%;
    }

    i {
      opacity: 0.6;
    }

    i:hover {
      opacity: 1;
    }

    .close-button {
      background: #fff;
    }

    button {
      @media #{$media-xs} {
        width: 100%;
        margin-bottom: 15px;
      }
    }
  }
</style>

``` 
## Author

👤 **Igor Nikolayev <igor.nikolayev@elogic.com.ua>**

************
## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/elogic-commerce/klevu-vuestorefront/issues). You can also take a look at the [contributing guide](https://github.com/elogic-commerce/klevu-vuestorefront/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

