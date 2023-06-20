<template>
    <!--公告模块-->
    <el-card shadow="never" class="border-0">
        <!--上：新增/刷新-->
        <list-header @create="handleCreate" @refresh="getData"></list-header>

        <!--中：公告表格-->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <!--公告标题-->
            <el-table-column prop="title" label="公告标题"/>
            <!--发布时间-->
            <el-table-column prop="create_time" label="发布时间" width="380" />
             <!--操作-->
            <el-table-column label="操作" width="180" align="center">
                <!--作用域插槽：用于访问父组件传递给子组件的数据，不需要<slot>标签，只需要在相应的位置使用scope来访问数据即可-->
                <!-- scope 是一个对象，包含了当前表格行的数据以及一些方法-->
                <template #default="scope">
                    <el-button type="primary" size="small" text  @click="handleEdit(scope.row)">修改</el-button>
                    <!--@confirm事件将触发handleDelete函数，并传递scope.row.id作为参数，用于删除当前行的数据-->
                    <el-popconfirm title="是否要删除该公告" confirm-button-text="确认"
                     cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!--下：分页-->
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev,pager,next" :total="total" 
            :current-page="currentPage" :page-size="limit"  @current-change="getData"/>
        </div>

        <!--新增公告弹窗-->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <!--prop 属性用于指定表单项的字段名，即在表单提交时所传递的参数名,prop 属性的值应该与后端接口或数据模型中定义的字段名保持一致-->
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="公告内容" :rows="5" type="textarea"></el-input>
                </el-form-item>
            </el-form>
        </form-drawer>
    </el-card>
</template>
<script setup>
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import {
  getNoticeList,
  createNotice,
  updateNotice,
  deleteNotice
} from "~/api/notice"
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
 
const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete
} = useInitTable({
  getList: getNoticeList,
  delete:deleteNotice
})
 
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handleSubmit,
  handleCreate,
  handleEdit
} = useInitForm({
  form: {
    title: "",
    content: ""
  },
  rules: {
    title: [{
      required: true,
      message: '公告标题不能为空',
      trigger: 'blur'
    }],
    content: [{
      required: true,
      message: '公告内容不能为空',
      trigger: 'blur'
    }]
  },
  getData,
  update: updateNotice,
  create: createNotice
})

</script>