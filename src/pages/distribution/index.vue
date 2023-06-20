<template>
    <div>
        <panel></panel>

        <el-card shadow="never" class="border-0">
            <!--搜索组件-->
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <!--搜索框:默认插槽-->
                <search-item label="时间选择">
                  <el-radio-group v-model="searchForm.type">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button label="today">今天</el-radio-button>
                    <el-radio-button label="all">昨天</el-radio-button>
                    <el-radio-button label="last7days">最近7天</el-radio-button>
                  </el-radio-group>
                </search-item>
                <template #show>
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
                    <search-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable></el-input>
                    </search-item>
                </template>
            </Search>


            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column label="ID"  prop="id" align="center"/>
                <el-table-column label="头像" width="65">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <!--头像-->
                            <el-avatar :size="40" :src="row.avatar">
                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                            </el-avatar>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户信息" width="200">
                    <template #default="{ row }">
                        <div class="text-xs">
                            <P>用户:{{row.username}}</P>
                            <P>昵称:{{row.nickname}}</P>
                            <P>姓名:{{row.user_info.name}}</P>
                            <P>电话:{{row.user_info.phone}}</P>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="推广用户数量" prop="share_num"></el-table-column>
                <el-table-column align="center" label="订单数量" prop="share_order_num"></el-table-column>
                <el-table-column align="center" label="订单金额" prop="order_price"></el-table-column>
                <el-table-column align="center" label="账户佣金" prop="commission"></el-table-column>
                <el-table-column align="center" label="已提现金额" prop="cash_out_price"></el-table-column>
                <el-table-column align="center" label="提现次数" prop="cash_out_time"></el-table-column>
                <el-table-column align="center" label="未提现金额" prop="no_cash_out_price"></el-table-column>
                <!--操作-->
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template #default="{row}">
                        <el-button type="primary" size="small" text @click="openDataDrawer(row.id,'user')">推广人</el-button>
                        <el-button type="primary" size="small" text @click="openDataDrawer(row.id,'order')">推广订单</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--下：分页-->
            <div class="flex items-center justify-center mt-5">
                <!--当触发current-change事件时，getData方法可能用于基于组件的当前状态检索新数据-->
                <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>

        <data-drawer ref="DataDrawerRef"></data-drawer>
        <data-drawer ref="orderDataDrawerRef" type="order"></data-drawer>
    </div>
</template>
<script setup>
import dataDrawer from "./dataDrawer.vue";
import panel from "./panel.vue";
import SearchItem from "~/components/SearchItem.vue";
import Search from "~/components/Search.vue";
import { ref } from "vue"
import {
    getAgentList
} from "~/api/distribution.js"
import { useInitTable } from '~/composables/useCommon.js';
const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData
} = useInitTable({
    searchForm: {
        keyword: "",
        type:"all",
        starttime:null,
        endtime:null
    },
    getList: getAgentList,
    //特殊的方法
    onGetListSuccess: (res) => {
        //获取列表数据
        tableData.value = res.list
        total.value = res.totalCount
    }
})
const DataDrawerRef = ref(null);
const orderDataDrawerRef = ref(null);
//打开推广人弹窗
const openDataDrawer = (id,type) => {
    (type === "user" ?  DataDrawerRef : orderDataDrawerRef).value.open(id);
}

</script>
