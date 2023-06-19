<template>
    <!--后台布局：公共头部-->
    <div class="f-header">
        <!--左边：图标-->
        <span class="logo">
            <!--mr-1:margin-right=0.25rem -->
            <el-icon class="mr-1"> <Sunny /></el-icon>
            口水吧
        </span>
        <!--展开/折叠图标-->
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <!--展开-->
            <fold v-if="$store.state.asideWidth == '250px'"/>
            <!--折叠-->
            <Expand v-else/>
        </el-icon>
        <!--文字提示-->
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <!--刷新图标-->
            <el-icon class="icon-btn" @click="handleRefresh">
                <refresh />
            </el-icon>
        </el-tooltip>

        <!--右边：图标-->
        <div class="ml-auto flex items-center">
            <!--文字提示:s-->
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <!--全屏图标：是否全屏-->
                <el-icon class="icon-btn" @click="toggle">
                    <!--非全屏状态下显示这个`全屏图标`-->
                    <full-screen v-if="!isFullscreen" />
                    <!--全屏状态显示这个`非全屏图标`-->
                    <aim v-else />
                </el-icon>
            </el-tooltip>
            <!--下拉菜单：command事件：用户点击下拉菜单项时，<el-dropdown>组件会触发command事件，并将`当前``下拉菜单项`的`command属性值`作为`参数`传递给该事件的回调函数-->
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <!--头像-->
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />{{ $store.state.user.username }}
                    <!--箭头-->
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <!--下拉菜单项-->
                <template #dropdown>
                    <el-dropdown-menu>
                        <!--command属性：指定属性值以参数形式返回给command事件处理函数中-->
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <!--修改密码弹框： @submit="onSubmit"表示只要点击提交按钮，就会触发onSubmit方法-->
    <form-drawer ref="formDrawerRef" title="修改密码" destoryOnClose @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
            <!--旧密码：prop属性：el-form 会根据 prop的 `属性值`将`用户输入的数据`绑定到 `el-form 组件`的`数据对象`上-->
            <el-form-item prop="oldpassword" label="旧密码">
                <!-- prop="oldpassword"表示这个表单项<-> form 对象上的`oldpassword属性`-->
                <el-input type="password" v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <!--新密码-->
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import FormDrawer from '~/components/FormDrawer.vue'
import { useFullscreen } from '@vueuse/core'
import { useRepassword,useLogout } from "~/composables/useManager"
const {
    // 全屏状态
    isFullscreen,
    // 切换全屏
    toggle
} = useFullscreen()
 
const {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm
} = useRepassword()
 
const {
    handleLogout
} = useLogout()
 
const handleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            openRePasswordForm()
            break;
    }
}
 
// 刷新
const handleRefresh = () =>{
    location.reload()
} 
 
</script>
<style scoped>
.f-header {
    @apply flex items-center bg-green-400 text-light-50 fixed top-0 right-0 left-0;
    height: 64px;
    z-index: 1000;
}

.logo {
    width: 250px;
    @apply flex items-center justify-center text-xl font-thin;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-green-300;
}

.dropdown {
    @apply flex justify-center items-center mx-5;
    height: 64px;
    cursor: pointer;
}
</style>