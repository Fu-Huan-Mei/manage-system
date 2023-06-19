<template>
  
    <!--多规格：添加规格-->
    <el-form-item label="添加规格" v-loading="bodyLoading">
        <el-card shadow="never" class="w-full mb-3" v-loading="item.loading" v-for="(item, index) in sku_card_list" :key="item.id">
            <!--规格名称-->
            <template #header>
                <div class="flex items-center">
                    <!--左边：输入框-->
                    <el-input v-model="item.text" placeholder="规格名称" style="width:200px;" @change="handleUpdate(item)">
                      
                        <template #append>
                            <el-icon>
                                <more @click="handleChooseSku(item)" class="cursor-pointer"/>
                            </el-icon>
                        </template>
                    </el-input>
                    <!--右边：3个按钮-->
                    <!--上移-->
                    <el-button class='ml-auto' size="small" @click="sortCard('up',index)" :disabled="index == 0">
                        <el-icon>
                            <Top />
                        </el-icon>
                    </el-button>
                    <!--下移-->
                    <el-button size="small" @click="sortCard('down',index)" :disabled="index == (sku_card_list.length -1)">
                        <el-icon>
                            <Bottom />
                        </el-icon>
                    </el-button>
                    <!--删除-->
                    <el-popconfirm title="是否要删除该选项" confirmButtonText="确认"
                     cancelButtonText="取消"  @confirm="handleDelete(item)">
                        <template #reference>
                            <el-button size="small">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </template>

            <!--添加选项值组件-->
            <sku-card-item :skuCardId="item.id"></sku-card-item>
        </el-card>

        <!--添加规格-->
        <el-button type="success" size="small" :loading="btnLoading" @click="addSkuCardEvent">添加规格</el-button>
    </el-form-item>
    <!--规格选择弹框组件-->
    <choose-sku ref="ChooseSkuRef"></choose-sku>
</template>
<script setup>
import SkuCardItem from "./SkuCardItem.vue"
import ChooseSku from "~/components/ChooseSku.vue"
import {ref} from 'vue'
import { 
    sku_card_list, 
    addSkuCardEvent, 
    btnLoading, 
    handleUpdate, 
    handleDelete,
    sortCard,
    bodyLoading,
    handleChooseSetGoodsSkusCard
} from "~/composables/useSku.js"
const ChooseSkuRef = ref(null)

//打开当前规格选项对应的弹框
const handleChooseSku = (item) => {
    //调用open方法打开弹窗：value表示当前form表单的值
    ChooseSkuRef.value.open((value) => {
        //将表单数据传递给给弹框组件
        handleChooseSetGoodsSkusCard(item.id,{
            //规格名称
            name:value.name,
            //规格值
            value:value.list
        })
    });
}
</script>
<style>
.el-card_header {
    @apply !p-2 bg-gray-50;
}
</style>