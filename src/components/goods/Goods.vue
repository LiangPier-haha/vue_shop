<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodList">
						<el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="16" >
					<el-button type="primary" class="addgood" @click="addPage">添加商品</el-button>
				</el-col>
			</el-row>
			<el-table :data="goodsList" border stripe>
				<el-table-column align="center" type="index" label="#"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name" width="700px"></el-table-column>
				<el-table-column align="center" label="商品价格(元)" prop="goods_price"></el-table-column>
				<el-table-column align="center" label="商品重量" prop="goods_weight"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="add_time">
					<template slot-scope="scope">
						{{scope.row.add_time | dateFormat}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="200px">
					<el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="queryInfo.pagenum"
						:page-sizes="[10, 15, 30]"
						:page-size="queryInfo.pagesize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="total" background>
				</el-pagination>
			</div>
		</el-card>
	</div>
</template>

<script>
    export default {
        name: "Goods",
		data() {
            return {
                queryInfo: {
                    searchKey: "",
                    pagenum: 1,
                    pagesize: 10,
				},
                goodsList: [],
				total: null,
			}
		},
		created() {
			this.getGoodList()
        },
		methods: {
            async getGoodList() {
                const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
				this.goodsList = res.data.goods
				this.total = res.data.total
				console.log(res)
			},
            handleSizeChange(val) {
                this.queryInfo.pagesize = val
                this.getGoodList()
			},
            handleCurrentChange(val) {
                this.queryInfo.pagenum = val
                this.getGoodList()
			},
            addPage() {
                this.$router.push('/goods/addgood')
			}
		}
    }
</script>

<style lang="less" scoped>
.addgood {
	margin-left: 15px;
}
.el-row {
	margin-bottom: 7px;
}

</style>