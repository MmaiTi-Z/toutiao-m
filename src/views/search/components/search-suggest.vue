<template>
  <div class="search-suggest">
    <van-cell icon="search" v-for="(text, index) in suggest" :key="index" @click="$emit('search', text)">
      <div slot="title" v-html="heightlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggest } from '@/api/search'
import { debounce } from 'lodash'
export default {
    name: 'SearchSuggest',
    data () {
      return {
        // 联想建议数据列表
        suggest: []
      }
    },
    props: {
      searchText: {
        type: String,
        required: true
      }
    },
    methods: {
      async loadSearchSuggest (q) {
        try {
          const { data } = await getSearchSuggest(q)
          this.suggest = data.data.options
        } catch (err) {
          this.$toast('获取数据失败，请稍后重试')
        }
      },
      heightlight (text) {
        const heightlightStr = `<span class="active">${this.searchText}</span>`
        // 正则表达式// 中间的内容都会当作匹配字符来使用，而不是数据变量
        // 如果需要一个动态的数据变量，则手动 new RegExp
        // RegExp 正则表达式构造函数
        //    参数一：匹配模式字符串，他会根据字符串创建正则表达式
        //    参数二：匹配模式，要写到字符串中，'gi' g表示全局匹配，i表示忽略大小写
        const reg = new RegExp(this.searchText, 'gi')
        return text.replace(reg, heightlightStr)
      }
    },
    watch: {
      searchText: {
        // 监视searchText, 当发生改变时就会调用handler函数
        // handler函数名称是语法固定的
        handler: debounce(
          function (value) {
          this.loadSearchSuggest(value)
        }, 200),
        // 让handler函数在监听开始之后被立即调用
        immediate: true
      }
    }
}
</script>

<style lang="less" scoped>
.search-suggest{
  /deep/ span.active{
    color: #3296fa;
  }
}
</style>
