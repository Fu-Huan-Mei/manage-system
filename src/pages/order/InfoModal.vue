<template>
    <el-drawer title="订单详情" v-model="dialogVisible" direction="rtl" size="50%">
        <!--订单信息-->
        <el-card shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">订单信息</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="订单号">
                    {{ info.no }}
                </el-form-item>
                <el-form-item label="付款方式">
                    {{ info.payment_method }}
                </el-form-item>
                <el-form-item label="付款时间">
                    {{ info.update_time }}
                </el-form-item>
                <el-form-item label="创建时间">
                    {{ info.create_time }}
                </el-form-item>
            </el-form>
        </el-card>
         <!--发货信息-->
        <el-card v-if="info.ship_data" shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">发货信息</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="物流公司">
                    {{ info.ship_data.express_company }}
                </el-form-item>
                <el-form-item label="运单号">
                    {{ info.ship_data.express_no }}
                    <el-button type="primary" size="small" text @click="openShipInfoModal(info.id)" class="ml-3" :loading="loading">查看物流</el-button>
                    
                </el-form-item>
                <el-form-item label="发货时间">
                    {{ ship_time }}
                </el-form-item>
            </el-form>
        </el-card>
        <!--商品信息-->
        <el-card shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">商品信息</b>
            </template>
            <div class="flex mb-2" v-for="(item, index) in info.order_items" :key="index">
                <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="fill" :lazy="true"
                    style="width:60px; height:60px;"></el-image>
                <div class="ml-2 text-sm">
                    <p>{{ item.goods_item ? item.goods_item.title : "商品已被删除" }}</p>
                    <p v-if="item.goods_item.sku_type === 1 && item.goods_skus" class="mt-1">
                        <el-tag type="info" size="small">{{ item.sku }}</el-tag>
                    </p>
                    <p>
                        <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
                        <span class="text-xs text-gray-500">X{{ item.num }}</span>
                    </p>
                </div>
            </div>
            <el-form label-width="80px">
                <el-form-item label="成交价">
                    <span class="text-rose-500 font-bold">￥{{ info.total_price }}</span>
                </el-form-item>
            </el-form>
        </el-card>
         <!--收货信息-->
        <el-card shadow="never" v-if="info.address" class="mb-3">
            <template #header>
                <b class="text-sm">收货信息</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="收货人">
                   {{ info.address.name }}
                </el-form-item>
                <el-form-item label="联系方式">
                    {{ info.address.phone }}
                </el-form-item>
                <el-form-item label="收货地址">
                     {{ info.address.province + info.address.city + info.address.district + info.address.address }}
                </el-form-item>
            </el-form>
        </el-card>
        <!--退款信息-->
        <el-card shadow="never" v-if="info.refund_status != 'pending'" class="mb-3">
            <template #header>
                <b class="text-sm">退款信息</b>
                <el-button type="text" disabled style="float:right;">{{refund_status}}</el-button>
            </template>
            <el-form label-width="80px">
                <el-form-item label="退款理由">
                    {{ info.extra.refund_reason }}
                </el-form-item>
            </el-form>
        </el-card>
    </el-drawer>
    <!--物流信息-->
    <ship-info-modal ref="ShipInfoModalRef"></ship-info-modal>
</template>
<script setup>
import ShipInfoModal from "./ShipInfoModal.vue";
import { ref,computed } from "vue";
import {  useDateFormat } from '@vueuse/core';
const dialogVisible = ref(false);

const loading = ref(false)

//订单详情信息
const props = defineProps({
    info: Object
})
const open = () => {
    dialogVisible.value = true
}

//发货时间
const ship_time = computed(( ) => {
    if(props.info.ship_data){
        //转为13位时间戳
        const s =  useDateFormat(props.info.ship_data.express_time * 1000,"YYYY-MM-DD HH:mm:ss")
        return s.value
    }
    return ""
})

//退款状态
const refund_status = computed(() => {
    const opt = {
        pending:"未退款",
        applied:"已申请,等待审核",
        processing:"退款中",
        success:"退款成功",
        falied:"退款失败"
    }
    return props.info.refund_status ? opt[props.info.refund_status] : ''
})

const ShipInfoModalRef = ref(null)
//物流信息
const openShipInfoModal = (id) => {
    loading.value = true
    ShipInfoModalRef.value.open(id).finally(() => loading.value = false)
}

defineExpose({
    open
})
</script>