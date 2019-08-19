import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.global_url = "https://miniapi.calron.cn/";

Vue.prototype.global_bgAudioMannager = uni.getBackgroundAudioManager()
Vue.prototype.global_bgAudioMannager.title = '飞樱专辑'
Vue.prototype.global_bgAudioMannager.epname = '跳跳语音'
Vue.prototype.global_bgAudioMannager.singer = '跳跳'
Vue.prototype.global_bgAudioMannager.coverImgUrl =  Vue.prototype.global_url + 'static/image/audio.jpg'
				
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
