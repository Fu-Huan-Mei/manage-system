import axios from '~/axios.js';
import { queryParams } from '~/composables/util.js';

//订单列表
export function getOrderList(page,query={ }){
    let r = queryParams(query)
    return axios.get(`/admin/order/${page}${r}`)
}

//批量删除商品 
export function deleteOrder(ids){
    return axios.post(`/admin/order/delete_all`,{
        ids
    })
}

//导出订单 
export function exportOrder(query={ }){
    let r = queryParams(query)
    return axios.post(`/admin/order/excelexport${r}`,{},{
        responseType:"blob"
    })
}

//查看物流信息
export function getShipInfo(id){
    return axios.get(`/admin/order/${id}/get_ship_info`)
}
