<template>
    <div class="category-box">
        <div class="category-action-bar">
            <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">添加分类</el-button>
            <el-button type="success" icon="el-icon-refresh-left" @click="listCategories()">刷新列表</el-button>
        </div>
        <div class="category-list-box">
            <el-table :data="categories" stripe style="width:100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="200">
                </el-table-column>
                <el-table-column prop="name" label="分类名称" width="120">
                </el-table-column>
                <el-table-column prop="pinyin" label="拼音" width="150">
                </el-table-column>
                <el-table-column prop="description" label="描述">
                </el-table-column>
                <el-table-column prop="order" label="顺序" width="50">
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==='1'">
                            <el-tag type="success">正常</el-tag>
                        </div>
                        <div v-if="scope.row.status==='0'">
                            <el-tag type="danger">删除</el-tag>
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
                        <div v-if="scope.row.status==='1'">
                            <el-button type="primary" @click="handleEdit(scope.row)" circle icon="el-icon-edit"></el-button>
                            <el-button slot="reference" type="danger" @click="handleDelete(scope.row)" circle icon="el-icon-delete"></el-button>
                        </div>
                        <div v-if="scope.row.status==='0'">
                            <el-button type="primary" @click="handleEdit(scope.row)" circle icon="el-icon-edit" disabled></el-button>
                            <el-button slot="reference" type="danger" @click="handleDelete(scope.row)" circle icon="el-icon-delete" disabled></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="navigation-bar">

        </div>

        <div class="category-dialog-box">

            <!-- 删除对话框 -->
            <el-dialog icon="el-icon-share" title="警告" :visible.sync="deleteDialogVisible" width="30%">
                <span>删除后将不可恢复,确定删除要 <b>{{deleteDialogMessage}}</b> 吗</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button size="mini" type="danger" @click="handleDoDelete()">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 添加对话框 -->
            <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="30%">
                <div class="add-dialog-box">
                    <!-- 信息表单 -->
                    <el-form :model="addCategory" ref="addCategory" label-width="80px">
                        <el-form-item label="分类名称" required>
                            <el-input @blur="nameBlur()" v-model="addCategory.name"></el-input>
                            <p class="msg">{{this.blur_msg.name}}</p>
                        </el-form-item>
                        <el-form-item label="分类拼音" required>
                            <el-input @blur="pinyinBlur()" v-model="addCategory.pinyin"></el-input>
                            <p class="msg">{{this.blur_msg.pinyin}}</p>
                        </el-form-item>
                        <el-form-item label="分类描述" required>
                            <el-input type="textarea" :rows="3" @blur="descriptionBlur()" v-model="addCategory.description"></el-input>
                            <p class="msg">{{this.blur_msg.description}}</p>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="addCategory.order" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" style="padding-right:10px">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAdd()">添 加</el-button>
                </span>
            </el-dialog>

            <!-- 更新对话框 -->
            <el-dialog
                title="编辑分类"
                :visible.sync="editDialogVisible"
                width="30%">
                <div class="edit-dialog-box">
                    <!-- 信息表单 -->
                    <el-form :model="editCategory" ref="editCategory" label-width="80px">
                        <el-form-item label="ID">
                            <el-input v-model="editCategory.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="分类名称" required>
                            <el-input @blur="nameBlur()" v-model="editCategory.name"></el-input>
                        </el-form-item>
                        <el-form-item label="分类拼音" required>
                            <el-input @blur="pinyinBlur()" v-model="editCategory.pinyin"></el-input>
                        </el-form-item>
                        <el-form-item label="分类描述" required>
                            <el-input type="textarea" :rows="3" @blur="descriptionBlur()" v-model="editCategory.description"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="editCategory.order" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleDoEdit()">确 定</el-button>
                </span>
            </el-dialog>
            
        </div>
    </div>
</template>

<script>
import * as dateUtils from '../../utils/date'
const axios = require('axios');
export default {
    data() {
        return {
            loading:false,
            categories: [],
            //删除相关
            deleteDialogVisible: false,
            deleteDialogMessage: '',
            deleteTargetId: '',
            //添加相关
            addDialogVisible: false,
            addCategory: {
                name: '',
                pinyin: '',
                description: '',
                order:1
            },
            blur_msg: {
                name: '',
                pinyin: '',
                description: ''
            },
            //编辑相关
            editDialogVisible:false,
            editCategory: {
                name: '',
                pinyin: '',
                description: '',
                order:1,
                id:''
            }
        };
    },
    methods: {
        //格式化日期
        formatDate(dateStr) {
            let date = new Date(dateStr)
            return dateUtils.formatDate(date, 'yyyy-MM-dd')
        },
        //数据校验
        nameBlur() {
            if (this.addCategory.name === '') {
                this.blur_msg.name = '分类名称不可以为空'
            } else {
                this.blur_msg.name = ''
            }
        },
        pinyinBlur() {
            if (this.addCategory.pinyin === '') {
                this.blur_msg.pinyin = '分类拼音不可以为空'
            } else {
                this.blur_msg.pinyin = ''
            }
        },
        descriptionBlur() {
            if (this.addCategory.description === '') {
                this.blur_msg.description = '分类描述不可以为空'
            } else {
                this.blur_msg.description = ''
            }
        },
        //确认添加
        handleAdd() {
            this.nameBlur()
            this.pinyinBlur()
            this.descriptionBlur()
            //发起请求
            //检查数据
            if (this.addCategory.name === '' || this.addCategory.pinyin === '' || this.addCategory.description === '') {
                this.$message({
                    message: '请补全数据',
                    center: true,
                    type: 'error'
                })
                return;
            }
            //数据正常,执行添加方法
            axios({
                method: 'post',
                url: '/admin/category',
                data: this.addCategory
            }).then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        center: true,
                        type: 'success'
                    })
                    this.addDialogVisible=false;
                    this.listCategories();
                    setTimeout(() => {
                        //清空数据
                        this.addCategory.name = ''
                        this.addCategory.pinyin = ''
                        this.addCategory.description = ''
                        this.addCategory.order=1
                    }, 500);
                } else {
                    this.$message({
                        message: result.data.message,
                        center: true,
                        type: 'error'
                    })
                }
            })
        },
        //编辑按钮
        handleEdit(item) {
            //获取数据
            this.editCategory.pinyin = item.pinyin
            this.editCategory.description = item.description
            this.editCategory.order = item.order
            this.editCategory.name = item.name
            this.editCategory.id = item.id
            this.editDialogVisible = true
        },
        handleDoEdit(){
            //发起请求
            //检查数据
            if (this.editCategory.name === '' || this.editCategory.pinyin === '' || this.editCategory.description === '') {
                this.$message({
                    message: '请补全数据',
                    center: true,
                    type: 'error'
                })
                return;
            }
            //数据正常,执行编辑方法
            axios({
                method: 'put',
                url: '/admin/category/'+this.editCategory.id,
                data: this.editCategory
            }).then(result=>{
                if(result.data.code===20000){
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    //关闭窗口,刷新数据
                    this.editDialogVisible=false
                    this.listCategories()
                    //清空数据
                    setTimeout(() => {
                        //清空数据
                        this.editCategory.pinyin = ''
                        this.editCategory.description = ''
                        this.editCategory.order = 1
                        this.editCategory.name = ''
                        this.editCategory.id = ''
                    }, 500);
                }else{
                    this.$message({
                        message: result.data.message+'请稍后重试!',
                        type: 'error'
                    })
                }
            })
            
        },
        //删除按钮警告
        handleDelete(item) {
            this.deleteDialogVisible = true;
            this.deleteDialogMessage = item.name;
            this.deleteTargetId = item.id;
        },
        //确认删除
        handleDoDelete() {
            //执行删除方法
            axios.delete('/admin/category/' + this.deleteTargetId).then(result => {
                if (result.data.code === 20000) {
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
            //关闭窗口,清空数据
            this.deleteDialogVisible = false;
            this.deleteDialogMessage = '';
            this.deleteTargetId = '';
            //重新加载列表
            setTimeout(() => {
                this.listCategories()
            }, 1000);
        },
        //获取分类列表
        listCategories() {
            this.loading=true;
            axios.get('/admin/category/list').then(result => {
                setTimeout(() => {
                    this.categories = result.data.data;
                    this.$message({
                        message: '列表加载成功!',
                        type: 'success'
                    });
                    this.loading=false
                }, 500);
            })
        }
    },
    mounted() {
        //获取分类列表
        this.listCategories();
    }
}
</script>

<style>
.category-action-bar {
    margin-top: 12px;
}
.category-list-box {
    margin-top: 22px;
}
/* 添加分类弹窗 */
.add-dialog-box {
    padding-right: 10px;
}
/* 输入框提示信息 */
.msg {
    margin-left: 10px;
    line-height: 20px;
    height: 8px;
    font-size: 10px;
    font-weight: 100;
    color: red;
}
</style>