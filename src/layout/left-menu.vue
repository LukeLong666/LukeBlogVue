<template>
    <div>
        <el-menu default-active="0" unique-opened="true" class="el-menu-vertical-demo">
            <template v-for="(item,index) in menuList">
                <router-link :to="item.path" v-if="!item.children&&!item.hidden" :key="index">
                    <el-menu-item :index="index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </router-link>
                <el-submenu :key="index" :index="index" v-if="item.children&&!item.hidden">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span>{{item.name}}</span>
                    </template>
                    <router-link :to="item.path+'/'+subItem.path" v-for="(subItem,subIndex) in item.children" :key="subIndex">
                        <el-menu-item :index="index+'-'+subIndex"  v-if="!subItem.hidden">
                            <i :class="subItem.icon"></i>
                            <span slot="title">{{subItem.name}}</span>
                        </el-menu-item>
                    </router-link>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>

import { routes } from '../router'

export default {
    date() {
        return {
            menuList: [

            ]
        }
    },
    mounted() {
        let menulist = routes[0]
        this.menuList = menulist.children
    }
}
</script>

<style>
    a{
        text-decoration: none;
    }
</style>