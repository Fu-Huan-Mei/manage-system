//权限配置
import store from "~/store";
//el是节点、value是一个数组
function hasPermission(value,el = false){
    //如果value不是一个数组
    if(!Array.isArray(value)){
        throw new Error(`需要配置权限,例如v-permissison=['getStatistics3,GET']`)
    }
    //只要索引不是-1，表示在ruleNames查到了 binding.value ，表示有权限访问
    const hasAuth = value.findIndex(v => store.state.ruleNames.includes(v)) != -1;
    //如果有该节点但无权限
    if(el && !hasAuth){
        //如果有节点就移除该节点
        el.parentNode && el.parentNode.removeChild(el);
    }
    return hasAuth;
}
export default{
    install(app){
        //注册了一个名为 permission 的全局指令
        app.directive("permission",{
            //el当前节点、binding表示1个对象
            mounted(el,binding) {
                hasPermission(binding.value)
            }
        })
    }
}