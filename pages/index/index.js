//获取应用实例
const app = getApp()
Page({
  data: {
    sfindex: 0, //身份类型下标
    senfens: ['学生', '老师'],
    grada: '班级',
    xuehao: '学号',
    index: 0,
    pic: '#ddd',
    name: '',
    number: '',
    bjlist: [],
    stuinfo:{},
    // departs: [{ id: 3, departname: "教务处" }, { id: 4, departname: "总务处" }],
    choice: false,
    choice1: true,
    currentid: 0,
    bjid: 0,
    scuan: false,
    scuan1: true,
    zppic: '',
  },
  //事件处理函数

  onShow: function () {
  
  },
  onLoad: function (options) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.login(res.code);
      }
    })
    // app.login();
   
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
  bindPickerChange: function(e) {
    this.setData({
      sfindex: e.detail.value
    })
    console.log(e.detail.value);
    if (e.detail.value == 1) {
      this.setData({
        grada: "部门",
        xuehao: "工号",
      })
      this.getTeacgerPart();
    } else if (e.detail.value == 0) {
      this.setData({
        grada: "班级",
        xuehao: "学号",
      })
      this.getGrade();
    }

  },
  // 班级下拉选
  bindPickerChange1: function(e) {
    this.setData({
      choice: true,
      choice1: false,
      bjid: e.detail.value,
      currentid: this.data.bjlist[e.detail.value].id
    })
  },
  // 姓名学号
  bindKeyInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInput1: function(e) {
    this.setData({
      number: e.detail.value
    })
  },
  // 自拍照上传
  brzp() {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#353535",
      success: function(res) {
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
  chooseWxImage: function(type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
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
              if (imgobj.status == 1) {
                that.setData({
                  zppic: app.globalData.imgurl + imgobj.url,
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
          fail: function(res) {
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function(res) {}
            })
          }
        })
      }
    })
  },
  tijiao() {
    if (this.data.name == '') {
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
      })
      return;
    } else if (this.data.zppic == '') {
      wx.showModal({
        title: '提示',
        content: '请上传本人自拍照',
      })
      return;
    }

if(this.data.sfindex==0){
 if (this.data.number == '') {
      wx.showModal({
        title: '提示',
        content: '学号不能为空',
      })
      return;
    } else if (this.data.currentid == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择班级',
      })
      return;
    } 
}else{
  if (this.data.number == '') {
    wx.showModal({
      title: '提示',
      content: '工号不能为空',
    })
    return;
  } else if (this.data.currentid == 0) {
    wx.showModal({
      title: '提示',
      content: '请选择部门',
    })
    return;
  } 
}

    this.subinfo();
  },
  getGrade() {
    app.post('xcx/getStudentDept', {}, res => {
      if (res.data.code == 1) {
        this.setData({
          bjlist: res.data.data,
        })
        if (this.data.currentid == 0) {
          this.setData({
            choice: false,
            choice1: true,
          })
        }
      } else {
        wx.showModal({
          title: '提醒',
          content: '未找到数据',
        })
      }
    });
  },

  getStuInfo() {
    app.post('xcx/getInfo', {
      sid: this.data.sid
    }, res => {
      if (res.data.code == 1) {
        let departid = res.data.data.depart_id;
        const bjindex = this.data.bjlist.findIndex(item => item.id == departid);
        this.setData({
        name:res.data.data.name,
        number: res.data.data.number,
          bjid: bjindex,
          currentid:departid,
          choice: true,
          choice1: false,
          zppic:res.data.data.face_img,
          scuan: true,
          scuan1: false,
        })
      } else {
        // wx.showModal({
        //   title: '提醒',
        //   content: '未找到数据',
        // })
      }
    });
  },
  subinfo() {
    app.post('xcx/subInfo', {
      sid: this.data.sid,
      name: this.data.name,
      number: this.data.number,
      depart_id: this.data.currentid,
      face_img: this.data.zppic,
      type: this.data.sfindex + 1,
    }, res => {
      if (res.data.code == 1) {
        wx.navigateTo({
          url: '../success/index'
        })
      } else {
        wx.showModal({
          title: '提醒',
          content: res.data.msg,
        })
      }
    });
  },
  getTeacgerPart() {
    app.post('xcx/getTeacherDept', {}, res => {
      if (res.data.code == 1) {
           this.setData({
                   bjlist: res.data.data
            })
      }
      else {
        wx.showModal({
          title: '提醒',
          content: res.data.msg,
        })
      }
    });
  },
  login(code) {
    app.post('xcx/login', { code: code }, res => {
      if (res.data.code == 1) {
        this.data.sid = res.data.sid;
        wx.setStorageSync('uid', res.data.sid);
        if (res.data.type==1){
          this.setData({
            grada: "班级",
            xuehao: "学号",
          })
          this.getGrade();
        }else{
          this.setData({
            grada: "部门",
            xuehao: "工号",
          })
          this.getTeacgerPart();
        }
        this.getStuInfo();
        this.setData({
        sfindex :res.data.type-1,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }
    })
  }
})