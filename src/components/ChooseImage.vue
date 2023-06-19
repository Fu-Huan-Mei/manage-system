<template>
    <!--选择图片-->
    <!--如果modelValue存在（即非空），则渲染<el-image>组件来显示该图片；否则，不渲染任何内容-->
    <div v-if="modelValue && preview">
        <!--点击头像获取图片:model Value是图片地址-->
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"  class="w-[100px] h-[100px] rounded border mr-2">
        </el-image>
        <div v-else class="flex flex-wrap">
            <!--显示设置轮播图功能中的图片：modelValue是图片地址组成的数组-->
            <div class="relative mx-1 mb-2  w-[100px] h-[100px]" v-for="(url, index) of modelValue" :key="index">
                <el-icon class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded-full"
                 style="z-index:10;" @click="removeImage(url)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>
    </div>

    <!--图库组件：+按钮-->
    <div v-if="preview" class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text-gray-500">
            <Plus />
        </el-icon>
    </div>

    <!--图库列表弹框-->
    <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
        <!--图库列表-->
        <el-container class="bg-white rounded" style="height:70vh;">
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
                <image-main :limit="limit" openChoose ref="ImageMainRef" @choose="handleChoose"></image-main>
            </el-container>
        </el-container>

        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";
import { toast } from '~/composables/util.js';

//获取节点
const ImageAsideRef = ref(null);

//打开抽屉
const handleOpenCreate = () => ImageAsideRef.value.handleCreate();

const ImageMainRef = ref(null);

const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id);

//上传图片
const handleOpenUploadFile = () => ImageMainRef.value.openUploadFile();

const dialogVisible = ref(false);

//存储返回给富文本编辑器图片
const callbackFunction = ref(null);

//打开弹窗
const open = ( callback=null) => {
    callbackFunction.value = callback
    dialogVisible.value = true;
}

//关闭弹窗
const close = () => {
    dialogVisible.value = false;
}

const props = defineProps({
    modelValue: [String, Array],
    limit:{
        type:Number,
        default:1
    },
    //默认显示选择图片的+按钮
    preview:{
        type:Boolean,
        //默认显示选择图片的+按钮
        default:true
    }
})

//"update:modelValue"事件会在`组件内部`被`触发`，以通知`父`组件`更新组件`的值，并将`新值`作为参数传递给父组件
const emit = defineEmits(["update:modelValue"])

//存储了选择的图片的地址，它的初始值为空数组
let urls = []

//处理选择文件的回调函数:e包含了用户选择的文件的信息
const handleChoose = (e) => {
    //将选择的文件的地址存储到urls数组
    urls = e.map(o => o.url)
}

//提交图片
const submit = () => {
    //图片地址
    let value = []
    //如果只选一张图片，就直接传此图片的url
    if(props.limit == 1){
        value =  urls[0]
    }else{
        //如果选中多张图片：新旧图片的地址合并为新数组
        value = props.preview ?  [...props.modelValue,...urls] : [...urls]
        //如果图片地址>限制图片传入的数量
        if(value.length > props.limit){
            let limit = props.preview ? (props.limit-props.modelValue.length) : props.limit
            //就做出提示
            return toast("最多还能选择"+ limit + "张")
        }
    }
    //将图片地址传给父组件
    if (value && props.preview) {
        //通知父组件触发"update:modelValue"事件，并将总地址数量传给父组件
        emit("update:modelValue", value)
    }
    if(!props.preview && typeof callbackFunction.value === "function"){
        callbackFunction.value(value) 
    }
    //调用close函数来关闭组件
    close()
}

//删除轮播图：删除鼠标点击得这张图片
const removeImage = (url) =>  emit("update:modelValue",props.modelValue.filter( u =>  u != url  )); 

defineExpose({
    open
})
</script>
<style scoped>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover: (bg-gray-100);
}

.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}
</style>