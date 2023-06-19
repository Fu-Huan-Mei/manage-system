import { createStore } from 'vuex';
import {login,getinfo} from '~/api/manager.js';
import { setToken,removeToken} from '~/composables/auth.js';
// 创建一个新的 store 实例
const store = createStore({
    state () {
      return {
        //用户信息
        user:{},
        //侧边宽度
        asideWidth:"250px",
        //菜单项
        menus:[],
        //接口权限
        ruleNames:[]
      }
    },
    mutations: {
      //记录用户信息
      SET_USERINFO(state,user){
        //用户登录成功的状态信息赋值给state.user
        state.user = user;
      },
      //展开/缩起侧边
      handleAsideWidth(state){
        //如果 state.asideWidth 的当前值等于 "250px"，那么将其值设置为 "250px"
        state.asideWidth = state.asideWidth == "250px" ? "64px" :  "250px";
      },
      SET_MENUS(state,menus){
          state.menus = menus
      },
      SET_RULENAMES(state,ruleNames){
          state.ruleNames = ruleNames
      }
    },
    actions:{
      //登录
      login({commit} = {},{username,password}){
        return new Promise((resolve,reject) => {
          //登录成功
          login(username,password)
          .then(res => {
            //服务器会返回一个包含用户身份信息的 token，并`存储`到`客户端`以便在`后续的请求`中`使用`
            setToken(res.token);
            //将登录成功的结果返回给调用者
            resolve(res);
            //将登录失败的原因返回给调用者
          })
          .catch(err => { reject(err)})
        })
      },
      
      //参数：{ commit }表示从'传入的参数'中提取'commit属性'并赋值给'变量commit'
      //注意：在函数参数中中添加默认值，避免函数参数对象中没有commit属性，那么这个变量的值将会是undefined
      //获取当前用户登录信息
      getinfo({ commit } = {}){
        return new Promise((resolve,reject) => {
          //res 和 err 都是从异步操作 getinfo() 返回的,res是后端返回的data数据
          getinfo()
          .then(res => {
            //如果异步操作成功，则调用 commit 或 context.commit 方法提交 SET_USERINFO mutation，将 res 作为user传递给 mutation
            commit("SET_USERINFO",res);
            commit("SET_MENUS",res.menus);
            commit("SET_RULENAMES",res.ruleNames);
            resolve(res);
          })//如果异步操作失败，则将错误信息传递给 Promise 的 reject 方法，以便在异步操作的调用方中处理这个错误
          .catch(err => reject(err));
        })
      },

      //退出登录
      logout({ commit } = {}){
        //移除cookie中的token
        removeToken();
        //清除当前用户状态：vuex中的user
        commit("SET_USERINFO",{});
      }
    }
})
export default store
  