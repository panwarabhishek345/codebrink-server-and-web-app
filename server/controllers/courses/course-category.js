var { CourseCategory } = require("./../../models/Courses/CourseCategory");

module.exports.postCourseCategory = (req, res) => {
  var newCourseCategory = new CourseCategory({
    name: req.body.name,
    desc: req.body.desc,
    courseCategoryImage: req.body.courseCategoryImage
  });

  newCourseCategory.save().then(
    courseCategory => {
      res.send(courseCategory);
    },
    err => {
      console.log("Unable to create the Course Category ", err);
      res.status(400).send("Unable to create the Course Category " + err);
    }
  );
};

module.exports.getCourseCategory = (req, res) => {
  let courseCategoryId = req.header("courseCategoryId");
  if (!courseCategoryId)
    res.status(400).send("Please provide the Course Category id.");

  CourseCategory.findOne({ _id: courseCategoryId })
    .populate("courses", "name")
    .then(
      courseCategory => {
        if (!courseCategory) return res.send("No Course Category found!");
        return res.send(courseCategory);
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the Course Category. " + e);
      }
    );
};

module.exports.getAllCourseCategories = (req, res) => {
  CourseCategory.find()
    .populate({
      path: "courses",
      match: { status: { $ne: "private" } },
      select: "name courseImage status",
      populate: { path: "chapters", select: "name" }
    })
    .then(
      courseCategories => {
        if (!courseCategories) return res.send("No Course Categories found!");
        return res.send(courseCategories);
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the Course Categories. " + e);
      }
    );
};

module.exports.addCourse = (req, res) => {
  let courseCategoryId = req.header("courseCategoryId");
  let courseId = req.header("courseId");
  let index = req.header("index");

  if (!courseCategoryId || !courseId || !index)
    res
      .status(400)
      .send("Course Category id or Course id or index is missing.");

  CourseCategory.findOne({ _id: courseCategoryId }).then(
    courseCategory => {
      if (!courseCategory) return res.send("No Course Category found!");

      let courses = courseCategory.courses;
      let i = courses.indexOf(courseId);
      if (i == -1) {
        if (index > courses.length)
          return res
            .status(401)
            .send("index is greater than the courses array length");
        else {
          if (index == -1) courses.push(courseId);
          else courses.splice(index, 0, courseId);
          courseCategory
            .save()
            .then(courseCategorySaved => {
              return res.send(courseCategorySaved);
            })
            .catch(err => {
              console.log(
                "Error while saving the Course Category after adding a Course " +
                  err
              );
              res.status(401).send(err);
            });
        }
      } else {
        return res.send(
          "Course already exists in the Course Category please delete it first."
        );
      }
    },
    e => {
      return res
        .status(401)
        .send("Error occurred while finding the Course Category. " + e);
    }
  );
};

module.exports.deleteCourse = (req, res) => {
  let courseCategoryId = req.header("courseCategoryId");
  let courseId = req.header("courseId");

  if (!courseCategoryId || !courseId)
    res.status(400).send("Course Category Id or Course Id is missing.");

  CourseCategory.findOne({ _id: courseCategoryId }).then(
    courseCategory => {
      if (!courseCategory) return res.send("Course Category not found!");

      let courses = courseCategory.courses;
      let i = courses.indexOf(courseId);
      if (i == -1) {
        return res.send("Course doesnt exist in this Course Category.");
      } else {
        courses.splice(i, 1);
        courseCategory
          .save()
          .then(courseCategorySaved => {
            return res.send(courseCategorySaved);
          })
          .catch(err => {
            console.log(
              "Error while saving the Course Category after deleting a Course " +
                err
            );
            res.status(401).send(err);
          });
      }
    },
    e => {
      return res
        .status(401)
        .send("Error occurred while finding the Course Category. " + e);
    }
  );
};
