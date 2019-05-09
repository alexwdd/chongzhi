<template>
	<div class="wrap">
		<van-swipe :autoplay="3000" indicator-color="white">
			<van-swipe-item v-for="vo in ad" :key="vo.name"><div class="banner"><a :href="vo.url"><img :src="vo.image"/></a></div></van-swipe-item>
		</van-swipe>

		<div class="type">
			<li @click="handleType(vo)" v-for="vo in type" :key="vo.id"><img :src="vo.aimg" v-if="vo.active"><img :src="vo.img" v-else=""></li>
		</div>

		<div class="mobile">
			<span>+65</span>
			<p @click="showKeyboard" v-if="mobile=='请输入手机号码'" class="gray">{{mobile}}</p>
			<p @click="showKeyboard" v-else="">{{mobile}}</p>
		</div>

		<van-number-keyboard
			:show="showKey"
			theme="custom"
			extra-key="."
			close-button-text="完成"
			@blur="showKey = false"
			@input="onInput"
			@delete="onDelete"
		/>

		<van-tabs v-model="active">
			<van-tab title="充话费">
				<div class="card" v-for="vo in huafei" :key="vo.id">
					<div class="img">
						<img :src="vo.picname">
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
					<div class="img">
						<img :src="vo.picname">
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
					<div class="img">
						<img :src="vo.picname">
						<div class="action" @click="doChongzhi(vo)">
							<p>${{vo.price}}</p>
							马上充值
						</div>
					</div>	
				</div>
				<div class="empty" v-show="empty3">~~暂无商品~~</div>
			</van-tab>
		</van-tabs>

		<van-popup v-model="payShow" position="bottom">
			<div class="payMoney">
				<span>${{goods.price}}</span>
			</div>
			<div class="payInfo">{{goods.typeName}}直充${{goods.money}} - {{this.mobile}}</div>

			<div class="payType">
				<div class="hd">支付方式</div>
				<!-- <li @click="getPayType(1)">
					<img src="../assets/image/alipay.jpg">
					<p>支付宝支付</p>
					<i class="active" v-if="payType==1"></i>
					<i v-else=""></i>
				</li> -->
				<li @click="getPayType(2)">
					<img src="../assets/image/weixin.jpg">
					<p>微信支付</p>
					<i class="active" v-if="payType==2"></i>
					<i v-else=""></i>
				</li>
			</div>
			<div class="rmb"><span>即将支付</span> {{goods.rmb}} RMB</div>
            <div style="padding: 10px;">
                <van-button class="my-btn" size="large" @click="doPay">去支付</van-button>
            </div>
        </van-popup>	

		<van-loading v-show="isLoading" style="margin:auto"/>
	</div>
</template>

<script>
export default {
    data() {
        return {
			isLoading:true,
			showKey:false,
			active:0,
			empty1:false,
			empty2:false,
			empty3:false,
			ad:[],
			type:[],
			mobile:'请输入手机号码',
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
			//this.$toast.loading({mask: true,duration:0});
            that.$http.post("/chongzhi/index").then(result => {
				this.isLoading=false;
				//this.$toast.clear();
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
		showKeyboard(){
			this.showKey = true;
		},
		onInput(value) {
			if(this.mobile=='请输入手机号码'){
				this.mobile = value.toString();
			}else{
				this.mobile += value.toString();
			}
		},
		onDelete() {
			if(this.mobile!='请输入手机号码'){
				this.mobile = this.mobile.substr(0,this.mobile.length - 1);
				if(this.mobile==''){
					this.mobile = '请输入手机号码';
				}
			}
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
			var that = this;
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
			this.payShow = false;
			if(this.config.isWeiXin()){
				let data = {
					mobile : this.mobile,
					payType : this.payType,
					goodsID : this.goods.id,
				};
				this.$toast.loading({mask: true,duration:0});
				that.$http.post("/chongzhi/createOrder",data).then(result => {
					this.$toast.clear();
					let res = result.data;
					if (res.code == 1) {              
						window.location.href = res.body.url;
					}else{
						that.$dialog.alert({title:'错误信息',message:res.desc});
					}
				});
			}else{
				let url = "app://Recharge?mobile="+this.mobile+"&payType="+this.payType+"&goodsID="+this.goods.id;
				window.location.href = url;
			}
		}
    }
};
</script>

<style scoped>
.wrap{min-height: 100vh}
.type{clear: both; overflow: hidden;}
.type li{float: left; width: 33.333%; padding: 10px; box-sizing: border-box}

.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa; border-radius: 25px}
.pay-btn{color: #fff;background-color: #07c160;border: 1px solid #07c160; border-radius: 25px}

.payMoney{text-align: center; padding: 10px 0;}
.payMoney p{color: #999}
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
.card .img{flex: 1; position: relative;}
.card .img img{width: 100%}
.card .img .action{border: 1px #de2741 solid; text-align: center;color:#de2741; font-size: 12px; border-radius:5px; padding: 2px 0; margin-top: 5px; position: absolute; width: 60px; right: 0px; top: 0px;}

.mobile{border-bottom:1px #dbdbdb solid; clear: both; overflow: hidden; display: flex; margin:20px; margin-top: 0}
.mobile span{display: block; line-height:50px; font-size: 20px; width: 60px; text-align: center;}
.mobile p{flex: 1; margin: 0;line-height:50px; font-size: 20px;}
.gray{color: #999}
.empty{text-align: center;color: #999; padding: 30px 0;}
</style>
