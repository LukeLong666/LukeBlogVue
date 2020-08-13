<template>
    <div>
        <el-container>
            <el-header id="header">
                <topHeader></topHeader>
            </el-header>
            <el-container>
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
        //动态设置侧边菜单高度
        let leftMenu = document.getElementById("left-menu");
        let header = document.getElementById("header");
        if(leftMenu){
            leftMenu.style.height=(window.innerHeight)-(header.offsetHeight)+"px";
        }
    }
}
</script>

<style>
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