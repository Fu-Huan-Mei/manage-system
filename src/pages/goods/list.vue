<template>
    <!--商品管理-->
    <div>
        <!--标签页-->
        <el-tabs v-model="searchForm.tab" @tab-change="getData">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in  tabbars" :key="index">
            </el-tab-pane>
        </el-tabs>

        <el-card shadow="never" class="border-0">

            <!--搜索组件-->
            <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
                <!--左：搜索框:商品名称-->
                <search-item label="关键词">
                    <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
                </search-item>
                <!--中：高级搜索：商品分类-->
                <template #show>
                    <search-item label="商品分类">
                        <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </search-item>
                </template>
            </Search>

            <!-- 新增|刷新组件|上架/下架 -->
            <list-header @create="handleCreate" @refresh="getData" @delete="handleMultiDelete"
                layout="create,delete,refresh">
                <el-button size="small" @click="handleMultiStatusChange(1)" v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架</el-button>
                <el-button size="small" @click="handleMultiStatusChange(0)" v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架</el-button>
            </list-header>

            <!--商品-->
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange" ref="multipleTableRef">
                <!--多选框-->
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div>
                            <div class="flex">
                                <el-image :src="row.cover" fit="fill" :lazy="true" style="width:50px; height:50px;"
                                    class="mr-3 rounded" :fit="cover">
                                </el-image>
                                <div class="flex-1">
                                    <p>{{ row.title }}</p>
                                    <div>
                                        <span class="text-rose-500">￥{{ row.min_price }}</span>
                                        <el-divider direction="vertical" />
                                        <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                                    </div>
                                    <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : '未分类' }}
                                    </p>
                                    <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <!--实际销量-->
                <el-table-column align="center" label="实际销量" width="80" prop="sale_count">
                    <template #default="{ row }">
                        {{ row.role ? row.role.name : '-' }}
                    </template>
                </el-table-column>

                <!--商品状态-->
                <el-table-column label="商品状态" width="100" align="center" prop="status">
                    <!--渲染默认内容-->
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="small">
                            {{ row.status ? '上架' : '仓库' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!--审核状态-->
                <el-table-column label="审核状态" width="120" align="center" prop="status" v-if="searchForm.tab != 'delete'">
                    <!--渲染默认内容-->
                    <template #default="{ row }">
                        <div v-if="row.ischeck == 0" class="flex flex-col">
                            <el-button type="success" size="small" plain>审核通过</el-button>
                            <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
                        </div>
                        <span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
                    </template>
                </el-table-column>

                <!--总库存-->
                <el-table-column align="center" label="总库存" width="90" prop="stock"></el-table-column>

                <!--操作-->
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab != 'delete'">
                            <!--修改-->
                            <el-button type="primary" size="small" text class="px-1"
                                @click="handleEdit(scope.row)">修改</el-button>

                            <!--商品规格-->
                            <el-button type="primary" size="small" text class="px-1" @click="handleSetGoodsSkus(scope.row)"
                                :loading="scope.row.skusLoading">商品规格</el-button>

                            <!--设置轮播图-->
                            <el-button type="primary" size="small" text class="px-1"
                                @click="handleSetGoodsBanners(scope.row)"
                                :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'"
                                :loading="scope.row.bannersLoading">
                                设置轮播图
                            </el-button>

                            <!--商品详情-->
                            <el-button type="primary" size="small" text class="px-1"
                                :type="!scope.row.content ? 'danger' : 'primary'" @click="handleSetGoodsContent(scope.row)"
                                :loading="scope.row.contentLoading">
                                商品详情
                            </el-button>

                            <!--删除：传递scope.row.id作为参数，用于删除当前行的数据-->
                            <el-popconfirm title="是否要删除该商品" confirmButtonText="确认" cancelButtonText="取消"
                                @confirm="handleDelete(scope.row.id)">
                                <template #reference>
                                    <el-button text type="primary" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <!--回收站-->
                        <span v-else>暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>

            <!--下：分页-->
            <div class="flex items-center justify-center mt-5">
                <!--当触发current-change事件时，getData方法可能用于基于组件的当前状态检索新数据-->
                <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>

            <!--新增/修改弹窗组件-->
            <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
                <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="form.title" placeholder="请输入商品名称,不能超过60个字符"></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <choose-image v-model="form.cover"></choose-image>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="category_id">
                        <el-select v-model="form.category_id" placeholder="选择所属角色">
                            <el-option v-for="item in category_list " :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="desc">
                        <el-input type="textarea" v-model="form.desc" placeholder="选填，商品卖点"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="form.unit" placeholder="请输入单位" style="width:50%;"></el-input>
                    </el-form-item>
                    <el-form-item label="总库存" prop="stock">
                        <el-input type="number" v-model="form.stock" style="width:40%;">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock">
                        <el-input type="number" v-model="form.min_stock" style="width:40%;">
                            <template #append>件</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低销售价" prop="min_price">
                        <el-input type="number" v-model="form.min_price" style="width:40%;">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低元价" prop="min_oprice">
                        <el-input type="number" v-model="form.min_oprice" style="width:40%;">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :label="0">隐藏</el-radio>
                            <el-radio :label="1">显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio :label="0">放入仓库</el-radio>
                            <el-radio :label="1">立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </form-drawer>
        </el-card>
        <!--轮播图组件-->
        <banners ref="bannersRef" @reload-data="getData"></banners>
        <!--商品详情组件-->
        <content ref="contentRef" @reload-data="getData"></content>
        <!--商品规格组件-->
        <skus ref="skusRef" @reload-data="getData"></skus>
    </div>
</template>
<script setup>
import SearchItem from "~/components/SearchItem.vue";
import Search from "~/components/Search.vue";
import ListHeader from "~/components/ListHeader.vue";
import { ref } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import {
    getGoodsList,
    updateGoodsStatus,
    createGoods,
    updateGoods,
    deleteGoods
} from "~/api/goods.js"
import { getCategoryList } from "~/api/category.js"
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
import banners from '~/pages/goods/banners.vue';
import content from '~/pages/goods/content.vue';
import skus from '~/pages/goods/skus.vue';
const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    handleMultiStatusChange
} = useInitTable({
    //query参数
    searchForm: {
        //关键字
        title: "",
        //订单类型
        tab: 'all',
        //分类id
        category_id: null
    },
    //获取商品资料列表
    getList: getGoodsList,
    onGetListSuccess: (res) => {
        //商品资料数据
        tableData.value = res.list.map(o => {
            // 定义按钮状态
            o.bannersLoading = false
            o.contentLoading = false
            o.skusLoading = false
            return o
        })
        //获取商品总数
        total.value = res.totalCount

    },
    delete: deleteGoods,
    updateStatus: updateGoodsStatus
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
    //body参数
    form: {
        title: null, //商品名称
        category_id: null, //商品分类
        cover: null, //商品封面
        desc: null, //商品描述
        unit: "件", //商品单位
        stock: 100, //总库存
        min_stock: 10, //库存预警
        status: 1, //是否上架 0仓库1上架
        stock_display: 1, //库存显示 0隐藏1显示
        min_price: 0, //最低销售价
        min_oprice: 0 //最低原价
    },
    getData,
    update: updateGoods,
    create: createGoods
})
//不同标签页
const tabbars = [
    {
        key: 'all',
        name: '全部'
    },
    {
        key: 'checking',
        name: '审核中'
    },
    {
        key: 'saling',
        name: '出售中'
    },
    {
        key: 'off',
        name: '已下架'
    },
    {
        key: 'min_stock',
        name: '库存警告'
    },
    {
        key: 'delete',
        name: '回收站'
    },
]

//商品分类
const category_list = ref([])

//商品分类列表数据
getCategoryList().then(res => {
    category_list.value = res
})

//轮播图
const bannersRef = ref(null)

 //打开轮播图弹窗
const handleSetGoodsBanners = (row) => {
    bannersRef.value.open(row)
}

//商品详情
const contentRef = ref(null)

//打开商品详情弹窗
const handleSetGoodsContent = (row) => {
    contentRef.value.open(row)
}

//商品规格
const skusRef = ref(null)

//打开当前对象的商品规格弹窗
const handleSetGoodsSkus = (row) => {
    skusRef.value.open(row)
}
</script>