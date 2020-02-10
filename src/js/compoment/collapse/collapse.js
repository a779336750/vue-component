Vue.component('Collapse', {
    template: `
        <div :class="classes">
            <slot></slot>
        </div>
    `,
    props: {
        accordion: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Array, String]
        },
    },
    data () {
        return {
            prefixCls: 'collapse',
            currentValue: this.value//由于props不允许直接修改，因此使用currentValue进行代理
        };
    },
    computed: {
        classes () {
            return [
                `${this.prefixCls}`,
            ];
        }
    },
    mounted () {
        this.setActive();
    },
    methods: {
        //设置当前激活的panel
        setActive () {

            //获取当前激活的panel对应的name数组
            const activeKey = this.getActiveKey();

            this.$children.forEach((child, index) => {
                const name = child.name || index.toString();
                child.isActive = activeKey.indexOf(name) > -1;
                child.index = index;
            });
        },

        //获取当前激活的panel对应的key数组
        getActiveKey () {
            let activeKey = this.currentValue || [];
            const accordion = this.accordion;

            if (!Array.isArray(activeKey)) {
                activeKey = [activeKey];
            }

            //手风琴激活第一个panel
            if (accordion && activeKey.length > 1) {
                activeKey = [activeKey[0]];
            }

            //转为字符串
            for (let i = 0; i < activeKey.length; i++) {
                activeKey[i] = activeKey[i].toString();
            }

            return activeKey;
        },

        //暴露的切换方法，用于给penel组件调用
        /**
         *
         * @param data
         * data: {
         *     name: xxx,
         *     isActive: xxx
         * }
         */
        toggle (data) {
            const name = data.name.toString();
            let newActiveKey = [];

            //判断是否是手风琴，是的话只push当前选择的面板name
            if (this.accordion) {
                if (!data.isActive) {
                    newActiveKey.push(name);
                }
            } else {
                let activeKey = this.getActiveKey();
                const nameIndex = activeKey.indexOf(name);

                //若当前面板已激活，则取消激活，反之激活
                if (data.isActive) {
                    if (nameIndex > -1) {
                        activeKey.splice(nameIndex, 1);
                    }
                } else {
                    if (nameIndex < 0) {
                        activeKey.push(name);
                    }
                }

                newActiveKey = activeKey;
            }

            //通知调用者当前激活的key，应用于v-modal指令
            this.$emit('input', newActiveKey);

            // this.$emit('on-change', newActiveKey);
        }
    },
    watch: {
        value (val) {
            this.currentValue = val;
        },
        currentValue () {
            this.setActive();
        }
    }
});
