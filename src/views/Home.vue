<template>
	<div class="wrap">
		<van-swipe :autoplay="3000" indicator-color="white">
			<van-swipe-item><div class="banner"></div></van-swipe-item>
			<van-swipe-item><div class="banner"></div></van-swipe-item>
			<van-swipe-item><div class="banner"></div></van-swipe-item>
			<van-swipe-item><div class="banner"></div></van-swipe-item>
		</van-swipe>

		<div class="channel">
			<li @click="handleChannel(vo)" v-for="vo in channel" :key="vo.id"><img :src="vo.aimg" v-if="vo.active"><img :src="vo.img" v-else=""></li>
		</div>

		<div class="mobile">
			<span>+65</span>
			<p>
			<van-field type="number" v-model="mobile" placeholder="手机号码" clearable style="font-size:20px;"/>
			</p>
		</div>

		<div style="padding: 10px;">
            <van-button class="my-btn" size="large" @click="doChongzhi">立即充值</van-button>
        </div>

		<van-popup v-model="payShow" position="bottom">
			
            <van-radio-group v-model="payType" @change="getPayType">
				<div class="payType">
					<li>
					<van-radio name="1" checked-color="#07c160">支付宝</van-radio>
					</li>
					<li>
					<van-radio name="2" checked-color="#07c160">微信钱包</van-radio>
					</li>
				</div>
			</van-radio-group>

            <div style="padding: 10px;">
                <van-button class="pay-btn" size="large" @click="doPay">去支付</van-button>
            </div>
        </van-popup>
	</div>
</template>

<script>
export default {
    data() {
        return {
			channel:[],
			mobile:'',
			payShow:false,
			payType:''
        };
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/') {		    	
		    	this.init();
		    }
		}
    },
    created(){	
        this.init();
	},
    methods: {
		init(){
            var that = this;
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/chongzhi/index").then(result => {
				this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
					that.channel = res.body.channel; 		
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
		},
		handleChannel(value){
			for(var i in this.channel){
				if(this.channel[i]['id'] == value['id']){
					this.channel[i]['active'] = true;
				}else{
					this.channel[i]['active'] = false;
				}
			}
		},
		doChongzhi(){
			this.payShow = true;
		},
		getPayType(value){
			this.payType = value;
		},
		doPay(){

		}
    }
};
</script>

<style scoped>
.banner{background-color: #f1f1f1; height:200px;}
.channel{clear: both; overflow: hidden;}
.channel li{float: left; width: 33.333%; padding: 10px; box-sizing: border-box}
.mobile{border-bottom:1px #dbdbdb solid; clear: both; overflow: hidden; display: flex}
.mobile span{display: block; line-height: 44px; font-size: 20px; color: #999; width: 60px; text-align: center}
.mobile p{flex: 1; margin: 0}
.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa; border-radius: 25px}
.pay-btn{color: #fff;background-color: #07c160;border: 1px solid #07c160; border-radius: 25px}
.payType{padding: 20px;}
.payType li{padding: 10px 0; border-bottom: 1px #f1f1f1 solid}
</style>
