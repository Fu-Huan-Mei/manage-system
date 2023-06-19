import axios from '~/axios.js';
import {queryParams} from "~/composables/util.js";

export function getAgentList(page,query = {}){
    let r = queryParams(query)
    return axios.get(`/admin/agent/${page}${r}`)
}
 
export function getAgentOrderList(page,query = {}){
    let r = queryParams(query)
    return axios.get(`/admin/user_bill/${page}${r}`)
}
 

export function getAgentStatistics(){
    return axios.get("/admin/agent/statistics")
}

 
//获取分销设置
export function getConfig(){
    return axios.get('/admin/distribution_setting/get')
}

//修改分销配置
export function setConfig(data){
    return axios.post('/admin/distribution_setting/set',data)
}
