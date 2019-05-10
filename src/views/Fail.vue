<template>
	<div class="wrap">
        <div class="ok">
            <van-icon name="cross" />
            <p>支付失败</p>
        </div>
        <p style="text-align:center; padding:20px"><van-button type="default" @click="goHome">继续购买</van-button></p>
	</div>
</template>

<script>
export default {
    data() {
        return {

        };
	},
    created(){	
	},
    methods: {
        goHome(){
            this.$router.push({path:'/'});
        }
    }
};
</script>

<style scoped>
.ok{background: #f7f7f7; text-align: center; padding: 40px 0}
.ok i{background: #c00; color: #fff; display: block; width: 60px; height: 60px; line-height: 60px;font-size: 40px; margin: auto;border-radius: 50%}
.ok p{margin-top: 20px;}
</style>
