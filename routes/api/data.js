const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const auth = require("../../middleware/auth");

const Form = require("../../models/Form");
const User = require("../../models/User");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   },
// });
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/png" || file.mimetype === "image/jpeg")
//     cb(null, true);
//   else cb(new Error("Invalid File Type"), false);
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// @type=GET
// @path=/api/user
// @access=private

router.get("/", auth, (req, res) => {
  Form.find({})
    .then((foundData) => {
      res.status(200).json(foundData);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error" });
    });
});

router.get("/:placeName", auth, (req, res) => {
  Form.find({ placeName: req.params.placeName })
    .then((foundData) => {
      res.status(200).json(foundData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// @type=POST
// @path=/api/user
// @access=private

// router.post("/:profileId", auth, (req, res) => {
//   upload.single("image")(req, res, function (err) {
//     if (err)
//       res.status(400).json({
//         message: "Invalid File type.Please Check the file before uploading",
//       });
//     else {
//       const placeName = req.body.place;
//       const description = req.body.desc;
//       const img = !req.file ? null : req.file.path;

//       if (!placeName || !description || !img) {
//         res.status(400).json({ message: "Please Enter all fields" });
//       }

//       User.findById(req.user.id)
//         .then((foundData) => {
//           return foundData.name;
//         })
//         .then((name) => {
//           const newFormData = new Form({
//             name: name,
//             placeName: placeName,
//             description: description,
//             img: img,
//           });

//           newFormData
//             .save()
//             .then((data) => {
//               return User.findOneAndUpdate(
//                 { _id: req.params.profileId },
//                 { $push: { images: data._id } },
//                 { new: true }
//               );
//             })
//             .then((data) => {
//               res.status(200).json({ data: data });
//             })
//             .catch(() => {
//               res
//                 .status(404)
//                 .json({ message: "Error Occured in submitting the form" });
//             });
//         });
//     }
//   });
// });

router.post("/:profileId", auth, (req, res) => {
  const place = req.body.place;
  const desc = req.body.desc;
  if (req.files === null || !place || !desc)
    return res.status(400).json({ message: "Please fill up all the fields" });
  else {
    if (
      req.files.image.mimetype === "image/jpeg" ||
      req.files.image.mimetype === "image/png"
    ) {
      const file = req.files.image;
      file.mv(`${(__dirname, "../")}/server/uploads/${file.name}`, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }

        User.findById(req.user.id)
          .then((foundData) => {
            return foundData.name;
          })
          .then((name) => {
            const newFormData = new Form({
              name: name,
              placeName: place,
              description: desc,
              img: `uploads/${file.name}`,
            });

            newFormData
              .save()
              .then((data) => {
                return User.findOneAndUpdate(
                  { _id: req.params.profileId },
                  { $push: { images: data._id } },
                  { new: true }
                );
              })
              .then((data) => {
                res.status(200).json({ message: "Successfully Submitted" });
              })
              .catch(() => {
                res.status(404).json({
                  message:
                    "Error Occured in submitting the form.PLease try again later",
                });
              });
          });
      });
    } else
      return res.status(400).json({ message: "Please Check the file format" });
  }
});

// router.post("/:profileId", (req, res) => {
//   console.log(req.body.placeName);
//   const place = req.body.placeName;
//   const desc = req.body.description;
//   const image = req.body.image;

//   if (!place || !desc || !image) {
//     return res.status(400).json({ message: "Please fill up all the fields" });
//   }

//   // User.findById(req.params.profileId).then((data) => console.log(data));

//   User.findById(req.params.profileId)
//     .then((foundUser) => {
//       return foundUser.name;
//     })
//     .then((name) => {
//       const newFormData = new Form({
//         name: name,
//         placeName: place,
//         description: desc,
//         img: image,
//       });

//       newFormData.save().then((data) => {
//         // console.log(data);
//         return User.findOneAndUpdate(
//           { _id: req.params.profileId },
//           { $push: { images: data._id } },
//           { new: true }
//         )
//           .then((data) => {
//             console.log(data);
//             res.status(200).json({ message: "Submitted Successfully" });
//           })
//           .catch((err) => {
//             res.status(404).json({ message: "Error!!" });
//           });
//       });
// });

//     newFormData.save().then((data) => {
//       console.log(data);
//       // return User.findOneAndUpdate(
//       //   { _id: req.params.profileId },
//       //   { $push: { images: data._id } },
//       //   { new: true }
//       // )
//       //   .then((data) => {
//       //     res.status(200).json({ message: "Submitted Successfully!!" });
//       //   })
//       //   .catch((err) => {
//       //     res.status(404).json({
//       //       message:
//       //         "Error Occured in submitting the form.PLease try again later",
//       //     });
//       //   });
//     });
// });

router.delete("/:id", auth, (req, res) => {
  const id = req.params.id;
  const profileId = req.user.id;

  Form.findByIdAndDelete(id, (err) => {
    if (err) res.status(404).json({ message: "Error in Deleting the Item" });
    else res.status(200).json({ message: "Item Deleted Successfully!!" });
  });

  // Form.findByIdAndDelete(id)
  // .then((deletedData)=>{
  //   return User.findById(id)
  // })
  // .then((user)=>{
  //   user.findByIdAndDelete()
  // })

  // User.findById(profileId)
  //   .then((userId) => {
  //     console.log(userId);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // User.findById(profileId)
  //   .then((user) => {
  //     user.images.pull({ _id: id });
  //     console.log("Item delete successfully!!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // User.findByIdAndUpdate(
  //   profileId,
  //   { $pull: { images: { _id: id } } },
  //   function (err, model) {
  //     if (err) {
  //       console.log(err);
  //       return res.json(err);
  //     }
  //     return res.json(model);
  //   }
  // );
});

module.exports = router;
