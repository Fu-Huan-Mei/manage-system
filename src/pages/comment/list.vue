<template>
  <!--评价列表-->
  <el-card shadow="never" class="border-0">
    <!--搜索组件-->
    <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
      <!--搜索框:默认插槽-->
      <search-item label="关键词">
        <el-input v-model="searchForm.title" placeholder="商品标题" clearable></el-input>
      </search-item>
    </Search>

    <!--管理员-->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" default-expand-all>
      <!--评价-->
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <!--左：头像-->
            <el-avatar size="50" shape="circle" :src="row.user.avator" fit="fill" class="mr-3"></el-avatar>
            <!--主要内容-->
            <div class="flex-1">
              <h6 class="flex items-center">
                <!--昵称-->
                {{ row.user.nickname || row.user.nickname }}
                <!--回复时间-->
                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                <!--右边：回复-->
                <el-button v-if="!row.textareaEdit && !row.extra" size="small" class="ml-auto"
                  @click="openTextarea(row)">回复</el-button>
              </h6>
              <!--评价内容-->
              {{ row.review.data }}
              <div class="py-2">
                <!--商品图片-->
                <el-image v-for="(item, index) in row.review.image" :key="index" :src="item" fit="cover" :lazy="true"
                  style="width:100px; height:100px;" class="rounded"></el-image>

                <!--客服回复框-->
                <div v-if="row.textareaEdit">
                  <el-input v-model="textarea" size="normal" label="" placeholder="请输入评价内容" type="textarea" rows="2">
                  </el-input>
                  <div class="py-2">
                    <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                    <el-button type="primary" size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
                  </div>
                </div>

                <!--已回复内容-->
                <template v-else>
                  <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item, index) in row.extra" :key="index">
                    <h6 class="flex font-bold">
                      客服
                      <el-button type="info" size="small" class="ml-auto"  @click="openTextarea(row, item.data)">修改</el-button>
                    </h6>
                    <p>{{ item.data }}</p>
                  </div>
                </template>

              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="70" align="center" prop="id"></el-table-column>
      <el-table-column label="商品" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" :lazy="true"
              style="width:50px; height:50px;" class="rounded"></el-image>
            <div class="ml-3">
              <h6>{{ row.goods_item ? row.goods_item.title : '商品已被删除' }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="200">
        <template #default="{ row }">
          <div>
            <p>用户：{{ row.user.nickname || row.user.username }}</p>
            <p>
              <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" score-template="{value} points" />
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" align="center" prop="review_time"></el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
            @change="handleStatusChange($event, row)" :loading="row.statusLoading" :disabled="row.super == 1">
          </el-switch>
        </template>
      </el-table-column>

    </el-table>


    <!--下：分页-->
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-card>
</template>
<script setup>
import SearchItem from "~/components/SearchItem.vue";
import Search from "~/components/Search.vue";
import { ref } from "vue";
import { getGoodsCommentList, updateGoodsCommentStatus, reviewGoodsComment } from "~/api/goods_comment.js";
import { useInitTable } from '~/composables/useCommon.js';
import { toast } from "~/composables/util.js";

const roles = ref([])

const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleStatusChange
} = useInitTable({
  searchForm: {
    title: ""
  },
  getList: getGoodsCommentList,
  //特殊的方法
  onGetListSuccess: (res) => {
    //获取列表数据
    tableData.value = res.list.map(o => {
      //修改switch开关的loading状态
      o.statusLoading = false;
      //非编辑状态(关闭回复框)
      o.textareaEdit = false;
      return o;
    })
    // console.log('tableData.value=',tableData.value)
    total.value = res.totalCount
    roles.value = res.roles
  },
  updateStatus: updateGoodsCommentStatus
})

//保存回复内容
const textarea = ref(null);

//打开回复框
const openTextarea = (row, data = "") => {
  //清空值
  textarea.value = ''
  //编辑状态
  row.textareaEdit = true
}

//提交回复内容
const review = (row) => {
  //如果没用客服回复内容
  if (textarea.value === "") {
    //提示
    return toast('回复内容不能为空', 'error')
  }
  //如果客服已回复
  reviewGoodsComment(row.id, textarea.value)
    .then(res => {
      //回复过后关闭回复框
      row.textareaEdit = false
      //提示
      toast('回复成功')
      //重新获取数据
      getData()
    })
}

</script>