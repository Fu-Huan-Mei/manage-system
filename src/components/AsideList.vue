<template>
    <!--非激活状态：分类列表-->
    <div class="aside-list" :class="{'active': active}">
        <!--分类标题:超出部分隐藏-->
        <span class="truncate">
            <slot></slot>
        </span>
        <!--编辑图标-->
        <el-button class="ml-auto px-1" text type="primary" size="small" @click.stop="$emit('edit')">
            <el-icon :size="12">
                <Edit />
            </el-icon>
        </el-button>
        <!--删除图标-->
    <span  @click.stop="()=>{}">
        <el-popconfirm title="是否要删除该分类" confirm-button-text="确认" cancel-button-text="取消" @confirm="$emit('delete')">
            <template #reference>
                <el-button text type="primary" size="small">
                    <el-icon :size="12"><Close /></el-icon>
                </el-button>
            </template>
        </el-popconfirm>
    </span>
    </div>

    <!-- 激活状态：分类列表
     <div class="aside-list active">
        <span class="truncate"><slot></slot></span>
        <el-button class="ml-auto px-1" text type="primary" size="small">
            <el-icon :size="12"><Edit /></el-icon>
        </el-button>
        <el-button text type="primary" size="small">
            <el-icon :size="12"><Close /></el-icon>
        </el-button>
    </div> -->
</template>
<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
})
defineEmits(['edit', 'delete'])
</script>
<style scoped>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
    @apply bg-blue-50;
}</style>
