<template>
    <!--会员等级模块-->
    <el-card shadow="never" class="border-0">
        <!--上：新增/刷新-->
        <list-header @create="handleCreate" @refresh="getData"></list-header>
        <!--中：列表-->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="会员等级"/>
            <el-table-column prop="discount" label="折扣率" align="center"/>
            <el-table-column prop="level" label="等级序号" align="center"/>
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)" :loading="row.statusLoading" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>


            <el-table-column label="操作" width="250" align="center">
                <!--作用域插槽：用于访问父组件传递给子组件的数据，不需要<slot>标签，只需要在相应的位置使用scope来访问数据即可-->
                <!-- scope 是一个对象，包含了当前表格行的数据以及一些方法-->
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要删除该记录" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!--下：分页-->
        <div class="flex items-center justify-center mt-5">
            <!--当触发current-change事件时，getData方法可能用于基于组件的当前状态检索新数据-->
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>

        <!--新增/修改弹窗-->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <!--prop 属性用于指定表单项的字段名，即在表单提交时所传递的参数名,prop 属性的值应该与后端接口或数据模型中定义的字段名保持一致-->
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name" placeholder="等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input v-model="form.level" placeholder="等级权重"  type="number"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div>
                        <small class="text-xs mr-2">累积消费满</small>
                        <el-input v-model="form.max_price" placeholder="累计消费"  type="number" style="width:50%;">
                            <template #append>元</template>
                        </el-input>
                        <small class="text-gray-400 flex">设置会员等级所需要的累计消费必须大于0,单位:元</small>
                    </div>
                    <div>
                        <small class="text-xs mr-2">累积次数满</small>
                        <el-input v-model="form.max_times" placeholder="累计次数"  type="number" style="width:50%;">
                            <template #append>%</template>
                        </el-input>
                        <small class="text-gray-400 flex">设置会员等级所需要的购买量必须大于0,单位:笔</small>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)" prop="discount">
                    <el-input v-model="form.discount" placeholder="折扣率(%)"  type="number" style="width:50%;">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-400 flex">折扣率单位为百分比,如输入90,表示该会员等级的用户可以以商品原价的90%购买</small>
                </el-form-item>
            </el-form>
        </form-drawer>
    </el-card>
</template>
<script setup>
import { ref } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getUserLevelList,
    createUserLevel,
    updateUserLevel,
    deleteUserLevel,
    updateUserLevelStatus
} from "~/api/level.js"
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    //获取角色列表
    getList: getUserLevelList,
    //删除角色
    delete: deleteUserLevel,
    //修改角色状态
    updateStatus: updateUserLevelStatus
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
        name: "",
        level:100,
        status:1,
        discount:0,
        max_price:0,
        max_times:0
    },
    rules: {
        name: [{
            required: true,
            message: '等级名称不能为空',
            trigger: 'blur'
        }],
        level: [{
            required: true,
            message: '等级序号不能为空',
            trigger: 'blur'
        }]
    },
    getData,
    //修改角色列表
    update: updateUserLevel,
    //增加角色列表
    create: createUserLevel
})

</script> 