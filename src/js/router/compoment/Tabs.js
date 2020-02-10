Ktu.router.Tabs = Vue.extend({
    template: `
        <div class="comtent">
            <h2>Menu 导航栏</h2>
            <div class="content-item">
                <h3>水平导航</h3>
                <template>
                    <Tabs
                        :active-name="1"
                        @on-select="select"
                    >
                        <TabPanel name="0" title="内容管理">
                            内容管理的内容
                        </TabPanel>
                        <TabPanel name="1" title="用户管理">
                            用户管理的内容
                        </TabPanel>
                        <TabPanel name="2" title="综合设置">
                            综合设置的内容
                        </TabPanel>
                    </Tabs>
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
