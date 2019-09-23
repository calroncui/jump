<template>
	<view class="content" >
		<view @click="toSpeech">
			<image class="logo" src="/static/img/text_speech.png"></image>
			<view class="text-area">
				<text class="title">{{title_text_to_speech}}</text>
			</view>
		</view>
		
		<view @click="toTransfer">
			<image class="logo" src="/static/img/services.png"></image>
			<view class="text-area">
				<text class="title">{{title_online_transfer}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title_text_to_speech: '文本转语音',
				title_online_transfer: '同声传译'
			}
		},
		onLoad() {

		},
		methods: {
			toSpeech(){
				uni.navigateTo({
					url: '../speech/index'
				});
			},
			toTransfer(){
				uni.navigateTo({
					url: '../online_transfer/index'
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
		margin-top: 150upx;
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
</style>
