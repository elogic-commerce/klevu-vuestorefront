import { Search } from '@vue-storefront/core/modules/catalog/components/Search'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import RootState from '@vue-storefront/core/types/RootState'
import { mapGetters, mapState } from 'vuex'

export const KlevuSearch = {
  name: 'KlevuSearchPanel',
  mixins: [onEscapePress],
  computed: {
    ...mapGetters('klevu', ['products', 'pages', 'suggestions', 'categories', 'emptyResults', 'searchString', 'loading']),
    ...mapState({
      isOpen: (state: RootState) => state.ui.searchpanel
    }),
    search: {
      get () {
        return this.searchString
      },
      set (value: string) {
        this.setSearch(value)
      }
    }
  },
  watch: {
    '$route.path': function () {
      this.closeSearchpanel()
    }
  },
  methods: {
    setSearch (value: string) {
      this.$store.dispatch('klevu/search', value)
    },
    onEscapePress () {
      this.closeSearchpanel()
    },
    closeSearchpanel () {
      this.$store.commit('ui/setSidebar', false)
      this.$store.commit('ui/setMicrocart', false)
      this.$store.commit('ui/setSearchpanel', false)
    },

    seeMore () {
    },
    makeSearch () {
      // noop
    }
  }
}
