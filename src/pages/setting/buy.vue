<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-tabs v-model="activeName">
                <!--注册与访问-->
                <el-tab-pane label="支付设置" name="first">
                    <el-table :data="tableData" border stripe>
                        <el-table-column label="支付方式">
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image :src="row.src" fit="fill" :lazy="true" style="width:10px height:10px;"
                                        class="rounded mr-2"></el-image>
                                    <div>
                                        <h6>{{ row.name }}</h6>
                                        <small class="flex text-gray-500 mt-1">{{ row.desc }}</small>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" text @click="open(row.key)">配置</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
                <!--上传设置-->
                <el-tab-pane label="购物设置" name="second">
                    <el-form-item label="未支付订单">
                        <div>
                            <el-input v-model="form.close_order_minute" placeholder="close_order_minute" type="number">
                                <template #append>分钟后自动关闭</template>
                            </el-input>
                            <small class="text-gray-500 flex mt-1">
                                订单完成后,用户在n天内可以发起售后申请,设置0后不自动关闭
                            </small> 
                        </div>
                    </el-form-item>
                    <el-form-item label="已发货订单">
                        <div>
                        <el-input v-model="form.auto_received_day" placeholder="auto_received_day"  type="number">
                            <template #append>分钟后自动关闭</template>
                        </el-input>
                        <small class="text-gray-500 flex mt-1">
                            订单完成后,用户在n天内可以发起售后申请,设置0后不自动收获
                        </small>
                    </div>
                    </el-form-item>
                    <el-form-item label="已完成订单">
                        <div>
                        <el-input v-model="form.after_sale_day" placeholder="after_sale_day"  type="number">
                            <template #append>分钟后自动关闭</template>
                        </el-input>
                        <small class="text-gray-500 flex mt-1">
                            订单完成后,用户在n天内可以发起售后申请,设置0后不允许申请售后
                        </small> 
                    </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="default" @click="submit">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>

        <!--配置弹框-->
        <form-drawer ref="formDrawerRef" title="配置" @submit="submit">
            <!--支付宝支付-->
            <el-form v-if="drawerType === 'alipay'" :model="form" label-width="80px">
                <el-form-item label="app_id">
                    <el-input v-model="form.alipay.app_id" placeholder="app_id" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="ali_public_key">
                    <el-input v-model="form.alipay.ali_public_key" placeholder="ali_public_key" style="width:90%;"
                        type="textarea" rows="4"></el-input>
                </el-form-item>
                <el-form-item label="private_key">
                    <el-input v-model="form.alipay.private_key" placeholder="private_key" style="width:90%;"></el-input>
                </el-form-item>
            </el-form>
            <!--微信支付-->
            <el-form v-else :model="form" label-width="80px">
                <el-form-item label="公众号APPID">
                    <el-input v-model="form.wxpay.app_id" placeholder="app_id" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="小程序APPID">
                    <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id" style="width:90%;" type="textarea"
                        rows="4"></el-input>
                </el-form-item>
                <el-form-item label="小程序secrete">
                    <el-input v-model="form.wxpay.secret" placeholder="secret" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" placeholder="appid" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="form.wxpay.mch_id" placeholder="mch_id" style="width:90%;" type="textarea"
                        rows="4"></el-input>
                </el-form-item>
                <el-form-item label="API密钥">
                    <el-input v-model="form.wxpay.key" placeholder="key" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="上传图片">
                    <el-upload :action="uploadAction" :headers="{ token }" aceept=".pem" :limit="1"
                        :on-success="uploadClientSucces">
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">
                                {{ form.wxpay.cert_client ? form.wxpay.cert_client : "还未配置" }}
                            </p>
                            <div class="el-upload__tip">
                                例如:apiclient_cert.pem
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="上传图片">
                    <el-upload :action="uploadAction" :headers="{ token }" aceept=".pem" :limit="1"
                        :on-success="uploadKeySuccess">
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <p class="text-rose-500">
                                {{ form.wxpay.cert_key ? form.wxpay.cert_key : "还未配置" }}
                            </p>
                            <div class="el-upload__tip">
                                例如:apiclient_key.pem
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </form-drawer>
    </div>
</template>
<script setup>
import { getToken } from "~/composables/auth.js";
import { getSysconfig, setSysconfig, uploadAction } from "~/api/sysconfig.js";
import { ref, reactive } from "vue";
import { toast } from '~/composables/util.js';
import FormDrawer from "~/components/FormDrawer.vue";
const loading = ref(false);
const formDrawerRef = ref(null);
const token = getToken()
//表格数据
const tableData = [
    {
        name: '支付宝支付',
        desc: '该系统支付即时到账服务',
        src: '/alipay.png',
        key: 'alipay'
    },
    {
        name: '微信支付',
        desc: '该系统支付微信网页支付和扫码支付',
        src: '/wepay.png',
        key: '"wxpay'
    }
]

const activeName = ref("first");
const form = reactive({
    "close_order_minute": 30,
    "auto_received_day": 7,
    "after_sale_day": 23,
    "alipay": {
        "app_id": "",
        "ali_public_key": "",
        "private_key": ""
    },
    "wxpay": {
        "app_id": "",
        "miniapp_id": "",
        "secret": "",
        "appid": "",
        "mch_id": "",
        "key": "",
        "cert_client": "",
        "cert_key": ""
    },
    "ship": ""
})

//获取原有系统设置数据
const getData = () => {
    loading.value = true;
    getSysconfig()
        .then(res => {
            for (const k in form) {
                form[k] = res[k]
            }

        })
        .finally(() => {
            loading.value = false;
        })
}
getData();


const submit = () => {
    loading.value = true
    setSysconfig({
        ...form
    })
        .then(res => {
            toast("修改成功")
            getData()
        })
        .finally(() => {
            loading.value = false
        })
}

const drawerType = ref("alipay")

const open = (key) => {
    drawerType.value = key;
    formDrawerRef.value.open();
}

//上传成功
function uploadClientSucces(response, uploadFile, uploadFiles) {
    form.wxpay.cert_client = response.data
}

//上传成功
function uploadKeySuccess(response, uploadFile, uploadFiles) {
    form.wxpay.cert_key = response.data
}
</script>