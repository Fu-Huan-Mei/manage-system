<template>
    <el-card shadow="never" class="border-0">
        <!--新增/刷新-->
        <list-header @refresh="getData" @create="handleCreate"></list-header>
        <!--树形组件：-->
        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ node, data }">
                <!--每一条菜单权限相关内容-->
                <div class="custom-tree-node">
                    <!--如果menu为1，显示蓝色背景的菜单；menu为0，显示灰色背景的权限-->
                    <el-tag size="small" :type="data.menu ? '' : 'info'">{{ data.menu ? "菜单" : "权限" }}</el-tag>
                    <!--图标-->
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <!--标题-->
                    <span>{{ data.name }}</span>
                    <!--右边：开关：激活状态下为1，关闭状态下为0-->
                    <div class="ml-auto">
                        <!--修改菜单权限状态-->
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event, data)">
                        </el-switch>
                        <!--data表示当前行的数据对象-->
                        <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
                        <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
                        <!--删除：传递scope.row.id作为参数，用于删除当前行的数据-->
                        <el-popconfirm title="是否要删除该记录" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>

        <!--表单弹框-->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <!--定义表单项-->
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader v-model="form.rule_id" :options="options"  placeholder="请选择上级菜单"
                    :props="{ label: 'name', children: 'child', checkStrictly: true, emitPath: false, value: 'id' }"/>
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" size="large" border>菜单</el-radio>
                        <el-radio :label="0" size="large" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" style="width:30%;" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
                    <!-- 图标下拉选择组件-->
                    <IconSelect v-model="form.icon"></IconSelect>
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
                    <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
                </el-form-item>
                <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
                    <el-input v-model="form.condition" placeholder="后端规则"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
                    <el-select v-model="form.method" class="m-2" placeholder="请选择请求方式">
                        <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>
            </el-form>
        </form-drawer>
    </el-card>
</template>
<script setup>
import FormDrawer from "~/components/FormDrawer.vue";
import { ref } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import IconSelect from "~/components/IconSelect.vue";
import { getRuleList, createRule, updateRule, updateRuleStatus, deleteRule } from "~/api/rule.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
//默认展开每一级菜单
const defaultExpandedKeys = ref([]);
//下拉菜单选项
const options = ref([]);
//操作列表相关方法
const {
    loading,
    tableData,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    //调用获取菜单权限列表接口方法
    getList: getRuleList,
    onGetListSuccess: (res) => {
        options.value = res.rules;
        tableData.value = res.list
        //默认展开多级菜单:根据id自动生成数组
        defaultExpandedKeys.value = res.list.map(o => {
            return o.id
        })
    },
    //删除菜单权限
    delete: deleteRule,
    //修改菜单权限状态
    updateStatus: updateRuleStatus
})

//操作表单相关方法
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    //触发打开表单弹窗的方法
    handleCreate,
    handleEdit
} = useInitForm({
    //初始化表单数据：查看接口文档的body参数获取
    form: {
        //上级菜单ID
        rule_id: 0,
        //是否是菜单：1是 0否
        menu: 0,
        //菜单权限名称
        name: '',
        //后端规则
        condition: '',
        //请求方式
        method: 'GET',
        //是否启用
        status: 1,
        //排序
        order: 50,
        //图标
        icon: '',
        //前端路由
        frontpath: ''
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
    //调用修改菜单权限接口方法
    update: updateRule,
    //调用增加菜单权限接口方法
    create: createRule
})

//增加
const addChild = (id) => {
    //打开弹窗    
    handleCreate();
    //获取当前打开对象id
    form.rule_id = id;
    //启用
    form.status = 1;
}
</script>
<style>
.custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
}

.el-tree-node_content {
    padding: 20px 0;
}
</style>