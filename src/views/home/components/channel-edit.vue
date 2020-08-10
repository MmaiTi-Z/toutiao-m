<template>
    <div class="channel-edit">
        <!-- 我的频道 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">我的频道</div>
            <van-button class="edit-btn" type="danger" plain round size="mini" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10" class="my-grid">
            <van-grid-item class="grid-item" v-for="(channel, index) in myChannels" :key="index" @click="onMychannelClick(channel, index)">
                <van-icon slot="icon" name="clear" v-show="isEdit && !fiexdChannels.includes(channel.id)"></van-icon>
                <span class="text" :class="{ active: index === active }" slot="text">{{ channel.name }}</span>
            </van-grid-item>
        </van-grid>
        <!-- 频道推荐 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">频道推荐</div>
        </van-cell>
        <van-grid :gutter="10" class="recommend">
            <van-grid-item class="grid-item" v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" icon="plus" @click="onAddChannel(channel)"/>
        </van-grid>
    </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
    name: 'ChannelEdit',
    data () {
        return {
            allChannels: [], // 所有频道数据
            isEdit: false, // 控制编辑状态的显示
            fiexdChannels: [0] // 固定频道不允许删除
        }
    },
    props: {
        myChannels: {
            type: Array,
            required: true
        },
        active: {
            type: Number,
            required: true
        }
    },
    created () {
        this.loadAllChannels()
    },
    methods: {
        async loadAllChannels () {
            try {
                const { data } = await getAllChannels()
                this.allChannels = data.data.channels
            } catch (err) {
                this.$toast('数据获取失败')
            }
        },
        async onAddChannel (channel) {
            this.myChannels.push(channel)
            // 持久化
            if (this.user) {
                try {
                    // 已登录，同步到数据库
                    await addUserChannel({
                        id: channel.id,
                        seq: this.myChannels.length
                    })
                } catch (err) {
                    this.$toast('保存失败，请稍后重试', err)
                }
            } else {
                // 未登录，储存到本地
                setItem('TOUTIAO_CHANNELS', this.myChannels)
            }
        },
        onMychannelClick (channel, index) {
            if (this.isEdit) {
                // 如果是固定频道不删除
                if (this.fiexdChannels.includes(channel.id)) {
                return
                }
                // 如果是编辑状态则执行删除频道
                if (index <= this.active) {
                    // 如果删除频道的索引小于激活频道的索引，就让active-1
                    this.$emit('update-active', this.active - 1, true)
                }
                this.myChannels.splice(index, 1)
                // 处理持久化
                this.deleteChannel(channel)
            } else {
                // 如果是非变价状态，则执行切换频道
                // 向父组件发送通讯，更新active
                this.$emit('update-active', index, false)
            }
        },
        async deleteChannel (channel) {
            try {
                if (this.user) {
                    // 已登录
                    await deleteUserChannel(channel.id)
                } else {
                    // 未登录
                    setItem('TOUTIAO_CHANNELS', this.myChannels)
                }
            } catch (err) {
                this.$toast('操作失败，请稍后重试')
            }
        }
    },
    computed: {
        ...mapState(['user']),
        recommendChannels () {
            // 用于存储推荐频道
            const channels = []
            this.allChannels.forEach(channel => {
                const ret = this.myChannels.find(myChannel => {
                    return myChannel.id === channel.id
                })
                // 如果我的频道中不包括该频道项，则push到推荐频道channels中
                if (!ret) {
                    channels.push(channel)
                }
            })
            // 返回计算结果
            return channels
        }
    }
}
</script>

<style lang="less" scoped>
.channel-edit{
    padding: 85px 0;
    .title-text{
        font-size: 32px;
        color: #333333;
    }
    .edit-btn{
        width: 104px;
        height: 48px;
        font-size: 26px;
        color: #f85959;
        border: 1px solid #f85959;
    }
/deep/.grid-item{
        width: 160px;
        height: 86px;
        .van-grid-item__content{
            white-space: nowrap;
            background-color: #f4f5f6;
            .van-grid-item__text, .text{
                font-size: 28px;
                color: #222222;
                 margin-top: 0;
            }
            .active{
                color: red;
            }
            .van-grid-item__icon-wrapper{
                position: unset;
            }
        }
    }
/deep/.my-grid{
    .grid-item{
        .van-icon-clear{
            position: absolute;
            right: -10px;
            top: -10px;
            font-size: 30px;
            color: #cacaca;
            z-index: 2;
        }
    }
}
/deep/.recommend{
        .grid-item{
            .van-grid-item__content{
                flex-direction: row;
                .van-icon-plus{
                    font-size: 28px;
                    margin-right: 6px;
                }
            }
        }
    }
}
</style>
