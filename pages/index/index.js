//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: [{ sid: 1, sname: "老师" }, { sid: 2, sname: "学生" }],
    grada:'班级',
    xuehao:'学号',
    index: 0,
    pic: '#ddd',
    name: '',
    num: '',
    bjlist: [{ id: 1, bjname: "一年级一班" }, { id: 2, bjname: "一年级二班" }],
    // bjlist: { "code": 1, "msg": "success", "data": [{ "id": 1, "dept_name": "中学部", "ji": { "id": 3, "dept_name": "中学2019级（二年级）", "ban": [{ "id": 12, "dept_name": "二年二班" }, { "id": 13, "dept_name": "二年三班" }] } }, { "id": 96, "dept_name": "小学部", "ji": { "id": 3, "dept_name": "中学2019级（二年级）", "ban": [{ "id": 12, "dept_name": "二年二班" }, { "id": 13, "dept_name": "二年三班" }] } }, { "id": 74, "dept_name": "小学部", "ji": { "id": 75, "dept_name": "一年级", "ban": [{ "id": 76, "dept_name": "一年级一班" }, { "id": 77, "dept_name": "一年级二班" }] } }, { "id": 71, "dept_name": "研究院", "ji": { "id": 86, "dept_name": "二楼展厅", "ban": [{ "id": 87, "dept_name": "智慧教室" }] } }, { "id": 102, "dept_name": "山东诚海继续教育中心", "ji": { "id": 123, "dept_name": "研究院", "ban": [{ "id": 124, "dept_name": "办公室" }] } }, { "id": 65, "dept_name": "烟台大学", "ji": { "id": 69, "dept_name": "一年级", "ban": [{ "id": 70, "dept_name": "教师研讨室" }] } }, { "id": 97, "dept_name": "护理", "ji": { "id": 98, "dept_name": "2016", "ban": [{ "id": 99, "dept_name": "2016护理1班" }] } }, { "id": 47, "dept_name": "初中部", "ji": { "id": 50, "dept_name": "初中一年级", "ban": [{ "id": 57, "dept_name": "初中一年级一班" }] } }, { "id": 46, "dept_name": "小学部", "ji": { "id": 49, "dept_name": "二年级", "ban": [{ "id": 59, "dept_name": "二年级一班" }] } }, { "id": 4, "dept_name": "初中部", "ji": { "id": 95, "dept_name": "九年级", "ban": [] } }, { "id": 126, "dept_name": "123", "ji": { "id": 95, "dept_name": "九年级", "ban": [] } }] },
    choice: false,
    choice1:true,
    currentid:0,
    bjid: 0,
    scuan: false,
    scuan1: true,
    zppic: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
// 身份类型
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value==1){
      this.setData({
        grada: "部门",
        xuehao:"工号",
      })
    } else if (e.detail.value == 0){
      this.setData({
        grada: "班级",
        xuehao: "学号",
      })
    }

  },
  // 班级下拉选
  bindPickerChange1: function (e) {
    this.setData({
      choice: true,
      choice1:false,
      bjid: e.detail.value,
      currentid: this.data.bjlist[e.detail.value].id
    })
  },
  // 姓名学号
  bindKeyInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInput1: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  // 自拍照上传
  brzp(){
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#353535",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在上传...',
          mask: true
        })
        wx.uploadFile({
          url: app.globalData.api + 'xcx/uploadImg', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'image',
          formData: {
            image: tempFilePaths[0],
          },
          success(res) {
            if (res.statusCode == 200) {
              let imgobj = JSON.parse(res.data);
              if (imgobj.code == 1) {

                that.setData({
                  zppic: imgobj.imgUrl,
                  scuan: true,
                  scuan1: false,
                })

                wx.hideLoading();
              } else {
                wx.showModal({
                  title: '错误提示',
                  content: imgobj.msg,
                })
                wx.hideLoading();
              }
            }
          },
          fail: function (res) {
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        })
      }
    })
  },
  tijiao(){
    wx.navigateTo({
      url: '../success/index'
    })
  }
})
