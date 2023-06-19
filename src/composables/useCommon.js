import { ref, reactive, computed } from "vue"
import { toast } from "~/composables/util"
// 列表，分页，搜索，删除，修改状态
export function useInitTable(opt = {}) {
    //搜索表单数据
    let searchForm = null
    //重置搜索表单数据
    let resetSearchForm = null
    if (opt.searchForm) {

        //响应式数据，与搜索表单进行双向绑定
        searchForm = reactive({ ...opt.searchForm })

        //重置搜索表单数据
        resetSearchForm = () => {
            //遍历opt.searchForm初始值（空）：清空数据
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }

    const tableData = ref([])
    const loading = ref(false)

    // 分页
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)

    // 获取数据
    function getData(p = null) {
        //检查传入的参数 p 是否为一个数字
        if (typeof p == "number") {
            //如果是数字则将其赋值给 currentPage.value
            currentPage.value = p
        }
        //设置 loading.value 为 true，表示正在加载数据
        loading.value = true
        //调用 opt.getList 函数获取数据列表
        opt.getList(currentPage.value, searchForm)
        .then(res => {//当数据列表获取成功后
            //如果在 opt 参数中传入了 onGetListSuccess 函数且该函数是一个可调用的函数，则会执行该函数：特殊的方法
            if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
                opt.onGetListSuccess(res)
            } else {
                //否则会将获取到的数据列表设置为 tableData.value，并将总数设置为 total.value(通用)
                tableData.value = res.list
                total.value = res.totalCount
            }
        })//最后，不论数据获取是否成功，都会将 loading.value 设置为 false，表示数据加载完成
        .finally(() => {
            loading.value = false
        })
    }

    getData()

    // 删除
    const handleDelete = (id) => {
        loading.value = true
        opt.delete(id).then(res => {
            toast("删除成功")
            getData()
        }).finally(() => {
            loading.value = false
        })
    }

    
    // 修改当前对象的状态:status表示即将修改的状态，row表示当前对象
    const handleStatusChange = (status, row) => {
        //当前对象
        row.statusLoading = true
        //调用接口方法
        opt.updateStatus(row.id, status)
        .then(res => {
            //提示
            toast("修改状态成功")
            //当前对象的状态赋值为即将修改的状态
            row.status = status
        })
        .finally(() => {
            row.statusLoading = false
        })
    }

    //多选选中的id
    const multiSelectionIds = ref([])
    //当选择项发生变化时会触发该事件
    const handleSelectionChange = (e) => {
        //多选框选中的id
        multiSelectionIds.value = e.map(o => o.id);
    }

    //获取节点
    const multipleTableRef = ref(null)

    //批量删除
    const handleMultiDelete = () => {
        loading.value = true
        opt.delete(multiSelectionIds.value)
            .then(res => {
                toast("删除成功")
                //清空选中项
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                //重新获取数据
                getData();
            })
            .finally(() => {
                loading.value = false
            })
    }

    //批量修改状态（上架/下架）
    const handleMultiStatusChange = (status) => {
        loading.value = true
        opt.updateStatus(multiSelectionIds.value,status)
            .then(res => {
                toast("修改状态成功")
                //清空选中
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                //重新获取数据
                getData();
            })
            .finally(() => {
                loading.value = false
            })
    }

    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData,
        handleDelete,
        handleStatusChange,
        handleSelectionChange,
        multipleTableRef,
        handleMultiDelete,
        handleMultiStatusChange,
        multiSelectionIds
    }
}


// 新增，修改表单
export function useInitForm(opt = {}) {
    // 表单部分
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    //初始化表单
    const defaultForm = opt.form
    const form = reactive({})
    const rules = opt.rules || {}
    //区分新增/修改
    const editId = ref(0)
    //如果有id就是修改，没id就是新增
    const drawerTitle = computed(() => editId.value ? "修改" : "新增")

    //提交表单：新增/修改
    const handleSubmit = () => {
        //表单验证
        formRef.value.validate((valid) => {
            //验证失败
            if (!valid) return
            //验证成功
            formDrawerRef.value.showLoading()
            //获取body参数
            let body = {}
            //如果有拦截
            if (opt.beforeSubmit && typeof opt.beforeSubmit == 'function') {
                body = opt.beforeSubmit({ ...form })
            } else {
                body = form
            }
            //调用接口方法
            const fun = editId.value ? opt.update(editId.value, body) : opt.create(body)
            //获取成功数据
            fun.then(res => {
                toast(drawerTitle.value + "成功")
                // 修改刷新当前页，新增刷新第一页
                opt.getData(editId.value ? false : 1)
                formDrawerRef.value.close()
            })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })

        })
    }

    // 重置表单：清空表单，重新获取数据(初始化时的数据)
    function resetForm(row = false) {
        if (formRef.value) formRef.value.clearValidate()
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }

    //新增：打开新增弹窗
    const handleCreate = () => {
        editId.value = 0
        //resetForm(opt.form)
        resetForm(defaultForm)
        //打开表单弹框
        formDrawerRef.value.open()
    }

    //编辑：打开 编辑（修改）弹窗
    const handleEdit = (row) => {
        //只要id有值
        editId.value = row.id
        //重置表单数据
        resetForm(row)
        formDrawerRef.value.open()
    }

    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        handleSubmit,
        resetForm,
        handleCreate,
        handleEdit
    }
}
