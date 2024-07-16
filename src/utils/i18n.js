import Vue from 'vue'
import si18n from './smart-vue-i18n/index'

import enLocaleElement from "element-ui/lib/locale/lang/en";
import zhLocaleElement from "element-ui/lib/locale/lang/zh-CN";
import locale from "element-ui/lib/locale"

import enLocale from "@/lang/en-US";
import zhLocale from "@/lang/zh-CN";
import enLocale_render from "@/lang/en-US_render";
import zhLocale_render from "@/lang/zh-CN_render";
import enLocale_extension from "@/lang/en-US_extension";
import zhLocale_extension from "@/lang/zh-CN_extension";
import {overwriteObj} from "@/utils/util";

const langResources = {
  'en-US': {
    something: {
      //...
    },
    ...enLocaleElement,
    ...enLocale,
    ...enLocale_render,
    ...enLocale_extension
  },

  'zh-CN': {
    something: {
      //...
    },
    ...zhLocaleElement,
    ...zhLocale,
    ...zhLocale_render,
    ...zhLocale_extension
  }
}

// *********************  下述代码参考element-ui/lib/locale/format.js begin  *****************//

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

const elLocalFormatter = function template(string, args) {
  return string.replace(RE_NARGS, (match, prefix, i, index) => {
    let result;

    if (string[index - 1] === '{' &&
        string[index + match.length] === '}') {
      return i;
    } else {
      result = hasOwn(args, i) ? args[i] : null;
      if (result === null || result === undefined) {
        return '';
      }

      return result;
    }
  })
}

// *********************  下述代码参考element-ui/lib/locale/format.js end  ******************//

Vue.use(si18n, {
  lang: localStorage.getItem('v_form_locale') || 'zh-CN',
  messages: langResources
})

locale.i18n((key, value) => {
  let result = Vue.prototype.$st(key)
  return elLocalFormatter(result, value)
})

export const changeLocale = function(langName) {
  Vue.prototype.$si18n.setLang(langName)
  localStorage.setItem('v_form_locale', langName)
}

export const getLocale = function () {
  return localStorage.getItem('v_form_locale')
}

export const translate = function(key) {
  return Vue.prototype.$st(key)
}

export const addZHExtensionLang = (zhLang) => {
  if (!!zhLang.extension && !!zhLang.extension.widgetLabel) {
    overwriteObj(zhLocale_extension.extension.widgetLabel, zhLang.extension.widgetLabel)
  }

  if (!!zhLang.extension && !!zhLang.extension.setting) {
    overwriteObj(zhLocale_extension.extension.setting, zhLang.extension.setting)
  }
}

export const addENExtensionLang = (enLang) => {
  if (!!enLang.extension && !!enLang.extension.widgetLabel) {
    overwriteObj(enLocale_extension.extension.widgetLabel, enLang.extension.widgetLabel)
  }

  if (!!enLang.extension && !!enLang.extension.setting) {
    overwriteObj(enLocale_extension.extension.setting, enLang.extension.setting)
  }
}

export default {
  methods: {
    i18nt(key) {
      return this.$st(key)
    },

    i18ntp(key, params) {
      return this.$st(key, params)
    },

    /* 如果key1不存在，则查找key2 */
    i18n2t(key1, key2) {
      return this.$st2(key1, key2)
    },

  }
}
