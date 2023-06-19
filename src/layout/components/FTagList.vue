<template>
    <!--后台布局：标签导航栏-->
    <div class="f-tag-list" :style="{ left:$store.state.asideWidth } ">
        <!--横向标签页：Tabs标签-->
        <el-tabs demo-tabs v-model="activeTab" type="card" class="demo-tabs" 
        @tab-remove="removeTab" style="min-width:100px;" @tab-change="changeTab">
            <el-tab-pane v-for="item in tabList" :closable="item.path != '/'" 
            :key="item.path" :label="item.title" :name="item.path">
            </el-tab-pane>
        </el-tabs>

        <!--下拉菜单-->
        <span class="tag-btn">
            <!--command	点击菜单项触发的事件回调-->
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item  command="clearAll">全部关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height:44px"></div>
</template>
<script setup>
import {useTabList} from '~/composables/useTabList.js';
const {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
} = useTabList()

</script>
<style scoped>
.f-tag-list{
    @apply fixed bg-gray-100 flex items-center;
    top:64px;
    right:0;
    height:44px;
    z-index:100;
}
.tag-btn{
    @apply  bg-white rounded ml-auto flex justify-center items-center px-2;/*px-2=0.5rem*/
    height:32px;
}

:deep(.el-tabs__header){
    margin-bottom: 0;   
    border:0 !important;
}

:deep(.el-tabs__nav){
    border:0 !important;
}
:deep(.el-tabs__item){
    border:0 !important;
    height:32px;
    line-height:32px;
    margin-top:3px;
    @apply bg-white mx-1 rounded;
}
:deep(.is-disabled){
    cursor: not-allowed;
    @apply text-gray-300;
}
</style>

