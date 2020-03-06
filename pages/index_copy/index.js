//获取应用实例
const app = getApp()
Page({
  data: {
    shownj:false,
    currentnjid:0,
    njid:0,
    sfindex: 0, //身份类型下标
    senfens: ['学生', '老师'],
    grada: '班级',
    nianji:'年级',
    xuehao: '学号',
    index: 0,
    pic: '#ddd',
    name: '',
    number: '',
    bjlist: [],
    stuinfo:{},
    choice: false,
    choice1: true,
    choice3: false,
    choice4: true,
    currentid: 0,
    bjid: 0,
    scuan: false,
    scuan1: true,
    zppic: '',
    njlist:[],
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
      sfindex: Number(e.detail.value)
    })
    if (e.detail.value == 1) {
      this.setData({
        grada: "部门",
        xuehao: "工号",
        shownj: true,
      })
      this.getTeacgerPart();
    } else if (e.detail.value == 0) {
      this.setData({
        grada: "班级",
        xuehao: "学号",
        shownj: false,
      })
      this.getGrade();
    }
//切换身份，部门显示缓存
    if (wx.getStorageSync('huancunsfindex') != this.data.sfindex){
      this.setData({
         njid:0,
         bjid:0
      })
    }else{
      this.setData({
       njid: wx.getStorageSync('huancunnjindex'),
        bjid: wx.getStorageSync('huancunbjindex')
      })  
    }
  },
  // 年级下拉选
  bindPickerChange2: function (e) {
    console.log(e.detail.value);
    console.log(this.data.njlist[e.detail.value].id);
    this.setData({
      choice3: true,
      choice4: false,
      njid: e.detail.value,
      currentnjid: this.data.njlist[e.detail.value].id
    })
    this.getClass(this.data.njlist[e.detail.value].id);
  
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
  //提交信息
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
//  if (this.data.number == '') {
//       wx.showModal({
//         title: '提示',
//         content: '学号不能为空',
//       })
//       return;
//     } else 
    if (this.data.currentid == 0) {
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
  //获取年级
  getGrade() {
    app.post('xcx/getStudentGrade', {}, res => {
      if (res.data.code == 1) {
        this.setData({
         njlist: res.data.data,
        })
        if (this.data.currentid == 0) {
          this.setData({
            choice3: false,
            choice4: true,
          })
        }
      } else {
        wx.showModal({
          title: '提醒',
          content: '未找到年级数据',
        })
      }
    });
  },
    //获取班级
getClass(id,classid){
  app.post('xcx/getStudentClass', {
    gid:id,
  }, res => {
    if (res.data.code == 1) {
      this.setData({
        bjlist: res.data.data,
        choice: false,
        choice1: true,
      })
      // const loginbjindex = this.data.bjlist.findIndex(item => item.id == classid);
      // wx.setStorageSync('hcloginbjindex', loginbjindex);
      // this.setData({
      //   bjid: bindex,
      // })
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
//获取学生信息
  getStuInfo() {
    app.post('xcx/getInfo', {
      sid: this.data.sid
    }, res => {
      if (res.data.code == 1) {
        let gradeid = res.data.data.grade_id;
        const njindex = this.data.njlist.findIndex(item => item.id == gradeid);
        let departid = res.data.data.depart_id;
        const bjindex = this.data.bjlist.findIndex(item => item.id == departid);
        console.log("res.data.data.grade_id");
        console.log(this.data.bjlist);
        wx.setStorageSync('huancunnjindex', njindex);
        wx.setStorageSync('huancunbjindex', bjindex);
        this.setData({
        name:res.data.data.name,
        number: res.data.data.number,
          njid:njindex,
          bjid: bjindex,
          currentid:departid,
          choice: true, 
          choice1: false,
          choice3:true,
          choice4:false,
          zppic:res.data.data.face_img,
          scuan: true,
          scuan1: false,
        })
        console.log("res.data.data.njid");
        console.log(this.data.bjid);
      } else {
        // wx.showModal({
        //   title: '提醒',
        //   content: '未找到数据',
        // })
      }
    });
  },
  //提交用户信息
  subinfo() {
    console.log(this.data.sfindex + 1);
    console.log(typeof(this.data.sfindex + 1));
    app.post('xcx/subInfo', {
      sid: this.data.sid,
      name: this.data.name,
      number: this.data.number,
      depart_id: this.data.currentid,
      face_img: this.data.zppic,
      type: this.data.sfindex+1,
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
  //获取老师部门
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
//登录
  login(code) {
    app.post('xcx/login', { code: code }, res => {
      if (res.data.code == 1) {
        this.data.sid = res.data.sid;
        wx.setStorageSync('uid', res.data.sid);
        if (res.data.type==1){
          this.setData({
            grada: "班级",
            xuehao: "学号",
            shownj:false,
          })
          this.getGrade();

          this.getClass(res.data.dept.parent_id, res.data.dept.depart_id)
        }else{
          this.setData({
            grada: "部门",
            xuehao: "工号",
            shownj: true,
          })
          this.getTeacgerPart();
        }
        this.getStuInfo();
        wx.setStorageSync('huancunsfindex', res.data.type - 1);
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