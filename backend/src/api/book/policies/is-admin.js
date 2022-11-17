module.exports = async (policyContext, config, { strapi }) => {
    // check if user is admin
    if (policyContext.state.user.isAdmin) {
        // Go to controller's action.
        return true;
    }

    // if not admin block request
    return false;
};