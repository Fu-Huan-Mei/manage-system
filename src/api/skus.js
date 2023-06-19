import axios from '~/axios.js';

//商品规格列表
export function getSkusList(page){
    return axios.get(`/admin/skus/${page}`)
}

//增加商品规格
export function createSkus(data){
    return axios.post("/admin/skus",data)
}

//修改商品规格
export function updateSkus(id,data){
    return axios.post("/admin/skus/"+id,data)
}

//批量删除商品规格
export function deleteSkus(ids){
    //如果ids不是数组，则转为数组，再进行下一步操作
    ids = !Array.isArray(ids) ? [ids] : ids
    return axios.post("/admin/skus/delete_all",{ids})
}

//修改商品规格状态
export function updateSkusStatus(id,status){
    return axios.post(`/admin/skus/${id}/update_status`,{ status })
}


