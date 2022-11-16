module.exports = async (policyContext, config, { strapi }) => {
    console.log("Baba no body called me ooo 😌")
    console.log(policyContext.state.user)

    // check if user is admin
    if (policyContext.state.admin) {
        // Go to next policy or will reach the controller's action.
        return true;
    }

    return false;
};