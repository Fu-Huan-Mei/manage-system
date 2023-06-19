<template>
    <!--菜单权限管理：弹框：菜单图标组件-->
    <div class="flex items-center">
        <!--选中才渲染动态图标-->
        <el-icon v-if="modelValue" :size="20" class="mr-2">
            <component :is="modelValue"></component>
        </el-icon>
        <!--下拉框菜单-->
        <el-select :modelValue="modelValue" class="m-2" placeholder="请选择请求方式" @change="handleChange" filterable>
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <div class="flex items-center justify-center">
                    <el-icon>
                        <component :is="item"></component>
                    </el-icon>
                    <span class="text-gray-500">{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>
<script setup>
import * as iconList from '@element-plus/icons-vue';
import { ref } from 'vue';
defineProps({
    modelValue: String
})

const emit = defineEmits(["update:modeValue"])
//获取所有图标名称
const icons = ref(Object.keys(iconList));
//监听选中值icon的变化
const handleChange = (icon) => {
    emit("update:modelValue", icon);
}
</script>