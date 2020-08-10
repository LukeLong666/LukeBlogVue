<template>
    <div class="container">
        <div class="content-title-box" v-text="$route.name"></div>
        <div class="content-container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data(){

    },
    methods:{

    },
    mounted(){

    }
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