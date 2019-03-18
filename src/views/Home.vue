<template>
	<div class="wrap">
		<van-pull-refresh v-model="isLoading" @refresh="init">

		<van-swipe :autoplay="3000" indicator-color="white">
			<van-swipe-item v-for="vo in ad" :key="vo.name"><div class="banner"><img :src="vo.image"/></div></van-swipe-item>
		</van-swipe>

		<div class="type">
			<li @click="handleType(vo)" v-for="vo in type" :key="vo.id"><img :src="vo.aimg" v-if="vo.active"><img :src="vo.img" v-else=""></li>
		</div>

		<div class="empty" v-show="empty">~~暂无商品~~</div>

		<div class="card" v-for="vo in card" :key="vo.id">
			<div class="img"><img :src="vo.picname"></div>
			<div class="info">
				<div class="name">{{vo.name}}</div>
				<div class="money">面值 {{vo.money}}</div>
			</div>
			<div class="action">
				<p>￥{{vo.price}}</p>
				<van-button size="small" plain type="danger" @click="doChongzhi(vo)">马上充值</van-button>
			</div>
		</div>
		</van-pull-refresh>

		<van-popup v-model="payShow" position="bottom">
			<div class="mobile">
				<span>+65</span>
				<p>
				<van-field type="number" v-model="mobile" placeholder="手机号码" clearable style="font-size:20px;"/>
				</p>
			</div>
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
			empty:false,
			ad:[],
			isLoading: false,
			type:[],
			mobile:'',
			payShow:false,
			payType:'',
			card:'',
			goods:''
        };
	},
	watch:{
    	$route(to,from){
		    if (to.path=='/') {		    	
		    	this.init();
		    }
		},
		card(newValue,oldValue){
			if(newValue.length==0){
				this.empty = true;
			}else{
				this.empty = false;
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
					this.card = this.type[0]['goods'];
                }else{
                    that.$dialog.alert({title:'错误信息',message:res.desc});
                }
            });
		},
		handleType(value){
			for(var i in this.type){
				if(this.type[i]['id'] == value['id']){
					this.type[i]['active'] = true;
					this.card = this.type[i]['goods'];
				}else{
					this.type[i]['active'] = false;
				}
			}
		},
		doChongzhi(value){
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
.banner{}
.type{clear: both; overflow: hidden;}
.type li{float: left; width: 33.333%; padding: 10px; box-sizing: border-box}

.my-btn{color: #fff;background-color: #1989fa;border: 1px solid #1989fa; border-radius: 25px}
.pay-btn{color: #fff;background-color: #07c160;border: 1px solid #07c160; border-radius: 25px}
.payType{padding: 20px;}
.payType li{padding: 10px 0; border-bottom: 1px #f1f1f1 solid}

.card{clear: both; padding: 10px; border-bottom: 1px #dbdbdb dotted; display: flex}
.card .img{width: 120px; margin-right: 10px;}
.card .img img{width: 100%}
.card .info{flex: 1; margin-right: 10px}
.card .info .name{font-size: 14px}
.card .info .money{color: #f00}
.card .action{width: 80px;}

.mobile{border-bottom:1px #dbdbdb solid; clear: both; overflow: hidden; display: flex; margin:20px;}
.mobile span{display: block; line-height: 44px; font-size: 20px; color: #999; width: 60px; text-align: center}
.mobile p{flex: 1; margin: 0}
.empty{text-align: center;color: #999; padding: 20px 0}
</style>
