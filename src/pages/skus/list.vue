<template>
    <!--商品规格模块-->
    <el-card shadow="never" class="border-0">
        <!--上：新增/刷新-->
        <list-header @create="handleCreate" @refresh="getData" layout="create,refresh,delete" @delete="handleMultiDelete">
            
        </list-header>
        <!--中：列表-->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading" 
        @selection-change="handleSelectionChange" ref="multipleTableRef">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="规格名称" />
            <el-table-column prop="default" label="规格值" width="380" />
            <el-table-column prop="order" label="排序" width="380" />
            <el-table-column label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event, row)" :loading="row.statusLoading" :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>


            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要删除该规格" confirm-button-text="确认" cancel-button-text="取消"
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

        <!--新增弹窗-->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit" destroyOnClose>
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <!--prop 属性用于指定表单项的字段名，即在表单提交时所传递的参数名,prop 属性的值应该与后端接口或数据模型中定义的字段名保持一致-->
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" size="small" label="" :min="0" :max="1000">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
                    {{ form.default }}
                    <tag-input v-model="form.default" :key="index"></tag-input>
                </el-form-item>
            </el-form>
        </form-drawer>
        
    </el-card>
</template>
<script setup>
import { ref } from "vue";
import TagInput from "~/components/TagInput.vue";
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getSkusList,
    createSkus,
    updateSkus,
    deleteSkus,
    updateSkusStatus
} from "~/api/skus.js"
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete
} = useInitTable({
    //获取角色列表
    getList: getSkusList,
    //删除角色
    delete: deleteSkus,
    //修改角色状态
    updateStatus: updateSkusStatus
})

const index = ref(1);
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
        status: 1,
        default: "",
        order: 50
    },
    rules: {
        name: [{
            required: true,
            message: '规格名称不能为空',
            trigger: 'blur'
        }],
        default: [{
            required: true,
            message: '规格值不能为空',
            trigger: 'blur'
        }]
    },
    getData,
    //修改角色列表
    update: updateSkus,
    //增加角色列表
    create: createSkus
})


</script> 