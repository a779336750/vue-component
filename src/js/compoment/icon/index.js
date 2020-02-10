Vue.component('Icon', {
    template: `
        <i
            :class="classes"
            @click="handleClick"
        >
            <svg
                class="svg-icon"
                :fill="color"
            >
                <use :xlink:href="imageid"></use>
            </svg>
        </i>
    `,
    props: {
        color: String,
        id: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            prefixCls: "icon"
        };
    },
    computed: {
        classes() {
            return [`${this.prefixCls}`];
        },
        imageid() {
            return this.id[0] == "#" ? this.id : "#" + this.id;
        }
    },
    methods: {
        handleClick(event) {
            this.$emit("click", event);
        }
    },
});
