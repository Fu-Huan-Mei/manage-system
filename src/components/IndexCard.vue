<template>
    <!--卡片：店铺及商品展示-->
  <el-card shadow="never">
      <!--卡片：头部-->
    <template #header>
        <div class="flex justify-between">
            <!--左边-->
            <span class="text-sm">{{ title }}</span>
            <!--右边-->
            <el-tag type="danger" effect="plain">
                {{ tip }}
            </el-tag>
        </div>
    </template>
    <!--卡片：主体内容:gutter 属性指定了行内网格间距的大小-->
    <el-row :gutter="20">
        <!--第1个：定义了行中的列，其中 span 属性指定了列占据的网格数，offset 属性指定了列向右的偏移量-->
        <el-col :span="6" :offset="0" v-for="(item,index) in btns" :key="index">
            <el-card shadow="hover" class="border-0 bg-light-400">
                <div class="flex flex-col items-center justify-center">
                    <span class="text-xl mb-2">{{item.value}}</span>
                    <span class="text-xs text-gray-500">{{item.label}}</span>
                </div>
            </el-card>
        </el-col>
    </el-row>
  </el-card>
</template>
<script setup>
defineProps({
    title:String,
    tip:String,
    btns:Array
})
</script>