<template>
    <div id="app">
        <div class="header-part">顶部</div>
        <div class="content-box">
            <div class="nav">
                <p>
                    <router-link to='/home'>首页</router-link>
                </p>
                <p>
                    <router-link to='/article'>文章</router-link>
                </p>
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    el: 'App'
}
</script>

<style>
.header-part {
    background: red;
}
.nav {
    background: antiquewhite;
    height: 500px;
    width: 159px;
    float: left;
}
.content {
    background: aliceblue;
    height: 500px;
    width: 800px;
    float: left;
}
</style>
