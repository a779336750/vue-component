Ktu.router.ISwitch = Vue.extend({
    template: `
        <div class="comtent">
            <h2>Menu 导航栏</h2>
            <div class="content-item">
                <h3>水平导航</h3>
                <template>
                   <ISwitch></ISwitch>
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
