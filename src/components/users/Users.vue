<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card >
			<el-row :gutter="40">
				<el-col :span="8">
					<el-input v-model="queryInfo.query" placeholder="请输入项目名称" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
			</el-row>
			<el-table :data="userList" style="width: 100%" align="center">
				<el-table-column align="center" type="index" label="#"></el-table-column>
				<el-table-column align="center" prop="username" label="姓名" ></el-table-column>
				<el-table-column align="center" prop="create_time" label="日期" ></el-table-column>
				<el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
				<el-table-column align="center" prop="email" label="邮箱"></el-table-column>
				<el-table-column align="center" prop="role_name" label="角色"></el-table-column>
				<el-table-column align="center" prop="mg_state" label="状态">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-tooltip effect="dark" content="编辑" placement="top" transition="in">
							<el-button type="primary" icon="el-icon-edit" circle @click="editUserDialog(scope.row.id)"></el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="查看" placement="top" transition="in">
							<el-button type="success" icon="el-icon-check" circle></el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="删除" placement="top" transition="in">
							<el-button type="danger" icon="el-icon-delete" circle @click="delUser(scope.row.id)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="queryInfo.pagenum"
					:page-sizes="[1, 2, 3, 5]"
					:page-size="queryInfo.pagesize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
			</el-pagination>
		</el-card>
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
			<el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="70px" >
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
			<el-button @click="addDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addUser">确 定</el-button>
  			</span>
		</el-dialog>
		<el-dialog title="修改用户" :visible.sync="editUserVisible" width="50%" @close="editDialogClose">
			<el-form :model="editUserForm" :rules="editUserFormRule" ref="editUserFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editUserForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editUserForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editUserForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="editUserVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUser(editUserForm.id)">确 定</el-button>
  			</span>
		</el-dialog>
	</div>
</template>

<script>
    export default {
        name: "Users",
		data() {
            var checkEmail = (rule,value,cb) => {
                const emailReg = /^([0-9a-zA-Z_-])+@([0-9a-zA-Z_-])+(\.[0-9a-zA-Z_-])+/
				if (emailReg.test(value)) {
				    return cb()
				}
				cb(new Error("请填入合法邮箱"))
			}
            var checkMobile= (rule,value,cb) => {
                const mobileReg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
                if (mobileReg.test(value)) {
                    return cb()
                }
                cb(new Error("请填入合法手机号"))
            }
            return {
				queryInfo: {
                    query: "",
                    pagenum: 1,
                    pagesize: 2
				},
				userList: [],
                total: 0,
                addDialogVisible: false,
                editUserVisible: false,
                addForm: {
				    username: "",
                    password: "",
					email: "",
					mobile: ""
				},
                addFormRule: {
				    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                    ],
                    email: [
						{validator: checkEmail,trigger: 'blur'},
                    ],
                    mobile: [
                        {validator: checkMobile,trigger: 'blur'},
                    ]
				},
                editUserForm: {},
                editUserFormRule: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    email: [
                        {validator: checkEmail,trigger: 'blur'},
                    ],
                    mobile: [
                        {validator: checkMobile,trigger: 'blur'},
                    ]
				}
			}
		},
		created() {
            this.getUserList()
        },
		methods: {
            async getUserList() {
				const {data:res} = await this.$http.get('users',{
				    params: this.queryInfo
				})
				if (res.meta.status === 200) {
					this.userList = res.data.users
					this.queryInfo.pagenum = res.data.pagenum
					this.total = res.data.total
					return
				}
				return this.$message.error("获取用户列表失败")
			},
            handleSizeChange(newsize) {
                this.queryInfo.pagesize = newsize
				this.getUserList()
			},
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
			},
             async userStateChange(userInfo) {
                console.log(userInfo)
				const req = `users/${userInfo.id}/state/${userInfo.mg_state}`
				 console.log(req)
                const {data:res} = await this.$http.put(req)
			 	console.log(res)
				if (res.meta.status !== 200){
				    userInfo.mg_state = !userInfo.mg_state
					return this.$message.error("更新用户状态失败")
				}
				this.$message.success("更新用户状态成功")

			},
			addDialogClose() {
                this.$refs.addFormRef.resetFields()
			},
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    console.log(valid)
					if (!valid) return this.$message.error("信息有误")
					const {data:res}= await this.$http.post('users',this.addForm)
					console.log(res)
					if (res.meta.status !== 201) {
					    return this.$message.error(res.meta.msg)
					}
					this.$message.success("添加成功")
					this.addDialogVisible = false
                    this.getUserList()
				})
			},
            async editUserDialog(userId) {
                const {data:res} = await this.$http.get(`users/${userId}`)
				console.log(res)
				if (res.meta.status !== 200) return this.$message.error("该用户不存在")
				this.editUserForm = res.data
                this.editUserVisible = true
			},
            editDialogClose() {
                this.$refs.editUserFormRef.resetFields()
			},
            editUser(userid) {
                this.$refs.editUserFormRef.validate(async valid => {
					if (!valid) return this.$message.error("信息填写有误")
					const {data:res} = await this.$http.put(`users/${userid}`,{mobile:this.editUserForm.mobile,email:this.editUserForm.email})
					console.log(res)
					if (res.meta.status !== 200) return this.$message.error("修改用户信息失败")
					this.$message.success("修改用户信息成功")
					this.editUserVisible = false
                    this.getUserList()
				})
			},
            async delUser(id) {
                const confirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(error => error)
				if (confirm === "cancel") return this.$message.info("取消删除用户")
				const {data:res} = await this.$http.delete('users/'+id)
				if (res.meta.status !== 200) {
				    return this.$message.error("删除用户失败")
				}
				this.$message.success("删除用户成功")
				this.getUserList()
			}
		}
    }
</script>

<style lang="less" scoped>
	.el-breadcrumb {
		margin-bottom: 15px;
		font-size: 12px;
	}
	.el-card {
		box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;
	}
	.el-pagination {
		margin-top: 15px;
		align-items: flex-end;
	}
</style>