<template>
    <div>
        <el-container>
            <el-header id="header">
                <topHeader></topHeader>
            </el-header>
            <el-container class="main-container">
                <el-aside id="left-menu" width="220px">
                    <leftMenu></leftMenu>
                </el-aside>
                <el-container>
                    <el-main>
                        <div class="content">
                            <router-view></router-view>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    mounted(){
        
    }
}
</script>

<style>
.main-container{
    position: absolute;
    top: 60px;
    width: 100%;
    bottom: 0;
}
#left-menu .el-aside{
    border-right: none;
}
.el-header {
    background-color: dodgerblue;
    line-height: 60px;
}

.el-aside {
    text-align: left;
    border-right: solid 1px #e6e6e6;
}
.el-main{
    padding: 0;
}

</style>