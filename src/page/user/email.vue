<template>
    <div>
        <div class="center-box" style="margin-top:22px">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="新邮箱地址" required>
                            <el-input v-model="newEmail"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="验证码" required>
                        <el-col :span="18">
                            <el-input v-model="verifyCode" class="verify-code"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button v-if="!isCountDown" style="margin-left:5px;width:70px" type="primary" @click.prevent="sendEmail()">发送</el-button>
                            <el-button v-else style="margin-left:5px;width:70px" type="info" disabled>{{countDownText}}</el-button>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-form-item>
                    <el-button @click="updateEmailAddress()" type="primary">修改邮箱</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
export default {
    data() {
        return {
            newEmail: '',
            verifyCode: '',
            countDownText: '(60)',
            isCountDown: false
        }
    },
    methods: {
        sendEmail() {
            if (this.newEmail === '') {
                this.$message({
                    message: '请输入邮箱地址',
                    type: 'error'
                })
            } else if (!reg.test(this.newEmail)) {
                this.$message({
                    message: '请输入正确的邮箱地址',
                    type: 'error'
                })
            } else {
                axios.get('/user/verify_code?type=update&email=' + this.newEmail).then(result => {
                    if (result.data.code === 20000) {
                        this.$message({
                            message: result.data.message,
                            type: 'success'
                        })
                        this.isCountDown = true;
                        let time = 60;
                        //按钮禁止,并开始倒记时
                        let interval = setInterval(() => {
                            //执行倒记时
                            time--;
                            if (time <= 0) {
                                clearInterval(interval)
                                this.isCountDown = false;
                            }
                            this.countDownText = '(' + time + ')'
                        }, 1000);
                    } else {
                        this.$message({
                            message: result.data.message,
                            type: 'error'
                        })
                    }
                })
            }

        },
        updateEmailAddress() {
            if (this.newEmail === '' || this.verifyCode === '') {
                this.$message({
                    message: '请输入邮箱地址和验证码',
                    type: 'error'
                })
            } else if (!reg.test(this.newEmail)) {
                this.$message({
                    message: '请输入正确的邮箱地址',
                    type: 'error'
                })
            } else {
                axios.put('/user/email?email=' + this.newEmail + '&verify_code=' + this.verifyCode).then(result => {
                    if (result.data.code === 20000) {
                        this.$message({
                            message: result.data.message,
                            type: 'success'
                        })
                        this.newEmail=''
                        this.verifyCode=''
                        this.isCountDown=false
                    } else {
                        this.$message({
                            message: result.data.message,
                            type: 'error'
                        })
                    }
                })
            }
        }
    }

}
</script>

<style scoped>
.center-box {
    width: 400px;
}
</style>