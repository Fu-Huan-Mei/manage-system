<template>
    <!--商品分类-->
    <form-drawer ref="formDrawerRef" title="推荐商品" @submit="handleConnect" confirmText="关联">
        <el-table :data="tableData" border stripe style="width:100%;">
            <el-table-column prop="goods_id" label="ID" width="60" />
            <el-table-column label="商品封面" width="60">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="fill" :lazy="true" style="width:64px; height:64px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-popconfirm title="是否要删除该商品" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button type="text" size="small" :loading="row.loading">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </form-drawer>

    <choose-goods ref="chooseGoodsRef"></choose-goods>
</template>
<script setup>
import ChooseGoods from "~/components/ChooseGoods.vue";
import FormDrawer from '~/components/FormDrawer.vue';
import { ref } from "vue";
import { getCategoryGoods, deleteCategoryGoods,connectCategoryGoods } from '~/api/category.js';
import { toast } from "~/composables/util.js";

const formDrawerRef = ref(null);

const chooseGoodsRef = ref(null)
//表格数据
const tableData = ref([])
//分类id
const category_id = ref(0)

//打开推荐商品弹框
const open = (item) => {
    category_id.value = item.id
    item.goodsDrawerLoading = true;
    //获取数据
    getData()
        .then(res => {
            //如果成功，打开弹窗
            formDrawerRef.value.open()
        })
        .finally(() => {
            item.goodsDrawerLoading = false;
        })
}

//获取数据
function getData() {
    return getCategoryGoods(category_id.value)
        .then(res => {
            tableData.value = res.map(o => {
                o.loading = false
                return o
            })
        })
        .finally(() => {

        })
}

//删除
const handleDelete = (row) => {
    row.loading = true
    deleteCategoryGoods(row.id)
    .then(res => {
        toast('删除成功')
        getData()
    } )
}

//打开关联弹框
const handleConnect = () => {
    chooseGoodsRef.value.open((multiSelectionIds) => {
        chooseGoodsRef.value.btnLoading = true;
        //发送关联请求
        connectCategoryGoods({
            category_id:category_id.value,
            goods_ids:multiSelectionIds
        }).then( res => {
            toast('关联成功')
            getData()
           
        }).finally(() => {
            chooseGoodsRef.value.btnLoading = false;
        })
    })
}

defineExpose({
    open
})
</script>