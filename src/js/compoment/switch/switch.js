Vue.component('ISwitch', {
    template: `
        <span 
            :class="wrapClasses" 
            @click="toggle"         
            @keydown.space="toggle"
        >
            <input type="text" :name="name" type="hidden" :value="currentValue">
            <span :class="innerClasses">
                <slot name="open" v-if="currentValue === trueValue"></slot>
                <slot name="close" v-if="currentValue === falseValue"></slot>
            </span>
        </span>
    `,

    props: {
        value: {
            type: [Boolean, String],
            default: false,
        },
        trueValue: {
            type: [Boolean, String],
            default: true,
        },
        falseValue: {
            type: [Boolean, String],
            default: false,
        },
        disabled: {
            type: [Boolean],
            default: false,
        },
        loading: {
            type: [Boolean],
            default: false,
        },
        name: {
            type: String
        },
        size: {
            validator(value) {
                return Ktu.oneOf(value, ["large", "small", "default"]);
            },
            default: 'default',
        },
    },
    mixins: [Ktu.mixins.emitter],
    data() {
        return {
            currentValue: this.value,
            prefixCls: 'switch',
        }
    },
    computed: {
        wrapClasses() {
            return [
                this.prefixCls,
                {
                    [`${this.prefixCls}-checked`]:
                    this.currentValue === this.trueValue,
                    [`${this.prefixCls}-disabled`]: this.disabled,
                    [`${this.prefixCls}-${this.size}`]: !!this.size,
                    [`${this.prefixCls}-loading`]: this.loading
                }
            ];
        },
        innerClasses() {
            return `${this.prefixCls}-inner`;
        }
    },
    watch: {
        currentValue(val) {
            if (val !== this.trueValue && val !== this.falseValue) {
                throw "Value should be trueValue or falseValue.";
            }
        }
    },
    methods: {
        toggle(event) {
            event.preventDefault();
            if (this.disabled || this.loading) {
                return false;
            }

            const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue;
            this.currentValue = checked;
            this.$emit('on-change', this.currentValue);
            this.$emit('input', this.currentValue);
            this.dispatch("FormItem", "on-form-change", checked);
        }
    }
});
