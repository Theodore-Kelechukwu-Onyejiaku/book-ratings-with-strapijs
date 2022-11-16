'use strict';

/**
 * book controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', ({ strapi }) => ({

    async likeBook(ctx) {
        let { id } = ctx.params;

        // get the book 
        const book = await strapi.service('api::book.book').findOne(id)

        // if book does not exist
        if (!book) {
            return ctx.badRequest("book does not exist", { details: "This book was not found" })
        }

        // update function
        const updateFunction = async (whoLiked) => {
            let entity = await strapi.service('api::book.book').update(id, { data: { likes: whoLiked } })
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return this.transformResponse(sanitizedEntity)
        }

        // if no existing likes
        if (book.likes == null || book.likes.length == 0) {
            let peopleWhoLiked = [];
            peopleWhoLiked.push(ctx.username);
            return updateFunction(peopleWhoLiked)

        }
        // if user already liked 
        else if (book.likes.includes(ctx.username)) {
            let peopleWhoLiked = book.likes
            let index = peopleWhoLiked.indexOf(ctx.username)
            if (index > -1) {
                peopleWhoLiked.splice(index, 1)
            }
            return updateFunction(peopleWhoLiked)
        }
        // new like
        else {
            let peopleWhoLiked = book.likes
            peopleWhoLiked.push(ctx.username)
            return updateFunction(peopleWhoLiked)
        }
    },

    async create(ctx) {
        const { data } = ctx.request.body;
        data.creator = ctx.username

        let entity = await strapi.service('api::book.book').create({ data });
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity)
    },

    async update(ctx) {
        let { id } = ctx.params;

        // get the book 
        const book = await strapi.service('api::book.book').findOne(id)

        // if book does not exist
        if (!book) {
            return ctx.badRequest("book does not exist", { details: "This book was not found" })
        }

        // if book belongs to this user
        if (book.creator !== ctx.username) {
            return ctx.forbidden("You cannot update this book", { details: "This book does not belong to you" })
        }

        let entity = await strapi.service('api::book.book').update(id, ctx.request.body)
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity)
    },

    async delete(ctx) {
        console.log("omo they no call me oo")
        let { id } = ctx.params;

        // get the book 
        const book = await strapi.service('api::book.book').findOne(id)

        // if book does not exist
        if (!book) {
            return ctx.badRequest("book does not exist", { details: "This book was not found" })
        }

        let entity = await strapi.service('api::book.book').delete(id)
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity)
    }
}));
