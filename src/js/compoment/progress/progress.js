
Vue.component('Progress', {
    template: `
        <div :class="wrapClasses">
            <div :class="outerClasses">
                <div :class="innerClasses">
                    <div
                        :class="bgClasses"
                        :style="bgStyle"
                    >
                        <div
                            class="progress-inner-text"
                            v-if="textInside"
                        >{{ percent }}%</div>
                    </div>
                    <div
                        :class="successBgClasses"
                        :style="successBgStyle"
                    ></div>
                </div>
            </div>
            <span
                v-if="!hideInfo && !textInside"
                :class="textClasses"
            >
                <slot>
                    <span
                        v-if="isStatus"
                        :class="textInnerClasses"
                    >
                        <Icon :id="statusIcon"></Icon>
                    </span>
                    <span
                        v-else
                        :class="textInnerClasses"
                    >
                        {{ percent }}%
                    </span>
                </slot>
            </span>
        </div>
    `,
    props: {
        percent: {
            type: Number,
            default: 0
        },
        successPercent: {
            type: Number,
            default: 0
        },
        status: {
            validator(value) {
                return Ktu.oneOf(value, ["normal", "active", "wrong", "success"]);
            },
            default: "normal"
        },
        hideInfo: {
            type: Boolean,
            default: false
        },
        strokeWidth: {
            type: Number,
            default: 10
        },
        vertical: {
            type: Boolean,
            default: false
        },
        strokeColor: {
            type: [String, Array]
        },
        textInside: {
            type: Boolean,
            default: false
        }
    },
    mixins: [Ktu.mixins.emitter],
    data() {
        return {
            prefixCls: 'progress',
            currentStatus: this.status
        }
    },
    computed: {
        isStatus() {
            return (
                this.currentStatus == "wrong" || this.currentStatus == "success"
            );
        },
        statusIcon() {
            let type = "";
            switch (this.currentStatus) {
                case "wrong":
                    type = "ios-close-circle";
                    break;
                case "success":
                    type = "ios-checkmark-circle";
                    break;
            }

            return type;
        },
        bgStyle() {
            const style = this.vertical
                ? {
                    height: `${this.percent}%`,
                    width: `${this.strokeWidth}px`
                }
                : {
                    width: `${this.percent}%`,
                    height: `${this.strokeWidth}px`
                };

            if (this.strokeColor) {
                if (typeof this.strokeColor === "string") {
                    style["background-color"] = this.strokeColor;
                } else {
                    style["background-image"] = `linear-gradient(to right, ${
                        this.strokeColor[0]
                    } 0%, ${this.strokeColor[1]} 100%)`;
                }
            }

            return style;
        },
        successBgStyle() {
            return this.vertical
                ? {
                    height: `${this.successPercent}%`,
                    width: `${this.strokeWidth}px`
                }
                : {
                    width: `${this.successPercent}%`,
                    height: `${this.strokeWidth}px`
                };
        },
        wrapClasses() {
            return [
                `${this.prefixCls}`,
                `${this.prefixCls}-${this.currentStatus}`,
                {
                    [`${this.prefixCls}-show-info`]:
                    !this.hideInfo && !this.textInside,
                    [`${this.prefixCls}-vertical`]: this.vertical
                }
            ];
        },
        textClasses() {
            return `${this.prefixCls}-text`;
        },
        textInnerClasses() {
            return `${this.prefixCls}-text-inner`;
        },
        outerClasses() {
            return `${this.prefixCls}-outer`;
        },
        innerClasses() {
            return `${this.prefixCls}-inner`;
        },
        bgClasses() {
            return `${this.prefixCls}-bg`;
        },
        successBgClasses() {
            return `${this.prefixCls}-success-bg`;
        }
    },
    created() {
        this.handleStatus();
    },
    methods: {
        handleStatus(isDown) {
            if (isDown) {
                this.currentStatus = "normal";
                this.$emit("on-status-change", "normal");
            } else {
                if (parseInt(this.percent, 10) == 100) {
                    this.currentStatus = "success";
                    this.$emit("on-status-change", "success");
                }
            }
        },

    },
    watch:{
        percent(val, oldVal) {
            if (val < oldVal) {
                this.handleStatus(true);
            } else {
                this.handleStatus();
            }
        },
        status(val) {
            this.currentStatus = val;
        }
    }
});
