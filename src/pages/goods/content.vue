<template>
    <!--设置商品详情组件-->
    <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>
<script setup>
import { readGoods, updateGoods } from "~/api/goods.js";
import { reactive, ref } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { toast } from "~/composables/util.js";
import Editor from "~/components/Editor.vue";
//获取节点
const formDrawerRef = ref(null);
//定义一个表单数据对象：商品详情
const form = reactive({
    "content": "" //商品详情
})
//记录商品id
const goodsId = ref(0)

//打开
const open = (row) => {
    //记录商品id
    goodsId.value = row.id;
    row.contentLoading = true;
    //读取商品相关信息
    readGoods(goodsId.value)
    .then(res => {
        //获取content
        form.content = res.content;
        //打开弹窗
        formDrawerRef.value.open();
    })
    .finally(() => {
        row.contentLoading = false;
    })
}

const emit = defineEmits(['reloadData'])

//提交
const submit = () => {
    //显示按钮loading状态
    formDrawerRef.value.showLoading();
    //设置商品轮播图:修改商品的id，对象
    updateGoods(goodsId.value,form)
    .then(res => {
        toast("设置商品详情成功")
        //关闭弹框
        formDrawerRef.value.close();
        //刷新数据
        emit('reloadData')
    })
//     .catch(err => {
//     if (err.response.data.message) {
//       toast(err.response.data.message)
//     } else {
//       console.log(err.response.data)
//     }
//   })
    //请求结束
    .finally(() => {
        //请求结束，隐藏按钮的loading状态
        formDrawerRef.value.hideLoading();
    })
}

defineExpose({
    open
})
</script>