Vue.component('MenuItem', {
    template: `
        <a :class="classes" @click.stop="handleClickItem" :style="itemStyle">
            <slot></slot>
        </a>
    `,
    mixins: [Ktu.mixins.emitter],
    props: {
        name: {
            type: [String, Number],
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            active: false,
            prefixCls: 'menu',
            menu: Ktu.findComponentUpward(this, 'Menu')
        };
    },
    computed: {
        hasParentSubmenu() {
            return !!Ktu.findComponentUpward(this, 'Submenu');
        },
        parentSubmenuNum() {
            return Ktu.findComponentsUpward(this, 'Submenu').length;
        },
        mode() {
            return this.menu.mode;
        },
        classes() {
            return [
                `${this.prefixCls}-item`,
                {
                    [`${this.prefixCls}-item-active`]: this.active,
                    [`${this.prefixCls}-item-selected`]: this.active,
                    [`${this.prefixCls}-item-disabled`]: this.disabled
                }
            ];
        },
        itemStyle() {
            return this.hasParentSubmenu && this.mode !== "horizontal"
                ? {
                    paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + "px"
                }
                : {};
        }
    },
    methods: {
        handleClickItem() {
            if (this.disabled) return;
            this.dispatch("Menu", "on-menu-item-select", this.name);
        }
    },
    mounted() {
        this.$on("on-update-active-name", name => {
            if (this.name === name) {
                this.active = true;
                this.dispatch("Submenu", "on-update-active", true);
            } else {
                this.active = false;
            }
        });
    }
});
