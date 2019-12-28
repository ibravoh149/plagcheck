const schemaOptions = {
    minimize: false,
    id: false,
    toJSON: {
        getters: true,
        virtuals: true,
        minimize: false,
        versionKey: false,
        retainKeyOrder: true
    },
    toObject: {
        getters: true,
        virtuals: true,
        minimize: false,
        versionKey: false,
        retainKeyOrder: true
    },

    autoIndex: false,
    safe: true,
    timestamps: true,
    usePushEach: true,
    strict: process.env.NODE_ENV !== 'development' // Only use strict in production
};
module.exports = schemaOptions;