
const <%= name %>Model = {
    namespace: '<%= name %>Model',
    state: {},

    subscriptions: {
        init({history, location}) {
            //TODO
        },
        setup({history}) {
            //TODO
        },
    },

    effects: {
        * <%= name %>Func({payload}, {call, put, select}) {
            //TODO
        },

    },
    reducers: {
        saveState(state, {payload},) {
            return {...state, ...payload};
        },

    },

};
export default <%= name %>Model;
