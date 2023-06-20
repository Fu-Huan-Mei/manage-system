<template>
    <!--推广人弹框-->
    <el-drawer :title="drawerTitle" v-model="dialogVisible" size="30%">
        <el-form :model="searchForm">
            <el-form-item label="时间选择" size="small">
                <el-radio-group v-model="searchForm.type">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button label="today">今天</el-radio-button>
                    <el-radio-button label="all">昨天</el-radio-button>
                    <el-radio-button label="last7days">最近7天</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开始日期">
                <el-date-picker v-model="searchForm.starttime" type="date" placeholder="开始日期" style="width:90%;"
                    value-format="YYY-MM-DD" />
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="searchForm.endtime" type="date" placeholder="结束日期" style="width:90%;"
                    value-format="YYY-MM-DD" />
            </el-form-item>
            <el-form-item label="用户类型">
                <el-radio-group v-model="searchForm.level">
                    <el-radio-button :label="0">全部</el-radio-button>
                    <el-radio-button :label="1">一级推广</el-radio-button>
                    <el-radio-button :label="2">二级推广</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        <el-card shadow="never" class="border-0">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <template v-if="type === 'user'">
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
                        <el-table-column label="用户信息" prop="username" align="center"></el-table-column>
                        <el-table-column label="推广数" prop="share_num" align="center"></el-table-column>
                        <el-table-column label="推广订单数" prop="share_order_num" align="center"></el-table-column>
                        <el-table-column label="绑定时间" prop="create_time" align="center"></el-table-column>
                </template>
                <template v-else>
                    <el-table-column label="订单号">
                        <template #default="{ row }">
                          {{  row.order.no }}
                        </template>
                    </el-table-column>
                    <el-table-column label="用户名|昵称|手机">
                        <template #default="{ row }">
                         <div v-if="!row.order.user">
                            该用户已被删除
                         </div>
                         <div v-else>
                            {{ row.order.user.username }} | {{ row.order.user.nickname }}|{{ row.order.user.phone }}
                         </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" prop="create_time"></el-table-column>
                    <el-table-column label="返佣金额" prop="commission"></el-table-column>
                </template>
            </el-table>
            <div class="flex items-center justify-center mt-5">
                <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>
    </el-drawer>
</template>
<script setup>
import { ref,computed } from "vue";
import {
    getAgentList,
    getAgentOrderList
} from "~/api/distribution.js";
import { useInitTable } from '~/composables/useCommon.js';
const {
    searchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData
} = useInitTable({
    searchForm: {
        type:"all",
        starttime:null,
        endtime:null,
        level: 0,
        user_id: 0
    },
    getList: (() => {
        return props.type === 'user' ? getAgentList :  getAgentOrderList
    })(),
    //特殊的方法
    onGetListSuccess: (res) => {
        //获取列表数据
        tableData.value = res.list
        total.value = res.totalCount
    }
})

const props = defineProps({
    type:{
        type:String,
        default:'user'
    }
})
const dialogVisible = ref(false);

const drawerTitle = computed(() => {
    return props.type === 'user' ? '推广人列表' : '推广订单列表'
})

const open = (id) => {
    dialogVisible.value = true;
    searchForm.user_id = id;
    getData();
}

//重置表单
const  resetSearchForm = () => {
    searchForm.type="all";
    searchForm.starttime = null;
    searchForm.endtime = null;
    searchForm.level = 0;
}

defineExpose({
    open
})
</script> 