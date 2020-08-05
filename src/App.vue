<template>
    <div id="app">
        <router-view></router-view>
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
