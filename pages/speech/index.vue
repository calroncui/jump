<template>
	<view class="content">
		<view class="checkbox">
			<view class="uni-title uni-common-mt">请选择类型</view>
			<view>
				<checkbox-group @change="checkboxChange" class="checkbox_label">
					<label class="uni-list-cell uni-list-cell-pd checkbox_label_inner" v-for="item in items" :key="item.value">
			            <view>
			                <checkbox :value="item.value" :checked="item.checked" :color="item.color"/>
			            </view>
			            <view>{{item.name}}</view>
			        </label>
				</checkbox-group>
			</view>
		</view>
		<view class="uni-textarea view_text" v-bind:style="{display:(display_ctn == 'text' ? 'block' : 'none')}">
			<textarea  placeholder="请输入文本" maxlength="-1" v-model="text" :disabled="loading"/>
		</view>
		<view class="uni-form-item uni-column view_url" v-bind:style="{display:(display_ctn == 'link' ? 'block' : 'none')}">
			<input class="uni-input" placeholder="请输入链接" maxlength="300" v-model="link" :readonly="loading"/>
		</view>
		
		<view class="uni-padding-wrap uni-common-mt btn">
            <button type="primary" size="mini" @click="toSpeech()">在线试听</button>
        </view>
		
		<view class="uni-padding-wrap uni-common-mt btn">
		    <button type="default" size="mini" @click="toCenter()">个人中心</button>
		</view>
		
		<uni-popup ref="popup" type="center">{{error}}</uni-popup>
		
		
		<uni-popup ref="popup_loading" type="center" :maskClick="maskClick">
			<view class="loading_ctn">
				<img src="/static/img/loading.gif"/>
				<p>加载中，请稍候</p>
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
				title: '文本转语音',
				items: [{
                        value: 'text',
                        name: '文本',
						checked: true,
						color:"#096dd9"
                    },
                    {
                        value: 'link',
                        name: '链接',
						checked: false,
						color:"#096dd9"
                    }
                ],
				maskClick:false,
				display_ctn :"text",
				text:"",
				link:"",
				loading:false,
				error:""
			}
		},
		onLoad() {
			if(!uni.getStorageSync("user")){
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					duration: 1000
				});
				setTimeout(function() {
					uni.switchTab({
						url: '../my/index'
					});
				}, 1000);
			}
		},
		methods: {
			checkboxChange: function (e) {
                var items = this.items,
                    values = e.detail.value;
					
				// 得出当前点击的是哪个
				var curr;
				var curr_opt ;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
				    const item = items[i]
				    if(values.includes(item.value) && !item.checked){
				        curr = item.value;
						curr_opt = true;
				    }
					if(!values.includes(item.value) && item.checked){
					    curr = item.value;
						curr_opt = false;
					}
				}	
				
				// 根据当前是选中还是取消 情况其他 操作当前
                for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					this.$set(item,'checked',false)
                    if(item.value == curr && curr_opt){
                        this.$set(item,'checked',true)
						this.display_ctn = curr;
                    }
                }
            },
			display_ctn_class(type){
				return this.display_ctn == type ? "ctn_display_block" : "ctn_display_none"
			},
			display_ctn_text_class(){
				return this.display_ctn == "text" ? "ctn_display_block" : "ctn_display_none"
			},
			toSpeech(){
				if(!this.text && !this.link){
					this.$refs.popup.open();
					this.error = "请输入文本或者链接";
					return false;
				}
				
				var curr = null;
				var items = this.items;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
				    const item = items[i]
					if(item.checked){
					    curr = item.value;
						break;
					}
				}	
				console.log(curr);
				var textVal = "";
				var linkVal = "";
				
				if(curr == "link"){
					if(!this.link){
						this.$refs.popup.open();
						this.error = "请输入链接";
						return false;
					}else{
						linkVal = this.link;
					}
				}else if(curr == "text"){
					if(!this.text){
						this.$refs.popup.open();
						this.error = "请输入文本";
						return false;
					}else{
						textVal = this.text;
					}
				}else{
					this.$refs.popup.open();
					this.error = "请输入文本或者链接";
					return false;
				}
				
				
				this.$refs.popup_loading.open();
				var _this = this;
				var json = {text:textVal,url:linkVal,openid:uni.getStorageSync("openid")};
				uni.request({
					url:  _this.global_url + 'convert',
					data: JSON.stringify(json),
					header: {
						'content-type': 'application/json'
					},
					method:'POST',
					success: (res) => {
						console.log(res.data);
						var mp3Path =  res.data.obj;
						var total = mp3Path.split("/");
						var filePath = total[total.length-1];
								
						// 设置了 src 之后会自动播放
						_this.global_bgAudioMannager.src = _this.global_url + 'static/audio/mp3/' + filePath;
						
						_this.$refs.popup_loading.close();
					},
					error:(res) => {
						_this.$refs.popup_loading.close();
						_this.error = "请求失败，请重试";
						_this.$refs.popup.open();
						return false;
					}
				});
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
		font-size: 30upx;
		line-height: 10upx;
		height: 100%;
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
		font-size: 32upx;
		color: #8f8f94;
	}
	
	.uni-form-item{
		font-size: 28upx;
	}
	
	.checkbox{
		width: 100%;
		text-align: center;
		line-height: 50upx;
		display: flex;
		justify-content: space-between;
		margin-top: 50upx;
	}
	
	.uni-title,.checkbox_label,.checkbox_label_inner{
		display: flex;
		justify-content: space-between;
	}
	
	.view_url,.view_text{
		margin-top: 50upx;
		width: 100%;
		background-color: #ffffff;
	}
	
	.view_text textarea,.view_url input{
		font-size: 25upx;
	}

	checkbox{
		transform: scale(0.8)
	}
	
	uni-input{
		height: 2.4em;
		line-height: 2.4em;
	}
	
	uni-textarea{
		line-height: 1.8em;
	}
	
	.ctn_display_block{
		display: block;
	}
	
	.ctn_display_none{
		display: none;
	}
	
	.btn{
		margin-top: 50upx;
	}
	
	/*.loading{
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #F1F1F1;
		opacity: 0.8;
		z-index: 10000;
	}*/
	
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
