import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'

const axios = require('axios')

Vue.config.productionTip = false
Vue.component('leftMenu',leftMenu)
Vue.component('topHeader',topHeader)

//网址拦截
router.beforeEach((to,from,next)=>{
    //如果是登录界面，放行
    if(to.path==='/login'){
        //判断当前用户是否已经登录
        //根据角色判断页面跳转
        next()
    }else{
        //否则检查
        axios.get('/user/checkToken').then(result=>{
            let res = result.data
            if(res.code===20000){
                //成功,判断角色
                if(res.data.roles==='role_admin'){
                    //管理员放行
                    //跳转到管理中心
                    next()
                }else{
                    //普通用户，跳转到门户首页
                    //跳转到
                    if(confirm('您不是管理员,请重新登录')){
                        next({
                            path:'/login'
                        })
                    }
                }
            }else{
                //跳转到登陆界面
                next({
                    path:'/login'
                })
            }
        })
    }
    
})

Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
