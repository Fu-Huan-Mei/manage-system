 <!-- <template>
    <a-directory-tree
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      multiple
      :tree-data="treeData"
      @click="downLoad"
    ></a-directory-tree>
  </template>
  <script>
  import { ref } from 'vue';
  const expandedKeys = ref(['0-0', '0-1']);
  const selectedKeys = ref([]);
  const treeData = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
          title: 'leaf 0-0',
          key: '0-0-0',//后端没有返回就自己构造一个
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    }
  ;
  </script>  -->

 <!--🔺研报系统需要的服务器文件查看和下载页面代码逻辑-->
 <!-- <template>
  <a-directory-tree
    :expanded-keys="expandedKeys"
    :selected-keys="selectedKeys"
    :tree-data="treeData"
    @click="handleClick"
  ></a-directory-tree>
</template>

<script>
export default {
  data() {
    return {
      expandedKeys: ['0-0', '0-1'],
      selectedKeys: [],
      treeData: [],
    };
  },
  mounted() {
    this.fetchTreeData();
  },
  methods: {
    async fetchTreeData() {
      try {
        const response = await fetch('/path/to/getDir');
        const data = await response.json();

        this.treeData = this.transformTreeData(data);
      } catch (error) {
        console.error('Failed to fetch tree data:', error);
      }
    },
    transformTreeData(data) {
      // 将后端返回的文件目录数据转换为 Ant Design 的树形数据结构
      return data.map((item) => {
        return {
          title: item.title,
          key: item.path,
          isLeaf: item.isLeaf,
        };
      });
    },
    async downloadFile(path) {
      try {
        const response = await fetch(`/path/to/downLoad?path=${path}`);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = path.split('/').pop(); // 使用路径中的最后一部分作为文件名
        link.click();
      } catch (error) {
        console.error('Failed to download file:', error);
      }
    },
    handleClick({ node }) {
      const { key, isLeaf } = node;

      if (isLeaf) {
        this.downloadFile(key);
      }
    },
  },
};
</script> -->



 <template>
    <div>
      <el-tree
        v-model="expandedKeys"
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="selectedKeys"
        :data="treeData"
        :props="treeProps"
      ></el-tree>
    </div>
  </template>
  
  <script>
  import { reactive } from 'vue';
  import { ElTree } from 'element-plus';
  
  export default {
    components: {
      ElTree,
    },
    data() {
      return {
        expandedKeys: ['0-0', '0-1'],
        selectedKeys: [],
        treeData: [
          {
            label: 'parent 0',
            key: '0-0',
            children: [
              {
                label: 'leaf 0-0',
                key: '0-0-0',
                isLeaf: true,
              },
              {
                label: 'leaf 0-1',
                key: '0-0-1',
                isLeaf: true,
              },
            ],
          },
          {
            label: 'parent 1',
            key: '0-1',
            children: [
              {
                label: 'leaf 1-0',
                key: '0-1-0',
                isLeaf: true,
              },
              {
                label: 'leaf 1-1',
                key: '0-1-1',
                isLeaf: true,
              },
            ],
          },
        ],
        treeProps: {
          label: 'label',
          children: 'children',
          isLeaf: 'isLeaf',
        }
      };
    }
  };
  </script>   

   