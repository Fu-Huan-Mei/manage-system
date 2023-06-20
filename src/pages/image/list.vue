<template>
    <!--图库列表-->
    <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
        <!--头部-->
        <el-header class="image-header">
            <!--新增按钮-->
            <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
            <el-button type="warning" size="small" @click="handleOpenUploadFile">上传图片</el-button>
        </el-header>
        
        <!--主体-->
        <el-container>
            <!--侧边组件-->
           <image-aside ref="ImageAsideRef" @change="handleAsideChange"></image-aside>
            <!--中间组件-->
            <image-main ref="ImageMainRef"></image-main>
        </el-container>
    </el-container>
</template>
<script setup>
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";
import {ref} from 'vue';
//占满主体部分剩余空间：浏览器可视区高度
const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;
//获取节点
const ImageAsideRef = ref(null);
//打开抽屉
const handleOpenCreate = () => ImageAsideRef.value.handleCreate();
const ImageMainRef = ref(null);
//图库分类id
const handleAsideChange = function(image_class_id){ 
    ImageMainRef.value.loadData (image_class_id);
}  
//打开上传图片弹框
const handleOpenUploadFile = () => ImageMainRef.value.openUploadFile();
</script>
<style scoped>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>