<template>
    <!--表格：订单统计-->
    <el-card shadow="never">
        <!--表头-->
        <template #header>
            <div class="flex justify-center">
                <span class="text-sm">订单统计</span>
                <div>
                    <el-check-tag v-for="(item, index) in options" :key="index" :checked="current == item.value"
                        style="margin-right: 8px" @click="handleChoose(item.value)">
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>

        <!--表格-->
        <div ref="el" id="chart" style="width:100%; height:300px;">
        </div>
    </el-card>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from 'echarts';
import { getStatistics3 } from '~/api/index.js';
import { useResizeObserver } from '@vueuse/core';
const current = ref('week');
const options = [
    {
        text: '近1个月',
        value: 'month'
    },
    {
        text: '近1周',
        value: 'week'
    },
    {
        text: '近24小时',
        value: 'hour'
    },
]

//切换表头，获取数据
const handleChoose = (type) => {
    current.value = type
    //重新获取数据
    getData()
}

//初始化数据
var myChart = null;
//渲染完后获取表格节点
onMounted(() => {
    var chartDom = document.getElementById("chart");
    //只有该节点存在，才会去调用接口获取数据
    if (chartDom) {
        //使用 echarts.init() 方法初始化一个`ECharts 实例`用于`渲染图表`，并将其赋值给变量 myChart
        myChart = echarts.init(chartDom);
        // chartDom.addEventListener('wheel', function (event) {
        // }, { passive: true })
        // chartDom.addEventListener('mousewheel', function (event) {
        // }, { passive: true })
        //调用 getData() 函数，获取数据并渲染图表
        getData();
    }
})

function getData() {
    //定义了一个变量 option，用于存储图表的配置选项
    let option = {
        //设置了图表的 x 轴类型和数据
        xAxis: {
            type: 'category',
            data: []
        },
        //设置了图表的y 轴的类型和数据
        yAxis: {
            type: 'value'
        },
        //设置了图表的数据系列，包括数据和图表的类型
        series: [
            {
                data: [],//y轴
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    //加载
    myChart.showLoading();

    //使用接口获取数据
    getStatistics3(current.value).then(res => {
        // console.log(res);
        //x轴数据
        option.xAxis.data = res.x;
        //y轴数据
        option.series[0].data = res.y;
        //使用myChart.setOption() 方法将图表的配置选项应用到 `ECharts 实例`中，从而`渲染出图表`
        myChart.setOption(option);
    }).finally(() => {
        //隐藏加载
        myChart.hideLoading();
    })

    //销毁组件时，也要销毁myChart
    onBeforeUnmount(() => {
        //销毁图表实例，如果不销毁图表实例，可能会导致在下次重新创建组件时出现`空白`的情况
        if (myChart) echarts.dispose(myChart);
    })
}

const el = ref(null);
//使表格跟随浏览器窗口的改变等比例缩放
useResizeObserver(el, (entries) => myChart.resize())
</script>