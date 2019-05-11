<template>
	<div class="wrap">
		<div class="top">
            <div class="left"><img src="../assets/image/left.png"></div>
            <div class="right"><div class="btn" @click="openApp">打开APP</div></div>
        </div>

		<div style="height:46px"></div>

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

		<div style="height:50px"></div>
		<div class="footer">
            <div class="logo"><img src="../assets/image/logo.jpg"></div>
            <div class="info">
                <p>新加坡同城生活掌上宝</p>
                <p>
                    <van-icon name="star" />
                    <van-icon name="star" />
                    <van-icon name="star" />
                    <van-icon name="star" />
                    <van-icon name="star" />
                </p>
            </div>
            <div class="download" @click="download">下载APP</div>
        </div>

        <van-popup position="top" v-model="show">
            <div class="alert">
                <img src="../assets/image/alert.jpg">
            </div>
        </van-popup>

        <van-popup v-model="downShow" class="my-van-popup">
            <div class="down">
                <div class="hd"><img src="../assets/image/down.png"></div>
                <div class="bd">
                    <li><a :href="config.ANDROIDS"><img src="../assets/image/googleplay.png"></a></li>
                    <li><a :href="config.IOS"><img src="../assets/image/appstore.png"></a></li>
                </div>
            </div>
        </van-popup>
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
			goods:'',
			show:false,
			downShow:false,
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
		openApp(){
            if(this.config.isWeiXin()){
                this.show = true
            }else{
                var url = '';
                if(this.config.isIOS()){
                    url = this.config.IOS;
                }else{
                    url = this.config.ANDROIDS
                }
                if (this.open_app(this.config.SCHEME)) {
                    this.open_app(this.config.SCHEME);
                } else {
                    var delay = setInterval(function() {
                        var d = new Date();
                        var t1 = d.getTime();
                        var t0 = 0;
                        if (t1 - t0 < 3000 && t1 - t0 > 2000) {
                            //alert('检测到未安装，请下载APP');
                            window.location.href = url
                        }
                        if (t1 - t0 >= 3000) {
                            clearInterval(delay);
                        }
                    }, 1000);
                }
            }
		},
		open_app(src){
            // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
            // 否则打开a标签的href链接
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            if (userAgent.indexOf("Safari") > -1) {
                window.location.href = src;
            } else {
                var ifr = document.createElement('iframe');
                ifr.src = src;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
                window.setTimeout(function() {
                    document.body.removeChild(ifr);
                }, 2000);
            }
        },
        download(){
            this.downShow = true;
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
.top{clear: both; overflow: hidden; height: 46px; position: fixed; left: 0; width: 100%; z-index: 999; background: #fff; border-bottom: 1px #f1f1f1 solid}
.top img{display: block; height: 46px;}
.top .left{float: left;}
.top .right{float: right;}
.top .right .btn{float:right; height: 30px; line-height: 30px; background: #7507c2; border-radius: 5px; color: #fff; margin-right: 10px; margin-top: 10px; font-size: 14px; padding: 0 10px}
.footer{background: rgba(0,0,0,0.8); width:100%; height: 50px; border-radius: 5px; margin: auto; position: fixed; left: 0;bottom: 0px; z-index: 80;}
.footer .logo{float: left; height: 40px; margin-top: 5px; margin-left: 5px; margin-right: 10px}
.footer .logo img{height: 40px; display: block;border-radius: 5px}
.footer .info{float: left; font-size: 14px; color: #fff; padding-top: 5px}
.footer .info p{line-height: 20px;}
.footer .info p i{color:#f60 }
.footer .download{float:right; height: 30px; line-height: 30px; background: #7507c2; border-radius: 5px; color: #fff; margin-right: 10px; margin-top: 10px; font-size: 14px; padding: 0 10px}

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

.alert{width: 100%;}
.alert img{width: 100%}
.my-van-popup {background-color:transparent; width: 80%;}
.down{clear: both; overflow: hidden;}
.down img{display: block}
.down .hd{clear: both;}
.down .bd{background: #fff; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding: 20px; overflow: hidden; padding-right: 0}
.down .bd li{float: left; width: 50%; padding-right: 20px; box-sizing: border-box}
</style>
