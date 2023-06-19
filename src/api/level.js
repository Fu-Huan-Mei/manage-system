import axios from '~/axios.js';

//会员等级列表
export function getUserLevelList(page){
    return axios.get(`/admin/user_level/${page}`)
}

//增加会员等级
export function createUserLevel(data){
    return axios.post("/admin/user_level",data)
}

//修改会员等级
export function updateUserLevel(id,data){
    return axios.post("/admin/user_level/"+id,data)
}

//删除会员等级
export function deleteUserLevel(id){
    return axios.post(`/admin/user_level/${id}/delete`)
}

//修改会员等级状态
export function updateUserLevelStatus(id,status){
    return axios.post(`/admin/user_level/${id}/update_status`,{ status })
}

