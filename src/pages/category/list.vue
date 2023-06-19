<template>
    <el-card shadow="never" class="border-0">
        <!--新增/刷新-->
        <list-header @refresh="getData" @create="handleCreate"></list-header>
        <!--树形组件：-->
        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ data.name }}</span>
                    <!--右边：开关：激活状态下为1，关闭状态下为0-->
                    <div class="ml-auto">
                        <el-button text type="primary" size="small" @click="openGoodsDrawer(data)" :loading="data.goodsDrawerLoading">推荐商品</el-button>
                        <!--修改菜单权限状态-->
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange($event, data)">
                        </el-switch>
                        <!--data表示当前行的数据对象-->
                        <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
                       
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

        <!--新增/修改表单弹框-->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <!--定义表单项-->
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name"  placeholder="分类名称" />
                </el-form-item>
            </el-form>
        </form-drawer>

        <!--推荐商品弹框-->
        <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
    </el-card>
</template>
<script setup>
import GoodsDrawer from "./components/GoodsDrawer.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { ref } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import { getCategoryList, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from "~/api/category.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
//操作列表相关方法
const {
    loading,
    tableData,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    //调用获取菜单权限列表接口方法
    getList: getCategoryList,
    onGetListSuccess: (res) => {
        tableData.value = res.map(o => {
            o.goodsDrawerLoading = false
            return o
        })
       
    },
    //删除菜单权限
    delete: deleteCategory,
    //修改菜单权限状态
    updateStatus: updateCategoryStatus
})
 

//操作表单相关方法
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
    //Body参数
    form: {
        //分类名称
        name: ''
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
    update: updateCategory,
    //调用增加菜单权限接口方法
    create: createCategory
})

const goodsDrawerRef = ref(null)

//打开推荐商品弹窗
const openGoodsDrawer = (data) =>  {
    goodsDrawerRef.value.open(data);
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