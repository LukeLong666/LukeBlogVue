import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter);

//登录页面
//const login = () => import("@/page/login/login");
//内容
const postArtile = () => import("@/page/content/post-article");
const manageArtile = () => import("@/page/content/manage-article");
const manageComment = () => import("@/page/content/manage-comment");
const manageImage = () => import("@/page/content/manage-image");
//首页
const index = () => import("@/page/dashboard/index");
//运营
const manageCategory = () => import("@/page/operation/manage-category");
const loop = () => import("@/page/operation/loop");
//设置
const friendLink = () => import("@/page/settings/friend-link");
const websizeInfo = () => import("@/page/settings/websize-info");
//用户
const email = () => import("@/page/user/email");
const info = () => import("@/page/user/info");
const list = () => import("@/page/user/list");
const resetPassword = () => import("@/page/user/reset-password");
//布局
const baseView = () => import("@/layout/base-view");
const rightContent = () => import("@/layout/right-content");


const routes = [
    {   
        path: '',
        component:baseView,
        redirect:'/index',
        children:[
            {
                path:'/index',
                component:index
            },
            {
                path:'/content',
                component:rightContent,
                children:[
                    {
                        path:'post-article',
                        component:postArtile
                    },
                    {
                        path:'manage-article',
                        component:manageArtile
                    },
                    {
                        path:'manage-image',
                        component:manageImage
                    },
                    {
                        path:'manage-comment',
                        component:manageComment
                    }
                ]
            },
            {
                path:'/user',
                component:rightContent,
                children:[
                    {
                        path:'list',
                        component:list
                    },
                    {
                        path:'reset-password',
                        component:resetPassword
                    },
                    {
                        path:'email',
                        component:email
                    },
                    {
                        path:'info',
                        component:info
                    }
                ]
            },
            {
                path:'/operation',
                component:rightContent,
                children:[
                    {
                        path:'manage-category',
                        component:manageCategory
                    },
                    {
                        path:'loop',
                        component:loop
                    }
                ]
            },
            {
                path:'/settings',
                component:rightContent,
                children:[
                    {
                        path:'websize-info',
                        component:websizeInfo
                    },
                    {
                        path:'friend-link',
                        component:friendLink
                    }
                ]
            }
        ]        
    }
]

const router = new VueRouter({
    routes
  });

  export default router;