<!--
 * @Author: wo1394721159 1394721159@qq.com
 * @Date: 2021-11-29 17:23:59
 * @LastEditors: wo1394721159 1394721159@qq.com
 * @LastEditTime: 2024-07-16 17:39:10
 * @FilePath: \xinhu-online-backende:\最新版vform Pro\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <VFormDesigner ref="vfDesignerRef" :designer-config="designerConfig" :global-dsv="globalDsv" :detailId="detailId" :form_template_id="form_template_id">
      <!--
      <template #customToolButtons>
        <el-button type="text" @click="doTest2">测试btn</el-button>
      </template>
      -->
    </VFormDesigner>
  </div>
</template>

<script>
import VFormDesigner from './components/form-designer/index.vue'

export default {
  name: 'App',
  components: {
    VFormDesigner,
  },
  data() {
    return {
      designerConfig: {
        //logoHeader: false,
        //toolbarMaxWidth: 510
      },
      form_template_id:0,
      detailId:0,
      //全局数据源变量
      globalDsv: {
        testApiHost: 'http://www.test.com/api',
        testPort: 8080,
      },
    }
  },
  methods: {
    doTest() {
      let fieldList = this.$refs.vfDesignerRef.getFieldWidgets(null, true)
      console.log('test', fieldList)
    },

    doTest2() {
      let dataSchema = this.$refs.vfDesignerRef.buildFormDataSchema()
      console.info(dataSchema)
      console.info( JSON.stringify(dataSchema, null, "  ") )
      alert( JSON.stringify(dataSchema) )
    }
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
