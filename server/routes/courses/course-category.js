var express = require("express");
var router = express.Router();

var courseCategoryController = require("./../../controllers/courses/course-category");

//Get a Category
router.get("/GetCourseCategory", courseCategoryController.getCourseCategory);
//Get all Categories
router.get(
  "/GetAllCourseCategories",
  courseCategoryController.getAllCourseCategories
);
//Post a Category
router.post("/PostCourseCategory", courseCategoryController.postCourseCategory);
//Add a course to a Category
router.post("/course_category/AddCourse", courseCategoryController.addCourse);
//Delete an course from a Category
router.post(
  "/course_category/DeleteCourse",
  courseCategoryController.deleteCourse
);

module.exports = router;
