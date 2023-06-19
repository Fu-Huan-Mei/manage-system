/*消息提示的工具 */
import {  ElNotification,ElMessageBox } from 'element-plus'
//导入NProgress库的JavaScript模块
import nprogress from 'nprogress';

//消息提示
//参数：dangerouslyUseHTMLString是否将 message 属性作为 HTML 片段处理，默认值false
export function toast(message,type='success',dangerouslyUseHTMLString = true){
      ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration:3000
    })
}

//消息弹出框（确认消息）
export function showModal(content="提示内容",title="",type="warning"){
  return ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type,
    }
  )
}

//显示全屏loading
export function showFullLoading(){
  nprogress.start();
}

//隐藏全屏
export function hideFullLoading(){
  nprogress.done();
}

//弹出输入框
export function showPrompt(tip,value=''){
  return ElMessageBox.prompt(tip, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue:value
  })
}

//将query对象转为url参数
export function queryParams(query){
  let q = []
    for(const key in query){
        if(query[key]){
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let r = q.join("&")
    r = r ? "?" + r : ""//tab=all&title=关键词&category_id=2&limit=10
    return r
}

//上移
export function useArrayMoveUp(arr,index){
  swapArray(arr,index,index-1)
}

//下移
export function useArrayMoveDown(arr,index){
  swapArray(arr,index,index+1)
}

//排序
function swapArray(arr,index1,index2){
 arr[index1] = arr.splice(index2,1,arr[index1])[0]
  return arr
}

