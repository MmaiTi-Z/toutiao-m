<template>
    <div class="home-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" fixed>
            <van-button slot="title" type="info" size="small" round icon="search" class="search-btn" to="/search">搜索</van-button>
        </van-nav-bar>
        <!-- 频道列表 -->
        <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
        <van-tabs class="channel-tabs" v-model="active" animated swipeable>
            <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
                <!-- 文章列表 -->
                <article-list :channel="channel"></article-list>
            </van-tab>
            <div slot="nav-right" class="placeholder"></div>
            <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
                <i class="toutiao toutiao-gengduo"></i>
            </div>
        </van-tabs>
        <!-- 弹出层 -->
        <van-popup
        v-model="isChannelEditShow"
        closeable
        position="bottom"
        close-icon-position="top-left"
        :style="{ height: '90%' }">
            <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive"></channel-edit>
        </van-popup>
    </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
    name: 'HomeIndex',
    data () {
        return {
            active: 0,
            channels: [], // 频道列表数据
            isChannelEditShow: false // 控制弹出层是否弹出
        }
    },
    created () {
        this.loadChannels()
    },
    methods: {
        async loadChannels () {
            try {
                // const { data } = await getUserChannels()
                // this.channels = data.data.channels
                let channels = []
                if (this.user) {
                    const { data } = await getUserChannels()
                    channels = data.data.channels
                } else {
                    // 未登录，判断是否有本地存储
                    const localChannels = getItem('TOUTIAO_CHANNELS')
                    if (localChannels) {
                        // 有本地存储
                        channels = localChannels
                    } else {
                        // 没有本地存储
                        const { data } = await getUserChannels()
                        channels = data.data.channels
                    }
                }
                this.channels = channels
            } catch (err) {
                this.$toast('获取频道数据失败')
            }
        },
        onUpdateActive (index, isChannelEditShow = true) {
            this.active = index
            this.isChannelEditShow = isChannelEditShow
        }
    },
    components: {
        ArticleList,
        ChannelEdit,
        ...mapState(['user'])
    }
}
</script>

<style lang="less" scoped>
.home-container {
    padding-bottom: 100px;
    padding-top: 174px;
    .search-btn {
        width: 555px;
        height: 64px;
        background-color: #5babfb;
        border: none;
        font-size: 28px;
    }
    .van-icon{
        font-size: 32px;
    }
/deep/ .channel-tabs{
        .van-tabs__wrap{
            position: fixed;
            top: 92px;
            z-index: 1;
            left: 0 ;
            right: 0;
            height: 82px;
        }
        .van-tab{
            min-width: 200px;
            border-right: 1px solid #edeff3;
            font-size: 30px;
            color: #777;
        }
        .van-tab--active{
            color: #333;
        }
        .van-tabs__nav{
            padding-bottom: 0;
        }
        .van-tabs__line{
            width: 31px !important;
            height: 6px;
            background-color: #3296fa;
            bottom: 8px;
        }
        .hamburger-btn{
            position: fixed;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 66px;
            height: 82px;
            background-color: #fff;
            opacity: 0.902;
            i.toutiao{
                font-size: 33px;
            }
            &:before{
                content: "";
                position: absolute;
                left: 0;
                width: 1px;
                height: 100%;
                background-image: url(~@/assets/gradient-gray-line.png);
                background-size: contain;
            }
        }
        .placeholder{
            width: 66px;
            height: 82px;
            // 该元素不参与flex剩余空间计算
            flex-shrink: 0;
        }
    }
}
</style>
