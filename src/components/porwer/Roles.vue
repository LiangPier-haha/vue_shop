<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row class="addUser">
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
			<el-table :data="roleList" border stripe>
				<el-table-column align="center" type="expand" prop="children">
					<template slot-scope="scope">
						<el-row :class="['tag-border-bottom',i1 === 0 ? 'tag-border-top':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
							<!--一级权限-->
							<el-col :span="5">
								<el-tag closable @close="delRoleRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!--二级三级权限-->
							<el-col :span="19">
								<el-row :class="[i2 !== 0 ? 'tag-border-top':'','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
									<!--二级权限-->
									<el-col :span="6">
										<el-tag @close="delRoleRight(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag @close="delRoleRight(scope.row,item3.id)" type="warning" closable v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
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
						<el-button type="success" icon="el-icon-s-tools" @click="editRightsDialog(scope.row)">修改权限</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog title="权限修改" :visible.sync="roleDiaVisible" width="30%">
				<el-tree :data="rightsTree" show-checkbox default-expand-all node-key="id"
						 ref="treeRef" highlight-current :props="treeProps" :default-checked-keys="defKeys">
				</el-tree>
				<span slot="footer" class="dialog-footer">
					<el-button @click="roleDiaVisible = false">取 消</el-button>
					<el-button type="primary" @click="editRoleRight">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
    export default {
        name: "Roles",
		data() {
            return {
                roleList: [],
				rightsTree:[],
                roleDiaVisible: false,
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
				defKeys:[],
                roleId: ""
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
			},
			getdefKeys(node,arr) {
                if (!node.children) {
                    return arr.push(node.id)
				}
                node.children.forEach(item => this.getdefKeys(item,arr))
			},
            async editRightsDialog(node) {
                this.defKeys = []
				this.roleId = node.id
				const {data:res} = await this.$http.get('rights/tree')
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.rightsTree = res.data
				this.getdefKeys(node,this.defKeys)
                this.roleDiaVisible = true
			},
            async delRoleRight(user,rightId) {
                const delrightConfirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
				if (delrightConfirm === 'cancel') return this.$message.info('已取消删除')
                const {data:res} = await this.$http.delete('roles/'+user.id+'/rights/'+rightId)
				console.log(res)
				if (res.meta.status !== 200) {
				    user.children = res.data
                    return this.$message.error(res.meta.msg)
				}
                user.children = res.data
			},
            async editRoleRight() {
                const checkedIdList = [
					...this.$refs.treeRef.getCheckedKeys(true),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				const rids = checkedIdList.join(',')
				const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids})
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.$message.success(res.meta.msg)
				this.roleDiaVisible = false
				this.getRoleList()
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
	.tag-border-top {
		border-top: 1px solid #eee;
	}
	.tag-border-bottom {
		border-bottom: 1px solid #eee;
	}
	.vcenter {
		display: flex;
		align-items: center;
	}
	.el-tag {
		margin: 7px;
	}
	.addUser {
		margin-bottom: 7px;
	}
</style>