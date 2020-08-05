<template>
  <div>
      <div class="header-part">顶部</div>
        <div class="content-box">
            <div class="nav">
                <router-link to='/'>首页</router-link>
                <router-link to='/content/post-article'>发表文章</router-link>
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>