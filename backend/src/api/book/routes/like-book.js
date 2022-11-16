module.exports = {
    routes: [
        {
            method: "PUT",
            path: "/books/:id/like",
            handler: "book.likeBook",
            config: {
                middlewares: [
                    (ctx, next) => {
                        let user = ctx.state.user;
                        if (user) ctx.username = ctx.state.user.username
                        return next();
                    }
                ]
            }
        }
    ]
}