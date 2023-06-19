//用户管理
//引入axios实例
import axios from '~/axios.js';
import { queryParams } from '~/composables/util.js';

//用户列表
export function getUserList(page,query={ }){
    let r = queryParams(query)
    return axios.get(`/admin/user/${page}${r}`)
}

//修改用户状态
export function updateUserStatus(id,status){
    return axios.post(`/admin/user/${id}/update_status`,{
        status
    })
}

//增加用户
export function createUser(data){
    return axios.post('/admin/user',data)
}

//修改用户
export function updateUser(id,data){
    return axios.post(`/admin/user/${id}`,data)
}

//删除用户
export function deleteUser(id){
    return axios.post(`/admin/user/${id}/delete`)
}