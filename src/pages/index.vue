<template>
    <!--后台首页：中间部分的展示区-->
    <div>
        <!--头部4个卡片：支付订单、订单量、销售额、新增用户：每个列之间的间隔为20个像素-->
        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <template v-if="panels.length == 0">
                <!--骨架屏-->
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%;" animated loading>
                        <!--卡片的标题和标签：具名插槽-->
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <!--左边标题-->
                                        <el-skeleton-item variant="text" style="width: 50%" />
                                        <!--右边标签-->
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <!--卡片中间的数据-->
                                <el-skeleton-item variant="h3" style="width: 80%" />
                                <!--卡片中间的分割线-->
                                <el-divider />
                                <div class="flex justify-between text-sm text-gray-500">
                                    <!--左边-->
                                    <el-skeleton-item variant="text" style="width: 50%" />
                                    <!--右边-->
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>

            <!--横向布局：4个卡片：支付订单、订单量、销售额、新增用户：每个列之间的间隔为20个像素-->
            <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
                <!--卡片的标题和标签：具名插槽，父组件可以在其中插入自定义的内容-->
                <el-card shadow="hover" class="border-0">
                    <!--卡片的标题和标签：具名插槽，父组件可以在其中插入自定义的内容-->
                    <template #header>
                        <div class="flex justify-between">
                            <!--左边标题-->
                            <span class="text-sm">{{ item.title }}</span>
                            <!--右边标签-->
                            <el-tag :type="item.unitColor" effect="plain">
                                {{ item.unit }}
                            </el-tag>
                        </div>
                    </template>
                    <!--卡片中间的数字-->
                    <span class="text-3xl font-bold text-gray-500">
                        <!--调用数字动画-->
                        <CountTo :value="item.value" />
                    </span>
                    <!--卡片中间的分割线-->
                    <el-divider />
                    <!--底部-->
                    <div class="flex justify-between text-sm text-gray-500">
                        <!--左边-->
                        <span>{{ item.subTitle }}</span>
                        <!--右边-->
                        <span>{{ item.subValue }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!--中部8个导航卡片展示区-->
        <IndexNavs></IndexNavs>

        <!--底部展示区-->
        <el-row :gutter="20" class="mt-5">
            <!--左边表格-->
            <el-col :span="12" :offset="0">
                <!--表格组件-->
                <index-chart v-permission="['getStatistics3,GET']"></index-chart>
            </el-col>
            <!--右边卡片-->
            <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
                <index-card title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" class="mb-3"></index-card>
                <index-card title="交易提示" tip="需要及时处理的交易订单" :btns="order"></index-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { getStatistics1, getStatistics2 } from "~/api/index.js";
import { ref } from "vue";
import CountTo from "~/components/CountTo.vue";
import IndexNavs from "~/components/IndexNavs.vue";
import IndexChart from "~/components/IndexChart.vue";
import IndexCard from "~/components/IndexCard.vue";
const panels = ref([]);
getStatistics1().then(res => {
    panels.value = res.panels;
})

const goods = ref([]);
const order = ref([]);
getStatistics2().then(res => {
    goods.value = res.goods
    order.value = res.order
})
</script>