const richEditor = requirePlugin('richeditor')
let result

Page({
  data: {
    testList: [],
    outPutList: [],
    supportType: {
      image: {
        name: '图片',
        type: 'image',
        isSupport: true,
        supportSource: ['album', 'camera'],
        sizeType: ['original', 'compressed'],
        frontMethod: function () {
          // 对应方法需返回true or false
          console.log(`插入图片前的前置事件`)
        },
        backMethod: function (res) {
          // 对应方法需返回true or false
          console.log(`插入图片前的后置事件，所插入的图片路径为${JSON.stringify(res)}`)
        }
      },
      text: {
        name: '文本',
        type: 'text',
        isSupport: true,
        maxNum: 120,
        frontMethod: function () {
          // 对应方法需返回true or false
          console.log(`插入文本前的前置事件`)
        },
        backMethod: function (res) {
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
        frontMethod: function () {
          // 对应方法需返回true or false
          console.log(`插入视频前的前置事件`)
        },
        backMethod: function (res) {
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
    },
    getObject: function (res) {
      //　返回当前的对象
      result = res
    }
  },
  onLoad: function() {
  },
  onReady: function () {
  },
  preview: function () {
    let string = ''
    result.forEach(function(item, index) {
      if (item.type === 'image') {
        string = string + '<div><img style="width: 100%;" src="' + item.src + '"/></div>'
      } else if (item.type === 'text') {
        string = string + '<div style="font-size: 14px">' + item.desc + '</div>'
      } else if (item.type === 'video') {
        // 目前小程序rich-text不支持video
        // string = string + '<div><video src="' + item.src + '"></video></div>'
      }
    })
    wx.navigateTo({
      url: '/pages/preview/preview?str=' + encodeURIComponent(string)
    })
  }
})