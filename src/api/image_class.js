import axios from "~/axios.js";

//图库列表接口：<page> 是一个动态参数，用于指定请求的页面数：该接口可能用于获取分页的图片分类数据
export function getImageClassList(page){
    return axios.get("/admin/image_class/"+page)
}

//增加图库分类
export function createImageClass(data){
    return axios.post("/admin/image_class",data)
}

//修改图库分类
export function updateImageClass(id,data){
    return axios.post("/admin/image_class/"+id,data)
}

//删除图库分类
export function deleteImageClass(id){
    return axios.post(`/admin/image_class/${id}/delete`)
}