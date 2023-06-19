import { ref, nextTick, computed } from 'vue';
import {
    createGoodsSkusCard, updateGoodsSkusCard, deleteGoodsSkusCard,
    sortGoodsSkusCard, createGoodsSkusCardValue, updateGoodsSkusCardValue,
    deleteGoodsSkusCardValue, chooseAndSetGoodsSkusCard
} from "~/api/goods.js";
import { useArrayMoveUp, useArrayMoveDown } from "~/composables/util.js";
//当前商品的id
export const goodsId = ref(0);

//添加规格(数据)
export const sku_card_list = ref([]);

//规格设置（数据）
export const sku_list = ref([])

//初始化添加规格数据
export function initSkuCardList(d) {
    sku_card_list.value = d.goodsSkusCard.map(item => {
        //创建name副本，错误修改就返回初始值，只有提交成功才修改
        item.text = item.name
        //显示加载状态：防止用户重复提交
        item.loading = false
        //获取添加选项值数据
        item.goodsSkusCardValue.map(v => {
            //创建name副本，错误修改就返回初始值，只有提交成功才修改
            v.text = v.value || "属性值"
            return v
        })
        //将这个新对象返回，以便它被放入新的数组中 
        return item
    })
    sku_list.value = d.goodsSkus;
}

//添加规格按钮
export const btnLoading = ref(false);

//添加规格选项
export function addSkuCardEvent() {
    btnLoading.value = true;
    //调用添加规格选项的接口方法
    createGoodsSkusCard({
        goods_id: goodsId.value, //商品ID
        name: "规格选项", //规格选项
        order: 50, //排序
        type: 0 //规格类型 0
    }).then(res => {
        sku_card_list.value.push({
            ...res,
            text: res.name,
            loading: false,
            goodsSkusCardValue: []
        })
    }).finally(() => {
        //请求结束：正常状态，关闭加载状态
        btnLoading.value = false;
    })
}

//修改规格选项
export function handleUpdate(item) {
    item.loading = true;
    //调用修改商品规格选项的接口
    updateGoodsSkusCard(item.id, {
        "goods_id": item.goods_id, //商品ID
        "name": item.text, //规格名称
        "order": item.order, //排序
        "type": 0 //规格类型 0文字
    })
        .then(res => {
            item.name = item.text;
        })
        .catch(err => {
            item.text = item.name;
        })
        .finally(() => {
            item.loading = false;
        })
}

//删除规格选项
export function handleDelete(item) {
    item.loading = true;
    //调用删除规格选项的接口
    deleteGoodsSkusCard(item.id)
        .then(res => {
            //找到要删除的对象的索引，根据索引删除
            const i = sku_card_list.value.findIndex(o => o.id === item.id);
            //如果当前索引存在
            if (i != -1) {
                //根据当前索引删除当前对象
                sku_card_list.value.splice(i, 1);
            }
        })
        .finally(() => {
            item.loading = false;
        })
}

export const bodyLoading = ref(false);

//排序规格选项
export function sortCard(action, index) {
    //排序前:储存原数组：重新创建了一个与原始对象相同的新对象，而不是直接引用原始对象（深复制）
    let oList = JSON.parse(JSON.stringify(sku_card_list.value))

    //上移/下移
    let func = action == 'up' ? useArrayMoveUp : useArrayMoveDown

    //为什么要在排序前调用排序函数？？在排序前，对副本 oList 进行操作，以保证排序前每个对象的 order 属性都是正确的
    func(oList, index)

    //排序后的结果
    let sortData = oList.map((o, i) => {
        return {
            id: o.id,
            order: i + 1
        }
    })
    bodyLoading.value = true;

    //调用排序商品规格选项的接口方法
    sortGoodsSkusCard({
        sortdata: sortData
    })
        .then(res => {
            //排序成功：修改原数组：在排序后，对原始数组 sku_card_list.value 进行操作，以将排序后的结果应用到原始数组中
            func(sku_card_list, index)
            
        })
        .finally(() => {
            bodyLoading.value = false;
        })
}


//选择设置规格
export function handleChooseSetGoodsSkusCard(id, data) {
    //获取当前对象
    let item = sku_card_list.value.find(o => o.id == id)
    item.loading = true;
    //调用接口方法
    chooseAndSetGoodsSkusCard(id, data)
        .then(res => {
            item.name = item.text = res.goods_skus_card.name
            item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
                o.text = o.value || "属性值"
                return o
            })
            
        })
        .finally(() => {
            item.loading = false;
        })
}


//初始化添加值（规格值）
export function initSkuCardItem(id) {
    const item = sku_card_list.value.find(o => o.id == id)

    const loading = ref(false)

    const inputValue = ref('')

    const inputVisible = ref(false)

    const InputRef = ref()



    //打开添加规格值输入框
    const showInput = () => {
        //记录输入框值
        inputVisible.value = true
        //在状态改变后立即使用，以等待 DOM 更新完成？？？
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }

    //向输入框添加规格选项的值
    const handleInputConfirm = () => {
        //如果输入框没有值
        if (!inputValue.value) {
            //隐藏输入框
            inputVisible.value = false
            return
        }
        //如果输入框有值：输入框显示加载
        loading.value = true;
        //调用添加商品规格选项的值的接口方法
        createGoodsSkusCardValue({
            goods_skus_card_id: id,
            name: item.name,
            order: 50,
            value: inputValue.value
        })
            .then(res => {
                item.goodsSkusCardValue.push({
                    ...res,
                    text: res.value
                })
                
            })
            .finally(() => {
                //隐藏输入框
                inputVisible.value = false;
                //清空输入框
                inputValue.value = '';
                //关闭加载
                loading.value = true;
            })

    }

    //修改规格值：当输入框内容发生变化时触发  
    const handleChange = (value, tag) => {
        loading.value = true;
        updateGoodsSkusCardValue(tag.id, {
            "goods_skus_card_id": id, //规格值的ID
            "name": item.name, //规格选项值名称
            "order": tag.order, //排序
            "value": value //规格选项值名称
        })
            .then(res => {
                //成功，修改为新值
                tag.value = value;
                
            })
            .catch(err => {
                //失败：还是保持原值
                tag.text = tag.value;
            })
            .finally(() => {
                loading.value = false;
            })
    }

    //删除商品规格选项的值
    const handleClose = (tag) => {
        loading.value = true;
        //调用删除商品规格选项的值接口方法
        deleteGoodsSkusCardValue(tag.id)
            .then(res => {
                //找到要删除值得索引
                let i = item.goodsSkusCardValue.findIndex(o => o.id == tag.id)
                //如果找到该索引值
                if (i != -1) {
                    //根据索引删除该值
                    item.goodsSkusCardValue.splice(i, 1)
                }
                
            })
            .finally(() => {
                loading.value = false;
            })

    }

    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        loading,
        handleChange,
        handleChooseSetGoodsSkusCard
    }
}

