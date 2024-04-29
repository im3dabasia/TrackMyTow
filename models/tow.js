const mongoose = require("mongoose");

const towSessionSchema = new mongoose.Schema({
  linkId: {
    type: String,
    required: true,
    unique: false,
  },
  policeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  towedVehicles: [
    {
      numberPlate: {
        type: String,
        ref: "Vehicle",
        required: true,
      },
      pickupLocation: {
        lat: {
          type: Number,
          required: true,
        },
        long: {
          type: Number,
          required: true,
        },
      },
      startTime: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  startLocation: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  currentLocation: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  endLocation: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastLocationUpdateTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sessionEnd: {
    type: Boolean,
    required: true,
  },
});

//Older Schema
// const towSchema = new mongoose.Schema({
//   linkId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   policeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   users: [
//     {
//       type: String,
//       ref: "Vehicle",
//     },
//   ],
//   vehicles: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vehicle",
//     },
//   ],
//   licenseNumber: [
//     {
//       type: String,
//       ref: "Vehicle",
//     },
//   ],
//   endTime: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   journey: [
//     {
//       lat: {
//         type: Number,
//         required: true,
//       },
//       long: {
//         type: Number,
//         required: true,
//       },
//       vehicle: {
//         type: String,
//         ref: "Vehicle",
//         required: true,
//       },
//       startTime: {
//         type: Date,
//         required: true,
//         default: Date.now,
//       },
//       startLocation: {
//         lat: {
//           type: Number,
//           required: true,
//         },
//         long: {
//           type: Number,
//           required: true,
//         },
//       },
//     },
//   ],
//   currentLocation: {
//     lat: {
//       type: Number,
//       required: true,
//     },
//     long: {
//       type: Number,
//       required: true,
//     },
//   },
//   updatedTime: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   endLocation: {
//     lat: {
//       type: Number,
//       required: true,
//     },
//     long: {
//       type: Number,
//       required: true,
//     },
//   },
//   sessionEnd: {
//     type: Boolean,
//     required: true,
//   },
// });

// const Tow = mongoose.model("Tow", towSchema);
const TowSession = mongoose.model("TowSession", towSessionSchema);

module.exports = { TowSession };
