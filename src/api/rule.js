//菜单权限
import axios from '~/axios.js';

//菜单权限列表
export function getRuleList(page){
    return axios.get(`/admin/rule/${page}`)
}

//增加菜单权限
export function createRule(data){
    return axios.post('/admin/rule',data)
}

//修改菜单权限
export function updateRule(id,data){
    return axios.post('/admin/rule/'+id,data)
}

//修改菜单权限状态
export function updateRuleStatus(id,status){
    return axios.post(`/admin/rule/${id}/update_status`,{status})
}

//删除菜单权限
export function deleteRule(id){
    return axios.post(`/admin/rule/${id}/delete`)
}
