<template>
	<div class="wrap">
		<van-pull-refresh v-model="isLoading" @refresh="init">

		<van-swipe :autoplay="3000" indicator-color="white">
			<van-swipe-item v-for="vo in ad" :key="vo.name"><div class="banner"><img :src="vo.image"/></div></van-swipe-item>
		</van-swipe>

		<div class="type">
			<li @click="handleType(vo)" v-for="vo in type" :key="vo.id"><img :src="vo.aimg" v-if="vo.active"><img :src="vo.img" v-else=""></li>
		</div>

		<div class="mobile">
			<span>+65</span>
			<p>
			<van-field type="number" v-model="mobile" placeholder="手机号码" clearable style="font-size:20px;"/>
			</p>
		</div>

		<van-tabs v-model="active">
			<van-tab title="充话费">
				<div class="card" v-for="vo in huafei" :key="vo.id">
					<div class="img"><img :src="vo.picname"></div>
					<div class="actionBox">
						<div class="action" @click="doChongzhi(vo)">
							<p>${{vo.price}}</p>
							马上充值
						</div>
					</div>
				</div>
				<div class="empty" v-show="empty1">~~暂无商品~~</div>
			</van-tab>
			<van-tab title="充流量">
				<div class="card" v-for="vo in liuliang" :key="vo.id">
					<div class="img"><img :src="vo.picname"></div>
					<div class="actionBox">
						<div class="action" @click="doChongzhi(vo)">
							<p>${{vo.price}}</p>
							马上充值
						</div>
					</div>
				</div>
				<div class="empty" v-show="empty2">~~暂无商品~~</div>
			</van-tab>
			<van-tab title="充套餐">
				<div class="card" v-for="vo in taocan" :key="vo.id">
					<div class="img"><img :src="vo.picname"></div>
					<div class="actionBox">
						<div class="action" @click="doChongzhi(vo)">
							<p>${{vo.price}}</p>
							马上充值
						</div>
					</div>
				</div>
				<div class="empty" v-show="empty3">~~暂无商品~~</div>
			</van-tab>
		</van-tabs>

		</van-pull-refresh>

		<van-popup v-model="payShow" position="bottom">
			<div class="payMoney">
				<p>支付</p>
				<span>${{goods.price}}</span>
			</div>
			<div class="payInfo">{{goods.typeName}}直充${{goods.money}} - {{this.mobile}}</div>

			<div class="payType">
				<div class="hd">支付方式</div>
				<li @click="getPayType(1)">
					<img src="../assets/image/alipay.jpg">
					<p>支付宝支付</p>
					<i class="active" v-if="payType==1"></i>
					<i v-else=""></i>
				</li>
				<li @click="getPayType(2)">
					<img src="../assets/image/weixin.jpg">
					<p>微信支付</p>
					<i class="active" v-if="payType==2"></i>
					<i v-else=""></i>
				</li>
			</div>
			<div class="rmb"><span>支付</span> RMB {{goods.rmb}}</div>
            <div style="padding: 10px;">
                <van-button class="my-btn" size="large" @click="doPay">去支付</van-button>
            </div>
        </van-popup>

		
	</div>
</template>

<script>
export default {
    data() {
        return {
			active:0,
			empty1:false,
			empty2:false,
			empty3:false,
			ad:[],
			isLoading: false,
			type:[],
			mobile:'',
			payShow:false,
			payType:'',
			huafei:'',
			liuliang:'',
			taocan:'',
			goods:''
        };
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/') {		    	
		    	this.init();
		    }
		},
		huafei(newValue,oldValue){
			if(newValue.length==0){
				this.empty1 = true;
			}else{
				this.empty1 = false;
			}
		},
		liuliang(newValue,oldValue){
			if(newValue.length==0){
				this.empty2 = true;
			}else{
				this.empty2 = false;
			}
		},
		taocan(newValue,oldValue){
			if(newValue.length==0){
				this.empty3 = true;
			}else{
				this.empty3 = false;
			}
		}
    },
    created(){	
        this.init();
	},
    methods: {
		init(){
			if(window.sessionStorage.getItem('mobile')){
				this.mobile = window.sessionStorage.getItem('mobile');
			}
            var that = this;
			this.$toast.loading({mask: true,duration:0});
            that.$http.post("/chongzhi/index").then(result => {
				this.isLoading=false;
				this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {              
					that.type = res.body.type; 	
					that.ad = res.body.ad; 	
					this.huafei = this.type[0]['huafei'];
					this.liuliang = this.type[0]['liuliang'];
					this.taocan = this.type[0]['taocan'];
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
		},
		handleType(value){
			for(var i in this.type){
				if(this.type[i]['id'] == value['id']){
					this.type[i]['active'] = true;
					this.huafei = this.type[i]['huafei'];
					this.liuliang = this.type[i]['liuliang'];
					this.taocan = this.type[i]['taocan'];
				}else{
					this.type[i]['active'] = false;
				}
			}
		},
		doChongzhi(value){
			if (this.mobile == "") {
                this.$toast({message:'请输入手机号码',position:'bottom'});
                return false;
            }
            if(!this.config.checkMobile(this.mobile)){
				this.$toast({message:'手机号码格式错误',position:'bottom'});
                return false;
			}
			this.payShow = true;
			this.goods = value;
		},
		getPayType(value){
			this.payType = value;
		},
		doPay(){
			if (this.mobile == "") {
                this.$toast({message:'请输入手机号码',position:'bottom'});
                return false;
            }
            if(!this.config.checkMobile(this.mobile)){
				this.$toast({message:'手机号码格式错误',position:'bottom'});
                return false;
			}
			if (this.payType == "") {
                this.$toast({message:'请选择支付方式',position:'bottom'});
                return false;
			}
			window.sessionStorage.setItem('mobile', this.mobile);

			this.$toast.loading({mask: true,duration:0});
			let data = {
				payType:this.payType,
				goodsID:this.goods.id,
				mobile:this.mobile,
			}
            this.$http.post("/chongzhi/submit",data).then(result => {
                this.$toast.clear();
                let res = result.data;
                if (res.code == 1) {
                    this.$dialog.alert({title:'提示',message:'订单号：'+res.body.order_no});
					this.payShow = false;
                }else{
                    this.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
		}
    }
};
</script>

<style scoped>
.type{clear: both; overflow: hidden;}
.type li{float: left; width: 33.333%; padding: 10px; box-sizing: border-box}

.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa; border-radius: 25px}
.pay-btn{color: #fff;background-color: #07c160;border: 1px solid #07c160; border-radius: 25px}

.payMoney{text-align: center; padding: 10px 0;}
.payMoney p{font-size: 12px; color: #999}
.payMoney span{ font-size: 30px; padding: 20px 0; display: block}
.payInfo{ padding: 10px; font-size:18px}
.payType{padding: 20px;}
.payType .hd{border-bottom: 1px #f1f1f1 solid; line-height: 36px;}
.payType li{padding: 10px 0; border-bottom: 1px #f1f1f1 solid; clear: both; overflow: hidden;}
.payType li img{ display: block; float: left; width:24px; margin-right: 10px}
.payType li p{line-height: 24px; float: left;}
.payType li i{display: block; float: right; height:13px; width:13px;border-radius:7px; border:1px #dbdbdb solid; margin-top: 3px}
.payType li i.active{background-color: #07c160; border-color: #07c160}
.rmb{padding: 10px;}
.rmb span{color: #999}

.card{clear: both; padding: 10px; border-bottom: 1px #dbdbdb dotted; display: flex}
.card .img{flex: 1; margin-right: 10px}
.card .img img{width: 100%}
.card .actionBox{width: 80px;}
.card .action{border: 1px #de2741 solid; text-align: center;color:#de2741; font-size: 14px; border-radius:5px; padding: 5px 0}

.mobile{border-bottom:1px #dbdbdb solid; clear: both; overflow: hidden; display: flex; margin:20px; margin-top: 0}
.mobile span{display: block; line-height: 44px; font-size: 20px; color: #999; width: 60px; text-align: center}
.mobile p{flex: 1; margin: 0}
.empty{text-align: center;color: #999; padding: 20px 0}
</style>
