import axios from '~/axios.js';
//后台统计接口方法
//后台首页统计1
export function getStatistics1(){
    // 完整url：axios.post('http://ceshi13.dishait.cn/admin/statistics1')
    //由于axios.js已经定义了baseURL域名，所以直接写地址即可
    return axios.get('/admin/statistics1')
}

//后台首页统计2
export function getStatistics2(){
    // 完整url：axios.post('http://ceshi13.dishait.cn/admin/statistics1')
    //由于axios.js已经定义了baseURL域名，所以直接写地址即可
    return axios.get('/admin/statistics2')
}

//后台首页统计3
//调用 getStatistics3 函数时，需要传入一个 type 参数，用于指定查询的事件类型
export function getStatistics3(type){
    return axios.get('/admin/statistics3?type='+type)
    // return axios.get('/admin/statistics3?type=hour'+type)
    // http://ceshi13.dishait.cn/admin/statistics3?type=hour
    //Query参数
}