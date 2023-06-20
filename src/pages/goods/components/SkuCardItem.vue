<template>
    <!--添加值-->
    <div v-loading="loading">
        <el-tag v-for="(tag, index) in item.goodsSkusCardValue" :key="index" class="mx-1" closable
            :disable-transitions="false" @close="handleClose(tag)" effect="plain">
            <el-input v-model="tag.text " size="small" label="" placeholder="选项值"  @change="handleChange($event,tag)" class="w-20 ml-[-10px]"></el-input>
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"/>
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + 添加选项值
        </el-button>
    </div>
</template>
<script setup>
import { initSkuCardItem } from "~/composables/useSku.js";
import { ElInput } from 'element-plus'
const props = defineProps({
    skuCardId: [Number, String]
})
//初始化规格值（规格属性的值
const {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange
} = initSkuCardItem(props.skuCardId);
</script>