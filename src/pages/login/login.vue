<template>
  <div>
    <div class="login">
      <div class="middle-wrapper">
        <div class="title-wrapper">
          <div class="title">后台管理</div>
        </div>
        <div class="login-form">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                   class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="checkPass">
              <el-input type="password" v-model.trim="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="校验码" prop="verfiyCode">
              <el-input v-model.trim="ruleForm.verfiyCode" placeholder="校验码">
                <template slot="append">
                  <img @click="changeImgUrl" :src="createImg" alt="" height="35">
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      let checkVerfiyCode = (rule, value, callback) => {
        if (value === '' || value.length < 0) {
          callback(new Error('校验码不能为空'));
        } else {
          callback();
        }
      };
      let validateUsername = (rule, value, callback) => {
        //匹配所有空格
        let reg = /\s+/g;
        if (value === '') {
          callback(new Error('用户名不能为空'));
        } else if (value.length < 0 || value.length > 16) {
          callback(new Error('用户名长度必须大于0或者小于16位'));
        } else if (reg.test(value)) {
          callback(new Error('用户名不能包括空格'));
        } else {
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        //必须包含数字和字母
        let reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
        //匹配所有空格
        let regKong = /\s+/g;
        if (value === '') {
          callback(new Error('密码不能输入为空'));
        } else if (value.length < 0 || value.length > 16) {
          callback(new Error('密码长度必须大于0小于16位'));
        } else if (regKong.test(value)) {
          callback(new Error('密码输入不能包含有空格'));
        } else if (!reg.test(value)) {
          callback(new Error('密码必须由数字和字母组成'))
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          username: '',
          checkPass: '',
          verfiyCode: ''
        },
        createImg: 'apis/login-sms/comm/img',
        rules: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          verfiyCode: [
            {validator: checkVerfiyCode, trigger: 'blur'}
          ]
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.$axios.post('/apis/login-sms/login', this.$qs.stringify({
              username: this.ruleForm.username,
              password: this.ruleForm.checkPass,
              imgCode: this.ruleForm.verfiyCode,
            })).then(res => {
              //跳转到后台管理主页面
              if (res.data.code === 200) {
                this.$Cookies.set('token', res.data.data.token, {expires: 1});
                this.$Cookies.set('username', res.data.data.username, {expires: 1});
                this.$router.push({path: '/home'});
              }
            }).catch(err => {
              console.log(err.response.data);
              this.$getMessage(err.response.data, 'error');
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //点击更换图片
      changeImgUrl () {
        this.createImg="apis/login-sms/comm/img?id="+Math.random();
      }
    },
    mounted() {
    }
  }
</script>

<style ref="stylesheet/scss" scoped lang="scss">
  .login {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgb(32, 160, 255);

    .middle-wrapper {
      position: fixed;
      width: 100%;
      margin: 0 auto;
      top: 50%;
      transform: translateY(-60%);

      .title-wrapper {
        margin-top: 50px;
        margin-bottom: 30px;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        color: #ffffff;
      }

      .login-form {
        position: relative;
        margin: 0 auto;
        width: 520px;
        padding: 30px 50px;
        box-sizing: border-box;
        border-radius: 5px;
        background-color: #ffffff;

        .el-row {
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          .login-btn {
            width: 100%;
          }
        }

        .check-code-wrapper {
          display: flex;
          justify-content: space-between;
          height: 40px;

          .yanzhengma-wrapper {
            flex: 0 1 auto;
          }

          .validate-code-wrapper {
            flex: 0 0 160px;
          }
        }
      }
    }
  }
</style>
