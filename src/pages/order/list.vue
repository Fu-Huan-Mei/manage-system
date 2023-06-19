<template>
    <!--订单列表-->
    <div>
        <!--标签页-->
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in  tabbars" :key="index">
            </el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class="border-0">

            <!--搜索组件-->
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <!--搜索框-->
                <search-item label="关键词">
                    <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
                </search-item>
                 <!--中：高级搜索：商品分类-->
                <template #show>
                    <search-item label="收货人">
                        <el-input v-model="searchForm.no" placeholder="收货人" clearable></el-input>
                    </search-item>
                    <search-item label="手机号">
                        <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
                    </search-item>
                    <search-item label="开始日期">
                        <el-date-picker
                        v-model="searchForm.starttime"
                        type="date"
                        placeholder="开始日期"
                        style="width:90%;"
                        value-format="YYY-MM-DD"/>
                    </search-item>
                    <search-item label="结束日期">
                        <el-date-picker
                        v-model="searchForm.endtime"
                        type="date"
                        placeholder="结束日期"
                        style="width:90%;"
                        value-format="YYY-MM-DD"/>
                    </search-item>
                </template>
            </Search>

            <!-- 新增|刷新组件|上架/下架 -->
            <list-header   layout="refresh,download" @refresh="getData" @download="handleExportExcel">
                <el-button type="danger" size="small" @delete="handleMultiDelete">批量删除</el-button>
            </list-header>

            <!--商品-->
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange" ref="multipleTableRef">
                <!--多选框-->
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                            <div class="flex text-sm">
                               <div class="flex-1">
                                    <p>订单号:</p>
                                    <small>{{row.no}}</small>
                               </div>
                               <div>
                                    <p>下单时间:</p>
                                    <small>{{row.create_time}}</small>
                               </div>
                            </div>
                            <div class="flex py-2" v-for="(item,index) in row.order_items" :key="index">
                                <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="fill"
                                 :lazy="true" style="width:30px; height:30px;">
                                </el-image>
                                <p class="text-blue-500 ml-2">{{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
                                </p>
                            </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实际付款" width="120" prop="total_price">
                    <template #default="{ row }">
                        {{ row.total_price ? row.total_price : '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="买家" width="120" align="center" prop="status">
                    <template #default="{ row }">
                        <p>{{row.user.nickname || row.user.username}}</p>
                        <small>(用户ID:{{ row.user.id }})</small>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" width="170" align="center" prop="status" v-if="searchForm.tab != 'delete'">
                    <template #default="{ row }">
                        <div>付款状态:
                            <el-tag type="success" size="small"  v-if="row.payment_method==='wechat'">微信支付</el-tag>
                            <el-tag type="primary" size="small"  v-if="row.payment_method==='alipay'">支付宝支付</el-tag>
                            <el-tag type="info" size="small" v-else>未支付</el-tag>
                        </div>
                        <div>发货状态:
                            <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">
                                {{ row.ship_data ? '已发货' :'未发货' }}
                            </el-tag>
                        </div>
                        <div>收货状态:
                            <el-tag :type="row.ship_status === 'received'? 'success' : 'info'" size="small">
                                {{ row.ship_status === 'received'? '已收货' :'未收货' }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <!--操作-->
                <el-table-column label="操作" align="center">
                    <template #default="{row}">
                        <el-button type="primary" size="small" text class="px-1" @click="openInfoModal(row)">订单详情</el-button>
                        <el-button type="primary" size="small" text class="px-1" v-if="searchForm.tab === 'noship'">订单发货</el-button>
                        <el-button type="primary" size="small" text class="px-1" v-if="searchForm.tab === 'refunding'">同意退款</el-button>
                        <el-button type="primary" size="small" text class="px-1" v-if="searchForm.tab === 'refunding'">拒绝退款</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--下：分页-->
            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>

        <!--导出订单组件-->
        <export-excel ref="ExportExcelRef" :tabs="tabbars"></export-excel>
        <!--查看订单详情组件-->
        <info-modal ref="InfoModalRef" :info="info"></info-modal>
    </div>
</template>
<script setup>
import InfoModal from "./InfoModal.vue";
import SearchItem from "~/components/SearchItem.vue";
import Search from "~/components/Search.vue";
import ListHeader from "~/components/ListHeader.vue";
import { ref } from "vue"
import ExportExcel from "./ExportExcel.vue";
import {
    getOrderList,
    deleteOrder
} from "~/api/order.js"
import { useInitTable } from '~/composables/useCommon.js'
const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete
} = useInitTable({
    //query参数
    searchForm: {
        tab: "all",
        no: '',
        starttime: '',
        endtime: '',
        name: '',
        phone: ''
    },
    //获取商品资料列表
    getList: getOrderList,
    onGetListSuccess: (res) => {
        //商品资料数据
        tableData.value = res.list.map(o => {
            // 定义按钮状态
            o.bannersLoading = false
            o.contentLoading = false
            o.skusLoading = false
            return o
        })
        //获取商品总数
        total.value = res.totalCount

    },
    delete: deleteOrder
})


//订单类型
const  tabbars = [
    {
        key: 'all',
        name: '全部'
    },
    {
        key: 'nopay',
        name: '待付款'
    },
    {
        key: 'noship',
        name: '待发货'
    },
    {
        key: 'shiped',
        name: '已发货'
    },
    {
        key: 'received',
        name: '已收货'
    },
    {
        key: 'finish',
        name: '已完成'
    },
    {
        key: 'closed',
        name: '已关闭'
    },
    {
        key: 'refunding',
        name: '退款中'
    },
]

const ExportExcelRef = ref(null)

//打开导出订单弹框
const handleExportExcel = () => {
    ExportExcelRef.value.open()
}

const  InfoModalRef = ref(null)

//每个商品信息
const info = ref(null)

//打开查看订单详情弹框
const openInfoModal = (row) => {
    row.order_items = row.order_items.map(o => {
        //如果是多规格并且商品规格存在
        if(o.skus_type === 1 && o.goods_skus){
            let s = []
            for(const k in o.goods_skus.skus){
                s.push(o.goods_skus.skus[k].value)
            }
            //将数组转为字符串,存在sku属性中
            o.sku = s.join(",")
        }
        return o
      
    })
    info.value = row
    InfoModalRef.value.open()
}
</script>