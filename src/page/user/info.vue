<template>
    <div>
        <div class="center-box">
            <el-form label-width="80px" v-if="userInfo!==null">
                <el-form-item label="ID">
                    <el-input v-model="userInfo.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址">
                    <el-input v-model="userInfo.email" disabled></el-input>
                    <el-button type="primary" @click="toUpdateEmail()">修改邮箱</el-button>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="userInfo.userName"></el-input>
                </el-form-item>
                <el-form-item label="签名">
                    <el-input v-model="userInfo.sign"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <div class="user-avatar" style="width:90px;height:90px;" @click="avatarUploadVisiable=true">
                        <el-avatar style="width:90px;height:90px;cursor:pointer" @click="avatarUploadVisiable=true" :src="userInfo.avatar"></el-avatar>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:150px" @click="updateUserInfo()">修改账户信息</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="user-info-dialog">
            <avatar-upload field="file" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" v-model="avatarUploadVisiable" :width="200" :height="200" url="/admin/image" img-format="png"></avatar-upload>
        </div>
    </div>
</template>

<script>
import api from '../../api/api'
import myUpload from 'vue-image-crop-upload/upload-2.vue';
import axios from 'axios'
export default {
    components: {
        'avatar-upload': myUpload
    },
    data() {
        return {
            avatarUploadVisiable: false,
            userInfo: {
                id: '',
                email: '',
                userName: '',
                sign: '',
                avatar: ''
            }
        }
    },
    methods: {
        updateUserInfo() {
            axios({
                url: '/user/user_info/' + this.userInfo.id,
                method: 'put',
                data: this.userInfo
            }).then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    this.listUserInfo()
                }else{
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
                this.$message({
                    message: response.message,
                    type: 'success'
                })
                this.userInfo.avatar = api.baseUrl+'/portal/image/' + response.data.id;
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
                message: '头像上传失败',
                type: 'error'
            })
        },
        listUserInfo() {
            axios.get('user/checkToken').then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    this.userInfo = result.data.data
                } else {
                    this.$message({
                        message: result.data.message,
                        type: 'error'
                    })
                }
            })
        },
        toUpdateEmail() {
            this.$router.push('/user/email')
        }
    },
    mounted() {
        this.listUserInfo()
    }
}
</script>

<style>
.center-box .el-input {
    width: 300px;
    margin-right: 12px;
}
</style>