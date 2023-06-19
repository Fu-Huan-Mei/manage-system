<template>
    <!--中间图片展示区:指定分类下的图片列表-->
    <el-main class="image-main" width="220px" v-loading="loading">

        <!--上部分：图片列表-->
        <div class="top p-3">
            <!-- <div v-for="(item,index) in list" :key="index">{{ item.url }}</div> -->
            <!--每一行有4张图片-->
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding': 0 }"
                        :class="{ 'border-blue-500': item.checked }">
                        <!--图片-->
                        <el-image :src="item.url" fit="cover" class="h-[150px]" style="width:100%"
                            :preview-src-list="[item.url]" :initial-index="0">
                        </el-image>
                        <!--标题-->
                        <div class="image-title">{{ item.name }}</div>
                        <!--按钮-->
                        <div class="flex items-center justify-center p-2">
                            <!--选择框：点击后，可将图片返回ChooseImage.vue组件的图片对话框-->
                            <el-checkbox v-if="openChoose" v-model="item.checked"
                                @change="handleChooseChange(item)"></el-checkbox>
                            <!--重命名按钮-->
                            <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>
                            <!--删除按钮-->
                            <el-popconfirm title="是否删除该图片" confirm-button-text="确认" 
                            cancel-button-text="取消"    @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" text class="!m-0">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!--下部分：分页部分-->
        <div class="bottom">
            <div class="bottom">
                <el-pagination background layout="prev,pager,next" @current-change="getData" :total="total"
                    :current-page="currentPage" :page-size="limit" />
            </div>
        </div>

    </el-main>

    <!--弹窗抽屉组件-->
    <el-drawer v-model="drawer" title="上传图片">
        <!--上传图片组件:将{ image_class_id }绑定到<upload-file>组件的data属性上-->
        <upload-file :data="{ image_class_id }" @success="handleUpLoadSuccess"></upload-file>
    </el-drawer>
</template>
<script setup>
import { ref, computed } from 'vue';
import { getImageList, updateImage, deleteImage } from "~/api/image.js";
import { showPrompt, toast } from "~/composables/util.js";
import UploadFile from './UploadFile.vue';
//默认上传图片的弹窗关闭
const drawer = ref(false);

//定义打开上传图片的弹窗的方法
const openUploadFile = () => drawer.value = true;

//总页码数
const total = ref(0);

//当前页码数
const currentPage = ref(1);

//每页显示10条
const limit = ref(10);

//图片列表
const list = ref([]);

//
let loading = ref(false);

//当前图库分类的id
const image_class_id = ref(0);

//获取数据,p表示页码
function getData(p = null) {
    //如果传入当前页码
    if (typeof p == "number") {
        //当前页码
        currentPage.value = p;
    }
    loading.value = true;
    //调用指定分类下的图片分类接口，获取图片
    getImageList(image_class_id.value, currentPage.value)
    .then(res => {
        //总页码数
        total.value = res.totalCount;
        //每张图片
        list.value = res.list.map(o => {
            // 添加check属性：标记被选中的图片
            o.checked = false
            return o
        })
    })
    .finally(() => {
        loading.value = false;
    })
}

//根据左侧的图库分类ID重新加载图片列表
const loadData = (id) => {
    //页码回到第一页
    currentPage.value = 1;
    //图片分类的id
    image_class_id.value = id;
    //获取数据
    getData();
}

//修改图片名称
const handleEdit = (item) => {
    //调用弹出输入框方法
    showPrompt("重命名", item.name)
    .then(({ value }) => {
        console.log('value=',value)
        loading = true;
        //调用更新图片的接口方法
        updateImage(item.id, value)
        .then(res => {
            toast("修改成功")
        })
        .finally(() => {
            loading = false;
        })
    })
}

//删除图片
const handleDelete = (id) => {
    loading.value = true;
    deleteImage([id])
    .then(res => {
        toast("删除成功")
        getData()
    })
    .finally(() => {
        loading.value = false;
    });
}

//上传成功
const handleUpLoadSuccess = () => getData(1);

const props =defineProps({
    openChoose: {
        type: Boolean,
        default: false
    },
    limit:{
        type:Number,
        default:1
    }
})

//获取选中的图片：把符合条件的图片筛选出来
const checkedImage = computed(() => list.value.filter(o => o.checked))

const emit = defineEmits(["choose"])
const handleChooseChange = (item) => {
    //如果选中图片超过xx张就会报错
    if (item.checked && checkedImage.value.length > props.limit) {
        item.checked = false
        return toast(`最多只能选中${props.limit}张`,'error');
    }
    //如果只选中1张图片:就把该图片传给父组件：ChooseImage.vue
    emit("choose", checkedImage.value)
}

//向父组件暴露该方法
defineExpose({
    loadData,
    openUploadFile
})
</script>
<style scoped>
.image-main {
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-main .bottom {
    height: 50px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}

.image-title {
    position: absolute;
    top: 122px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>