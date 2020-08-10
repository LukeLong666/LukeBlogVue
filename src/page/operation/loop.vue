<template>
    <div class="loop-box">
        <div class="loop-action-bar">
            <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">添加轮播图</el-button>
            <el-button type="success" icon="el-icon-refresh-left" @click="listLoops()">刷新列表</el-button>
        </div>
        <div class="loop-list-box">
            <el-table :data="loops" stripe style="width:100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="168">
                </el-table-column>
                <el-table-column label="标题" width="150">
                    <template slot-scope="scope"> 
                        <a target="blank" :href="scope.row.targetUrl">{{scope.row.title}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="轮播图">
                    <template slot-scope="scope">
                        <img border="1" id="loop-logo" :src="scope.row.imageUrl">
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="顺序" width="50">
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
                            <el-button type="primary" @click="handleEdit(scope.row)" circle icon="el-icon-edit"></el-button>
                            <el-button slot="reference" type="danger" @click="handleDelete(scope.row)" circle icon="el-icon-delete"></el-button>
                        </div>
                        <div v-if="scope.row.state==='0'">
                            <el-button type="primary" @click="handleEdit(scope.row)" circle icon="el-icon-edit" disabled></el-button>
                            <el-button slot="reference" type="danger" @click="handleDelete(scope.row)" circle icon="el-icon-delete" disabled></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="loop-dialog-box">

            <!-- 删除对话框 -->
            <el-dialog icon="el-icon-share" title="警告" :visible.sync="deleteDialogVisible" width="30%">
                <span>删除后将不可恢复,确定删除要 <b>{{deleteDialogMessage}}</b> 吗</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button size="mini" type="danger" @click="handleDoDelete()">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 添加对话框 -->
            <el-dialog title="添加轮播图" :visible.sync="addDialogVisible" width="30%">
                <div class="add-dialog-box">
                    <!-- 信息表单 -->
                    <el-form :model="addLoop" ref="addLoop" label-width="100px">
                        <el-form-item label="轮播图名称" required>
                            <el-input @blur="titleBlur()" v-model="addLoop.title"></el-input>
                            <p class="msg">{{this.blur_msg.title}}</p>
                        </el-form-item>
                        <el-form-item label="图片地址" required>
                            <el-input @blur="imageUrlBlur()" v-model="addLoop.imageUrl"></el-input>
                            <p class="msg">{{this.blur_msg.imageUrl}}</p>
                        </el-form-item>
                        <el-form-item label="目标地址" required>
                            <el-input @blur="targetUrlBlur()" v-model="addLoop.targetUrl"></el-input>
                            <p class="msg">{{this.blur_msg.targetUrl}}</p>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="addLoop.order" :min="1" :max="10"></el-input-number>
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
                    <el-form :model="editLoop" ref="editLoop" label-width="100px">
                        <el-form-item label="ID">
                            <el-input v-model="editLoop.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="轮播图名称" required>
                            <el-input @blur="nameBlur()" v-model="editLoop.title"></el-input>
                        </el-form-item>
                        <el-form-item label="图片地址" required>
                            <el-input @blur="pinyinBlur()" v-model="editLoop.imageUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="目标地址" required>
                            <el-input @blur="targetUrlBlur()" v-model="editLoop.targetUrl"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="editLoop.order" :min="1" :max="100"></el-input-number>
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
    data(){
        return {
            loading:false,
            loops:[],
            blur_msg: {
                title: '',
                imageUrl: '',
                targetUrl: ''
            },
            //添加相关
            addDialogVisible:false,
            addLoop:{
                title:'',
                imageUrl:'',
                targetUrl:'',
                order:1
            },
            //删除相关
            deleteDialogVisible:false,
            deleteDialogMessage:'',
            deleteTargetId:'',
            //修改相关
            editLoop:{
                title:'',
                imageUrl:'',
                targetUrl:'',
                order:1,
                id:''
            }
        }
    },
    methods:{
        //添加轮播图
        handleAdd(){
            //检查数据
            this.titleBlur()
            this.imageUrlBlur()
            this.targetUrlBlur()
            if (this.addLoop.title === '' || this.addLoop.imageUrl === '' || this.addLoop.targetUrl === '') {
                this.$message({
                    message: '请补全数据',
                    center: true,
                    type: 'error'
                })
                return;
            }
            //数据正确,执行添加方法
            axios({
                method: 'post',
                url: '/admin/loop',
                data: this.addLoop
            }).then(result => {
                if (result.data.code === 20000) {
                    this.$message({
                        message: result.data.message,
                        center: true,
                        type: 'success'
                    })
                    this.addDialogVisible=false;
                    this.listLoops();
                    setTimeout(() => {
                        //清空数据
                        this.addLoop.title = ''
                        this.addLoop.imageUrl = ''
                        this.addLoop.targetUrl = ''
                        this.addLoop.order=1
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
        //修改
        handleEdit(item){
            //获取数据
            this.editLoop.title = item.title
            this.editLoop.imageUrl = item.imageUrl
            this.editLoop.targetUrl = item.targetUrl
            this.editLoop.order = item.order
            this.editLoop.id = item.id
            this.editDialogVisible = true
        },
        handleDoEdit(){
            //发起请求
            //检查数据
            if (this.editLoop.title === '' || this.editLoop.imageUrl === '' || this.editLoop.targetUrl === '') {
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
                url: '/admin/loop/'+this.editLoop.id,
                data: this.editLoop
            }).then(result=>{
                if(result.data.code===20000){
                    this.$message({
                        message: result.data.message,
                        type: 'success'
                    })
                    //关闭窗口,刷新数据
                    this.editDialogVisible=false
                    this.listLoops()
                    //清空数据
                    setTimeout(() => {
                        //清空数据
                        this.editLoop.title = ''
                        this.editLoop.imageUrl = ''
                        this.editLoop.targetUrl = ''
                        this.editLoop.order = 1
                        this.editLoop.id = ''
                    }, 500);
                }else{
                    this.$message({
                        message: result.data.message+'请稍后重试!',
                        type: 'error'
                    })
                }
            })
            
        },
        //删除
        handleDelete(item){
            this.deleteDialogVisible = true;
            this.deleteDialogMessage = item.title;
            this.deleteTargetId = item.id;
        },
        handleDoDelete(){
            //执行删除方法
            axios.delete('/admin/loop/' + this.deleteTargetId).then(result => {
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
                this.listLoops()
            }, 500);
        },
        //格式化日期
        formatDate(dateStr) {
            let date = new Date(dateStr)
            return dateUtils.formatDate(date, 'yyyy-MM-dd')
        },
        //获取列表
        listLoops(){
            this.loading=true;
            axios.get('/admin/loop/list').then(result => {
                setTimeout(() => {
                    this.loops = result.data.data;
                    this.$message({
                        message: '列表加载成功!',
                        type: 'success'
                    });
                    this.loading=false
                }, 500);
            })
        },
        //数据校验
        titleBlur() {
            if (this.addLoop.title === '') {
                this.blur_msg.title = '轮播图名称不可以为空'
            } else {
                this.blur_msg.title = ''
            }
        },
        imageUrlBlur() {
            if (this.addLoop.imageUrl === '') {
                this.blur_msg.imageUrl = '图片地址不可以为空'
            } else {
                this.blur_msg.imageUrl = ''
            }
        },
        targetUrlBlur() {
            if (this.addLoop.targetUrl === '') {
                this.blur_msg.targetUrl = '目标地址不可以为空'
            } else {
                this.blur_msg.targetUrl = ''
            }
        }
    },
    mounted(){
        //加载列表
        this.listLoops()
    }
}
</script>

<style>
.loop-action-bar {
    margin-top: 12px;
}
.loop-list-box {
    margin-top: 22px;
}
/* 图片显示 */
#loop-logo{
    max-width: 100%;
    height: 90px;
}
/* 超连接 */
a{
    text-decoration: underline;
    color:blue;
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
/* 添加分类弹窗 */
.add-dialog-box {
    padding-right: 10px;
}
</style>