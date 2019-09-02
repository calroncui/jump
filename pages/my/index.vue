<template>
	<view class="content">
		<view class="topCtn">
			<image class="logo" :src="user.avatarUrl"></image>
			<view class="uni-padding-wrap uni-common-mt btn logout_btn" v-bind:style="{display:(!loginFlag ? 'none' : 'block')}">
				<button type='primary' size="mini" @click="logout()">
					退出登录
				</button>
			</view>
			<view class="text-area">
				<text class="title">{{user.nickName}}</text>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt btn" v-bind:style="{display:(loginFlag ? 'none' : 'block')}">
			<button type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="weixinLogin" size="mini">
				微信登录
			</button>
		</view>
		
		<view class="uni-title history_title">
			<view class="history_title_content">
				<text>历史记录</text>
			</view>
		</view>
		<view class="uni-flex uni-column history">
			<view class="flex-item flex-item-V" v-for="item in list">
				<view class="top_text">
					<text class="text_desc">{{item.title}}</text>
					<text class="time">{{item.createTime.substring(0,16)}}</text>
				</view>
				<button class="mini-btn online" type="primary" size="mini" plain="true" @click="online(item.audioUrl)">在线收听</button>
				<button class="mini-btn copy" type="primary" size="mini" plain="true" @click="copyUrl(item.audioUrl)">复制地址</button>
				<button class="mini-btn download" type="default" size="mini" @click="download(item.audioUrl)" disabled="true" plain="true">下载本地</button>
			</view>
		</view>
		
		<uni-popup ref="popup" type="center">{{error}}</uni-popup>
		
		<uni-popup ref="popup_loading" type="center" :maskClick="maskClick">
			<view class="loading_ctn">
				<img src="/static/img/loading.gif"/>
				<p>{{loading_text}}</p>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {uniPopup},
		data() {
			return {
				title: '我的',
				user:{
					avatarUrl:"",
					nickName:""
				},
				loginBtn:"",
				loginFlag:false,
				maskClick:false,
				loading_text:"",
				list:[],
				error:""
			}
		},
		onLoad() {
			this.initListMayNoOpenid = function(){
				var _this = this;
				if(!uni.getStorageSync("user")){
					return false;
				}
				
				if(!uni.getStorageSync("openid")){
					uni.login({
					  provider: 'weixin',
					  success: function (loginRes) {
						console.log(loginRes);
						var json = {code:loginRes.code};
						uni.request({
							url:  _this.global_url + 'oauth',
							data: JSON.stringify(json),
							header: {
								'content-type': 'application/json'
							},
							method:'POST',
							success: (res) => {
								console.log(res.data.obj.openid);
				
								uni.setStorageSync("openid",res.data.obj.openid);
								
								var json = {openid:uni.getStorageSync("openid")};
								uni.request({
									url:  _this.global_url + 'list',
									data: JSON.stringify(json),
									header: {
										'content-type': 'application/json'
									},
									method:'POST',
									success: (res) => {
										console.log(res.data);
										_this.list = res.data.obj;
									},
									fail:(res) => {
										_this.error = "获取历史数据失败";
										_this.$refs.popup.open();
										return false;
									}
								});
								
							},
							fail:(res) => {
								_this.error = "获取openid失败";
								_this.$refs.popup.open();
								return false;
							}
						});
					  }
					});
				}else{
					var json = {openid:uni.getStorageSync("openid")};
					uni.request({
						url:  _this.global_url + 'list',
						data: JSON.stringify(json),
						header: {
							'content-type': 'application/json'
						},
						method:'POST',
						success: (res) => {
							console.log(res.data);
							_this.list = res.data.obj;
						},
						fail:(res) => {
							_this.error = "获取openid失败";
							_this.$refs.popup.open();
							return false;
						}
					});
				}
			}
		},
		onReady(){
			console.log(uni.getStorageSync("openid"));
			this.initListMayNoOpenid();
			
			var loginUser = uni.getStorageSync("user");
			if(loginUser){
				var loginJson = JSON.parse(loginUser);
				if(loginJson.nickName && loginJson.avatarUrl){
					this.user = loginJson;
					console.log(JSON.stringify(this.user));
					this.loginFlag = true;
				}
			}
		},
		onShow(){
			console.log("on Show");
			this.initListMayNoOpenid();
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
						_this.initListMayNoOpenid();
                    },
                    fail(res) {
						
					}
                });
			},
			logout(){
				uni.removeStorageSync("user");
				uni.removeStorageSync("openid");
				this.user = {};
				this.loginFlag = false;
				this.list = [];
			},
			download(){
				return false;
				let _this = this;
				uni.downloadFile({
					url: 'https://miniapi.calron.cn/static/audio/mp3/1566378035077.wav', 
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功:'+res.tempFilePath);
							
							uni.saveFile({
							  tempFilePath: res.tempFilePath,
							  success: function (res) {
								console.log('下载成功:'+res.savedFilePath);
							  }
							});
						}
					}
				});
				
				uni.getSavedFileList({
				  success: function (res) {
					console.log(res.fileList);
				  }
				});
			},
			online(url){
				var _this = this;
				// 设置了 src 之后会自动播放
				_this.global_bgAudioMannager.src = _this.getAudioUrl(url);
			},
			copyUrl(url){
				var _this = this;
				uni.setClipboardData({
					data: _this.getDownloadUrl(url),
					success: function () {
						
					},
					fail:function(){
						
					}
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
		background-color: #ffffff;
	}
	
	.topCtn{
		width: 100%;
		margin: 0 auto;
		text-align: center;
	}

	.logo {
		height: 120upx;
		width: 120upx;
		margin: 10upx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 26upx;
		color: #8f8f94;
	}
	
	.loginBtn_no{
		display: none;
	}
	
	.loginBtn_yes{
		display: block;
	}
	
	.logout_btn{
		position: absolute;
		right: 20upx;
		top: 20upx;
	}
	
	.history_title{
		font-size: 32upx;
		width: 100%;
		text-align: left;
		border-top: 1px solid #e5e5e5;
		margin-bottom: 15upx;
	}
	
	.history_title_content{
		width: 90%;
		margin: 0 auto;
		vertical-align:middle;
		color: rgba(51,51,51,1);
		font-weight: 400;
	}
	
	.history{
		width: 90%;
		text-align: center;
		font-size: 24upx;
	}
	
	.top_text{
		display: flex;
		justify-content: space-between;
		margin: 10upx 0;
	}
	
	.top_text text{
		color:#a0a0a0;
	}
	
	.text_desc{
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		width:60%;
		text-align: left;
	}
	
	.download,.copy{
		margin-left: 10upx;
	}
	
	.flex-item-V{
		height: 120upx;
		border-bottom: 1px solid #e5e5e5;
	}
	
	.loading_ctn{
		text-align: center;
	}
	
	.loading_ctn img{
		width: 100upx;
		height: 100upx;
	}
	
	.loading_ctn p{
		margin-top: 30upx;
	}
</style>
