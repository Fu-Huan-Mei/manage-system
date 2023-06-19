import axios from '~/axios.js';

//获取原有系统设置
export function getSysconfig(){
    return axios.get('/admin/sysconfig')
}

//修改系统设置
export function setSysconfig(data){
    return axios.post('/admin/sysconfig',data)
}

//图片上传：域名
export const uploadAction =  import.meta.env.VITE_APP_BASE_API+"/admin/sysconfig/upload";
