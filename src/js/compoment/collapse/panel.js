Vue.component('Panel', {
    template: `
      <div :class="itemClasses">
        <div :class="headerClasses" @click="toggle">
            <slot></slot>
        </div>
        <div :class="contentClasses" v-show="isActive">
            <div :class="boxClasses"><slot name="content"></slot></div>
        </div>
    </div>
    `,
    name: 'Panel',
    components: {},
    props: {
        name: {
            type: String
        },
        hideArrow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            prefixCls: 'collapse',
            index: 0,
            isActive: false
        };
    },
    computed: {
        itemClasses() {
            return [
                `${this.prefixCls}-item`,
                {
                    [`${this.prefixCls}-item-active`]: this.isActive
                }
            ];
        },
        headerClasses() {
            return `${this.prefixCls}-header`;
        },
        contentClasses() {
            return `${this.prefixCls}-content`;
        },
        boxClasses() {
            return `${this.prefixCls}-content-box`;
        }
    },
    methods: {
        toggle() {
            this.$parent.toggle({
                name: this.name || this.index,
                isActive: this.isActive
            });
        }
    }
});

