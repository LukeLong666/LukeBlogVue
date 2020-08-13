<template>
    <div class="friend-link">
        <div class="friend-link-top-bar">
            <el-button type="primary" @click="addDialogVisible=true">添加友情链接</el-button>
            <el-button type="success" @click="listFriendLinks()">刷新列表</el-button>
        </div>
        <div class="friend-link-list-box">
            <el-table :data="friendLink" stripe style="width:100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="168">
                </el-table-column>
                <el-table-column label="网站名称">
                    <template slot-scope="scope">
                        <a target="blank" :href="scope.row.url">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="LOGO" width="160">
                    <template slot-scope="scope">
                        <img border="1" id="loop-logo" :src="scope.row.logo"/>
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
                <el-table-column prop="order" label="顺序" width="50">
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
                            <el-button type="primary" circle @click="handleEdit(scope.row)" circlean icon="el-icon-edit"></el-button>
                            <el-button slot="reference" type="danger" @click="handleDelete(scope.row)" circle icon="el-icon-delete"></el-button>
                        </div>
                        <div v-if="scope.row.state==='0'">
                            <el-button type="primary" disabled @click="handleEdit(scope.row)" circle icon="el-icon-edit"></el-button>
                            <el-button slot="reference" type="danger" circle disabled @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="dialog-box">
            <!-- 添加对话框 -->
            <el-dialog title="添加友情链接" :visible.sync="addDialogVisible" width="40%">
                <div class="add-dialog-box">
                    <!-- 信息表单 -->
                    <el-form :model="addFriendLink" label-width="120px">
                        <el-form-item label="对方网站名称" required>
                            <el-input v-model="addFriendLink.name"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转链接" required>
                            <el-input v-model="addFriendLink.url"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number style="width:160px" v-model="addFriendLink.order" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="logo">
                            <div style="width:160px;height:90px;" @click="logoUploadVisiable=true">
                                <el-button type="info" style="width:160px;height:90px" v-if="addFriendLink.logo===''" icon="el-icon-plus"></el-button>
                                <el-image v-else width="160" height="90" style="cursor:pointer" :src='addFriendLink.logo' ></el-image>
                            </div>
                            <div class="user-info-dialog">
                                <avatar-upload field="file" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" v-model="logoUploadVisiable" :width="160" :height="90" url="/admin/image" img-format="png"></avatar-upload>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" style="padding-right:10px">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAdd()">添 加</el-button>
                </span>
            </el-dialog>

            <!-- 编辑对话框 -->
            <el-dialog title="编辑友情链接" :visible.sync="editDialogVisible" width="40%">
                <div class="add-dialog-box">
                    <!-- 信息表单 -->
                    <el-form :model="editFriendLink" label-width="120px">
                        <el-form-item label="ID">
                            <el-input v-model="editFriendLink.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="对方网站名称" required>
                            <el-input v-model="editFriendLink.name"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转链接" required>
                            <el-input v-model="editFriendLink.url"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number style="width:160px" v-model="editFriendLink.order" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="logo">
                            <div style="width:160px;height:90px;" @click="logoUploadVisiable=true">
                                <el-button type="info" style="width:160px;height:90px" v-if="editFriendLink.logo===''" icon="el-icon-plus"></el-button>
                                <el-image v-else width="160" height="90" style="cursor:pointer" :src='editFriendLink.logo' ></el-image>
                            </div>
                            <div class="user-info-dialog">
                                <avatar-upload field="file" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" v-model="logoUploadVisiable" :width="160" :height="90" url="/admin/image" img-format="png"></avatar-upload>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" style="padding-right:10px">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleDoEdit()">修 改</el-button>
                </span>
            </el-dialog>

            <!-- 删除对话框 -->
            <el-dialog icon="el-icon-share" title="警告" :visible.sync="deleteDialogVisible" width="30%">
                <span>删除后将不可恢复,确定删除要 <b>{{deleteDialogMessage}}</b> 吗</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button size="mini" type="danger" @click="handleDoDelete()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import * as api from '../../api/api'
import myUpload from 'vue-image-crop-upload/upload-2.vue';
import * as dateUtils from '../../utils/date'
const axios = require('axios')
export default {
    components: {
        'avatar-upload': myUpload
    },
    data() {
        return {
            logoUploadVisiable: false,
            loading: false,
            friendLink: [],
            //添加相关
            addDialogVisible: false,
            addFriendLink: {
                name: '',
                url: '',
                logo: '',
                order: 0
            },
            //修改相关
            editFriendLink:{
                id:'',
                name: '',
                url: '',
                logo: '',
                order: 0
            },
            editDialogVisible:false,
            //删除相关
            deleteDialogVisible:false,
            deleteDialogMessage:'',
            deleteFriendLinkId:''
        }
    },
    methods: {
        //删除
        handleDelete(item){
            this.deleteDialogVisible = true
            this.deleteFriendLinkId=item.id
            this.deleteDialogMessage=item.name
        },
        handleDoDelete(){
            axios({
                method: 'delete',
                url: '/admin/friend_link/'+this.deleteFriendLinkId,
            }).then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    this.deleteDialogVisible = false;
                    this.listFriendLinks();
                    setTimeout(() => {
                        //清空数据
                        this.deleteDialogMessage=''
                        this.deleteFriendLinkId=''
                    }, 500);
                } else {
                    this.$message({
                        message: result.data.message,
                        type: 'error'
                    })
                }
            })
        },
        //编辑
        handleEdit(item){
            //回显数据
            this.editFriendLink.id=item.id;
            this.editFriendLink.name=item.name;
            this.editFriendLink.url=item.url;
            this.editFriendLink.logo=item.logo;
            this.editFriendLink.order=item.order;
            this.editDialogVisible=true;
        },
        handleDoEdit(){
            if (this.editFriendLink.name === '' || this.editFriendLink.url === '' || this.editFriendLink.logo === '') {
                this.$message({
                    message: '请补全所需数据',
                    type: 'error'
                })
                return;
            }
            if (!this.editFriendLink.url.startsWith('http://') && !this.editFriendLink.url.startsWith('https://')) {
                this.$message({
                    message: '目标地址格式错误,请以 "http://" 或 "https://" 开头',
                    type: 'error'
                })
                return;
            }
            axios({
                method: 'put',
                url: '/admin/friend_link/'+this.editFriendLink.id,
                data: this.editFriendLink
            }).then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    this.editDialogVisible = false;
                    this.listFriendLinks();
                    setTimeout(() => {
                        //清空数据
                        this.editFriendLink.name = ''
                        this.editFriendLink.logo = ''
                        this.editFriendLink.url = ''
                        this.editFriendLink.order = 1
                        this.editFriendLink.id = ''
                    }, 500);
                } else {
                    this.$message({
                        message: result.data.message,
                        type: 'error'
                    })
                }
            })
        },
        handleAdd() {
            if (this.addFriendLink.name === '' || this.addFriendLink.url === '' || this.addFriendLink.logo === '') {
                this.$message({
                    message: '请补全所需数据',
                    type: 'error'
                })
                return;
            }
            if (!this.addFriendLink.url.startsWith('http://') && !this.addFriendLink.url.startsWith('https://')) {
                this.$message({
                    message: '目标地址格式错误,请以 "http://" 或 "https://" 开头',
                    type: 'error'
                })
                return;
            }
            axios({
                method: 'post',
                url: '/admin/friend_link',
                data: this.addFriendLink
            }).then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    this.addDialogVisible = false;
                    this.listFriendLinks();
                    setTimeout(() => {
                        //清空数据
                        this.addFriendLink.name = ''
                        this.addFriendLink.logo = ''
                        this.addFriendLink.url = ''
                        this.addFriendLink.order = 1
                    }, 500);
                } else {
                    this.$message({
                        message: result.data.message,
                        type: 'error'
                    })
                }
            })
        },
        //上传图片成功
        cropUploadSuccess(response) {
            if (response.code === 20000) {
                this.addFriendLink.logo = api.baseUrl+'/portal/image/' + response.data.id;
                this.editFriendLink.logo = api.baseUrl+'/portal/image/' + response.data.id;
            } else {
                this.$message({
                    message: response.message,
                    type: 'error'
                })
            }
        },
        //上传图片失败
        cropUploadFail() {
            this.$message({
                message: 'LOGO上传失败',
                type: 'error'
            })
        },
        listFriendLinks() {
            this.loading = true
            axios.get('/admin/friend_link/list').then(result => {
                if (result.data.code === 20000) {
                    setTimeout(() => {
                        this.$message({
                            message: result.data.message,
                            type: 'success'
                        })
                        this.friendLink = result.data.data
                        this.loading = false
                    }, 500);
                } else {
                    this.$message({
                        message: result.data.message,
                        type: 'error'
                    })
                }

            })
        },
        //格式化日期
        formatDate(dateStr) {
            let date = new Date(dateStr)
            return dateUtils.formatDate(date, 'yyyy-MM-dd')
        }
    },
    mounted() {
        this.listFriendLinks()
    }
}
</script>

<style>
.friend-link-top-bar,
.friend-link-list-box {
    margin-top: 12px;
}
/* 图片显示 */
#loop-logo {
    max-width: 100%;
    height: 50px;
}
</style>