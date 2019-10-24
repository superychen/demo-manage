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
    <div class="topbar-wrapper" :style="{left: this.isCollapsed?'64px':'200px'}">
      <div style="float: left" class="menu-collapse-wrapper float-left" @click="toggleMenu">
        <i class="el-icon-menu" :style="{transform: 'rotateZ(' + (this.isCollapsed ? '90' : '0') + 'deg)'}"></i>
      </div>
      <div style="float: left;" class="title">后台管理系统</div>
      <ul style="float: right" class="menu-list">
        <li class="menu-item" style="padding: 0;">
          <el-dropdown
            :show-timeout="10"
            :hide-timeout="10"
            @command="handleCommand"
            style="padding: 0 15px;">
            <div class="dropdown-content el-dropdown-link">
              <i class="icon el-icon-s-custom"></i>
              <span class="text">cqyc</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="menu-item" title="有什么问题嘛?请及时联系管理员">
          <i class="icon el-icon-question"></i>
        </li>
        <li class="menu-item" title="退出登录">
          <i class="icon el-icon-switch-button"></i>
        </li>
      </ul>
    </div>

    <div class="content-wrapper" ref="content-wrapper" :style="{left: this.isCollapsed?'64px':'200px'}">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Router from 'vue-router'
  //这段代码解决NavigationDuplicated错
  const originalPush = Router.prototype.push;
  Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
  }

  export default {
    data() {
      return {
        sider_menu_data: [],
        isCollapsed: false,
        adminMenuShow: false,
      }
    },
    methods: {
      handleCommand(command) {
        console.log(command);
      },
      toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
      },
      initMenu(){
        this.$axios.get('/apis/management/manage/menu').then(res => {
          this.sider_menu_data = res.data.data;
        }).catch(err => {
          console.log(err.response);
        })
      }
    },
    mounted() {
      this.initMenu();
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
