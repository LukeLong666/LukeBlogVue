<template>
    <div class="admin-login-box">
        <!-- 顶部内容 -->
        <div class="admin-login-header-box">
            <div class="admin-login-logo">
                Luke博客系统 | 登录
            </div>
        </div>
        <!-- 中间内容 -->
        <div class="admin-login-center-box">
            <div class="login-center-box">
                <el-form label-position="right" label-width="100px" :model="user">
                    <el-form-item required label="账号">
                        <el-input @blur="userNameBlur()" v-model="user.userName" @keyup.native.enter="doLogin()" placeholder="用户名/邮箱地址"></el-input>
                        <p class="msg">{{this.blur_msg.username}}</p>
                    </el-form-item>
                    <el-form-item required label="密码">
                        <el-input @blur="passwordBlur()" v-model="user.password" @keyup.native.enter="doLogin()" type="password" placeholder="密码"></el-input>
                        <p class="msg">{{this.blur_msg.password}}</p>
                    </el-form-item>
                    <el-form-item required label="验证码">
                        <el-row>
                            <el-col :span="12">
                                <el-input @blur="captchaBlur()" @keyup.native.enter="doLogin()" v-model="loginInfo.captcha" class="cap" placeholder="验证码"></el-input>
                                <p class="msg">{{this.blur_msg.captcha}}</p>
                            </el-col>
                            <el-col :span="12" class="cap-img">
                                <img class="capImg" @click="changeImg()" height="40px" width="125px" :src="captchaPath">
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-check" plain @click="doLogin()"> 登录 </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 底部内容 -->
    </div>
</template>

<script>
const axios = require('axios')
export default {
    data() {
        return {
            user: {
                userName: '',
                password: ''
            },
            loginInfo: {
                captcha: '',
                captcha_key: '',
                from: 'p_'
            },
            captchaPath:'',
            blur_msg:{
                username:'',
                password:'',
                captcha:''
            }
        };
    },
    methods: {
        userNameBlur(){
            if(this.user.userName===''){
                this.blur_msg.username='账号不可以为空'
            }else{
                this.blur_msg.username=''
            }
        },
        passwordBlur(){
            if(this.user.password===''){
                this.blur_msg.password='密码不可以为空'
            }else{
                this.blur_msg.password=''
            }
        },
        captchaBlur(){
            if(this.loginInfo.captcha===''){
                this.blur_msg.captcha='验证码不可以为空'
            }else{
                this.blur_msg.captcha=''
            }
        },
        // 更换验证码图片
        changeImg() {
            let date = Date.parse(new Date())
            if (this.loginInfo.captcha_key != date) {
                let i = Math.floor(Math.random()*1000)
                this.loginInfo.captcha_key = date+i
                console.log('captchaKey==>'+this.loginInfo.captcha_key)
                this.captchaPath = "/user/captcha?captcha_key=" + this.loginInfo.captcha_key
            }
        },
        // 登录
        doLogin(){
            this.userNameBlur()
            this.passwordBlur()
            this.captchaBlur()
            //发起请求
            //检查数据
            if(this.user.userName===''||this.user.password===''||this.loginInfo.captcha===''){
                this.$message({
                        message:'请补全数据',
                        center:true,
                        type:'error'
                    })
                this.changeImg()
                return;
            }
            //提交数据
            //处理结果
            console.log('user     ==>'+JSON.stringify(this.user))
            console.log('loginInfo==>'+JSON.stringify(this.loginInfo))
            axios({
                method:'post',
                url:'/user/login/'+this.loginInfo.captcha+'/'+this.loginInfo.captcha_key+'?from='+this.loginInfo.from,
                data:this.user
            }).then(result=>{
                let resultData = result.data;
                //处理登录结果
                //判断状态
                if(resultData.code===20001){
                    this.$message({
                        message:resultData.message,
                        center:true,
                        type:'success'
                    })
                    //成功则跳转
                    setTimeout(() => {
                        //延迟0.5秒跳转
                        this.$router.push('/index');
                    }, 500);
                }else{
                    this.$message({
                        message:resultData.message,
                        center:true,
                        type:'error'
                    })
                }
            });
            //延迟1秒重新请求验证码
            setTimeout(() => {
                this.changeImg()
            }, 1000);
        }
    },
    mounted(){
        this.changeImg()
    }
}
</script>

<style>
/* 输入框提示信息 */
.msg{
    margin-left: 10px;
    line-height: 20px;
    height: 8px;
    font-size: 10px;
    font-weight: 100;
    color: red;
}
/* el input 标签样式 */
.el-form-item__label {
    text-align: center;
    background: #f2f6fc;
    border-radius: 10px;
}
/* el input 输入框样式 */
.el-input__inner {
    width: 250px;
    border-radius: 10px;
}
/* 验证码输入框 */
.cap .el-input__inner {
    width: 125px;
}
/* 登录按钮 */
.el-button{
    width: 150px;
}
/* 验证码图片 */
.capImg{
    cursor: pointer;
}

.admin-login-header-box {
    width: 100%;
    height: 60px;
    background: dodgerblue;
}

.admin-login-logo {
    margin-left: 20px;
    color: white;
    line-height: 60px;
    font-size: 20px;
    font-weight: 600;
}

.admin-login-center-box {
    margin: 0 auto;
    margin-top: 100px;
}

.login-center-box {
    padding: 40px;
    width: 350px;
    height: 240px;
    background: white;
    box-shadow: 0 1px 10px #afafaf;
    margin: 0 auto;
    border-radius: 10px;
}
</style>