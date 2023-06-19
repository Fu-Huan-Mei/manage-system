<template>
    <!--商品规格-->
    <form-drawer ref="formDrawerRef" @submit="submit" destroy-on-close title="设置商品规格" size="70%">
        <el-form :model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type">
                    <el-radio :label="0">单规格</el-radio>
                    <el-radio :label="1">多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--单规格-->
            <template v-if="form.sku_type === 0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice" size="normal" style="width:35%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice" size="normal" style="width:35%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice" size="normal" style="width:35%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight" size="normal" style="width:35%;">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积">
                    <el-input v-model="form.sku_value.volume" size="normal" style="width:35%;">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>

            <!--多规格-->
            <template v-else>
                <!--规格选项组件-->
                <sku-card></sku-card>
            </template>
        </el-form>
    </form-drawer>
</template>
<script setup>
import { goodsId, initSkuCardList } from "~/composables/useSku.js"
import SkuCard from "./components/SkuCard.vue";
import { readGoods, updateGoodsSkus } from "~/api/goods.js";
import { reactive, ref } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { toast } from "~/composables/util.js";
//获取节点
const formDrawerRef = ref(null);
//定义一个表单数据对象：商品详情
const form = reactive({
    //规格类型：0单规格
    "sku_type": 0,
    //单规格属性（sku_type=0时必填）
    "sku_value": {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    } 
})


//打开弹窗
const open = (row) => {
    //记录商品id
    goodsId.value = row.id;
    row.skusLoading = true;
    //读取商品相关信息(初始化)
    readGoods(goodsId.value)
        .then(res => {
            //获取content
            form.sku_type = res.sku_type;
            form.sku_value = res.sku_value || {
                "oprice": 0,
                "pprice": 0,
                "cprice": 0,
                "weight": 0,
                "volume": 0
            };
            //初始化规格选项
            initSkuCardList(res);
            // console.log('res=',res);
            //打开弹窗
            formDrawerRef.value.open();
        })
        .finally(() => {
            row.skusLoading = false;
        })
}

const emit = defineEmits(['reloadData'])

//提交数据
const submit = () => {
    //显示按钮loading状态
    formDrawerRef.value.showLoading();
    //更新商品规格
    updateGoodsSkus(goodsId.value, form)
        .then(res => {
            toast("设置商品规格成功")
            //关闭弹框
            formDrawerRef.value.close();
            //刷新数据
            emit('reloadData')
        })//请求结束
        .finally(() => {
            //请求结束，隐藏按钮的loading状态
            formDrawerRef.value.hideLoading();
        })
}

defineExpose({
    open
})
</script>