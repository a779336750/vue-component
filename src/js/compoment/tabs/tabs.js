Vue.component('Tabs', {
    template: `
        <ul
            :class="classes"
            :style="styles"
        >
            <slot></slot>
        </ul>
    `,
    mixins: [Ktu.mixins.emitter],
    props: {
        //当前激活的选项名字
        activeName: {
            type: [String, Number]
        },
        width: {
            type: String,
            default: "240px"
        }
    },
    data() {
        return {
            //当前激活的选项名字
            currentActiveName: this.activeName,
            prefixCls: 'tabs'
        };
    },
    computed: {
        classes() {
            return [
                `${this.prefixCls}`,
                `${this.prefixCls}-light`,
                `${this.prefixCls}-horizontal`,
            ];
        },
        styles() {
            let style = {};

            return style;
        }
    },
    methods: {
        //更新当前激活的选项
        updateActiveName() {
            if (this.currentActiveName === undefined) {
                this.currentActiveName = -1;
            }
            this.emitterBroadcast("TabPanel","on-update-active-name",this.currentActiveName);
        },
    },
    mounted() {
        this.updateActiveName();
        this.$on("on-tab-panel-select", name => {
            this.currentActiveName = name;
            this.$emit("on-select", name);
        });
    },
    watch: {
        activeName(val) {
            this.currentActiveName = val;
        },
        currentActiveName() {
            this.updateActiveName();
        }
    }
});
