import axios from '~/axios.js';
import { queryParams } from '~/composables/util.js';
//商品列表
//第二个参数 query 是一个对象，它可以包含多个查询参数，这些参数会被拼接到请求 URL 的后面，以 ? 开头
export function getGoodsList(page,query={ }){
    let r = queryParams(query)
    return axios.get(`/admin/goods/${page}${r}`)
}

//批量上架/下架商品
// ids 和 status，这两个参数被组合成一个对象作为请求体发送给服务器
export function updateGoodsStatus(ids,status){
    return axios.post('/admin/goods/changestatus',{
        ids,
        status
    })
}

//增加商品 
export function createGoods(data){
    return axios.post('/admin/goods',data)
}

//修改商品(商品详情)
export function updateGoods(id,data){
    return axios.post(`/admin/goods/${id}`,data)
}

//批量删除商品 
export function deleteGoods(ids){
    return axios.post(`/admin/goods/delete_all`,{
        ids
    })
}

//查看商品资料
export function readGoods(id){
    return axios.get(`/admin/goods/read/${id}`)
}

//设置商品轮播图 
export function setGoodsBanner(id,data){
    return axios.post(`/admin/goods/banners/${id}`,data)
}

//更新商品规格 ？？这里有问题
export function updateGoodsSkus(id,data){
    return axios.post(`/admin/goods/updateskus/${id}`,data)
}

//添加商品规格选项
export function createGoodsSkusCard(data){
    return axios.post('/admin/goods_skus_card',data)
}

//修改商品规格选项
export function updateGoodsSkusCard(id,data){
    return axios.post(`/admin/goods_skus_card/${id}`,data)
}

//删除商品规格选项
export function deleteGoodsSkusCard(id){
    return axios.post(`/admin/goods_skus_card/${id}/delete`)
}

//排序商品规格选项
export function sortGoodsSkusCard(data){
    return axios.post("/admin/goods_skus_card/sort",data)
}

//添加商品规格选项的值
export function createGoodsSkusCardValue(data){
    return axios.post("/admin/goods_skus_card_value",data)
}

//修改商品规格选项的值
export function updateGoodsSkusCardValue(id,data){
    return axios.post(`/admin/goods_skus_card_value/${id}`,data)
}

//删除商品规格选项的值
export function deleteGoodsSkusCardValue(id){
    return axios.post(`/admin/goods_skus_card_value/${id}//delete`)
}

//选择设置商品规格选项和值
export function  chooseAndSetGoodsSkusCard(id,data){
    return axios.post(`/admin/goods_skus_card/${id}/set`,data)
}


