<template>
  <div class="search-container">
     <!-- 搜索栏 -->
    <form class="search-form" action="/">
        <van-search
            v-model="searchText"
            show-action
            placeholder="请输入搜索关键词"
            background="#3296fa"
            @search="onSearch"
            @cancel="onCancel"
            @focus="isResultShow = false"
        />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText"/>
    <!-- 联想建议 -->
    <search-suggest v-else-if="searchText" :search-text="searchText" @search="onSearch"/>
    <!-- 历史记录 -->
    <search-history v-else :search-histories="searchHistories" @clear-search-histories="searchHistories = []" @search="onSearch"/>
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggest from './components/search-suggest'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
    name: 'SearchIndex',
    data () {
        return {
            searchText: '',
            // 控制搜索结果的展示
            isResultShow: false,
            // 搜索的历史数据
            searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
        }
    },
     methods: {
        onSearch (val) {
            // 跟新文本框内容
            this.searchText = val
            // 存储历史记录
            // 要求：不能有重复历史记录，最新的排在最前面
            const index = this.searchHistories.indexOf(val)
            if (index !== -1) {
                this.searchHistories.splice(index, 1)
            }
            this.searchHistories.unshift(val)
            // 渲染搜索结果
            this.isResultShow = true
        },
        onCancel () {
            this.$router.back()
        }
    },
    components: {
        SearchHistory,
        SearchSuggest,
        SearchResult
    },
    watch: {
        searchHistories (value) {
            setItem('TOUTIAO_SEARCH_HISTORIES', value)
        }
    }
}
</script>

<style lang="less" scoped>
.search-container{
    padding-top: 108px;
    .van-search__action{
        color: #ffffff;
    }
    .search-form{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}
</style>
