<template>
    <!--侧边：图库分类-->
    <el-aside width="220px" class="image-aside" v-loading="loading">
        <!--上方：图片分类列表-->
        <div class="top">
            <!--分类列表组件:通过传入 item 参数，可以将正在编辑的元素的值（即 item）传递给 handleEdit 方法-->
            <AsideList :active="activeId == item.id" v-for="(item, index) in list" :key="index"
             @edit="handleEdit(item)" @delete="handleDelete(item.id)" @click="handleChangeActiveId(item.id)">
               {{ item.name }}
            </AsideList>
        </div>
        <!--下部：分页区域-->
        <div class="bottom">
            <el-pagination background layout="prev, next" @current-change="getData" :total="total"
                :current-page="currentPage" :page-size="limit" />
        </div>
    </el-aside>

    <!--新增图库分类表单组件：抽屉-->
    <form-drawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <!--分类名称-->
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!--排序-->
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="1" :max="1000"/>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { ref,reactive,computed } from 'vue';
import AsideList from "./AsideList.vue";
import { getImageClassList,createImageClass,updateImageClass,deleteImageClass } from "~/api/image_class.js";
import FormDrawer from "./FormDrawer.vue";
import {toast} from "~/composables/util.js";

//当前页码数：显示当前页面的数据
const currentPage = ref(1);
//总条数
const total = ref(0);
//每页显示10条
const limit = ref(10);

//加载动画ta
const loading = ref(false);

//列表数据
const list = ref([]);


//获取数据,p表示页码
function getData(p = null) {
    //如果传入当前页码
    if (typeof p == "number") {
        //当前页码
        currentPage.value = p;
    }
    loading.value = true;
    //获取侧边的图库分类列表（调用接口方法）
    getImageClassList(currentPage.value)
    .then(res => {
        //总页码数
        total.value = res.totalCount;
        //分类列表项的标题
        list.value = res.list;
        //左侧图库分类列表中的第1项
        let item = list.value[0];
        if (item) {
            //自动获取第1个分类下的图片列表
            handleChangeActiveId(item.id)
        }
    })
    .finally(() => {
        loading.value = false;
    })
}

getData();

//获取form-drawer节点
const formDrawerRef = ref(null);

//修改
const editId = ref(0);

//修改抽屉标题属性
const drawerTitle = computed(() =>editId.value ? "修改" : "新增")

//表单部分的字段 eg：相册名称、排序：50
const form = reactive({
    name:"",
    order:50
})

//表单验证规则
const rules = {
    //name字段的验证规则，当失去焦点时触发验证
    name:[{
            required: true,
            message: '图库分类名称不能为空',
            trigger: 'blur'
        }]
}

//获取表单节点 el-form 的引用，以便在提交表单时进行验证
const formRef= ref(null);

//提交表单数据
const handleSubmit = () => {
    //对表单进行验证
    formRef.value.validate((valid) => {
        //如果验证没有通过，不进行任何操作
        if(!valid) return;
        //加载中（提交按钮由Loading效果）
        formDrawerRef.value.showLoading()
        //如果验证通过:当editId有值时，调用修改图库分类接口；否则就调用增加图库分类接口
        const fun = editId.value ? updateImageClass(editId.value,form) : createImageClass(form);
        fun.then(res => {
            //提示
            toast(drawerTitle.value + "成功")
            //如果是修改，刷新当前页的数据；新增就要回到第1页
            getData( editId.value ? currentPage.value : 1)
            //关闭弹窗
            formDrawerRef.value.close();
        })
        .finally(() => {
            //请求结束，隐藏loading状态
            formDrawerRef.value.hideLoading()
        })
    })
};

//打开新增图片分类抽屉
const handleCreate = () => {
    editId.value = 0;
    //清空上一次编辑的数据
    form.name = "";
    form.order = 50;
    formDrawerRef.value.open();
}

//触发编辑按钮的方法
const handleEdit = (row) =>{
    editId.value = row.id;
    //初始化数据
    form.name = row.name 
    form.order = row.order
    formDrawerRef.value.open();
}

//删除
const handleDelete = (id) => {
    loading.value = true;
    //调用删除图库分类接口
    deleteImageClass(id)
    .then(res => {
        toast("删除成功")
        getData()
    })
    .finally(() => {
        loading.value = false;
    })
}

//选中图库分类ID
const activeId = ref(0);

const emit = defineEmits(["change"]);

//切换分类:点击左侧图库列表显示对应右侧的图片分类列表
function handleChangeActiveId(id){
    //当前图库分类id
    activeId.value = id;
    //触发change事件
    emit("change",id);
}

//向父组件暴露以下方法
defineExpose({
    handleCreate
})

</script>
<style scoped>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    height: 50px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}
</style>
