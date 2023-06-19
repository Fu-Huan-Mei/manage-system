<template>
  <!-- 新增|批量删除|刷新 -->
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button v-if="btns.includes('create')" type="primary" size="small" @click="$emit('create')">新增</el-button>
      <el-popconfirm title="是否要删选中记录" confirm-button-text="确认" cancel-button-text="取消" v-if="btns.includes('delete')"
      @confirm="$emit('delete')">
          <template #reference>
            <el-button v-if="btns.includes('delete')" type="danger" size="small" @click="$emit('delete')">批量删除</el-button>
          </template>
    </el-popconfirm>
      <el-popconfirm title="是否要删选中记录" confirm-button-text="确认" cancel-button-text="取消" v-if="btns.includes('delete')"
        @confirm="$emit('delete')">
        <template #reference></template>
      </el-popconfirm>
      <!--上架/下架-->
      <slot></slot>
    </div>

    <div>
    <el-tooltip v-if="btns.includes('refresh')" effect="dark" content="刷新数据" placement="top">
      <!--注意：方法不需要传递参数，则在模板中可以省略方法名称后的括号"()"-->
      <el-button text @click="$emit('refresh')" size="small">
        <el-icon :size="15">
          <Refresh />
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip v-if="btns.includes('download')" effect="dark" content="导出数据" placement="top">
      <!--注意：方法不需要传递参数，则在模板中可以省略方法名称后的括号"()"-->
      <el-button text @click="$emit('download')" size="small">
        <el-icon :size="15"><Download /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh"
  }
})
const btns = computed(() => props.layout.split(","))  //['create','refresh']

defineEmits(['create', 'refresh', 'delete','download'])
</script>