<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-tabs v-model="activeName">
                <!--注册与访问-->
                <el-tab-pane label="注册与访问" name="first">
                    <el-form-item label="是否允许注册会员">
                        <el-radio-group v-model="form.open_reg">
                            <el-radio :label="0" border>关闭</el-radio>
                            <el-radio :label="1" border>开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="注册类型">
                        <el-radio-group v-model="form.reg_method">
                            <el-radio :label="username" border>普通注册</el-radio>
                            <el-radio :label="phone" border>手机注册</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="密码最小长度">
                        <el-input v-model="form.password_min" placeholder="密码最小长度" style="width:30%;"
                            type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="强制密码复杂度">
                        <el-checkbox-group v-model="form.password_encrypt">
                            <el-checkbox label="0" border>数字</el-checkbox>
                            <el-checkbox label="1" border>小写字母</el-checkbox>
                            <el-checkbox label="2" border>大写字母</el-checkbox>
                            <el-checkbox label="3" border>符号</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <!--上传设置-->
                <el-tab-pane label="上传设置" name="second">
                    <el-form-item label="默认上传方式">
                        <el-radio-group v-model="form.upload_method">
                            <el-radio label="oss">对象储存</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Bucket">
                        <el-input v-model="form.upload_config.Bucket" placeholder="Bucket" style="width:30%;"></el-input>
                    </el-form-item>
                    <el-form-item label="ACCESS_KEY">
                        <el-input v-model="form.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY" style="width:30%;"></el-input>
                    </el-form-item>
                    <el-form-item label="SECRET_KEY">
                        <el-input v-model="form.upload_config.SECRET_KEY" placeholder="SECRET_KEY" style="width:30%;"></el-input>
                    </el-form-item>
                    <el-form-item label="空间域名">
                        <el-input v-model="form.upload_config.http" placeholder="http" style="width:30%;"></el-input>
                        <small class="text-gray-500 flex mt-1">请补全http://或https://</small> 
                    </el-form-item>
                </el-tab-pane>
                <!--Api安全-->
                <el-tab-pane label="Api安全" name="thrid">
                    <el-form-item label="api安全">
                        <el-radio-group v-model="form.api_safe">
                            <el-radio :label="0">关闭</el-radio>
                            <el-radio :label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="秘玥">
                        <el-input v-model="form.api_secret" placeholder="http" style="width:30%;"></el-input>
                        <small class="text-gray-500 flex mt-1">秘钥设置关系系统中api调用传输签名串的编码规则,以及会员token解析,请慎重设置,注意设置之后对应会员要求重新登录获取token</small> 
                    </el-form-item>
                </el-tab-pane>
                <el-form-item>
                    <el-button type="primary" size="default" @click="submit">保存</el-button>
                </el-form-item>
            </el-tabs>
        </el-form>
    </div>
</template>
<script setup>
import { getSysconfig, setSysconfig } from "~/api/sysconfig.js";
import { ref, reactive} from "vue";
import { toast } from '~/composables/util.js';

const loading = ref(false);

const activeName = ref("first");
const form = reactive({
    "open_reg": 1, //开启注册，0关闭1开启
    "reg_method": "username", //注册方式，username普通phone手机
    "password_min": 7, //密码最小长度
    "password_encrypt": [], //密码复杂度，0数字、1小写字母、2大写字母、3符号；例如0,1,2
    "upload_method": "oss", //上传方式，local本地，oss对象存储
    //上传配置 { Bucket:"", ACCESS_KEY:"", SECRET_KEY:"", http:""}
    "upload_config": {
        "Bucket": "",
        "ACCESS_KEY": "",
        "SECRET_KEY": "",
        "http": ""
    },
    "api_safe": 1, //api安全，0关闭1开启
    "api_secret": "", //秘钥
})

//获取原有系统设置数据
const getData = () => {
    loading.value = true;
    getSysconfig()
    .then(res => {
       for(const k in form){
        form[k] = res[k]
       }
       //数组
       form.password_encrypt = form.password_encrypt.split(',')
    })
    .finally(() => {
        loading.value = false;
    })
}
getData();


const submit = () => {
    loading.value = true
    setSysconfig({
        ...form,
        //字符串
        password_encrypt:form.password_encrypt.join(",")
    })
    .then(res => {
        toast("修改成功")
        getData()
    })
    .finally(() => {
        loading.value = false
    })
}
</script>