// 搜索相关接口
import request from '@/utils/request'
// 获取联想建议数据
export const getSearchSuggest = q => {
    return request({
        method: 'get',
        url: '/app/v1_0/suggestion',
        params: {
            q
        }
    })
}
// 获取搜索结果数据
export const getSearchResult = params => {
    return request({
        method: 'get',
        url: '/app/v1_0/search',
        params: params
    })
}
