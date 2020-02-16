<template>
  <div class="layout">
    <div class="siderbar-wrapper" :style="{width: this.isCollapsed?'64px':'200px'}">
      <div class="logo-wrapper">
        logo
      </div>
      <el-menu
        background-color="#424f63"
        text-color="#fff"
        active-text-color="#65cea7"
        class="menu-wrapper"
        router
        unique-opened
        :collapse="isCollapsed"
        :default-active="$route.path">
        <template v-for="(item, index) in sider_menu_data">
          <el-menu-item class="menu-item" v-if="item.children.length <= 0" :index="item.menuPath" :key="index">
            <i :class="item.menuIcon"></i>
            <span slot="title">{{item.menuTitle}}</span>
          </el-menu-item>
          <el-submenu v-else :index="item.menuPath">
            <template slot="title">
              <i :class="item.menuIcon"></i>
              <span slot="title">{{item.menuTitle}}</span>
            </template>
            <el-menu-item class="menu-item" v-for="(sub_item, sub_index) in item.children" :index="sub_item.menuPath"
                          :key="sub_index">
              <span slot="title" style="margin-left:12px;">{{sub_item.menuTitle}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </div>

    <!--用户界面导航栏-->
    <div  class="topbar-wrapper" :style="{left: this.isCollapsed?'64px':'200px'}">
      <div v-if="pcOrPhone" style="float: left" class="menu-collapse-wrapper float-left" @click="toggleMenu">
        <i class="el-icon-menu" :style="{transform: 'rotateZ(' + (this.isCollapsed ? '90' : '0') + 'deg)'}"></i>
      </div>
      <div style="float: left;" class="title">车辆检测后台管理</div>
      <ul v-if="!pcOrPhone" style="float: right" class="menu-list">
        <li @click="exitUser" class="menu-item" title="退出登录">
          <i class="icon el-icon-switch-button"></i>
        </li>
      </ul>
      <ul v-if="pcOrPhone" style="float: right" class="menu-list">
        <li class="menu-item" style="padding: 0;">
          <el-dropdown
            :show-timeout="10"
            :hide-timeout="10"
            style="padding: 0 15px;">
            <div class="dropdown-content el-dropdown-link">
              <i v-if="user.userImg === ''" class="icon el-icon-s-custom"></i>
              <el-avatar shape="square" style="padding-left: 2px;" size="small"
                         :src="$fastdfsUrl.fastdfs + user.userImg"></el-avatar>
              <span class="text">{{user.username}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="openUserInfo">
                  修改用户信息
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="openUserPassword">
                  修改密码
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="menu-item" title="有什么问题嘛?请及时联系管理员">
          <i class="icon el-icon-question"></i>
        </li>
        <li @click="exitUser" class="menu-item" title="退出登录">
          <i class="icon el-icon-switch-button"></i>
        </li>
      </ul>
    </div>
    <div class="content-wrapper" ref="content-wrapper" :style="{left: this.isCollapsed?'64px':'200px'}">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>

    <el-dialog
      title="用户信息修改"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <user-info @changeImgUrl="changeImgUrl" ref="cuserInfo" v-bind:user="user"></user-info>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="paUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="passwordDialog"
      width="30%"
      :before-close="passwordClose">
      <el-form label-width="80px">
        <el-form-item label="旧密码">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input placeholder="请输入手机号" v-model="telephone"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="veriyCode">
            <el-button placeholder="请输入验证码" slot="append" type="primary" @click="sendTelCode" icon="el-icon-phone">
              {{codeMsg}}
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Router from 'vue-router'
  //1.先使用import导入你要在该组件中使用的子组件
  import userInfo from '../components/userInfo'

  //这段代码解决NavigationDuplicated错
  const originalPush = Router.prototype.push;
  Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
  };

  export default {
    components: {userInfo},
    data() {
      return {
        sider_menu_data: [],
        isCollapsed: false,
        adminMenuShow: false,
        dialogVisible: false,
        user: {
          username: '', //用户信息
          telephone: '',//用户电话
          address: '', //用户的地址
          uid: 0, //用户id
          userImg: '',//用户图片
          likeWebsite: 0,//是否点赞
        },
        passwordDialog: false,
        password: '',//旧密码
        newPassword: '', //新密码
        confirmPassword: '',//确认密码
        telephone: '',//电话
        veriyCode: '',//电话验证码
        codeTime: 60,//发送验证码后需要300后才能发送
        codeMsg: "发送验证码",
        timeName: null,
        pcOrPhone: true, //true为电脑端,false为手机端
      }
    },
    methods: {
      handleCommand(command) {
        console.log(command);
      },
      toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
      },
      initMenu() {
        this.$axios.get('/apis/management/manage/menu').then(res => {
          this.sider_menu_data = res.data.data;
        }).catch(err => {
          console.log(err.response);
        })
      },
      //得到用户信息
      userInfo() {
        this.$axios.get('/apis/login-sms/website/user').then(res => {
          if (res.data.code === 200) {
            this.user.username = res.data.data.username;
            this.user.telephone = res.data.data.telephone;
            this.user.address = res.data.data.address;
            this.user.uid = res.data.data.uid;
            this.user.userImg = res.data.data.userImg;
            this.user.likeWebsite = res.data.data.likeWebsite;
          }
        }).catch(err => {
          console.log(err.response);
        })
      },
      handleClose() {
        this.dialogVisible = false;
      },
      //修改用户信息
      openUserInfo() {
        this.dialogVisible = true;
      },
      //修改用户密码
      openUserPassword() {
        this.passwordDialog = true;
      },
      passwordClose(done) {
        done();
      },
      changeImgUrl(msg) {
        this.user.userImg = msg;
      },
      paUserInfo() {
        this.$axios.put('apis/login-sms/login/user', this.user).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('修改用户成功', 'success')
            this.dialogVisible = false;
          }
        }).catch(err => {
          console.log(err.response);
        })
      },
      //发送电话验证
      sendTelCode() {
        if (this.newPassword !== this.confirmPassword || this.newPassword === '') {
          this.$getMessage('密码不能为空或两次密码输入不一致', 'error');
          return false;
        }
        this.$axios.post('/apis/management/manage/sendsms', this.$qs.stringify({
          telephone: this.telephone
        })).then(res => {
          if (res.data.code === 200) {
            this.$getMessage(res.data.data, 'success');
            this.timeName = setInterval(() => {//定时器
              this.codeTime--;
              this.codeMsg = this.codeTime + "秒";
              if (this.codeTime <= 0) {
                this.codeMsg = "发送验证码";
                clearInterval(this.timeName);//清除轮询
                return;
              }
            }, 1000);
          }
        }).catch(err => {
          console.log(err.response);
        });
      },

      updatePassword() {
        if (this.newPassword !== this.confirmPassword || this.newPassword === '') {
          this.$getMessage('密码不能为空或两次密码输入不一致', 'error');
          return false;
        }
        this.$axios.post('/apis/login-sms/login/change/pass', this.$qs.stringify({
          password: this.password,
          newPassword: this.newPassword,
          telephone: this.telephone,
          veriyCode: this.veriyCode
        })).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('修改密码成功,请重新登录', 'success')
            this.$Cookies.set('token', '');
            setTimeout(() => {
              this.$router.push({path: '/login'});
            }, 1500);
          }
        }).catch(err => {
          console.log(err.response);
        })

      },
      //退出登录
      exitUser() {
        this.$axios.post('/apis/login-sms/login/exit', this.$qs.stringify({
          username: this.$Cookies.get('username'),
        })).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('退出成功', 'success');
            //清空cookie中的token
            this.$Cookies.set('token', '');
            setTimeout(() => {
              this.$router.push({path: '/login'})
            }, 1000);
          }
        }).catch(err => {
          console.log(err.response);
        })
      },
      //判断当前用户是手机还是电脑用户
      _isMobile() {
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return flag;
      }
    },
    mounted() {
      this.initMenu();
      this.userInfo();
      if (this._isMobile()) {
        //手机端
        this.pcOrPhone = false;
        this.isCollapsed = true;
      } else {
        //PC端
        this.pcOrPhone = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/styles/variable';

  .siderbar-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: $siderbarWidth;
    z-index: 11;
    background-color: $siderbarBackgroundColor;
    transition: all 0.3s ease-in-out;

    .logo-wrapper {
      height: 40px;
      line-height: 40px;
      padding: 16px 0;
      text-align: center;
      font-size: 24px;
      color: #FFFFFF;
      color: #65CEA7;
    }

    .menu-wrapper {
      position: absolute;
      top: 72px;
      bottom: 0;
      width: 100%;
      border-right: none;
      transition: all 0.3s ease-in-out;

      &:not(.el-menu--collapse) {
        overflow-y: auto;
        overflow-x: hidden;
      }

      i {
        color: #FFFFFF;
      }

      .menu-item {

        &.is-active, &:hover {
          background-color: #353F4F !important;
          color: #65CEA7 !important;

          i {
            color: #65CEA7 !important;
          }
        }

      }

      .el-submenu__title:hover {
        color: #65CEA7 !important;

        i {
          color: #65CEA7 !important;
        }
      }

      .el-submenu, .el-menu-item {
        width: 100%;
      }
    }
  }

  .topbar-wrapper {
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: 0;
    heihgt: $topbarHeight;
    line-height: $topbarHeight;
    padding: 0 24px 0 0;
    background-color: $topbarBackgroundColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    transition: all 0.3s ease-in-out;
    z-index: 12;

    .menu-collapse-wrapper {
      height: 100%;
      width: 48px;
      text-align: center;
      cursor: pointer;

      i {
        transition: all 0.3s ease-in-out;
      }
    }

    .title {
      height: 100%;
      font-weight: bold;
    }

    .menu-list {
      .menu-item {
        position: relative;
        float: left;
        padding: 0 15px;
        min-width: 45px;
        height: 48px;
        text-align: center;
        font-size: 0px;

        &:hover {
          cursor: pointer;
          background-color: #F5F5F5;
        }

        .icon {
          vertical-align: middle;
          font-size: 24px;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          margin-left: 4px;
          font-size: 16px;
        }
      }
    }
  }

  .content-wrapper {
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: $topbarHeight;
    bottom: 0;
    padding: 16px;
    overflow: auto;
    transition: all 0.3s ease-in-out;

    .content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
</style>
