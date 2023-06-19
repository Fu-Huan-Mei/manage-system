<template>
    <!--用于显示标签，使用v-for指令遍历dynamicTags数组，动态渲染标签-->
    <el-tag v-for="(tag, index) in dynamicTags" 
    :key="index" class="mx-1" closable 
    :disable-transitions="false"
    @close="handleClose(tag)">
    {{ tag }}
    </el-tag>
    <!--修改：用于输入新的标签，在inputVisible为true时显示-->
    <el-input v-if="inputVisible" ref="InputRef"
     v-model="inputValue" class="ml-1 w-20" size="small"
    @keyup.enter="handleInputConfirm" 
    @blur="handleInputConfirm"/>
    <!--访问：用于显示添加标签的按钮，在inputVisible为false时显示-->
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">+ 添加值</el-button>
</template>
  
<script setup>
import { nextTick, ref } from 'vue'

//定义一个响应式变量`inputValue`，用于存储输入框中的值
const inputValue = ref('')

//获取父组件数据
const props = defineProps({
    modelValue: String
})

//（固定写法）在标签发生变化时更新`modelValue`属性：父组件传递给子组件的属性modelValue所触发的
const emit = defineEmits(["update:modelValue"])

//将标签中的字符串类型的值转为数组，并将其作为dynamicTags的初始值；否则，将空数组作为初始值
const dynamicTags = ref( props.modelValue ? props.modelValue.split(',') : [])


//控制输入框的显示和隐藏
const inputVisible = ref(false)

//用于存储输入框的引用
const InputRef = ref()

//删除指定的标签
const handleClose = (tag) => {
    //找到数组中第一个值等于tag的元素的位置，然后使用splice()方法将其从数组中删除：删除指定标签的功能
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    //将数据传给父组件
    emit("update:modelValue", dynamicTags.value.join(","))
}

//显示输入框,用于输入新标签
const showInput = () => {
    //输入框显示时
    inputVisible.value = true
    //确保了输入框已完全呈现在页面上，可以接受焦点
    nextTick(() => {
        //将输入元素成为当前活动元素，并准备接受用户输入
        InputRef.value.input.focus()
    })
}

//添加：在输入框失去焦点或按下回车键时,将输入框中的值添加到标签列表中
const handleInputConfirm = () => {
    if (inputValue.value) {
        //用户按下回车键或输入框失去焦点时就会把输入框中的值放入 dynamicTags
        dynamicTags.value.push(inputValue.value)
        //通知父组件当前标签的值发生了变化，从而更新自己的数据
        emit("update:modelValue", dynamicTags.value.join(","))
    }
    //隐藏输入框
    inputVisible.value = false
    //清空输入框中的内容
    inputValue.value = ''
}
</script>