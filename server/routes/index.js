

function initRoutes(app) {
    app.use("/vc4", require("./vc4/feed-route"));
    app.use("/vc4", require("./vc4/article-objects-route"));
    app.use("/vc4", require("./vc4/user-data-route"));
    app.use("/vc4", require("./vc4/courses/chapter"));
    app.use("/vc4", require("./vc4/search-articles-route"));

    app.use(require("./recent-articles-route"));
    app.use(require("./category-objects-route"));
    app.use(require("./article-objects-route"));
    app.use(require("./user-objects-route"));
    app.use(require("./user-data-route"));
    app.use(require("./author-objects-route"));
    app.use(require("./search-articles-route"));
    app.use(require("./feedback-route"));
    app.use(require("./app-data-route"));
    app.use(require("./author/auth"));
    app.use(require("./author/article-objects"));
    app.use(require("./admin/article-objects"));
    app.use(require("./courses/chapter"));
    app.use(require("./courses/course-category"));
    app.use(require("./courses/course"));
    app.use(require("./homepage"));
}

module.exports = initRoutes;
