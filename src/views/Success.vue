<template>
	<div class="wrap">
        <div class="ok">
            <van-icon name="success" />
            <p>支付成功</p>
        </div>

        <van-loading v-show="isLoading" style="margin:auto"/>

		<van-cell title="订单号" :value="info.order_no" />
		<van-cell title="支付方式" :value="info.pay" />
        <van-cell title="商品" :value="info.goodsName" />
		<van-cell title="金额" :value="info.rmb" />
		<van-cell title="交易时间" :value="info.time" />

        <p style="text-align:center; padding:20px"><van-button type="default" @click="goHome">继续购买</van-button></p>
	</div>
</template>

<script>
export default {
    data() {
        return {
            isLoading:true,
            info:'',
            order_no:''
        };
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/success') {		    	
		    	this.init();
		    }
		},
    },
    created(){	
        this.init();
	},
    methods: {
		init(){
            var that = this;
            that.order_no = that.$route.params.order_no; 
            //this.$toast.loading({mask: true,duration:0});
            let data = {order_no:that.order_no};
            that.$http.post("V1/chongzhi/info",data).then(result => {
                //this.$toast.clear();
                that.isLoading=false;
                let res = result.data;
                if (res.code == 1) {              
					that.info = res.body; 	
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
        },
        goHome(){
            this.$router.push({path:'/'});
        }
    }
};
</script>

<style scoped>
.ok{background: #f7f7f7; text-align: center; padding: 40px 0}
.ok i{background: #07c160; color: #fff; display: block; width: 60px; height: 60px; line-height: 60px;font-size: 40px; margin: auto;border-radius: 50%}
.ok p{margin-top: 20px;}
</style>
