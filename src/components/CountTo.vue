<template>
    <!--将对象 d 的 num 属性的值显示在页面上，并保留2位小数-->
    {{ d.num.toFixed(2) }}
</template>
<script setup>
import {reactive,watch} from 'vue';
import gsap from 'gsap';

//希望滚动的终点
const props = defineProps({
    value:{
        type:Number,
        default:0
    }
    
})

//要滚动的数字：希望滚动的起点
const d = reactive({num:0})

//定义滚动动画
function AnimationToValue(){
    gsap.to(
        //要进行动画处理的对象
        d,
        {   //动画持续时间为0.5秒
            duration:0.5,
            //数值从0经过0.5秒动画加载到父组件传过来的数值
            num:props.value
        }
    )
}

//执行动画
AnimationToValue()

//用于监视props.value的值发生更改时地函数
watch(
    //当props.value的值发生更改时
    () => props.value,
    //重新执行滚动动画
    () => AnimationToValue()
)
</script>
