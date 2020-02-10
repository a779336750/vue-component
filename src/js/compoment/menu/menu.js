Vue.component('Menu', {
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
        mode: {
            validator(value) {
                return Ktu.oneOf(value, ["horizontal", "vertical"]);
            },
            default: "vertical"
        },
        //当前激活的选项名字n
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
            prefixCls: 'menu'
        };
    },
    computed: {
        classes() {
            return [
                `${this.prefixCls}`,
                `${this.prefixCls}-light`,
                {
                    [`${this.prefixCls}-${this.mode}`]: this.mode
                }
            ];
        },
        styles() {
            let style = {};

            if (this.mode === "vertical") style.width = this.width;

            return style;
        }
    },
    methods: {
        //更新当前激活的选项
        updateActiveName() {
            if (this.currentActiveName === undefined) {
                this.currentActiveName = -1;
            }
            this.emitterBroadcast("Submenu", "on-update-active", false);
            this.emitterBroadcast("MenuItem","on-update-active-name",this.currentActiveName);
        },
    },
    mounted() {
        this.updateActiveName();
        this.$on("on-menu-item-select", name => {
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
