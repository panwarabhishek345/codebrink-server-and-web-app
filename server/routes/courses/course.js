var express = require("express");
var router = express.Router();

var courseController = require("./../../controllers/courses/course.js");

//Get a Course
router.get("/GetCourse", courseController.getCourse);
//Get all Courses
router.get("/GetAllCourses", courseController.getAllCourses);
//Post a Course
router.post("/PostCourse", courseController.postCourse);
//Delete a Course
router.post("/DeleteCourse", courseController.deleteCourse);
//Add a chapter
router.post("/course/AddChapter", courseController.addChapter);
//Delete a chapter
router.post("/course/DeleteChapter", courseController.deleteChapter);

module.exports = router;
