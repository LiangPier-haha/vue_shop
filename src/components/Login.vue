<template>
	<div class="login-contianer">
		<div class="login-box">
			<div class="icon-box">
				<img src="../assets/img/logo.png" alt=""/>
			</div>
			<div class="form-box">
				<el-form ref="loginFormRef" class="login-form" :model="form" :rules="loginFormRules" label-width="0px">
					<!--用户名-->
					<el-form-item prop="username">
						<el-input  v-model="form.username" prefix-icon="iconfont icon-wode" type="text"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input prefix-icon="iconfont icon-jiemi" type="password" v-model="form.password" ></el-input>
					</el-form-item>
					<el-form-item class="btns">
						<el-button type="primary" @click="login">登陆</el-button>
						<el-button type="info" @click="reset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: "Login",
		data() {
            return {
                form:{
                    username:'admin',
					password:'123456'
				},
                loginFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					],
					password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                    ]
				}
			}
		},
		methods: {
            reset() {
                this.$refs.loginFormRef.resetFields()
			},
            login() {
                this.$refs.loginFormRef.validate( async (value) => {
                    if (!value) return
					const { data: res } = await this.$http.post("/login",this.form)
					if (res.meta.status===200) {
                        window.sessionStorage.setItem("token",res.data.token)
                        this.$message.success("登陆成功")
						return this.$router.push('/home')
					}
                    return this.$message.error("登陆失败！")
				})
            }
		}
    }
</script>

<style lang="less" scoped>
	.login-contianer {
		background-color: #2c5e8b;
		height: 100%;
		.login-box {
			width: 400px;
			height: 400px;
			background-color: #2c5e8b;
			position: absolute;
			border: 0px;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			/*opacity:0;*/

			.form-box {
				width: 100%;
				height: 250px;
				background-color: #fafafa;
				border-radius: 10px;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translate(-50%);

				.login-form {
					width: 100%;
					position: absolute;
					bottom: 10%;
					padding: 0 20px;
					box-sizing: border-box;

				}

				.btns {
					display: flex;
					justify-content: flex-end;
				}
			}
			.icon-box {
				height: 100px;
				width: 100px;
				border: 2px solid #eee;
				border-radius: 50%;
				padding: 10px;
				position: absolute;
				background-color: #aaa;
				left: 50%;
				top: 0;
				transform: translate(-50%);



				img {
					height: 100%;
					width: 100%;
					border-radius: 50%;
				}
			}
		}
	}



</style>