<!-- <template>
    <div>
      <a-button type="primary" @click="createAndSaveReport">创建研报副本</a-button>
      <a-modal v-model="modalVisible" :title="modalTitle" :content="modalContent">
        <template #footer>
          <a-button type="primary" @click="modalVisible = false">确定</a-button>
        </template>
      </a-modal>
      <div v-if="reportCreated">
        <h2>研报页面</h2>
        <div>{{ reportContent }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        modalVisible: false,
        modalTitle: '',
        modalContent: '',
        reportId: null,
        reportContent: '',
        reportCreated: false,
      };
    },
    methods: {
      createAndSaveReport() {
        // 调用新建接口来创建一个空白的研报页面
        const newReportId = api.createReport();
        
        if (newReportId) {
          this.reportId = newReportId;
          this.reportContent = '';
          this.reportCreated = true;
          
          // 调用保存研报接口保存研报内容
          const success = api.saveReport(this.reportId, this.reportContent);
          
          if (success) {
            this.showModal('创建成功', '新建研报页面已创建并保存成功');
          } else {
            this.showModal('创建成功', '新建研报页面已创建，但保存失败');
          }
        } else {
          this.showModal('创建失败', '无法创建新的研报页面');
        }
      },
      showModal(title, content) {
        this.modalTitle = title;
        this.modalContent = content;
        this.modalVisible = true;
      },
    },
  };
  </script> -->

  <template>
    <div>
      <a-button type="primary" @click="createAndSaveReport">创建研报副本</a-button>
      <a-modal v-model="modalVisible" :title="modalTitle" :content="modalContent">
        <template #footer>
          <a-button type="primary" @click="modalVisible = false">确定</a-button>
        </template>
      </a-modal>
      <div v-if="reportCreated">
        <h2>研报页面</h2>
        <div>{{ reportContent }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        modalVisible: false,
        modalTitle: '',
        modalContent: '',
        reportId: null,
        reportContent: '',
        reportCreated: false,
      };
    },
    methods: {
      createAndSaveReport() {
        // 模拟新建接口来创建一个空白的研报页面
        const newReportId = '123'; // 静态研报ID
  
        if (newReportId) {
          this.reportId = newReportId;
          this.reportContent = '这是一个静态研报内容'; // 静态研报内容
          this.reportCreated = true;
  
          // 模拟保存研报接口保存研报内容
          const success = true; // 假设保存成功
  
          if (success) {
            this.showModal('创建成功', '新建研报页面已创建并保存成功');
          } else {
            this.showModal('创建成功', '新建研报页面已创建，但保存失败');
          }
        } else {
          this.showModal('创建失败', '无法创建新的研报页面');
        }
      },
      showModal(title, content) {
        this.modalTitle = title;
        this.modalContent = content;
        this.modalVisible = true;
      },
    },
  };
  </script>