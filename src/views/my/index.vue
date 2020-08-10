<template>
    <div class="my-container">
         <!-- 已登录 -->
        <div v-if="user" class="header user-info">
            <div class="base-info">
                <div class="left">
                    <van-image class="avatar" fit="cover" round :src="userInfo.photo" />
                    <span class="name">{{ userInfo.name }}</span>
                </div>
                <div class="right">
                    <van-button size="mini" round>编辑资料</van-button>
                </div>
            </div>
            <div class="data-stats">
                <div class="data-item">
                    <span class="count">{{ userInfo.art_count }}</span>
                    <span class="text">头条</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.follow_count }}</span>
                    <span class="text">关注</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.fans_count }}</span>
                    <span class="text">粉丝</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.like_count }}</span>
                    <span class="text">获赞</span>
                </div>
            </div>
        </div>
        <!-- 未登录 -->
        <div v-else class="header not-login">
            <div class="login-btn" @click="$router.push('/login')">
                <img src="~@/assets/mobile.png" alt="" class="mobile-img">
                <span class="text">登录/注册</span>
            </div>
        </div>
        <!-- 导航 -->
        <van-grid class="grid-nav" :column-num="2" clickable>
            <van-grid-item class="grid-item">
                <i slot="icon" class="toutiao toutiao-shoucang"></i>
                <span slot="text" class="text">收藏</span>
            </van-grid-item>
            <van-grid-item class="grid-item">
                <i slot="icon" class="toutiao toutiao-lishi"></i>
                <span slot="text" class="text">历史</span>
            </van-grid-item>
        </van-grid>
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" class="mb-9" is-link />
        <van-cell v-if="user" title="退出登录" class="logout-cell" @click="onLogout" clickable/>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
    name: 'MyIndex',
    data () {
      return {
          userInfo: {} // 用户信息
      }
    },
    created () {
        // 如果用户登录了，则请求用户信息数据
        if (this.user) {
            this.loadUserInfo()
        }
    },
    methods: {
      onLogout () {
          // 1.退出提示
        this.$dialog.confirm({
            title: '确认退出吗？'
        })
        .then(() => {
            // 2.取人退出，清除登录状态，清除容器中user和本地token中的数据
            this.$store.commit('setUser', null)
        })
        .catch(() => {})
      },
      async loadUserInfo () {
          try {
              const { data } = await getUserInfo()
              this.userInfo = data.data
          } catch (err) {
              this.$toast('获取数据失败，请稍后重试')
          }
      }
    },
    computed: {
        ...mapState(['user'])
    }
}
</script>

<style lang="less" scoped>
.my-container{
    .header{
        height: 361px;
        // @指向src目录，在css中要使用~@来指向src目录
        background: url("~@/assets/banner.png");
        background-size: cover;
    }
    .not-login{
        display: flex;
        justify-content: center;
        align-items: center;
        .login-btn{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .mobile-img{
                width: 132px;
                height: 132px;
                margin-bottom: 15px;
            }
            .text{
                font-size: 28px;
                color: #ffffff;
            }
        }
    }
    .user-info{
        .base-info{
            padding: 76px 32px 23px;
            box-sizing: border-box;
            height: 231px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                display: flex;
                align-items: center;
                .avatar{
                    width: 132px;
                    height: 132px;
                    margin-right: 23px;
                    border: 4px solid #ffffff;
                }
                .name{
                    font-size: 30px;
                    color: #ffffff;
                }
            }
        }
        .data-stats{
            // height: 130px;
            display: flex;
            .data-item{
                height: 130px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-self: center;
                align-items: center;
                color: #ffffff;
                .count{
                    font-size: 36px;
                }
                .text{
                    font-size: 23px;
                }
            }
        }
    }
    .grid-nav{
        .grid-item{
            height: 141px;
            i.toutiao{
                font-size: 45px;
            }
            .toutiao-shoucang{
                color: #eb5253;
            }
            .toutiao-lishi{
                color: #ff9d1d;
            }
            span.text{
                font-size: 28px;
            }
        }
    }
    .mb-9{
        margin-bottom: 9px;
    }
    .logout-cell{
        display: flex;
        text-align: center;
        align-items: center;
        font-size: 28px;
        color: #eb5253;
    }
}
</style>
