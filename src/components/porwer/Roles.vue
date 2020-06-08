<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
			<el-table :data="roleList" border stripe>
				<el-table-column align="center" type="expand">
					<template>
						<el-row>
							<el-col span="9">

							</el-col>
						</el-row>
 					</template>
				</el-table-column>
				<el-table-column align="center" label="#" type="index"></el-table-column>
				<el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>
				<el-table-column align="center" label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" @click="editUserDialog(scope.row.id)">编辑</el-button>
						<el-button type="success" icon="el-icon-s-tools">修改权限</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
    export default {
        name: "Roles",
		data() {
            return {
                roleList: [],
			}
		},
		created() {
            this.getRoleList()
        },
		methods: {
            async getRoleList() {
                const {data:res} = await this.$http.get('roles')
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.roleList = res.data
				this.$message.success(res.meta.msg)
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