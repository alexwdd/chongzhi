<template>
	<div class="wrap">   
		
	</div>
</template>

<script>
export default {
    data() {
        return {
			user:[],
			notice:[],
			par:0,
			kefu:[]
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
		feedback(){
			this.$router.push({path:'/feedback'});
		},
		showNotice(){
			this.$router.push({name: 'detail', params: { id: this.notice.id }});
		},
		init(){
            // var that = this;
            // let data = {
            //     token : that.$store.state.token
			// };
			// this.$toast.loading({mask: true,duration:0});
            // that.$http.post("/account/userinfo",data).then(result => {
			// 	this.$toast.clear();
            //     let res = result.data;
            //     if (res.code == 1) {              
			// 		that.user = res.body.user; 
			// 		that.notice = res.body.notice; 
			// 		that.kefu = res.body.kefu; 
			// 		that.par = that.user.par;					
            //     } else if(res.code==9001) {
            //         that.$dialog.alert({title:'错误信息',message:res.desc}).then(() => {
            //             this.$router.push({path:'/login'});
            //         });
            //     }else{
            //         that.$dialog.alert({title:'错误信息',message:res.desc});
            //     }
            // });
		}
    }
};
</script>

<style scoped>

</style>
