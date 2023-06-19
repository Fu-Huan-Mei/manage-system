<template> 
    <el-form :model="model" label-width="80px" class="mb-3" size="small">
        <el-row :gutter="20">
            <!--左：搜索框:SearchItem.vue组件-->
            <slot/>
            <!--中：高级搜索:SearchItem.vue组件-->
            <template v-if="showSearch">
                <slot name="show"></slot>
            </template>
            <!--右：搜索和重置按钮-->
            <el-col :span="8" :offset="showSearch ? 0 : 8">
                <div class="flex items-center justify-end">
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button type="primary" text @click="showSearch = !showSearch" v-if="hasShowSearch">
                    {{ showSearch ? '收起' : "展开" }}
                        <el-icon>
                            <ArrowUp v-if="showSearch"/>
                            <ArrowDown v-else/>
                        </el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>
<script setup>
import {ref,useSlots} from 'vue';
defineEmits(['search','reset']);
defineProps({
    model:Object
})


//是否显示高级搜索：默认情况下收起高级搜索
const showSearch = ref(false)

//插槽是否存在内容
const slots = useSlots()

//如果slots.show有值，就是true；否则为false
const hasShowSearch = ref(!!slots.show)
</script>
