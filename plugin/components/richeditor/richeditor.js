// plugin/components/richeditor/richeditor.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    initData: {
      type: Array
    },
    // 绘画单位
    drawUnit: {
      type: String,
      value: 'px'
    },
    // 是否使用scrollview
    isScrollView: {
      type: Boolean,
      value: false
    },
    // 容器宽度
    containWidth: {
      type: Number
    },
    // 容器高度
    containHeight: {
      type: Number
    },
    // 支持类型（图片，文本，视频）
    supportType: {
      type: Object,
      value: {
        image: {
          name: '图片',
          type: 'image',
          isSupport: true,
          supportSource: ['album', 'camera'],
          sizeType: ['original', 'compressed'],
          frontMethod: function() {
            // 对应方法需返回true or false
            console.log(`插入图片前的前置事件`)
          },
          backMethod: function(res) {
            // 对应方法需返回true or false
            console.log(`插入图片前的后置事件，所插入的图片路径为${ JSON.stringify(res) }`)
          }
        },
        text: {
          name: '文本',
          type: 'text',
          isSupport: true,
          maxNum: 120,
          frontMethod: function() {
            // 对应方法需返回true or false
            console.log(`插入文本前的前置事件`)
          },
          backMethod: function(res) {
            // 对应方法需返回true or false
            console.log(`插入文本前的后置事件，所插入的文本内容为${JSON.stringify(res)}`)
          }
        },
        video: {
          name: '视频',
          type: 'video',
          isSupport: true,
          supportSource: ['album', 'camera'],
          isCompress: true,
          maxDuration: 60,
          camera: 'back',
          frontMethod: function() {
            // 对应方法需返回true or false
            console.log(`插入视频前的前置事件`)
          },
          backMethod: function(res) {
            // 对应方法需返回true or false
            console.log(`插入视频前的后置事件，所插入的视频路径为${JSON.stringify(res)}`)
          }
        },
        // 暂不实现
        // audio: {
        //   name: '音频',
        //   type: 'audio',
        //   frontMethod: function () {
        //     // 对应方法需返回true or false
        //     console.log(`插入音频前的前置事件`)
        //   },
        //   backMethod: function (res) {
        //     // 对应方法需返回true or false
        //     console.log(`插入音频前的后置事件，所插入的音频路径为${JSON.stringify(res)}`)
        //   }
        // }
      }
    },
    getObject: {
      type: Function,
      value: function (res) {
        console.log(res)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    innerInitData: [],
    globalEditing: false,
    curIndex: -1,
    newCurIndex: -1
  },

  attached: function() {
    let self = this
    self.setData({
      innerInitData: self.properties.initData
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    triggerEvent: function(e) {
      let self = this
      let index = e.currentTarget.dataset.index
      if (self.data.globalEditing) {
        wx.showToast({
          title: '请完成已编辑的内容',
          icon: 'none'
        })
        return false
      }
      let insertType = e.currentTarget.dataset.type
      switch (insertType) {
        case "image":
          if (index !== undefined) {
            self.data.innerInitData.splice(index + 1, 0, {
              isEditing: true,
              "type": "image",
              "src": "",
              "desc": "",
              "mode": ""
            })
          } else {
            self.data.innerInitData.push({
              isEditing: true,
              "type": "image",
              "src": "",
              "desc": "",
              "mode": ""
            })
          }
          break
        case "text":
          if (index !== undefined) {
            self.data.innerInitData.splice(index + 1, 0, {
              isEditing: true,
              // 模块类型
              "type": "text",
              // 文本内容
              "desc": "",
              // 容器宽
              "width": ""
            })
          } else {
            self.data.innerInitData.push({
              isEditing: true,
              // 模块类型
              "type": "text",
              // 文本内容
              "desc": "",
              // 容器宽
              "width": ""
            })
          }
          break
        case "video":
          if (index !== undefined) {
            self.data.innerInitData.splice(index + 1, 0, {
              isEditing: true,
              // 模块类型
              "type": "video",
              // 视频地址
              "src": "",
              // 容器宽
              "width": "",
              // 容器高
              "height": "",
              // 视频描述
              "desc": "",
              // 视频模式
              "mode": ""
            })
          } else {
            self.data.innerInitData.push({
              isEditing: true,
              // 模块类型
              "type": "video",
              // 视频地址
              "src": "",
              // 容器宽
              "width": "",
              // 容器高
              "height": "",
              // 视频描述
              "desc": "",
              // 视频模式
              "mode": ""
            })
          }
          break
      }
      if (index !== undefined) {
        self.setData({
          globalEditing: true,
          innerInitData: self.data.innerInitData,
          curIndex: index + 1
        })
      } else {
        self.setData({
          globalEditing: true,
          innerInitData: self.data.innerInitData,
          curIndex: self.data.innerInitData.length - 1
        })
      }
      
    },
    deleteBlock: function (e) {
      let index = e.currentTarget.dataset.index
      let self = this
      self.data.innerInitData.splice(index, 1)
      self.setData({
        globalEditing: false,
        innerInitData: self.data.innerInitData,
        curIndex: -1,
        newCurIndex: -1
      })
    },
    saveBlock: function (e) {
      let index = e.currentTarget.dataset.index
      let self = this
      switch (self.data.innerInitData[index].type) {
        case "image":
          if (self.data.innerInitData[index].src === '') {
            wx.showToast({
              title: '图片不能为空',
              icon: 'none'
            })
            return false
          }
          break
        case "text":
          if (self.data.innerInitData[index].desc === '') {
            wx.showToast({
              title: '文本不能为空',
              icon: 'none'
            })
            return false
          }
          break
        case "video":
          if (self.data.innerInitData[index].src === '') {
            wx.showToast({
              title: '视频不能为空',
              icon: 'none'
            })
            return false
          }
          break
      }
      self.data.innerInitData[index].isEditing = false
      self.setData({
        globalEditing: false,
        innerInitData: self.data.innerInitData,
        curIndex: -1
      })
      // 获取对象
      self.properties.getObject(self.data.innerInitData)
    },
    tapEvent: function (e) {
      let index = e.currentTarget.dataset.index
      let type = e.currentTarget.dataset.type
      let self = this
      switch (type) {
        case "image":
          // 上传图片
          wx.chooseImage({
            count: 1,
            supportSource: self.properties.supportType.image.supportSource,
            sizeType: self.properties.supportType.image.sizeType,
            success: function(res) {
              self.data.innerInitData[index].src = res.tempFilePaths[0]
              self.setData({
                innerInitData: self.data.innerInitData
              })
            }
          })
          break
        case "video":
          wx.chooseVideo({
            supportSource: self.properties.supportType.video.supportSource,
            isCompress: self.properties.supportType.video.isCompress,
            maxDuration: self.properties.supportType.video.maxDuration,
            camera: self.properties.supportType.video.camera,
            success:function (res){
              self.data.innerInitData[index].src = res.tempFilePath
              console.log(self.data.innerInitData)
              self.setData({
                innerInitData: self.data.innerInitData
              })
            }
          })
      }
    },
    changeInput: function (e) {
      let index = e.currentTarget.dataset.index
      let self = this
      self.data.innerInitData[index].desc = e.detail.value
      self.setData({
        innerInitData: self.data.innerInitData
      })
    },
    moveUp: function (e) {
      let index = e.currentTarget.dataset.index
      let self = this
      let thisData = self.data.innerInitData[index]
      let prevData = self.data.innerInitData[index - 1]
      self.data.innerInitData[index] = prevData
      self.data.innerInitData[index - 1] = thisData
      self.setData({
        innerInitData: self.data.innerInitData,
        newCurIndex: -1
      })
    },
    moveDown: function (e) {
      let index = e.currentTarget.dataset.index
      let self = this
      let thisData = self.data.innerInitData[index]
      let nextData = self.data.innerInitData[index + 1]
      self.data.innerInitData[index] = nextData
      self.data.innerInitData[index + 1] = thisData
      self.setData({
        innerInitData: self.data.innerInitData,
        newCurIndex: -1
      })
    },
    newItem: function (e) {
      let index = e.currentTarget.dataset.index
      let self = this
      if (self.data.newCurIndex === index) {
        self.setData({
          newCurIndex: -1
        })
      } else {
        self.setData({
          newCurIndex: index
        })
      }
    }
  },

  externalClasses: [
    'ctl-style',
    'op-style'
  ]
})