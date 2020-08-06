<template>
    <div>
        <div class="content-title-box">右边内容</div>
        <div class="content-container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
    .content-title-box{
        border-bottom: solid 1px #e6e6e6;
        padding: 10px;
    }
    .content-container{
        padding: 10px;
    }
</style>