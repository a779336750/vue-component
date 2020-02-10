Vue.component('Submenu', {
    template: `
        <li :class="classes" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
            <div :class="[prefixCls + '-submenu-title']" ref="reference" @click.stop="handleClick" >
                <slot name="title"></slot>
            </div>
            <div :class="[prefixCls + '-dropdown']" v-show="opened">
                <ul :class="[prefixCls + '-drop-list']">
                    <slot></slot>
                </ul>
            </div>
        </li>
    `,
    mixins: [Ktu.mixins.emitter],
    components: {},
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            prefixCls: "menu",
            active: false,
            opened: false,
            menu: Ktu.findComponentUpward(this, 'Menu'),
        };
    },
    computed: {
        mode () {
            return this.menu.mode;
        },
        classes() {
            return [
                `${this.prefixCls}-submenu`,
                {
                    [`${this.prefixCls}-item-active`]:this.active,
                    [`${this.prefixCls}-opened`]: this.opened,
                    [`${this.prefixCls}-submenu-disabled`]: this.disabled,
                    [`${this.prefixCls}-child-item-active`]: this.active
                }
            ];
        },
        accordion() {
            return this.menu.accordion;
        },
    },
    methods: {
        handleMouseenter() {
            if (this.disabled) return;
            if (this.mode === "vertical") return;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.opened = true;
            }, 250);
        },
        handleMouseleave() {
            if (this.disabled) return;
            if (this.mode === "vertical") return;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.opened = false;
            }, 150);
        },
        handleClick() {
            if (this.disabled) return;
            if (this.mode === "horizontal") return;
            const opened = this.opened;
            if (this.accordion) {
                this.$parent.$children.forEach(item => {
                    if (item.$options.name === "Submenu") item.opened = false;
                });
            }
            this.opened = !opened;
        }
    },
    watch: {
        opened(val) {
            if (this.mode === "vertical") return;
        }
    },
    mounted() {
        this.$on("on-update-active", status => {
            this.active = status;
        });
    }
});

