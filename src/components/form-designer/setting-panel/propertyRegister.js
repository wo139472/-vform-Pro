import Vue from 'vue'

/**
 * 格式说明：属性名称==对应属性编辑器的组件名称
 */
const COMMON_PROPERTIES = {
  //字段
  'name'              :            'name-editor',
  'descInfo'          :            'descInfo-editor',
  // 'keyNameEnabled'    :            'keyNameEnabled-editor',
  // 'keyName'           :            'keyName-editor',
  // 'objectName'        :            'objectName-editor',
  'label'             :            'label-editor',
  'labelAlign'        :            'labelAlign-editor',
  'type'              :            'type-editor',
  'defaultValue'      :            'defaultValue-editor',
  'placeholder'       :            'placeholder-editor',
  'startPlaceholder'  :            'startPlaceholder-editor',
  'endPlaceholder'    :            'endPlaceholder-editor',
  'columnWidth'       :            'columnWidth-editor',
  'size'              :            'size-editor',
  'controls'          :            'controls-editor',
  'controlsPosition'  :            'controlsPosition-editor',
  'showStops'         :            'showStops-editor',
  'displayStyle'      :            'displayStyle-editor',
  'buttonStyle'       :            'buttonStyle-editor',
  'border'            :            'border-editor',
  'labelWidth'        :            'labelWidth-editor',
  'labelHidden'       :            'labelHidden-editor',
  'labelWrap'         :            'labelWrap-editor',
  'rows'              :            'rows-editor',
  'required'          :            'required-editor',
  'requiredHint'      :            'requiredHint-editor',
  'validation'        :            'validation-editor',
  'validationHint'    :            'validationHint-editor',
  'readonly'          :            'readonly-editor',
  'disabled'          :            'disabled-editor',
  'hidden'            :            'hidden-editor',
  'clearable'         :            'clearable-editor',
  'editable'          :            'editable-editor',
  'showPassword'      :            'showPassword-editor',
  'textContent'       :            'textContent-editor',
  'textAlign'         :            'textAlign-editor',
  'fontSize'          :            'fontSize-editor',
  'preWrap'           :            'preWrap-editor',
  'htmlContent'       :            'htmlContent-editor',
  'format'            :            'format-editor',
  'valueFormat'       :            'valueFormat-editor',
  'filterable'        :            'filterable-editor',
  'allowCreate'       :            'allowCreate-editor',
  'remote'            :            'remote-editor',
  'automaticDropdown' :            'automaticDropdown-editor',
  'checkStrictly'     :            'checkStrictly-editor',
  'showAllLevels'     :            'showAllLevels-editor',
  'multiple'          :            'multiple-editor',
  'multipleLimit'     :            'multipleLimit-editor',
  'contentPosition'   :            'contentPosition-editor',
  'optionItems'       :            'optionItems-editor',
  'uploadURL'         :            'uploadURL-editor',
  'uploadTip'         :            'uploadTip-editor',
  'withCredentials'   :            'withCredentials-editor',
  'multipleSelect'    :            'multipleSelect-editor',
  'limit'             :            'limit-editor',
  'fileMaxSize'       :            'fileMaxSize-editor',
  'fileTypes'         :            'fileTypes-editor',
  'customClass'       :            'customClass-editor',
	// tree
	'filter':            							'show-filter-editor',
  'showCheckBox':            				'show-checkbox-editor',
	'defaultExpandAllNode':           'show-defaultExpandAllNode-editor',
	'expandRetractAllNode':           'tree-expandRetractAllNode-editor',
	'selectClearAllNode':            	'tree-selectClearAllNode-editor',
	'expandOnClickNode':            	'show-expandOnClickNode-editor',
  'nodeEdit':            						'tree-nodeEdit-editor',
  'draggable':            					'show-draggable-editor',
	'lazy':            								'tree-lazy-editor',
	'treeDataEdit':            				'treeData-editor',

  //容器
  'showBlankRow'       :            'showBlankRow-editor',
  'showRowNumber'      :            'showRowNumber-editor',
  'actionColumnPosition':           'actionColumnPosition-editor',
  'cellWidth'          :            'cellWidth-editor',
  'cellHeight'         :            'cellHeight-editor',
  'colHeight'          :            'colHeight-editor',
  'wordBreak'          :            'wordBreak-editor',
  'gutter'             :            'gutter-editor',
  'responsive'         :            'responsive-editor',
  'span'               :            'span-editor',
  'offset'             :            'offset-editor',
  'push'               :            'push-editor',
  'pull'               :            'pull-editor',
  'title'              :            'title-editor',
  'width'              :            'width-editor',
  'fullscreen'         :            'fullscreen-editor',
  'showModal'          :            'showModal-editor',
  'showClose'          :            'showClose-editor',
  'closeOnClickModal'  :            'closeOnClickModal-editor',
  'closeOnPressEscape' :            'closeOnPressEscape-editor',
  'center'             :            'center-editor',
  'direction'          :            'direction-editor',
  'readMode'           :            'readMode-editor',
  'disabledMode'       :            'disabledMode-editor',
  'okButtonLabel'      :            'okButtonLabel-editor',
  'okButtonHidden'     :            'okButtonHidden-editor',
  'cancelButtonLabel'  :            'cancelButtonLabel-editor',
  'cancelButtonHidden' :            'cancelButtonHidden-editor',

}

const ADVANCED_PROPERTIES = {
  'min'               :            'min-editor',
  'max'               :            'max-editor',
  'precision'         :            'precision-editor',
  'step'              :            'step-editor',
  'minLength'         :            'minLength-editor',
  'maxLength'         :            'maxLength-editor',
  'showWordLimit'     :            'showWordLimit-editor',
  'prefixIcon'        :            'prefixIcon-editor',
  'suffixIcon'        :            'suffixIcon-editor',
  'switchWidth'       :            'switchWidth-editor',
  'activeText'        :            'activeText-editor',
  'inactiveText'      :            'inactiveText-editor',
  'activeColor'       :            'activeColor-editor',
  'inactiveColor'     :            'inactiveColor-editor',
  'lowThreshold'      :            'lowThreshold-editor',
  'highThreshold'     :            'highThreshold-editor',
  'allowHalf'         :            'allowHalf-editor',
  'showText'          :            'showText-editor',
  'showScore'         :            'showScore-editor',
  'range'             :            'range-editor',
  'vertical'          :            'vertical-editor',
  'plain'             :            'plain-editor',
  'round'             :            'round-editor',
  'circle'            :            'circle-editor',
  'icon'              :            'icon-editor',
  'labelIconClass'    :            'labelIconClass-editor',
  'labelIconPosition' :            'labelIconPosition-editor',
  'labelTooltip'      :            'labelTooltip-editor',
  'appendButton'      :            'appendButton-editor',
  'appendButtonDisabled':          'appendButtonDisabled-editor',
  'buttonIcon'        :            'buttonIcon-editor',

}

const EVENT_PROPERTIES = {
  //字段
  'onCreated'         :            'onCreated-editor',
  'onMounted'         :            'onMounted-editor',
  'onClick'           :            'onClick-editor',
  'onInput'           :            'onInput-editor',
  'onChange'          :            'onChange-editor',
  'onFocus'           :            'onFocus-editor',
  'onBlur'            :            'onBlur-editor',
  'onRemoteQuery'     :            'onRemoteQuery-editor',
  'onBeforeUpload'    :            'onBeforeUpload-editor',
  'onUploadSuccess'   :            'onUploadSuccess-editor',
  'onUploadError'     :            'onUploadError-editor',
  'onFileRemove'      :            'onFileRemove-editor',
  'onValidate'        :            'onValidate-editor',
  'onAppendButtonClick':           'onAppendButtonClick-editor',

  //tree
	'onNodeClick' 				:						  'onNodeClick-editor',
	'onNodeCheck' 				:							'onNodeCheck-editor',
	'onNodeContextmenu' 	:							'onNodeContextmenu-editor',
	'onCheckChange' 	    :							'onCheckChange-editor',

  //容器
  'onTabClick'                :            'onTabClick-editor',
  'onSubFormRowAdd'           :            'onSubFormRowAdd-editor',
  'onSubFormRowInsert'        :            'onSubFormRowInsert-editor',
  'onSubFormRowDelete'        :            'onSubFormRowDelete-editor',
  'onSubFormRowChange'        :            'onSubFormRowChange-editor',
  'onPageSizeChange'          :            'onPageSizeChange-editor',
  'onCurrentPageChange'       :            'onCurrentPageChange-editor',
  'onSortChange'              :            'onSortChange-editor',
  'onSelectionChange'         :            'onSelectionChange-editor',
  'onHideOperationButton'     :            'onHideOperationButton-editor',
  'onDisableOperationButton'  :            'onDisableOperationButton-editor',
  'onGetOperationButtonLabel' :            'onGetOperationButtonLabel-editor',
  'onOperationButtonClick'    :            'onOperationButtonClick-editor',
  'onHeaderClick'             :            'onHeaderClick-editor',
  'onRowClick'                :            'onRowClick-editor',
  'onRowDoubleClick'          :            'onRowDoubleClick-editor',
  'onCellClick'               :            'onCellClick-editor',
  'onCellDoubleClick'         :            'onCellDoubleClick-editor',
  'onGetRowClassName'         :            'onGetRowClassName-editor',
  'onGetSpanMethod'           :            'onGetSpanMethod-editor',
  'onOkButtonClick'           :            'onOkButtonClick-editor',
  'onCancelButtonClick'       :            'onCancelButtonClick-editor',
  'onDialogOpened'            :            'onDialogOpened-editor',
  'onDialogBeforeClose'       :            'onDialogBeforeClose-editor',
  'onDrawerOpened'            :            'onDrawerOpened-editor',
  'onDrawerBeforeClose'       :            'onDrawerBeforeClose-editor',
  'onButtonGroupClick'        :            'onButtonGroupClick-editor',

}

/**
 * 注册组件常见属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerCommonProperty(uniquePropName, propEditorName) {
  COMMON_PROPERTIES[uniquePropName] = propEditorName
}

/**
 * 注册组件高级属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerAdvancedProperty(uniquePropName, propEditorName) {
  ADVANCED_PROPERTIES[uniquePropName] = propEditorName
}

/**
 * 注册组件事件属性
 * 如属性编辑器的组件名称propEditorName设置为null，则不显示该属性编辑器！！
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 * @param propEditorName 对应属性编辑器的组件名称
 */
export function registerEventProperty(uniquePropName, propEditorName) {
  EVENT_PROPERTIES[uniquePropName] = propEditorName
}

/**
 * 判断属性是否已注册
 * @param uniquePropName 属性名称（保证名称唯一，不跟其他组件属性冲突）
 */
export function propertyRegistered(uniquePropName) {
  return !!COMMON_PROPERTIES[uniquePropName] || !!ADVANCED_PROPERTIES[uniquePropName] || !!EVENT_PROPERTIES[uniquePropName]
}

/**
 * 注册常见属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerCPEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerCommonProperty(uniquePropName, propEditorName)
}

/**
 * 注册高级属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerAPEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerAdvancedProperty(uniquePropName, propEditorName)
}

/**
 * 注册事件属性对应的属性编辑器
 * @param uniquePropName
 * @param propEditorName
 * @param editorComponent
 */
export function registerEPEditor(uniquePropName, propEditorName, editorComponent) {
  Vue.component(propEditorName, editorComponent)
  registerEventProperty(uniquePropName, propEditorName)
}

export default {
  COMMON_PROPERTIES,
  ADVANCED_PROPERTIES,
  EVENT_PROPERTIES
}


