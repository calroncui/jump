import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.global_url = "https://miniapi.calron.cn/";

Vue.prototype.global_bgAudioMannager = uni.getBackgroundAudioManager()
Vue.prototype.global_bgAudioMannager.title = '飞樱专辑'
Vue.prototype.global_bgAudioMannager.epname = '跳跳语音'
Vue.prototype.global_bgAudioMannager.singer = '跳跳'
Vue.prototype.global_bgAudioMannager.coverImgUrl =  Vue.prototype.global_url + 'static/image/audio.jpg'

var plugin = requirePlugin("WechatSI")  
Vue.prototype.global_record_rec_manager = plugin.getRecordRecognitionManager();

Vue.prototype.getAudioUrl = function(url){
	var total = url.split("/");
	var filePath = total[total.length-1];
	var audioUrl = Vue.prototype.global_url + 'static/audio/wav/' + filePath;
	console.log("audioUrl:"+ audioUrl);
	return audioUrl;
}

Vue.prototype.getDownloadUrl = function(url){
	var total = url.split("/");
	var filePath = total[total.length-1];
	var fileName = filePath.split(".")[0];
	var downloadUrl = Vue.prototype.global_url + "download?fileName=" + fileName;
	console.log("downloadUrl:"+ downloadUrl);
	return downloadUrl;
}
				
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
