import Vue from "vue";

import UmyUi from "umy-ui";
Vue.use(UmyUi);

// 添加全局组件
import Components from "@/components/global";
Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key]);
});

// 添加全局方法
import Utils from "@/utils";
Vue.prototype.$utils = Object.keys(Utils).reduce((obj, key) => {
  obj[key] = Utils[key];
  return obj;
}, {});

// 添加全局指令
import Directives from "@/directives";
Object.keys(Directives).forEach(key => {
  Vue.directive(key, Directives[key]);
});

// 添加全局Api
import Api from "@/api";
Vue.prototype.$api = Api;

// 添加聊天Bus
import ChatBus from "@/bus/chat.js";
Vue.prototype.$chat = ChatBus;

// 添加全局Bus
import Bus from "@/bus";
Vue.prototype.$bus = Bus;
