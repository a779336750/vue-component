Ktu.mixins = {};
Ktu.mixins.emitter =  {
    methods: {
        //广播所有名为componentName的祖先组件，促发他们的eventName事件
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },

        //递归广播所有名为componentName的子孙组件，促发他们的eventName事件
        emitterBroadcast(componentName, eventName, params) {
            this.$children.forEach(child => {
                const name = child.$options.name;

                if (name === componentName) {
                    child.$emit.apply(child, [eventName].concat(params));
                } else {
                    child.emitterBroadcast(componentName, eventName,params);
                }
            });
        }
    }
};