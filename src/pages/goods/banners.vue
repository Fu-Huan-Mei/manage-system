<template>
    <!--修改轮播图弹窗组件-->
    <el-drawer title="设置轮播图" v-model="dialogVisible" direction="rtl" size="50%" :destroy-on-close="true">
        <el-form :model="form" label-width="80px">
            <el-form-item label="轮播图">
                <!--选择图片-->
                <ChooseImage v-model="form.banners" :limit="9"></ChooseImage>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<script setup>
import { readGoods, setGoodsBanner } from "~/api/goods.js";
import { reactive, ref } from "vue";
import ChooseImage from "~/components/ChooseImage.vue";
import { toast } from "~/composables/util.js";

//默认关闭弹窗
const dialogVisible = ref(false);

//定义一个表单数据对象
const form = reactive({
    banners: []
})

//记录商品id
const goodsId = ref(0)

//打开弹窗
const open = (row) => {
    goodsId.value = row.id;
    //当前对象点击轮播图按钮时出现加载状态
    row.bannersLoading = true;
    //查看商品资料
    readGoods(goodsId.value)
    .then(res => {
        //获取图片链接组成的一维数组
        form.banners = res.goodsBanner.map(o => o.url);
        //打开弹窗
        dialogVisible.value = true;
    })
    .finally(() => {
        row.bannersLoading = false;
    })


}
defineExpose({
    open
})
const loading = ref(false)

const emit = defineEmits(['reloadData'])

//提交数据
const submit = () => {
    loading.value = true
    //设置商品轮播图
    setGoodsBanner( goodsId.value,form)
    .then(res => {
        toast("设置轮播图成功")
        //关闭弹框
        dialogVisible.value = false;
        //刷新数据
        emit('reloadData')
    })
    .finally(() => {
        loading.value = false
    })
}
</script>