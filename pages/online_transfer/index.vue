<template>
	<view class="content">
		<view class="uni-textarea view_text">
			<textarea  placeholder="同声传译内容" maxlength="-1" v-model="text" />
		</view>
		<view class="uni-padding-wrap uni-common-mt btn">
		    <button type="default" size="mini" plain="true" @click="toCenter()">个人中心</button>
		</view>
		<view class="uni-padding-wrap uni-common-mt btn_bottom">
		    <button type="primary" @touchstart="startVoice()" @touchend="stopVoice()">{{optText}}</button>
		</view>
	</view>	
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {uniPopup},
		data() {
			return {
				text: '',
				optText:'按住说话',
				startTime : 0,
				endTime : 0,
				
			}
		},
		onLoad() {
			var _this = this;
			
			this.global_record_rec_manager.onRecognize = function(res) {
			    console.log("current result", res.result)
				_this.text = res.result;
				var curr = new Date().getTime();
				if(curr - _this.startTime > 30000){
					uni.showToast({
						title: '说太多了，喝点水再来',
						icon: 'none',
						duration: 2000
					});
					_this.global_record_rec_manager.stop();
				}
			}
			this.global_record_rec_manager.onStop = function(res) {
			    console.log("record file path", res.tempFilePath)
			    console.log("result", res.result)
			}
			this.global_record_rec_manager.onStart = function(res) {
			    console.log("成功开始录音识别", res)
			}
			this.global_record_rec_manager.onError = function(res) {
			    console.error("error msg", res.msg)
				var offset = new Date().getTime() - _this.startTime;
				if(offset < 1000){
					uni.showToast({
						title: '太快了，锻炼好身体再来',
						icon: 'none',
						duration: 2000
					});
				}else{
					if(res.msg == "internal voice data failed"){
						uni.showToast({
							title: '权限获取成功',
							icon: 'none',
							duration: 2000
						});
					}else{
						uni.showToast({
							title: '传译失败',
							icon: 'none',
							duration: 2000
						});
					}
				}
			}
		},
		methods: {
			startVoice(){
				this.startTime = new Date().getTime();
				uni.showToast({
					title: '来来来，说点什么',
					icon: 'none',
					duration: 1000
				});
				this.global_record_rec_manager.start({duration:30000, lang: "zh_CN"});
			},
			stopVoice(){
				uni.showToast({
					title: '同声传译结束',
					icon: 'none',
					duration: 2000
				});
				this.global_record_rec_manager.stop();
			},
			toCenter(){
				uni.switchTab({
					url: '../my/index'
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
		width: 80%;
		margin: 0 auto;
	}
	.btn{
		margin-top: 500upx;
	}
	
	.btn_bottom{
		margin-top: 50upx;
	}
	
	.view_text{
		margin-top: 50upx;
		width: 100%;
		background-color: #ffffff;
		font-size: 25upx;
	}
</style>
