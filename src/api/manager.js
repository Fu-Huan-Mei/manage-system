/*管理员模块*/
//引入axios实例
import axios from '~/axios.js';
import { queryParams } from '~/composables/util.js';

//登录接口
export function login(username,password){
    return axios.post('/admin/login',{ username,password })
}

//获取管理员信息和权限菜单(用户信息)接口
// getinfo()的返回值就是promise对象
export function getinfo(){
    //因为在axios.js的请求拦截中：会自动添加token，所以第2个参数不必传入token
    return axios.post('/admin/getinfo')
}

//退出登录接口
export function logout(){
    return axios.post('/admin/logout')
}

//修改密码接口:data表示请求体中携带的3个参数
export function updatepassword(data){
    //第一个参数是URL、第二个参数是请求体
    return axios.post('/admin/updatepassword',data);
    // http://ceshi13.dishait.cn/admin/updatepassword
    //body参数 
}

//管理员列表
export function getManagerList(page,query={ }){
    let r = queryParams(query)
    return axios.get(`/admin/manager/${page}${r}`)
}

//修改管理员状态
export function updateManagerStatus(id,status){
    return axios.post(`/admin/manager/${id}/update_status`,{
        status
    })
}

//新增管理员
export function createManager(data){
    return axios.post('/admin/manager',data)
}

//修改管理员
export function updateManager(id,data){
    return axios.post(`/admin/manager/${id}`,data)
}

//删除管理员
export function deleteManager(id){
    return axios.post(`/admin/manager/${id}/delete`)
}