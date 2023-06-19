<template>
    <el-drawer 
    v-model="showDrawer" 
    :title="title" 
    :size="size" 
    :close-on-click-modal="false" 
    :destroy-on-close="destroyOnClose">
        <div class="formDrawer">
            <!--上部：表单-->
           <div class="body">
               <!--将父组件中的内容插入到插槽中-->
                <slot></slot>
            </div>
           <!--底部：按钮-->
           <div class="actions">
            <el-button type="primary" @click="submit" :loading="loading">{{confirmText}}</el-button>
            <el-button type="default" @click="close">取消</el-button>
           </div>
        </div>
    </el-drawer>
</template>
<script setup>
import { ref } from 'vue';

///是否加载（显示进度条）
const loading = ref(false);
const showLoading = () => loading.value = true;
const hideLoading = () => loading.value = false;

//控制弹窗是否关闭：默认弹框关闭
const showDrawer = ref(false);
//打开弹框
const open = () => showDrawer.value = true;
//关闭弹框
const close = () => showDrawer.value = false;

//定义了一个名为 "submit" 的事件:该件可以在组件中被触发，从而向父组件发送消息
const emit = defineEmits(["submit"]);

//提交按钮：使用 emit 函数`通知`父组件去执行"submit"事件中的`onSubmit方法`
const submit = () => emit("submit");

//初始化弹框drawer相关信息：当父组件`传递属性`给子组件时，Vue.js 会自动对这些属性进行类型检查和默认值处理
const props = defineProps({
    title:String,
    size:{
        type:String,
        default:"45%"
    },
    //控制是否在关闭 Drawer 之后将子元素全部销毁
    destroyOnClose:{
        type:Boolean,
        default:false
    },
    //confirmText 是作为一个属性传递给组件的
    confirmText:{
        type:String,
        default:"提交"
    }
});

//使用内置方法defineExpose向`父组件`暴露以下方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
});
</script>
<style scoped>
.formDrawer{
    width:100%;
    height:100%;
    position: relative;
    @apply flex flex-col;
}
.formDrawer .body{
    flex:1;
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:50px;/*为了让按钮置于页面底部*/
    overflow-y: auto;/*超出部分：可滚动：纵向滚动条*/
}
.formDrawer .actions{
    height:50px;
    @apply mt-auto flex items-center;
}
</style>