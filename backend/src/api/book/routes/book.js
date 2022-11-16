'use strict';

/**
 * book router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::book.book', {
    config: {
        create: {
            middlewares: [
                (ctx, next) => {
                    let user = ctx.state.user;
                    if (user) ctx.username = ctx.state.user.username
                    return next();
                }
            ]
        },
        update: {
            middlewares: [
                (ctx, next) => {
                    let user = ctx.state.user;
                    if (user) ctx.username = ctx.state.user.username
                    return next()
                }
            ]
        },
        delete: {
            policies: ["is-admin"]
            // middlewares: [
            //     (ctx, next) => {
            //         console.log("omo i be middlewaare they no call me ooo")
            //         let user = ctx.state.user;
            //         // check if user is admin
            //         if (!user.admin) {
            //             return ctx.forbidden("You can not delete this book as you are not an admin!")
            //         }
            //         return next()
            //     }
            // ]
        },
    }
});