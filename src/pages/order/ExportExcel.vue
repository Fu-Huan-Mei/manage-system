<template>
   <el-drawer title="导出订单" v-model="dialogVisible"  size="40%">
        <el-form :model="form" label-width="80px" :inline="false" size="normal">
            <el-form-item label="订单类型">
               <el-select v-model="form.tab" placeholder="请选择">
                <el-option v-for="item in tabs"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key">
                </el-option>
               </el-select>
               
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker
                v-model="form.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
            </el-form-item>
        </el-form>
        
   </el-drawer>
</template>
<script setup>
import { exportOrder} from "~/api/order.js";
import {ref,reactive} from 'vue';
import { toast } from "~/composables/util"
const dialogVisible = ref(false)
defineProps({
    tabs:Array
})

//打开导出弹框
const open = () => dialogVisible.value = true;
//关闭导出弹框
const close = () => dialogVisible.value = false;

defineExpose({
    open,
    close
})

const form = reactive({
    tab:null,
    time:'',
})

const loading = ref(false)

//提交导出弹框表单
const onSubmit =() => {
    //如果没有订单类型
    if(!form.tab) return toast("订单类型不能为空","error")
    loading.value = true
    let starttime = null
    let endtime = null
    if(form.time && Array.isArray(form.time)){
        starttime = form.time[0]
        endtime =  form.time[1]
    }
    exportOrder({
        tab:form.tab,
        starttime,
        endtime
    }).then(data => {
        //保存到文件中的数据
        let url = window.URL.createObjectURL(new Blob([data]))
        //a标签触发下载文件
        let link = document.createElement("a")
        //隐藏标签
        // link.style.display = "none"
        //获取要下载的文件地址
        link.href = url
        //文件名
        let filename = (new Date()).getTime() + ".xlsx"
        //下载的文件名
        link.setAttribute("download",filename)
        //将a标签添加到文档流中，触发下载操作
        document.body.appendChild(link)
        //模拟用户点击下载
        link.click()
        //关闭当前窗口或标签页：
        close()
    }).finally(() => {
        loading.value = false
    })
}
</script>

