<template>
  <div class="login-wrapper">
    <div class="container">
      <div class="logo"></div>
      <div class="login-form">
        <div class="login-txt">请使用您的管理账号登录</div>
        <Form class="form-style" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <FormItem label="用户名" prop="userName">
            <Row>
              <Col span="18">
                <Input v-model="formValidate.userName" placeholder="请输入用户名"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Row>
              <Col span="18">
                <Input type="password" v-model="formValidate.password" placeholder="请输入密码" />
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">登录</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../fetch/api'
  import * as CONST from '../../store/types'
  import generate from 'nanoid/generate'
  export default {
    data () {
      return {
        formValidate: {
          userName: '',
          password: ''
        },
        ruleValidate: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', min: 5, message: '用户密码至少为5位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // 验证通过后 发送请求
            api.Login(this.formValidate).then(result => {
              // console.log(result)
              if (+result === 1) {
              // if (true) {
                // 保存用户信息
                let token = generate('1234567890abcdef', 10)
                this.$store.dispatch({
                  type: CONST.LOCATIONTOKEN,
                  token: token
                })
                this.$store.dispatch({
                  type: CONST.SETUSERINFO,
                  operinfo: this.formValidate
                })
                let redirect = decodeURIComponent(this.$route.query.redirect || '/')
                this.$router.push({
                  path: redirect
                })
              } else {
                this.$Message.error('用户名或密码不正确')
              }
            })
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    }
  }
</script>

<style lang="less">
  html,
  body{
    height: 100%;
    width: 100%;
  }
  .login-wrapper{
    width: 100%;
    height:100%;
    background: url(../../assets/login-bg.png) center no-repeat;
    background-size: cover;
    .container{
      position: relative;
      margin: 0 auto;
      width: 1080px;
      height: 100%;
      // background: gold;
      .logo{
        position: absolute;
        left: 0;
        top: 150px;
        background: url(../../assets/logo-bg.png) center no-repeat;
        width: 584px;
        height: 216px;
        background-size: cover;
      }
      .login-form{
        position: absolute;
        right: -20px;
        top: 250px;
        background: url(../../assets/login-input-bg.png) center no-repeat;
        width: 400px;
        height: 400px;
        border-top-right-radius: 30px;
        border-bottom-left-radius: 30px;
        overflow: hidden;
        // top: 50%;
        // margin-top: -120px;
        // width: 500px;
        // border: 1px solid green;
        // padding: 20px;
        .login-txt{
          font-size: 22px;
          color: #333;
          text-align: center;
          line-height: 1;
          margin-top: 45px;
        }
        .form-style{
          margin-top: 50px;
        }
      }
    }
  }
</style>
