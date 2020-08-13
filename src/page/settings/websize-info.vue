<template>
    <div>
        <div class="info-list-box">
            <el-form label-width="100px">
                <el-form-item label="网站名称">
                    <el-input v-model="websizeTitle"></el-input>
                </el-form-item>
                <el-form-item label="网站关建字">
                    <el-input v-model="keywords"></el-input>
                </el-form-item>
                <el-form-item label="网站描述">
                    <el-input type="textarea" rows="2" v-model="description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateWebSizeInfo()">更新</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            websizeTitle: '',
            keywords: '',
            description: '',
            oldInfo: {
                websizeTitle: '',
                keywords: '',
                description: ''
            }
        }
    },
    methods: {
        //更新信息
        updateWebSizeInfo() {
            if (this.websizeTitle === '' || this.keywords === '' || this.description === '') {
                this.$message({
                    message: '请补全所需数据',
                    type: 'error'
                })
                return
            }
            if (this.websizeTitle !== this.oldInfo.websizeTitle) {
                axios.put('/admin/web_size_info/title?title=' + this.websizeTitle).then(result => {
                    if (result.data.code === 20000) {
                        this.oldInfo.websizeTitle = this.websizeTitle
                        this.$message({
                            message: result.data.message,
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            message: result.data.message,
                            type: 'error'
                        })
                    }
                })
            }
            if (this.keywords !== this.oldInfo.keywords || this.description !== this.oldInfo.description) {
                axios.put('/admin/web_size_info/seo?description=' + this.description + '&keywords=' + this.keywords).then(result => {
                    if (result.data.code === 20000) {
                        this.oldInfo.description = this.description
                        this.oldInfo.keywords = this.keywords
                        this.$message({
                            message: result.data.message,
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            message: result.data.message,
                            type: 'error'
                        })
                    }
                })
            } 
            if(this.websizeTitle === this.oldInfo.websizeTitle&&this.keywords === this.oldInfo.keywords && this.description === this.oldInfo.description) {
                this.$message({
                    message: '数据未发生变化',
                    type: 'info'
                })
            }
        },
        //获取信息
        listWebsizeInfo() {
            axios.get('/admin/web_size_info/seo').then(seo => {
                if (seo.data.code === 20000) {
                    this.description = seo.data.data.web_size_description
                    this.oldInfo.description = seo.data.data.web_size_description
                    this.keywords = seo.data.data.web_size_keywords
                    this.oldInfo.keywords = seo.data.data.web_size_keywords
                } else {
                    this.$message({
                        message: seo.data.message,
                        type: 'error'
                    })
                }
            })
            axios.get('/admin/web_size_info/title').then(title => {
                if (title.data.code === 20000) {
                    this.websizeTitle = title.data.data.value
                    this.oldInfo.websizeTitle = title.data.data.value
                } else {
                    this.$message({
                        message: title.data.message,
                        type: 'error'
                    })
                }
            })
        }
    },
    mounted() {
        this.listWebsizeInfo()
    }
}
</script>

<style>
.info-list-box {
    margin-top: 22px;
}
.info-list-box .el-input,
.info-list-box .el-textarea {
    width: 250px;
}
.info-list-box .el-button {
    width: 125px;
}
</style>