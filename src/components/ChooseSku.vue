<template>
    <!--规格选择弹窗-->
    <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
        <!--规格选择弹窗布局-->
        <el-container style="height:65vh;">

            <!--左侧侧边-->
            <el-aside class="image-aside">
                <!--上方：图片分类列表-->
                <div class="top">
                    <!--列表数据-->
                    <div class="sku-list" v-for="(item,index) in tableData" :key="index"
                    :class="{'active':(activeId == item.id)}" @click="handleChangeActiveId(item.id)">
                        {{ item.name }}
                    </div>
                </div>
                <!--下部：分页区域-->
                <div class="bottom">
                    <el-pagination background layout="prev, next" 
                    @current-change="getData" :total="total"
                    :current-page="currentPage" :page-size="limit" />
                </div>
            </el-aside>

            <!--中间：内容区-->
            <el-main>
              <el-checkbox-group v-model="form.list" >
                <el-checkbox v-for="item in list" :key="item" :label="item" border>
                    {{item}}
                </el-checkbox>
              </el-checkbox-group>
            </el-main>

        </el-container>

        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>

    </el-dialog>
</template>
<script setup>
import { reactive,ref } from "vue";
import {getSkusList} from "~/api/skus.js";
import { useInitTable } from "~/composables/useCommon.js";
const dialogVisible = ref(false)
//激活id
const activeId = ref(0)
const {
    loading,
    currentPage,
    limit,
    total,
    tableData,
    getData
} = useInitTable({
    getList:getSkusList,
    onGetListSuccess:(res => {
        tableData.value = res.list
        total.value = res.totalCount
        if(tableData.value.length > 0){
            //自动激活选中页码的第一个
            handleChangeActiveId(tableData.value[0].id)
        }
    })
})

//使用函数传数据
const callbackFunction = ref(null)

//打开弹框
const open = ( callback=null) => {
    callbackFunction.value = callback
    //获取数据
    getData(1);
    //打开弹窗
    dialogVisible.value = true;
}

//存储左侧菜单栏的列表数据
const list = ref([])

//存储右侧内容区中呈现的数据：当用户点击提交按钮时，可以通过form变量获取用户输入的数据并进行相应的处理
const form = reactive({
    name:'',
    list:[]
})

//当用户点击某个列表数据时，更新当前选中的数据id，并根据该id查找到对应的列表数据，
function handleChangeActiveId (id){
    //通过响应式变量activeId.value来更新当前选中的数据id
    activeId.value = id;
    //将列表数据list.value清空
    list.value = [];
    let item = tableData.value.find(o => o.id == id)
    //如果有当前对象
    if(item){
        //规格值
       list.value = item.default.split(",")
       //规格名称
       form.name = item.name
    }
}

//提交
const submit = () => {
    if(typeof callbackFunction.value === 'function'){
        callbackFunction.value(form)
    }
    //关闭弹框
    dialogVisible.value = false
}

defineExpose({
    open
})
</script>
<style scoped>
.image-aside {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-aside .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    height: 50px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    @apply flex items-center justify-center;
}
.sku-list{
    border-bottom:1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}
.sku-list:hover,active{
    @apply bg-blue-50;
}
</style>
