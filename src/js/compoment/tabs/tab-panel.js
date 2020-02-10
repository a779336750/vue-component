Vue.component('TabPanel', {
    template: `
            <div :class="classes" @click.stop="handleClickItem" >
                <div class="title">{{title}}</div>
                <div :class="contentClasses">
                    <slot></slot>
                </div>
            </div>
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
        },
        title: {
            type: [String],
            required: true
        }
    },
    data() {
        return {
            active: false,
            prefixCls: 'tabs',
            tabs: Ktu.findComponentUpward(this, 'Tabs')
        };
    },
    computed: {
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
        contentClasses() {
            return [
                `${this.prefixCls}-content`,
                {
                    [`${this.prefixCls}-content-active`]: this.active,
                }
            ];
        },
    },
    methods: {
        handleClickItem() {
            if (this.disabled) return;
            this.dispatch("Tabs", "on-tab-panel-select", this.name);
        }
    },
    mounted() {
        this.$on("on-update-active-name", name => {
            if (this.name === name) {
                this.active = true;
            } else {
                this.active = false;
            }
        });
    }
});
