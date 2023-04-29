var { Course } = require("./../../models/Courses/Course");

module.exports.postCourse = (req, res) => {
  var newCourse = new Course({
    name: req.body.name,
    desc: req.body.desc,
    courseImage: req.body.courseImage,
    status: "draft",
    tags: req.body.tags,
    rating: 0
  });

  newCourse.save().then(
    course => {
      res.send(course);
    },
    err => {
      console.log("Unable to create the Course ", err);
      res.status(400).send("Unable to create the Course " + err);
    }
  );
};

module.exports.deleteCourse = (req, res) => {
  let courseId = req.header("courseId");

  if (!courseId) {
    return res.status(400).send("Please specify the courseId.");
  }

  Course.findOneAndDelete({ _id: courseId })
    .then(removed => {
      Course.removeRefs(courseId);
      return res.send("Course Removed Successfully.");
    })
    .catch(err => {
      console.log(err);
      return res
        .status(401)
        .send("Error Occurred while deleting the Course. " + err);
    });
};

module.exports.getCourse = (req, res) => {
  let courseId = req.header("courseId");
  if (!courseId) res.status(400).send("Please provide the Course id.");

  Course.findOne({ _id: courseId }).then(
    course => {
      if (!course) return res.send("No course found!");
      return res.send(course);
    },
    e => {
      return res
        .status(401)
        .send("Error occurred while finding the course. " + e);
    }
  );
};

module.exports.getAllCourses = (req, res) => {
  Course.find()
    .populate("chapters", "name")
    .then(
      courses => {
        if (!courses) return res.send("No courses found!");
        return res.send(courses);
      },
      e => {
        return res
          .status(401)
          .send("Error occurred while finding the courses. " + e);
      }
    );
};

module.exports.addChapter = (req, res) => {
  let chapterId = req.header("chapterId");
  let courseId = req.header("courseId");
  let index = req.header("index");

  if (!chapterId || !courseId || !index)
    res.status(400).send("Course id or Chapter id or index is missing.");

  Course.findOne({ _id: courseId }).then(
    course => {
      if (!course) return res.send("No course found!");

      let chapters = course.chapters;
      let i = chapters.indexOf(chapterId);
      if (i == -1) {
        if (index > chapters.length)
          return res
            .status(401)
            .send("index is greater than the chapter array length");
        else {
          if (index == -1) chapters.push(chapterId);
          else chapters.splice(index, 0, chapterId);
          course
            .save()
            .then(courseSaved => {
              return res.send(courseSaved);
            })
            .catch(err => {
              console.log(
                "Error while saving the course after adding a chapter " + err
              );
              res.status(401).send(err);
            });
        }
      } else {
        return res.send("Chapter already exists please delete it first.");
      }
    },
    e => {
      return res
        .status(401)
        .send("Error occurred while finding the course. " + e);
    }
  );
};

module.exports.deleteChapter = (req, res) => {
  let chapterId = req.header("chapterId");
  let courseId = req.header("courseId");

  if (!chapterId || !courseId)
    res.status(400).send("Course id or Chapter id is missing.");

  Course.findOne({ _id: courseId }).then(
    course => {
      if (!course) return res.send("Course not found!");

      let chapters = course.chapters;
      let i = chapters.indexOf(chapterId);
      if (i == -1) {
        return res.send("Chapter doesnt exist in this course.");
      } else {
        chapters.splice(i, 1);
        course
          .save()
          .then(courseSaved => {
            return res.send(courseSaved);
          })
          .catch(err => {
            console.log(
              "Error while saving the course after deleting a chapter " + err
            );
            res.status(401).send(err);
          });
      }
    },
    e => {
      return res
        .status(401)
        .send("Error occurred while finding the course. " + e);
    }
  );
};
