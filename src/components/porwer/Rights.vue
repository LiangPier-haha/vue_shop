<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-table :data="rightList" border stripe>
				<el-table-column align="center" type="index" label="#"></el-table-column>
				<el-table-column align="center" label="权限名称" prop="authName"></el-table-column>
				<el-table-column align="center" label="路径" prop="path"></el-table-column>
				<el-table-column align="center" label="权限等级" prop="level">
					<template slot-scope="scope">
						<el-tag type="" v-if="scope.row.level === '0'">一级</el-tag>
						<el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
						<el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
    export default {
        name: "Rights",
		data() {
            return {
                rightList: []
			}
		},
		created() {
            this.getRightList()
        },
        methods: {
            async getRightList() {
                const {data:res} = await this.$http.get('rights/list')
				console.log(res)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.rightList = res.data
				this.$message.success(res.meta.msg)
            }
		}
    }
</script>

<style scoped>
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