// 用户相关接口模块
import request from '@/utils/request'
// 登录请求方法
export const login = data => {
    return request({
        method: 'post',
        url: '/app/v1_0/authorizations',
        data
    })
}
// 发送验证码
// 每个手机号每分钟只能发送1次
export const sendSms = mobile => {
    return request({
        method: 'get',
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}
// 获取当前登录用户的信息
export const getUserInfo = () => {
    return request({
        method: 'get',
        url: '/app/v1_0/user'
        // 专门用于发送请求头数据
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}
// 获取用户频道列表
export const getUserChannels = () => {
    return request({
        method: 'get',
        url: '/app/v1_0/user/channels'
    })
}
