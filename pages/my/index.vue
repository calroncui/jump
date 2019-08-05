<template>
	<view class="content">
		<image class="logo" :src="user.avatarUrl"></image>
		<view class="text-area">
			<text class="title">{{user.nickName}}</text>
		</view>
		
		<view class="uni-padding-wrap uni-common-mt btn" v-bind:style="{display:(loginFlag ? 'none' : 'block')}">
			<button type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="weixinLogin">
				微信登录
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '我的',
				user:{
					avatarUrl:"",
					nickName:""
				},
				loginBtn:"",
				loginFlag:false
			}
		},
		onLoad() {
			var loginUser = uni.getStorageSync("user");
			if(loginUser){
				var loginJson = JSON.parse(loginUser);
				if(loginJson.nickName && loginJson.avatarUrl){
					this.user = loginJson;
					this.loginFlag = true;
				}
			}
		},
		methods: {
			weixinLogin(){
                let _this = this;
                uni.getUserInfo({
                    provider: 'weixin',
                    success: function(infoRes) {
						console.log(infoRes);
                        _this.user.nickName = infoRes.userInfo.nickName; //昵称
                        _this.user.avatarUrl = infoRes.userInfo.avatarUrl; //头像
						uni.setStorageSync("user",JSON.stringify(_this.user));
						_this.loginFlag = true;
                    },
                    fail(res) {}
                });
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
	
	.loginBtn_no{
		display: none;
	}
	
	.loginBtn_yes{
		display: block;
	}
</style>
