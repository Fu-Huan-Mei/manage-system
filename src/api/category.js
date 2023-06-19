import axios from '~/axios.js';

//商品分类列表
export function getCategoryList(){
    return axios.get('/admin/category')
}

//增加商品分类
export function createCategory(data){
    return axios.post('/admin/category',data)
}

//修改商品分类
export function updateCategory(id,data){
    return axios.post('/admin/category/'+id,data)
}

//修改商品分类状态
export function updateCategoryStatus(id,status){
    return axios.post(`/admin/category/${id}/update_status`,{status})
}

//删除商品分类
export function deleteCategory(id){
    return axios.post(`/admin/category/${id}/delete`)
}

//分类关联产品列表
export function getCategoryGoods(id){
    return axios.get(`/admin/app_category_item/list?category_id=${id}`)
}

//删除关联产品
export function deleteCategoryGoods(id){
    return axios.post(`/admin/app_category_item/${id}/delete`)
}

//关联产品
export function connectCategoryGoods(data){
    return axios.post('/admin/app_category_item',data)
}
