const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const profileSchema = new Schema({
    user : {        
        type: Schema.Types.ObjectId, // This is like a primary key, foreign key relationship in the table
        ref: 'Users'
    },
    handle : {
        type: String,
        required: true,
        max: 40
    },
    company : {
        type: String
    },
    website: {
        type: String
    },
    location : {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills : {
        type: [String],
        required : true
    },
    bio : {
        type: String
    },
    githubusername:{
        type: String
    },
    experience:[
        {
            title: {
                type: String,
                require: true
            },
            company : {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description:{
                type: String
            }
        }
    ],
    education:[
        {
            school:{
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldOfStudy: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            }
        }
    ],
    social:{
        youtube: {
            type:String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin : {
            type: String            
        }, 
        instagram : {
            type: String
        }
    }   
}
)

module.exports = ProfileModel = mongoose.model('profile', profileSchema);