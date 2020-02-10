Ktu.router.Compoment = Vue.extend({
    name: 'Compoment',
    template: `
        <div class="comp-view">
            <div class="comp-nav">
                <ul class="nav-list">
                    <li
                        class="nav-item"
                        :class="{'active' : index === active }"
                        v-for="(item,index) in routerList"
                        :key="item.key"
                        @click="change( index )"
                    >
                        <span v-text="item.name"></span>
                    </li>
                </ul>
            </div>

            <div class="comp-content">
                <router-view></router-view>
            </div>
        </div>
    `,
    data() {
        return {
            routerList: Ktu.config.router,
            active: -1,
            parentPath: "/Components/",
        };
    },
    created() {
    },
    computed: {

    },
    watch: {

    },
    mounted() {
        this.change(0);
    },
    methods: {
        change(index) {
            if (index != this.active) {
                const item = this.routerList[index];
                const key = item.key;
                let path = this.parentPath + key;

                this.$router.push({
                    path: path
                });

                this.active = index;
            }
        }
    }
});
