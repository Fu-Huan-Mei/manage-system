<template>
    <!--物流信息弹框组件-->
    <el-drawer title="物流信息" v-model="dialogVisible" size="40%">
        <el-card shadow="never" class="border-0 mb-3">
            <div class="flex items-center">
                <el-image :src="info.logo" fit="fill" :lazy="true" style="width:60px; height:60px;" class="rounded border"></el-image>
                <div class="ml-3">
                    <p>物流公司:{{ info.typename }}</p>
                    <p>物流单号:{{ info.number }}</p>
                </div>
            </div>
        </el-card>
        <!--时间线组件-->
        <el-card shadow="never" class="border-0 border-t">
            <el-timeline class="ml-[-40px]">
                <el-timeline-item :timestamp="item.time" placement="top" v-for="(item, index) in info.list" :key="index">
                    {{ item.status }}
                </el-timeline-item>
            </el-timeline>
        </el-card>
    </el-drawer>
</template>
<script setup>
import { getShipInfo } from '~/api/order.js';
import { ref } from "vue";
const dialogVisible = ref(false)

//物流信息
const info = ref({})

const open = (id) => {
    return getShipInfo(id)
        .then(res => {
            //如果请求失败，会获取订单号失效信息
            if (res.status != 0) {
                return toast(res.msg, "error")
            }
            //请求成功，获取物流信息
            info.value = res.result
            //打开
            dialogVisible.value = true
        })

}

defineExpose({
    open
})

</script>