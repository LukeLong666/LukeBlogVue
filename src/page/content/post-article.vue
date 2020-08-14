<template>
    <div class="article-post-box">
        <!-- 编辑 -->
        <div class="article-title">
            <el-form label-width="70px">
                <el-form-item label="标题" required>
                    <el-input label="标题" v-model="postArticle.title" placeholder="请输入文章标题"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <!-- 内容编辑 -->
        <div class="article-content">
            <mavon-editor ref="mdEidtor" v-model="postArticle.content" />
        </div>
        <!-- 文章设置 -->
        <div class="article-setting">
            <el-form label-width="80px">
                <el-form-item label="文章分类" required>
                    <el-select v-model="postArticle.categoryId" placeholder="请选择文章分类">
                        <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="封面">
                    <div class="cover-select">
                        <div style="width:160px;height:90px;" @click="coverUploadVisible=true">
                            <el-button type="info" style="width:160px;height:90px" v-if="postArticle.cover===''" icon="el-icon-plus"></el-button>
                            <el-image v-else width="160" height="90" style="cursor:pointer" :src='postArticle.cover'></el-image>
                        </div>
                        <div>
                            <avatar-upload field="file" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" v-model="coverUploadVisible" :width="160" :height="90" url="/admin/image" img-format="png"></avatar-upload>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="摘要" required>
                    <el-input type="textarea" rows="2" placeholder="请输入文章摘要" v-model="postArticle.summary"></el-input>
                </el-form-item>
                <el-form-item label="标签" required>
                    <el-tag :key="tag" v-for="tag in labels" closable :disable-transitions="false" type="success" @close="deleteTag(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input style="width:100px" v-if="inputNewTagVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" style="width:100px" @click="showInput" icon="el-icon-plus"></el-button>
                    <span style="color:red;margin-left:4px">{{newTagMessage}}</span>
                </el-form-item>
            </el-form>

        </div>
        <!-- 操作按钮 -->
        <div class="action-bar clearfix">
            <div class="action-bar-btn">
                <el-button type="warning" @click="preview()">全屏预览</el-button>
                <el-button type="primary" @click="doPostArticle('1')" v-loading.fullscreen.lock="fullscreenLoading">发表文章</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import * as api from '../../api/api'
import myUpload from 'vue-image-crop-upload/upload-2.vue';
const axios = require('axios')
export default {
    components: {
        'avatar-upload': myUpload
    },
    data() {
        return {
            fullscreenLoading: false,
            newTagMessage: '',
            inputValue: '',
            inputNewTagVisible: false,
            coverUploadVisible: false,
            categories: [],
            labels: [],
            postArticle: {
                title: '',
                content: '',
                categoryId: '',
                summary: '',
                cover: '',
                labels: '',
                type: '1',
                state: ''
            }
        }
    },
    methods: {
        preview(){
            this.$refs.mdEidtor.toolbar_right_click('read')
        },
        doPostArticle(postState) {
            this.postArticle.labels = ''
            this.labels.forEach(element => {
                this.postArticle.labels += element + '-'
            });
            this.postArticle.labels = this.postArticle.labels.substring(0, this.postArticle.labels.length - 1)
            if (this.postArticle.title === '' || this.postArticle.content === '' ||
                this.postArticle.categoryId === '' || this.postArticle.summary === '' ||
                 this.postArticle.labels === '') {
                this.$message({
                    message: '请补全所需数据',
                    type: 'error'
                })
                return;
            }
            this.postArticle.state = postState
            this.fullscreenLoading = true;
            axios({
                url: '/admin/article',
                method: 'post',
                data: this.postArticle
            }).then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    this.fullscreenLoading = false;
                    location.reload()
                } else {
                    this.fullscreenLoading = false;
                    this.$message({
                        message: result.data.message,
                        type: 'error'
                    })
                }
            })

        },
        showInput() {
            if (this.labels.length < 5) {
                this.inputNewTagVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                    console.log(_)
                });
            } else {
                this.newTagMessage = '标签最大支持5个'
            }
        },
        deleteTag(tag) {
            this.labels.splice(this.labels.indexOf(tag), 1);
            this.newTagMessage = ''
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.labels.push(inputValue);
            }
            this.inputNewTagVisible = false;
            this.inputValue = '';
        },
        //上传封面成功
        cropUploadSuccess(response) {
            if (response.code === 20000) {
                this.postArticle.cover = api.baseUrl + '/portal/image/' + response.data.id;
            } else {
                this.$message({
                    message: response.message,
                    type: 'error'
                })
            }
        },
        //上传封面失败
        cropUploadFail() {
            this.$message({
                message: 'LOGO上传失败',
                type: 'error'
            })
        },
        listArticleCategories() {
            axios.get('/portal/article/categories').then(result => {
                this.categories = result.data.data;
            })
        }
    },
    mounted() {
        //获取文章分类
        this.listArticleCategories()
    }
}
</script>

<style>
.article-content .markdown-body {
    height: 800px;
}
.article-content {
    margin-top: 12px;
}
.article-setting {
    margin-top: 12px;
    height: 300px;
}
.action-bar-btn {
    float: right;
    margin: 12px;
}
.el-tag {
    margin-right: 6px;
}
</style>