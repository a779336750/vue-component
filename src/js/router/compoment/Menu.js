Ktu.router.Menu = Vue.extend({
    template: `
        <div class="comtent">
            <h2>Menu 菜单栏</h2>
            <div class="content-item">
                <h3>水平菜单</h3>
                <template>
                    <Menu
                        mode="horizontal"
                        active-name="1"
                        @on-select="select"
                    >
                        <MenuItem name="0">
                            内容管理
                        </MenuItem>
                        <MenuItem name="1">
                            用户管理
                        </MenuItem>
                        <MenuItem name="2">
                            综合设置
                        </MenuItem>
                    </Menu>
                </template>
                
                <h3>二级菜单</h3>
                <template>
                    <Menu
                        mode="horizontal"
                        active-name="1"
                        @on-select="select"
                    >
                       <MenuItem name="0">用户管理</MenuItem>
                       <Submenu name="1">
                            <template slot="title">
                                内容管理
                            </template>
                            <MenuItem name="1-1">文章管理</MenuItem>
                            <MenuItem name="1-2">评论管理</MenuItem>
                            <MenuItem name="1-3">举报管理</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                用户管理
                            </template>
                            <MenuItem name="2-1">新增用户</MenuItem>
                            <MenuItem name="2-2">活跃用户</MenuItem>
                            <MenuItem name="2-3">傻子用户</MenuItem>
                        </Submenu>
                    </Menu>
                </template>
            </div>
            
            <div class="content-item" style="margin-top: 200px;">
                <h3>垂直菜单</h3>
                <template>
                    <Menu
                        mode="vertical"
                        active-name="0"
                        @on-select="select"
                    >
                        <MenuItem name="0">
                            内容管理
                        </MenuItem>
                        <MenuItem name="1">
                            用户管理
                        </MenuItem>
                        <MenuItem name="2">
                            综合设置
                        </MenuItem>
                    </Menu>
                </template>
                
                <h3>垂直二级菜单</h3>
                <template>
                    <Menu
                        mode="vertical"
                        active-name="1"
                        @on-select="select"
                    >
                       <MenuItem name="0">用户管理</MenuItem>
                       <Submenu name="1">
                            <template slot="title">
                                内容管理
                            </template>
                            <MenuItem name="1-1">文章管理</MenuItem>
                            <MenuItem name="1-2">评论管理</MenuItem>
                            <MenuItem name="1-3">举报管理</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                用户管理
                            </template>
                            <MenuItem name="2-1">新增用户</MenuItem>
                            <MenuItem name="2-2">活跃用户</MenuItem>
                            <MenuItem name="2-3">傻子用户</MenuItem>
                        </Submenu>
                    </Menu>
                </template>
            </div>
        </div>
      `,
    data() {
        return {
            value1: '1',
            value2: '1',
            value3: '1',
            value4: '1-1'
        };
    },
    created() {},
    computed: {},
    watch: {},
    mounted() {},
    methods: {
        select(name) {
            console.log(name);
        },
    }
});
