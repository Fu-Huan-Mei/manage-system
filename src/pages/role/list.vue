<template>
    <!--角色管理模块-->
    <el-card shadow="never" class="border-0">
        <!--上：新增/刷新-->
        <list-header @create="handleCreate" @refresh="getData"></list-header>

        <!--中：角色列表-->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <!--角色名称-->
            <el-table-column prop="name" label="角色名称" />
            <!--角色描述-->
            <el-table-column prop="desc" label="角色描述" width="380" />
            <!--更新状态-->
            <el-table-column label="状态" width="120" align="center">
                <!--渲染默认内容-->
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
                    <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
                    <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要删除该公告" confirm-button-text="确认" cancel-button-text="取消"
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="角色描述" :rows="5" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </form-drawer>

        <!--权限配置弹窗-->
        <form-drawer ref="SetRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <!--树形控件:label和children是属性名，用于在组件中接收父组件传递的值-->
            <el-tree-v2 node-key="id" :data="ruleList" ref="elTreeRef" :props="{ label: 'name', children: 'child' }"
                @check="handleTreeCheck" show-checkbox :height="treeHeight" :check-strictly="checkStrictly"
                :default-expanded-keys="defaultExpandedKeys">
                <template #default="{ node, data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '' : 'info'" size="small">
                            {{ data.menu ? "菜单" : "权限" }}
                        </el-tag>
                        <span class="ml-2 text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </form-drawer>
    </el-card>
</template>
<script setup>
import { ref } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { getRuleList } from "~/api/rule.js";
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    setRoleRules
} from "~/api/role.js"
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import { toast } from "~/composables/util.js";
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
    getList: getRoleList,
    //删除角色
    delete: deleteRole,
    //修改角色状态
    updateStatus: updateRoleStatus
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
        desc: "",
        status: 1
    },
    rules: {
        name: [{
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
        }],
        desc: [{
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur'
        }]
    },
    getData,
    //修改角色列表
    update: updateRole,
    //增加角色列表
    create: createRole
})
//获取树形控件节点
const elTreeRef = ref(null)
//默认展开树形控件
const defaultExpandedKeys = ref([])
//树形控件高度
const treeHeight = ref(0)
//获取权限配置节点
const SetRuleFormDrawerRef = ref(null)
//权限配置列表
const ruleList = ref([])
//当前角色id
const roleId = ref(0)
//当前角色拥有的权限id
const ruleIds = ref([])
//父子级菜单关联
const checkStrictly = ref(false)

//打开权限配置弹窗
const openSetRule = (row) => {
    //记录当前角色id,方便后面使用
    roleId.value = row.id;
    treeHeight.value = window.innerHeight - 170
    //获取数据之前:父子节点不关联
    checkStrictly.value = true
    //获取权限列表
    getRuleList(1).then(res => {
        //权限列表
        ruleList.value = res.list
        //默认展开一级节点
        defaultExpandedKeys.value = res.list.map(o => o.id)
        //打开弹窗
        SetRuleFormDrawerRef.value.open();
        //当前角色拥有的权限id数组
        ruleIds.value = row.rules.map(o => o.id);
        setTimeout(() => {
            //默认选中：当前角色拥有的权限id
            elTreeRef.value.setCheckedKeys(ruleIds.value)
            //默认选中后父子节点关联（才会获取全key和半key）
            checkStrictly.value = false
        }, 300)
    })
}

//进行权限配置数据交互
const handleSetRuleSubmit = () => {
    //加载状态
    SetRuleFormDrawerRef.value.showLoading();
    //调用配置角色权限接口:为指定的角色配置权限
    setRoleRules(roleId.value, ruleIds.value)
        .then(res => {
            toast('配置成功')
            //关闭弹窗
            SetRuleFormDrawerRef.value.close();
        })
        .finally(() => {
            //结束加载状态
            SetRuleFormDrawerRef.value.hideLoading();
        })
}
//处理勾选后的树形控件
const handleTreeCheck = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}
</script> 