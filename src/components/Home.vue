<template>
	<el-container class="home-container">
		<!--Header-->
		<el-header>
			<div>
				<img class="logo-img" src="../assets/img/logo.png" alt="">
				<span>项目管理平台</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<!--侧边栏-->
			<el-aside :width="isCollapse ? '56px' : '200px'">
				<div class="btncollapse" @click="collapseContal">|||</div>
				<el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff" :collapse="isCollapse" :collapse-transition="false" router :default-active="activeMenu" :unique-opened="true">
					<el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
						<template slot="title">
							<i :class="icons[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>
						<el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveActibeMenu('/'+subitem.path)">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{subitem.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-container>
				<!--主显示区-->
				<el-main>
					<router-view></router-view>
				</el-main>
				<!--Footer-->
				<el-footer>Footer</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
    export default {
        name: "Home",
		data() {
          return {
              menusList: [],
			  icons: {
                  125: "iconfont icon-wode",
                  103: "iconfont icon-xinxi",
                  101: "iconfont icon-xueshimao",
                  102: "iconfont icon-shexiang",
                  145: "iconfont icon-shoucang"
			  },
			  isCollapse: false,
              activeMenu: ""
		  }
		},
		created(){
            this.getMenuList()
			const activeMenu = window.sessionStorage.getItem("activeMenu")
			if (activeMenu) {
                this.activeMenu = activeMenu
			} else {
			    this.activeMenu = '/users'
			}

		},
		methods: {
            logout() {
                window.sessionStorage.clear()
				this.$router.push('/login')
			},
			async getMenuList() {
                const {data:res} = await this.$http.get('menus')
				this.menusList = res.data
			},
            collapseContal() {
				this.isCollapse = !this.isCollapse
			},
            saveActibeMenu(activeMenu) {
                window.sessionStorage.setItem('activeMenu',activeMenu)
				this.activeMenu = activeMenu
			}
		}
    }
</script>

<style lang="less" scoped>
	.home-container {
		height: 100%;
	}
	.el-header {
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		padding-right: 10px;
		align-items: center;
		color: #fff;
		font-size: 30px;

		.logo-img {
			height: 60px;
		}
		div {
			display: flex;
			align-items: center;

			span {
				margin-left: 15px;
			}
		}
	}
	.el-aside {
		background-color: #333744;
		.el-menu {
			border-right: 0;
		}
		.btncollapse {
			background-color: #373d41;
			text-align: center;
			letter-spacing: 3px;
			cursor: pointer;
		}
	}
	.el-main {
		background-color: #EAEDF1;
	}
	.el-footer {
		background-color: #EAEDF9;
	}
</style>