const { oneOf, calcTextareaHeight } = Ktu;
Vue.component('Input', {
    template: `
        <div :class="wrapClasses">
            <template v-if="type !== 'textarea'">
                <!-- 输入框的前缀内容，可以是图标，选择框等等等 -->
                <div
                    :class="[prefixCls + '-group-prepend']"
                    v-if="prepend"
                    v-show="slotReady"
                >
                    <slot name="prepend"></slot>
                </div>

                <!-- 清除按钮 -->
                <icon
                    id="#svg-close-2"
                    :class="[prefixCls + '-icon', prefixCls + '-icon-clear' , prefixCls + '-icon-normal']"
                    v-if="clearable && currentValue && !disabled"
                    @click="handleClear"
                ></icon>
                <!-- 调用时传递进来的按钮 -->
                <icon
                    id="#svg-time-picker"
                    :class="[prefixCls + '-icon', prefixCls + '-icon-normal']"
                    v-else-if="icon"
                    @click="handleIconClick"
                ></icon>
                <!-- 前置的搜索按钮 -->
                <icon
                    id="#svg-search"
                    :class="[prefixCls + '-icon', prefixCls + '-icon-normal', prefixCls + '-search-icon']"
                    v-else-if="search && enterButton === false"
                    @click="handleSearch"
                ></icon>

                <!-- 前置-在调用时通过属性传递进来的 -->
                <span
                    class="input-suffix"
                    v-else-if="showSuffix"
                >
                    <slot name="suffix">
                        <icon
                            :id="'#'+suffix"
                            :class="[prefixCls + '-icon', prefixCls + '-icon-' + suffix]"
                            v-if="suffix"
                        ></icon>
                    </slot>
                </span>

                <!-- 加载图标，不知道有什么用 -->
                <!-- <transition name="fade">
                    <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop" :class="[prefixCls + '-icon', prefixCls + '-icon-validate']" v-if="!icon"></i>
                </transition> -->

                <input
                    :id="elementId"
                    :autocomplete="autocomplete"
                    :spellcheck="spellcheck"
                    ref="input"
                    :type="type"
                    :class="inputClasses"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :maxlength="maxlength"
                    :readonly="readonly"
                    :name="name"
                    :value="currentValue"
                    :number="number"
                    :autofocus="autofocus"
                    @keyup.enter="handleEnter"
                    @keyup="handleKeyup"
                    @keypress="handleKeypress"
                    @keydown="handleKeydown"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @compositionstart="handleComposition"
                    @compositionupdate="handleComposition"
                    @compositionend="handleComposition"
                    @input="handleInput"
                    @change="handleChange"
                >

                <!-- 输入框后置内容，可以是图标，选择框等等等 -->
                <div
                    :class="[prefixCls + '-group-append']"
                    v-if="append"
                    v-show="slotReady"
                >
                    <slot name="append"></slot>
                </div>

                <!-- 后置的搜索按钮 -->
                <div
                    :class="[prefixCls + '-group-append', prefixCls + '-search']"
                    v-else-if="search && enterButton"
                    @click="handleSearch"
                >
                    <icon
                        id="#svg-search"
                        :class="[prefixCls + '-icon', prefixCls + '-search-icon']"
                        v-if="enterButton === true"
                    ></icon>
                    <template v-else>{{ enterButton }}</template>
                </div>
                <!-- 后置-在调用时通过属性传递进来的 -->
                <span
                    class="input-prefix"
                    v-else-if="showPrefix"
                >
                    <slot name="prefix">
                        <icon
                            :id="'#'+prefix"
                            :class="[prefixCls + '-icon', prefixCls + '-icon-' + prefix]"
                            v-if="prefix"
                        ></icon>
                    </slot>
                </span>

            </template>
            <textarea
                v-else
                :id="elementId"
                :wrap="wrap"
                :autocomplete="autocomplete"
                :spellcheck="spellcheck"
                ref="textarea"
                :class="textareaClasses"
                :style="textareaStyles"
                :placeholder="placeholder"
                :disabled="disabled"
                :rows="rows"
                :maxlength="maxlength"
                :readonly="readonly"
                :name="name"
                :value="currentValue"
                :autofocus="autofocus"
                @keyup.enter="handleEnter"
                @keyup="handleKeyup"
                @keypress="handleKeypress"
                @keydown="handleKeydown"
                @focus="handleFocus"
                @blur="handleBlur"
                @compositionstart="handleComposition"
                @compositionupdate="handleComposition"
                @compositionend="handleComposition"
                @input="handleInput"
            >
            </textarea>
        </div>
    `,
    props: {
        type: {
            validator(value) {
                return oneOf(value, [
                    "text",
                    "textarea",
                    "password",
                    "url",
                    "email",
                    "date",
                    "number",
                    "tel"
                ]);
            },
            default: "text"
        },
        value: {
            type: [String, Number],
            default: ""
        },
        size: {
            validator(value) {
                return oneOf(value, ["small", "large", "default"]);
            },
            default() {
                return !this.$IVIEW || this.$IVIEW.size === ""
                    ? "default"
                    : this.$IVIEW.size;
            }
        },
        placeholder: {
            type: String,
            default: ""
        },
        maxlength: {
            type: Number
        },
        disabled: {
            type: Boolean,
            default: false
        },
        icon: String,
        autosize: {
            type: [Boolean, Object],
            default: false
        },
        rows: {
            type: Number,
            default: 2
        },
        readonly: {
            type: Boolean,
            default: false
        },
        name: {
            type: String
        },
        number: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        spellcheck: {
            type: Boolean,
            default: false
        },
        autocomplete: {
            validator(value) {
                return oneOf(value, ["on", "off"]);
            },
            default: "off"
        },
        clearable: {
            type: Boolean,
            default: false
        },
        elementId: {
            type: String
        },
        wrap: {
            validator(value) {
                return oneOf(value, ["hard", "soft"]);
            },
            default: "soft"
        },
        prefix: {
            type: String,
            default: ""
        },
        suffix: {
            type: String,
            default: ""
        },
        search: {
            type: Boolean,
            default: false
        },
        enterButton: {
            type: [Boolean, String],
            default: false
        }
    },
    data() {
        return {
            prefixCls: 'input',
            currentValue: this.value,
            prepend: true,
            append: true,
            slotReady: false,
            textareaStyles: {},
            showPrefix: false,
            showSuffix: false,
            isOnComposition: false
        };
    },
    computed: {
        wrapClasses() {
            return [
                `${prefixCls}-wrapper`,
                {
                    [`${prefixCls}-wrapper-${this.size}`]: !!this.size,
                    [`${prefixCls}-type`]: this.type,
                    [`${prefixCls}-group`]:
                        this.prepend ||
                        this.append ||
                        (this.search && this.enterButton),
                    [`${prefixCls}-group-${this.size}`]:
                        (this.prepend ||
                            this.append ||
                            (this.search && this.enterButton)) &&
                        !!this.size,
                    [`${prefixCls}-group-with-prepend`]: this.prepend,
                    [`${prefixCls}-group-with-append`]:
                        this.append || (this.search && this.enterButton),
                    [`${prefixCls}-hide-icon`]: this.append, // #554
                    [`${prefixCls}-with-search`]:
                        this.search && this.enterButton
                }
            ];
        },
        inputClasses() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-${this.size}`]: !!this.size,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-with-prefix`]: this.showPrefix,
                    [`${prefixCls}-with-suffix`]:
                        this.showSuffix ||
                        (this.search && this.enterButton === false)
                }
            ];
        },
        textareaClasses() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-disabled`]: this.disabled
                }
            ];
        }
    },
    methods: {
        handleEnter(event) {
            this.$emit("on-enter", event);
            if (this.search) this.$emit("on-search", this.currentValue);
        },
        handleKeydown(event) {
            this.$emit("on-keydown", event);
        },
        handleKeypress(event) {
            this.$emit("on-keypress", event);
        },
        handleKeyup(event) {
            this.$emit("on-keyup", event);
        },
        handleIconClick(event) {
            this.$emit("on-click", event);
        },
        handleFocus(event) {
            this.$emit("on-focus", event);
            console.log();
            // self.$el.select();
            this.$nextTick(() => {
                if (this.type === "textarea") {
                    this.$refs.textarea.select();
                } else {
                    this.$refs.input.select();
                }
            });
        },
        handleBlur(event) {
            this.$emit("on-blur", event);
        },
        handleComposition(event) {
            if (event.type === "compositionstart") {
                this.isOnComposition = true;
            }
            if (event.type === "compositionend") {
                this.isOnComposition = false;
                this.handleInput(event);
            }
        },
        handleInput(event) {
            if (this.isOnComposition) return;

            let value = event.target.value;
            if (this.number && value !== "")
                value = Number.isNaN(Number(value)) ? value : Number(value);
            this.$emit("input", value);
            this.setCurrentValue(value);
            this.$emit("on-change", event);
        },
        handleChange(event) {
            this.$emit("on-input-change", event);
        },
        setCurrentValue(value) {
            if (value === this.currentValue) return;
            this.$nextTick(() => {
                this.resizeTextarea();
            });
            this.currentValue = value;
        },
        resizeTextarea() {
            const autosize = this.autosize;
            if (!autosize || this.type !== "textarea") {
                return false;
            }

            const minRows = autosize.minRows;
            const maxRows = autosize.maxRows;

            this.textareaStyles = calcTextareaHeight(
                this.$refs.textarea,
                minRows,
                maxRows
            );
        },
        focus() {
            if (this.type === "textarea") {
                this.$refs.textarea.focus();
            } else {
                this.$refs.input.focus();
            }
        },
        blur() {
            if (this.type === "textarea") {
                this.$refs.textarea.blur();
            } else {
                this.$refs.input.blur();
            }
        },
        handleClear() {
            const e = { target: { value: "" } };
            this.$emit("input", "");
            this.setCurrentValue("");
            this.$emit("on-change", e);
        },
        handleSearch() {
            if (this.disabled) return false;
            this.$refs.input.focus();
            this.$emit("on-search", this.currentValue);
        }
    },
    watch: {
        value(val) {
            this.setCurrentValue(val);
        }
    },
    mounted() {
        if (this.type !== "textarea") {
            this.prepend = this.$slots.prepend !== undefined;
            this.append = this.$slots.append !== undefined;
            this.showPrefix =
                this.prefix !== "" || this.$slots.prefix !== undefined;
            this.showSuffix =
                this.suffix !== "" || this.$slots.suffix !== undefined;
        } else {
            this.prepend = false;
            this.append = false;
        }
        this.slotReady = true;
        this.resizeTextarea();
    }
});
