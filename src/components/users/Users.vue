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
					<el-input v-model="searchKey" placeholder="请输入项目名称">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-button type="primary">创建项目</el-button>
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
						<el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-tooltip effect="dark" content="编辑" placement="top" transition="in">
							<el-button type="primary" icon="el-icon-edit" circle></el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="查看" placement="top" transition="in">
							<el-button type="success" icon="el-icon-check" circle></el-button>
						</el-tooltip>
						<el-tooltip effect="dark" content="删除" placement="top" transition="in">
							<el-button type="danger" icon="el-icon-delete" circle></el-button>
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
	</div>
</template>

<script>
    export default {
        name: "Users",
		data() {
            return {
                searchKey: "",
				queryInfo: {
                    query: "",
                    pagenum: 1,
                    pagesize: 2
				},
				userList: [],
                total: 0
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
				console.log(res)
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