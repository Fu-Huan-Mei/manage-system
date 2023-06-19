/*Token相关的工具:在客户端中存储和管理 token*/
import { useCookies } from '@vueuse/integrations/useCookies';
//标识存储在浏览器 Cookie 中的 `token `的`键名`
const TokenKey = "admin-token";
//Cookie 的作用主要是用于实现'用户状态'的跟踪和身份验证等功能
const cookie = useCookies();
//获取存储在浏览器中的 token
export function getToken(){
    return cookie.get(TokenKey);
};
//将 token 存储到浏览器中:setToken 函数的作用是将传入的 token 值存储到浏览器的 cookie 中，并返回 cookie 的值
export function setToken(token){
    return cookie.set(TokenKey,token);
};
//清除存储在浏览器中的 token
export function removeToken(){
    return cookie.remove(TokenKey);
};

