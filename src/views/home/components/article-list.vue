<template>
    <div class="article-list">
        <van-pull-refresh v-model="isreFreshLoading" :success-text="refreshSuccessText" :success-duration="1500" @refresh="onRefresh">
            <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad">
                <article-item
                v-for="(article, index) in list" :key="index" :article="article"></article-item>
                <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
    name: 'ArticleList',
    data () {
        return {
            // 存储列表数据的数组
            list: [],
            // 控制加载中loading效果
            loading: false,
            // 控制数据加载结束的效果
            finished: false,
            // 请求获取下一页数据时间戳
            timestamp: null,
            // 控制列表失败提示状态
            error: false,
            // 控制下拉刷刷新的loading状态
            isreFreshLoading: false,
            // 下拉刷新成功提示文本
            refreshSuccessText: '刷新成功'
        }
    },
     methods: {
        async onLoad () {
            try {
                // 异步更新数据
                // 1.请求数据
                const { data } = await getArticles({
                    channel_id: this.channel.id,
                    timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳, 简单理解就是请求数据的页码
                    // 请求第一页数据，date.now()获取当前事件戳
                    with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
                })
                // 2.把请求结果放到list数组中
                const { results } = data.data
                // ...数组的展开操作符, 他会把数组元素一个一个拿出来
                this.list.push(...results)
                // 3.本次数据加载结束之后要把加载状态设为false
                this.loading = false
                // 4.判断数据是否全部加载完成
                if (results.length) {
                    // 更新获取下一页的事件戳
                    this.timestamp = data.data.pre_timestamp
                } else {
                    // 没有数据将finished设置为true
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                this.loading = false
            }
        },
        // 下来刷新时触发的函数
        async onRefresh () {
            try {
                 // 请求获取数据
                 const { data } = await getArticles({
                    channel_id: this.channel.id,
                    timestamp: Date.now(), // 下拉刷新每次请求最新数据，所以发送Date.now()就可以
                    // 请求第一页数据，date.now()获取当前事件戳
                    with_top: 1
                })
                 // 将数据追加到列表的顶部
                 const { results } = data.data
                 this.list.unshift(...results)
                 // 关闭下拉刷新的loading状态
                 this.isreFreshLoading = false
                 // 刷新成功提示
                 this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
            } catch (err) {
                 this.refreshSuccessText = '刷新失败'
                 this.isreFreshLoading = false
            }
        }
     },
    props: {
        channel: {
            type: Object,
            required: true
        }
    },
    components: {
        ArticleItem
    }
}
</script>

<style lang="less" scoped>
.article-list{
    height: 79vh;
    overflow-y: auto;
}
</style>
