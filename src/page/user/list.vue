<template>
    <div>
        <div class="action-bar-box">
            <span class="select">
                <span style="margin-right:15px"><el-tag>每页显示条数:</el-tag></span>
                <el-select class="number-select" @change="listUsers()" v-model="pageSize">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <el-input class="search-input" v-model="userName" placeholder="请输入用户名" prefix-icon="el-icon-search" width="150" clearable></el-input>
            <el-input class="search-input" v-model="email" placeholder="请输入邮箱地址" prefix-icon="el-icon-search" width="150" clearable></el-input>
            <el-button type="success" icon="el-icon-refresh-left" @click="listUsers()">刷新列表<b> / </b>查询</el-button>
            <el-button icon="el-icon-refresh" type="info" @click="userName='';email='';">重置</el-button>
        </div>
        <div class="user-list-box">
            <el-table :data="users" stripe style="width:100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="168">
                </el-table-column>
                <el-table-column prop="userName" label="用户账号" width="100">
                </el-table-column>
                <el-table-column label="用户角色" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.roles==='role_normal'">
                            <el-tag type="info">普通用户</el-tag>
                        </div>
                        <div v-if="scope.row.roles==='role_admin'">
                            <el-tag type="warning">管理员</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="头像" width="100">
                    <template slot-scope="scope">
                        <img border="1" id="loop-logo" :src="scope.row.avatar">
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="200">
                </el-table-column>
                <el-table-column prop="sign" label="签名">
                    <template slot-scope="scope">
                        <div v-if="scope.row.sign">
                            <span>{{scope.row.sign}}</span>
                        </div>
                        <div v-else>
                            <span>这个人要不行了,啥也没写...</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state==='1'">
                            <el-tag type="success">正常</el-tag>
                        </div>
                        <div v-if="scope.row.state==='0'">
                            <el-tag type="danger">不可用</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" width="110">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.createTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="更新日期" width="110">
                    <template slot-scope="scope">
                        <span v-text="formatDate(scope.row.updateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state==='1'">
                            <el-button type="success"  title="解除账号封禁" circle disabled @click="handleUnBan(scope.row)"  circlean icon="el-icon-circle-plus-outline"></el-button>
                            <el-button slot="reference" type="info" title="封禁该账号" @click="handleBan(scope.row)" circle icon="el-icon-remove-outline" ></el-button>
                        </div>
                        <div v-if="scope.row.state==='0'">
                            <el-button type="success" title="解除账号封禁" @click="handleUnBan(scope.row)" circle icon="el-icon-circle-plus-outline" ></el-button>
                            <el-button slot="reference" type="info" circle title="封禁该账号" disabled @click="handleBan(scope.row)" icon="el-icon-remove-outline" ></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="navagation-box">
            <el-pagination background :current-page="page" layout="prev, pager, next" :total="totalPage" :page-size="pageSize" @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <div class="dialog-box">
            <!-- 封禁diglog -->
            <el-dialog
                title="封禁帐号"
                :visible.sync="BanDiglogVisiable"
                width="30%">
                <i class="el-icon-warning"></i> 您确定要封禁 <b>{{BanMessage}}</b> 的账号吗,封禁之后可以随时解封.
                <span slot="footer">
                    <el-button  @click="BanDiglogVisiable = false">取 消</el-button>
                    <el-button type="danger" @click="handleDoBan()">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 解封账号 -->
            <el-dialog
                title="解封帐号"
                :visible.sync="UnBanDiglogVisiable"
                width="30%">
                您确定要解封 <b>{{BanMessage}}</b> 的账号吗,解封之后,该账号的功能即可恢复正常
                <span slot="footer">
                    <el-button  @click="BanDiglogVisiable = false">取 消</el-button>
                    <el-button type="danger" @click="handleDoUnBan()">确 定</el-button>
                </span>
            </el-dialog>
            
        </div>
    </div>

</template>

<script>
import * as dateUtils from '../../utils/date'
const axios = require('axios')
export default {
    data() {
        return {
            users: [],
            //总页数
            totalPage: 1,
            //当前页码
            page: 1,
            //数据总数
            size: 1,
            //页面大小
            pageSize: 2,
            loading: false,
            //搜索相关
            userName: '',
            email: '',
            options: [
                {
                    label: '2',
                    value: 2
                },
                {
                    label: '5',
                    value: 5
                },
                {
                    label: '10',
                    value: 10
                },
                {
                    label: '20',
                    value: 20
                },
                {
                    label: '30',
                    value: 30
                }
            ],
            //操作相关
            BanDiglogVisiable:false,
            BanUserId:'',
            BanMessage:'',
            UnBanDiglogVisiable:false,
        }
    },
    methods: {
        //恢复用户
        handleUnBan(item){
            this.BanUserId=item.id;
            this.BanMessage = item.userName;
            this.UnBanDiglogVisiable=true;
        },
        handleDoUnBan(){
            axios.put('/user/'+this.BanUserId).then(result=>{
                if(result.data.code===20000){
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    });
                    this.BanUserId='';
                    this.BanMessage = '';
                    this.UnBanDiglogVisiable=false;
                    this.listUsers();
                }else{
                    this.$message({
                        message: result.data.message+',请稍后重试!',
                        type: 'error'
                    });
                }
            })
        },
        //封禁账号
        handleBan(item){
            this.BanDiglogVisiable=true;
            this.BanUserId=item.id;
            this.BanMessage = item.userName;
        },
        handleDoBan(){
            axios.delete('/user/'+this.BanUserId).then(result=>{
                if(result.data.code===20000){
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    });
                    this.BanUserId='';
                    this.BanMessage = '';
                    this.BanDiglogVisiable=false;
                    this.listUsers();
                }else{
                    this.$message({
                        message: result.data.message+',请稍后重试!',
                        type: 'error'
                    });
                }
            })
        },
        //页码转换
        handleCurrentChange(val) {
            this.page = val;
            this.listUsers();
        },
        //获取用户列表
        listUsers() {
            this.loading = true;
            let getUserUrl = '/user/list?page=' + this.page + '&size=' + this.pageSize;
            if (this.userName !== '') {
                getUserUrl = getUserUrl + '&userName=' + this.userName;
            }
            if (this.email !== '') {
                getUserUrl = getUserUrl + '&email=' + this.email;
            }
            axios.get(getUserUrl).then(result => {
                setTimeout(() => {
                    //用户列表
                    this.users = result.data.data.list;
                    //总页数
                    this.totalPage = result.data.data.total;
                    //数据总数
                    this.size = result.data.data.size;
                    this.$message({
                        message: '列表加载成功!',
                        type: 'success'
                    });
                    this.loading = false
                }, 500);
            })
        },
        //格式化日期
        formatDate(dateStr) {
            let date = new Date(dateStr)
            return dateUtils.formatDate(date, 'yyyy-MM-dd')
        },
    },
    mounted() {
        this.listUsers()
    }
}
</script>

<style scoped>
.action-bar-box {
    margin-top: 12px;
}
.user-list-box {
    margin-top: 22px;
}
.navagation-box {
    margin-top: 22px;
    text-align: center;
}
.search-input {
    margin-right: 12px;
    width: 200px;
}
.number-select {
    margin-right: 12px;
    width: 80px;
}
.select{
    float: right;
}
/* 图片显示 */
#loop-logo {
    max-width: 100%;
    height: 50px;
}
</style>