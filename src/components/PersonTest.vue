<template>
    <div class="person">
        <h2>姓名：{{name}}</h2>
        <h2>年龄：{{age}}</h2>
        <button @click="showTel">查看联系方式</button>
    </div>
</template>
<!--Vue2：选项式API、
Vue3：组合式API--->
<script lang="ts">
export default {
    name:'Person',
    data(){
        return {
            name:"张三",
            age:18,
            tel:'10012566'
        }
    },
    computed:{},
    watch:{},
    methods: {
        showTel(){
            alert("联系方式："+this.tel)
        }
    },
}
</script>
<style scoped>
.person{
    background-color: aqua;
    box-shadow: 0 0 10px;
    border-radius: 10px;
    padding:20px;
}
</style>

