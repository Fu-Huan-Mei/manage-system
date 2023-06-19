import axios from "~/axios.js";

//指定分类下的图片列表
export function getImageList(id,page=1){
    return axios.get(`/admin/image_class/${id}/image/${page}`)
}

//修改图片名称（重命名）
export function updateImage(id,name){
    return axios.post(`/admin/image/${id}`,{name})
}

//删除图片
export function deleteImage(ids){
    return axios.post(`/admin/image/delete_all`,{ids})
}

//图片上传（特殊）
export const uploadImageAction = import.meta.env.VITE_APP_BASE_API+"/admin/image/upload";
