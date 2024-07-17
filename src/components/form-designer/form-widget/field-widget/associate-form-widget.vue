<template>
  <form-item-wrapper :designer="designer" :field="field" :rules="rules" :design-state="designState"
                     :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList"
                     :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <el-select ref="fieldEditor" v-model="fieldModel" v-show="!isReadMode" class="full-width-input"
               :disabled="field.options.disabled"
               :clearable="field.options.clearable"
               :filterable="field.options.filterable"
               :allow-create="field.options.allowCreate"
               v-scrollLoad="scrollForm"
               value-key="id"
               :default-first-option="allowDefaultFirstOption"
               :automatic-dropdown="field.options.automaticDropdown"
               :multiple="field.options.multiple" 
               :multiple-limit="field.options.multipleLimit"
               :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
               :remote="field.options.remote"
               @focus="handleFocusCustomEvent" @blur.native.capture="handleBlurCustomEvent"
               @change="handleChangeEvent">
      <el-option v-for="item in titleList" :key="item.id" :label="item.label"
                 :value="{id:item.id,label:item.label}" :disabled="item.disabled">
      </el-option>
    </el-select>
    <template v-if="isReadMode">
      <span class="readonly-mode-field">{{displayLabel()}}</span>
    </template>
  </form-item-wrapper>
</template>

<script>
  import FormItemWrapper from './form-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  export default {
    name: "associate-form-widget",
    componentName: 'FieldWidget',  //必须固定为FieldWidget，用于接收父级组件的broadcast事件
    mixins: [emitter, fieldMixin, i18n],
    props: {
      field: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,
      form_template_id:[Number,String],
      detailId:[Number,String],
      designState: {
        type: Boolean,
        default: false
      },

      subFormRowIndex: { /* 子表单组件行索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormColIndex: { /* 子表单组件列索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormRowId: { /* 子表单组件行Id，唯一id且不可变 */
        type: String,
        default: ''
      },

    },
    components: {
      FormItemWrapper,
    },
    inject: ['refList', 'globalOptionData', 'globalModel'],
    data() {
      return {
        oldFieldValue: null, //field组件change之前的值
        fieldModel: null,
        rules: [],
        page:1,
        list:[],
        titleList:[],
      }
    },
    computed: {
      allowDefaultFirstOption() {
        return !!this.field.options.filterable || !!this.field.options.remote
      },

      remoteMethod() {
        if (!!this.field.options.remote && !!this.field.options.onRemoteQuery) {
          return this.remoteQuery
        } else {
          return undefined
        }
      },

    },
    beforeCreate() {
      /* 这里不能访问方法和属性！！ */
    },

    created() {
      /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
      this.registerToRefList()
      this.initOptionItems()
      this.initFieldModel()
      this.initEventHandler()
      this.buildFieldRules()

      this.handleOnCreated()
      // console.log("form_template_id==>",this.form_template_id)
      this.getList()
    },

    mounted() {
      this.handleOnMounted()
    },

    beforeDestroy() {
      this.unregisterFromRefList()
    },

    methods: {
      displayLabel() {
        let resultContent = '--'
        if (this.fieldModel === null) {
          resultContent = '--'
        } else {
          resultContent = this.fieldModel.map(item =>{return item.label}).join(',')
        }
        return resultContent
      },
      scrollForm() {
        setTimeout(() => {
          this.page = this.page + 1
          this.getList()
        }, 100);
      },
      // 获取表单列表
      async getList() {
        // const res = await axios.get('http://api-admin-park.lcsnfm.com.cn/FormPractice/index',{ headers: {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJqd3RfeWgiLCJleHAiOjE3MjEyOTExNjUsInN1YiI6IllIIiwiYXVkIjoiZXZlcnkiLCJuYmYiOjE3MjA2ODYzNjUsImlhdCI6MTcyMDY4NjM2NSwianRpIjoxMDAwMSwidWlkIjoxLCJwYXJrX2NvZGUiOiIxMDAwMSJ9.8OC5d66nyMmoo34q7ZPoCJW0k5cE-bjhIKCBy6brmo0`},
        //   params:{form_template_id:this.form_template_id,is_myself:0,page:this.page}
        // })
        if(!this.form_template_id)return
        const res = await this.$http.get('/FormPractice/index',{params:{form_template_id:this.form_template_id,is_myself:0,page:this.page}})
        if(res.data.code == 0){
          const {data} = res.data
          this.list = data.list.concat(this.list)
          this.getFormTitle()
        }
      },
      // 获取表单的数据标题
      async getFormTitle() {
        // const res = await axios.get('http://api-admin-park.lcsnfm.com.cn/FormTemplate/info',{ headers: {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJqd3RfeWgiLCJleHAiOjE3MjEyOTExNjUsInN1YiI6IllIIiwiYXVkIjoiZXZlcnkiLCJuYmYiOjE3MjA2ODYzNjUsImlhdCI6MTcyMDY4NjM2NSwianRpIjoxMDAwMSwidWlkIjoxLCJwYXJrX2NvZGUiOiIxMDAwMSJ9.8OC5d66nyMmoo34q7ZPoCJW0k5cE-bjhIKCBy6brmo0`},
        //   params:{id:this.form_template_id}
        // })
        const res = await this.$http.get('/FormTemplate/info',{params:{id:this.form_template_id}})
        if(res.data.code == 0){
          const {data} = res.data
          // console.log("data==>",data)
          this.titleList = []
          let widgetList = ''
          if(data.data_pc_obj){
            let dataList = JSON.parse(data.data_pc_obj)
            widgetList = dataList.widgetList.filter(item => item.type != 'divider' && item.type != 'picture-upload' && item.type != 'file-upload' && item.type != 'static-text' && item.type != 'html-text' && item.type != 'button'
            && item.type != 'sub-form' && item.type != 'grid' && item.type != 'card' && item.type != 'table' && item.type != 'tab' && item.type != 'alert')
          }
          if(data.data_title_obj){
            let data_title_obj = JSON.parse(data.data_title_obj)
            // console.log("data_title==>",data_title_obj)
            if(data_title_obj && data_title_obj.length > 0){
              data_title_obj.forEach((item,index) => {
                if(!item.id){
                  this.titleList.push({id:item.key,label:item.key})
                }
              })
              // console.log("widgetList==>",data_title_obj)
              data_title_obj.forEach((item,index) => {
                if(item.id && !this.detailId){
                  widgetList.forEach(item1 => {
                    if(item.id && item.id == item1.options.name){
                      this.titleList.push({id:item.id,label:item1.options.defaultValue})
                    }
                  })
                }
                this.list.forEach(item1 => {
                  // Object.keys(item1).forEach(key => {
                    if(item.id && item1.id == this.detailId){
                      this.titleList.push({id:item.id,label:item1[item.id]})
                    }
                  // })
                })
              })
              // console.log("widgetList==>",this.titleList)
            }
            let obj = {};
            this.titleList = this.titleList.length > 0 ? this.titleList.reduce((item, next) => {
              obj[next.id] ? '' : obj[next.id] = true && item.push(next);
              return item;
            }, []) : []
            }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/global.scss"; //* form-item-wrapper已引入，还需要重复引入吗？ *//

  .full-width-input {
    width: 100% !important;
  }

</style>
