const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId
    },
    //this defines the object id of the liked object
    likeable:{
        type:mongoose.Schema.ObjectId,
        require:true,
        refPath:'onModel'
    },
    //this field is used for defining the type of the liked object since this is a dynamic refernce
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},{
    timestamp:true
});
const Like = mongoose.model('Like',LikeSchema);
module.exports = Like;