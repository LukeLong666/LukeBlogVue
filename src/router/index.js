import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter);

//登录页面
const login = () => import("@/page/login/login");
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


export const routes = [
    {   
        path: '',
        component:baseView,
        redirect:'/index',
        children:[
            {
                path:'/index',
                hidden:false,
                name:'首页',
                icon:'el-icon-s-home',
                component:index
            },
            {
                path:'/content',
                hidden:false,
                name:'内容',
                icon:'el-icon-postcard',
                component:rightContent,
                children:[
                    {
                        path:'post-article',
                        hidden:false,
                        name:'发表文章',
                        icon:'el-icon-edit',
                        component:postArtile
                    },
                    {
                        path:'manage-article',
                        hidden:false,
                        name:'管理文章',
                        icon:'el-icon-finished',
                        component:manageArtile
                    },
                    {
                        path:'manage-image',
                        hidden:false,
                        name:'图片管理',
                        icon:'el-icon-picture-outline',
                        component:manageImage
                    },
                    {
                        path:'manage-comment',
                        hidden:false,
                        name:'评论管理',
                        icon:'el-icon-s-fold',
                        component:manageComment
                    }
                ]
            },
            {
                path:'/user',
                hidden:false,
                name:'用户',
                icon:'el-icon-postcard',
                component:rightContent,
                children:[
                    {
                        path:'list',
                        name:'用户列表',
                        icon:'el-icon-user',
                        hidden:false,
                        component:list
                    },
                    {
                        path:'reset-password',
                        hidden:false,
                        icon:'el-icon-refresh-left',
                        name:'重置密码',
                        component:resetPassword
                    },
                    {
                        path:'email',
                        hidden:false,
                        icon:'el-icon-receiving',
                        name:'邮箱设置',
                        component:email
                    },
                    {
                        path:'info',
                        name:'用户信息',
                        icon:'el-icon-warning-outline',
                        hidden:false,
                        component:info
                    }
                ]
            },
            {
                path:'/operation',
                hidden:false,
                name:'运营',
                icon:'el-icon-help',
                component:rightContent,
                children:[
                    {
                        path:'manage-category',
                        name:'分类管理',
                        icon:'el-icon-coin',
                        hidden:false,
                        component:manageCategory
                    },
                    {
                        path:'loop',
                        name:'轮播图管理',
                        hidden:false,
                        icon:'el-icon-orange',
                        component:loop
                    }
                ]
            },
            {
                path:'/settings',
                hidden:false,
                name:'设置',
                icon:'el-icon-s-tools',
                component:rightContent,
                children:[
                    {
                        path:'websize-info',
                        name:'网站信息',
                        icon:'el-icon-medal',
                        hidden:false,
                        component:websizeInfo
                    },
                    {
                        path:'friend-link',
                        name:'友情链接',
                        icon:'el-icon-postcard',
                        hidden:false,
                        component:friendLink
                    }
                ]
            }
        ]        
    },
    {
        path:'/login',
        component:login
    }
]

const router = new VueRouter({
    routes
  });

  export default router;