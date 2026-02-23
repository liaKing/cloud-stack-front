import App from './App'
import uView from "uview-ui";
import store from './store/index.js'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store
Vue.use(uView);

// 手动注册核心组件，解决 uView 内部组件相互调用时可能出现的 Unknown custom element 问题
import uIcon from 'uview-ui/components/u-icon/u-icon.vue';
import uPopup from 'uview-ui/components/u-popup/u-popup.vue';
import uTransition from 'uview-ui/components/u-transition/u-transition.vue';
import uLine from 'uview-ui/components/u-line/u-line.vue';
import uButton from 'uview-ui/components/u-button/u-button.vue';
import uOverlay from 'uview-ui/components/u-overlay/u-overlay.vue';
import uLoadingIcon from 'uview-ui/components/u-loading-icon/u-loading-icon.vue';

Vue.component('u-icon', uIcon);
Vue.component('u-popup', uPopup);
Vue.component('u-transition', uTransition);
Vue.component('u-line', uLine);
Vue.component('u-button', uButton);
Vue.component('u-overlay', uOverlay);
Vue.component('u-loading-icon', uLoadingIcon);

import uEmpty from 'uview-ui/components/u-empty/u-empty.vue';
import uModal from 'uview-ui/components/u-modal/u-modal.vue';
import uInput from 'uview-ui/components/u-input/u-input.vue';
import uTag from 'uview-ui/components/u-tag/u-tag.vue';

Vue.component('u-empty', uEmpty);
Vue.component('u-modal', uModal);
Vue.component('u-input', uInput);
Vue.component('u-tag', uTag);

// 其他常用组件
import uSticky from 'uview-ui/components/u-sticky/u-sticky.vue';
import uSubsection from 'uview-ui/components/u-subsection/u-subsection.vue';
import uPicker from 'uview-ui/components/u-picker/u-picker.vue';
import uCountTo from 'uview-ui/components/u-count-to/u-count-to.vue';
import uAvatar from 'uview-ui/components/u-avatar/u-avatar.vue';
import uCellGroup from 'uview-ui/components/u-cell-group/u-cell-group.vue';
import uCell from 'uview-ui/components/u-cell/u-cell.vue';
import uNavbar from 'uview-ui/components/u-navbar/u-navbar.vue';
import uSearch from 'uview-ui/components/u-search/u-search.vue';
import uTabs from 'uview-ui/components/u-tabs/u-tabs.vue';

Vue.component('u-sticky', uSticky);
Vue.component('u-subsection', uSubsection);
Vue.component('u-picker', uPicker);
Vue.component('u-count-to', uCountTo);
Vue.component('u-avatar', uAvatar);
Vue.component('u-cell-group', uCellGroup);
Vue.component('u-cell', uCell);
Vue.component('u-navbar', uNavbar);
Vue.component('u-search', uSearch);
Vue.component('u-tabs', uTabs);

const app = new Vue({
	...App
})
app.$mount()
// #endif