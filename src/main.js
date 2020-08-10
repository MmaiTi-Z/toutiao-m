import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式表
import './style/index.less'
// 引入vant核心组件库
import Vant from 'vant'
// 加载vant样式
import 'vant/lib/index.css'
// 导入amfe-flexible设置基准rem值
import 'amfe-flexible'
// 加载dayjs初始化配置
import './utils/dayjs'
// 注册使用vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
