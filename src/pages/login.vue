<template>
    <!--登录页面：左右响应式布局-->
    <el-row class="login-container" >
        <!--左边-->
        <el-col :lg="16" :md="12" class="left">
            <div>欢迎光临</div>
            <div>口水吧-后台管理</div>
        </el-col>
        <!--右边-->
        <el-col :lg="8" :md="12" class="bg-light-50 right">
            <h2>欢迎回来</h2>
            <div class="title">
                <span></span>
                <span>账号密码登录</span>
                <span></span>
            </div>
            <div class="form">
                <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
                    <!--用户名-->
                    <el-form-item prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名">
                            <template #prefix>
                                <el-icon><user /></el-icon>
                            </template>
                        </el-input> 
                    </el-form-item>
                    <!--密码-->
                    <el-form-item prop="password">
                        <el-input type="password" v-model="form.password" show-password placeholder="请输入密码">
                            <template  #prefix>
                                <el-icon><lock /></el-icon>
                            </template>
                        </el-input>    
                    </el-form-item>
                    <!--登录：使用 loading 变量来控制加载状态-->
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit" :loading="loading" round class="w-[250px]" color="#34D399" >登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import { reactive,ref,onBeforeUnmount,onMounted} from 'vue';
import { toast } from '~/composables/util.js';
import {useRouter} from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore();
//初始化表单:从表单中收集到的数据
const form = reactive({
    username: '',
    password: ''
});

//表单验证规则：动态绑定（根据用户输入进行动态更新）
const rules ={
    username:[
        { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    password:[
        { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
};

//`组件渲染后`，可以使用 formRef 引用 `<el-form> 组件`(获取节点），以便在组件中访问该组件的`方法和属性`
const formRef = ref(null);

//默认为false
const loading = ref(false);

//当用户输入用户名和密码后，点击提交后，客户端会将这些凭据发送到服务器进行验证
const onSubmit = () => {
    //验证用户输入的信息是否合法
    formRef.value.validate(valid => {
        //如果结果为false，表示用户未输入信息未通过验证
        if(!valid){
            //登录失败
            return false;
        }else{
            //当用户点击登录按钮时，表单会进入加载状态，此时 loading.value 会被设置为 true，表示表单正在加载中
            loading.value = true;
            //登录成功：在客户端`保存`用户的`登录信息` eg：setToken(res.token);
            store.dispatch("login",form)
            .then(res => {
                //提示登录成功
                toast('登录成功');
                //跳转到后台首页
                router.push('/');
            }) 
            .finally(()=> {
                //当登录请求结束时，无论请求是否成功,表单都要停止加载，回到正常状态
                loading.value = false
            });
        }
    })
};

//监听回车事件
function onKeyUp(e){
    //按下回车键就相当于点击登录按钮
    if(e.key === "Enter"){
        onSubmit();
    }
};

//页面加载结束
onMounted(() => {
    //添加键盘监听
    document.addEventListener("keyup",onKeyUp);
});

//页面消失
onBeforeUnmount(() => {
    //取消键盘监听
    document.removeEventListener("keyup",onKeyUp);
});
</script>
<style scoped>
.login-container{
    @apply min-h-screen bg-green-400 ;
}
.login-container .left ,.login-container .right{
    @apply flex items-center justify-center flex-col;
}
.left>div:first-child{
    @apply font-bold text-5xl text-light-50 mb-4;
}
.left>div:last-child{
    @apply text-gray-100 text-sm;
}
.right h2{
    @apply font-bold text-3xl text-gray-800;
}
.right .title{
    @apply flex items-center justify-center my-5 text-gray-400 space-x-2;
}
.right .title span:not(:nth-child(2)){
    @apply h-[1px] w-16 bg-gray-200;/*账号密码登录左右2条横线*/
}

</style>