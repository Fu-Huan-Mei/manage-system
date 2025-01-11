<template>
    <!--用户列表-->
    <el-card shadow="never" class="border-0">
        <!--搜索组件-->
        <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
            <!--搜索框:默认插槽-->
            <search-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称" clearable></el-input>
            </search-item>
            <template #show>
                <search-item label="会员等级">
                    <el-select v-model="searchForm.user_level_id" placeholder="请选择商品分类" clearable>
                        <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </search-item>
            </template>
        </Search>

        <!-- 新增|刷新组件 -->
        <list-header @create="handleCreate" @refresh="getData"></list-header>


        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column label="会员" width="200">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <!--左：头像-->
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <!--右：昵称和ID-->
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>

           
            <el-table-column align="center" label="会员等级">
                <template #default="{ row }">
                    {{ row.user_level ? row.user_level.name : '-' }}
                </template>
            </el-table-column>

            <el-table-column align="center" label="登录注册">
                <template #default="{ row }">
                    <p v-if="row.last_login_time">最后登录：{{ row.last_login_time }}</p>
                    <p>注册时间：{{ row.create_time }}</p>
                </template>
            </el-table-column>

            <!--更新状态-->
            <el-table-column label="状态" width="100" align="center">
                <!--渲染默认内容-->
                <template #default="{ row }">
                    <!--当开关处于打开状态时，"modelValue"将被设置为1；当开关处于关闭状态时，"modelValue"将被设置为0-->
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)" :loading="row.statusLoading" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>

            <!--操作-->
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <!--超级管理员 -->
                    <small v-if="scope.row.super == 1" class="text-sm text-gray-500">暂无操作</small>
                    <div v-else>
                        <!--修改-->
                        <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                        <!--删除：传递scope.row.id作为参数，用于删除当前行的数据-->
                        <el-popconfirm title="是否要删除该记录" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!--下：分页-->
        <div class="flex items-center justify-center mt-5">
            <!--当触发current-change事件时，getData方法可能用于基于组件的当前状态检索新数据-->
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>

        <!--新增弹窗-->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="密码" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="昵称"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <choose-image v-model="form.avatar"></choose-image>
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id">
                    <el-select v-model="form.user_level_id" placeholder="选择会员等级">
                        <el-option v-for="item in user_level"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </form-drawer>
    </el-card>
</template>
<!--1、setup返回值：可以是渲染函数
2、setup、data、methods等可同时写吗？会冲突吗？（面试题）
答：关键点：beforeCreate在setup前调用：所以当vue2和vue3混用时，在data中
可访问setup中的数据，但在setup中不能访问data中的数据会报错！！！-->
<script setup>
import SearchItem from "~/components/SearchItem.vue";
import Search from "~/components/Search.vue";
import ListHeader from "~/components/ListHeader.vue";
import { ref } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import {
    getUserList,
    updateUserStatus,
    createUser,
    updateUser,
    deleteUser
} from "~/api/user.js"

import { useInitTable, useInitForm } from '~/composables/useCommon.js'

const user_level = ref([])

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    searchForm: {
        keyword: "",
        user_level_id: null
    },
    getList: getUserList,
    //特殊的方法
    onGetListSuccess: (res) => {
        //获取列表数据
        tableData.value = res.list.map(o => {
            //修改switch开关的loading状态
            o.statusLoading = false
            return o
        })
        total.value = res.totalCount
        user_level.value = res.user_level
    },
    delete: deleteUser,
    updateStatus: updateUserStatus
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
        username: "",
        password: "",
        status: 1,
        nickname:'',
        phone:'',
        email:'',
        avatar: "",
        user_level_id:null
    },
    //UseInitTable获取的方法
    getData,
    update: updateUser,
    create: createUser
})


</script>