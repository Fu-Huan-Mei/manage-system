import axios from '~/axios.js';

//角色列表
export function getRoleList(page){
    return axios.get(`/admin/role/${page}`)
}

//增加角色
export function createRole(data){
    return axios.post("/admin/role",data)
}

//修改角色
export function updateRole(id,data){
    return axios.post("/admin/role/"+id,data)
}

//删除角色
export function deleteRole(id){
    return axios.post(`/admin/role/${id}/delete`)
}

//修改角色状态
export function updateRoleStatus(id,status){
    return axios.post(`/admin/role/${id}/update_status`,{ status })
}

//配置角色权限
export function setRoleRules(id,rule_ids){
    return axios.post("/admin/role/set_rules",{
        id,rule_ids
    })
}