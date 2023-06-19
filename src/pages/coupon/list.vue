<template>
    <!--优惠券模块-->
    <el-card shadow="never" class="border-0">
        <!--上：新增/刷新-->
        <list-header @create="handleCreate" @refresh="getData"></list-header>

        <!--中：表格-->
        <el-table :data="tableData" stripe style="width:100%" v-loading="loading">
            <!--标题-->
            <el-table-column prop="title" label="优惠券名称" width="350">
                <template #default="{ row }">
                    <div class="border border-dashed py-2 px-4 rounded"
                        :class="row.statusText == '领取中' ? 'active' : 'inactive'">
                        <h5 class="font-bold text-md">{{ row.name }}</h5>
                        <small>{{ row.start_time }}~~{{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="statusText" label="状态"/>
            <el-table-column label="优惠">
                <template #default="{ row }">
                    {{ row.type == 0 ? "满减" : "折扣" }} {{ row.type == 0 ? ("￥" + row.value) : (row.value + "折") }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" />
            <el-table-column prop="used" label="已使用" />
            <!--操作-->
            <el-table-column label="操作" width="180" align="center">
                <!--作用域插槽：用于访问父组件传递给子组件的数据，不需要<slot>标签，只需要在相应的位置使用scope来访问数据即可-->
                <!-- scope 是一个对象，包含了当前表格行的数据以及一些方法-->
                <template #default="scope">

                    <el-button  v-if="scope.row.statusText != '未开始'"
                    type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>

                    <!--@confirm事件将触发handleDelete函数，并传递scope.row.id作为参数，用于删除当前行的数据-->
                    <el-popconfirm  v-if="scope.row.statusText != '领取中'" title="是否要删除该优惠券"
                     confirm-button-text="删除" cancel-button-text="取消"  @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>

                    <el-popconfirm v-if="scope.row.statusText === '领取中'" title="是否要让该优惠券失效？" 
                    confirm-button-text="失效" cancel-button-text="取消"
                    @confirm="handleStatusChange(0,scope.row) ">
                    <template #reference>
                        <el-button text type="danger" size="small">失效</el-button>
                    </template>
                </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!--下：分页-->
        <div class="flex items-center justify-center mt-5">
            <!--当触发current-change事件时，getData方法可能用于基于组件的当前状态检索新数据-->
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>

        <!--新增公告弹窗-->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <!--prop 属性用于指定表单项的字段名，即在表单提交时所传递的参数名,prop 属性的值应该与后端接口或数据模型中定义的字段名保持一致-->
                <el-form-item label="优惠券名称" prop="name">
                    <el-input v-model="form.name" placeholder="优惠券名称" style="width:50%;"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0">满减</el-radio>
                        <el-radio :label="1">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value" style="width:50%;">
                    <el-input v-model="form.value" placeholder="面值">
                        <template #append>{{ form.type ? '折' : '元'}}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="0" :max="10000">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price">
                    <el-input v-model="form.min_price" placeholder="最低使用价格" type="number"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="活动时间">
                    <div class="block">
                        <span class="demonstration"></span>
                        <el-date-picker
                          editable="false"
                          v-model="timerange"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          type="datetimerange"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          :default-time="defaultTime1"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
        </form-drawer>
    </el-card>
</template>
<script setup>
import {computed} from 'vue';
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import {
    getCouponList,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    updateCouponStatus
} from "~/api/coupon.js"
import { useInitTable, useInitForm } from '~/composables/useCommon.js'

//状态
function formatStatus(row) {
    //默认显示
    let s = "领取中"
    //开始时间
    let start_time = (new Date(row.start_time)).getTime()
    //当前时间
    let now = (new Date()).getTime()
    //结束时间
    let end_time = (new Date(row.end_time)).getTime()
    if (start_time > now) {
        s = "未开始"
    } else if (end_time < now) {
        s = "已结束"
    } else if ( row.status = 0){
        s = "已失效"
    }
    return s
}

const {
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange
} = useInitTable({
    getList: getCouponList,
    onGetListSuccess: (res) => {
        //获取每个数据
        tableData.value = res.list.map(o => {
            //转化优惠券状态
            o.statusText = formatStatus(o)
            return o
        })
        total.value = res.totalCount
    },
    delete: deleteCoupon,
    updateStatus: updateCouponStatus
})

const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    handleSubmit,
    handleCreate,
    handleEdit
} = useInitForm({
    form: {
        //优惠券名称
        name: "",
        //类型：0表示满减，1表示折扣
        type: 0,
        //面值
        value:0,
        //总发行量
        total:100,
        //最低使用价格
        min_price:0,
        //开始时间
        start_time:null,
        //结束时间
        end_time:null,
        //排序
        order:50,
        //描述
        desc:''
    },
    rules: {
        title: [{
            required: true,
            message: '公告标题不能为空',
            trigger: 'blur'
        }],
        content: [{
            required: true,
            message: '公告内容不能为空',
            trigger: 'blur'
        }]
    },
    getData,
    update: updateCoupon,
    create: createCoupon,
    //提交前先转为时间戳
    beforeSubmit:(f) => {
        //如果不是数值类型
        if(typeof f.start_time != 'number'){
            f.start_time = (new Date(f.start_time)).getTime();
        }
        if(typeof f.end_time != 'number'){
            f.end_time = (new Date(f.end_time)).getTime();
        }
        return f
    }
})

//根据用户选择的时间范围动态更新
const timerange = computed({
    get(){
        //如果 form.start_time 和 form.end_time 都有值，则返回一个包含这两个值的数组 [form.start_time,form.end_time]
        //如果 form.start_time 或 form.end_time 中有一个没有值，则返回一个空数组 []
        return form.start_time && form.end_time ? [form.start_time,form.end_time] : [ ]
    },
    //当外部代码修改 timerange 的值时，会触发 set 函数，将传入的值 val 分别赋值给 form.start_time 和 form.end_time
    set(val){ 
        form.start_time = val[0]
        form.end_time = val[1]
    }
})

</script>
<style scoped>
.active {
    @apply border-rose-200 bg-rose-50 text-red-400;/*激活状态*/
}

.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;/*非激活状态*/
}
</style>