//**********Room Model**********//

const mongoose =  require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema =  mongoose.Schema;

const NewRoomSchema = new Schema
({
    title:
    {
        type: String,
        required:true
    },
    price:
    {
        type:Number,
        required:true
    },
    desc:
    {
        type:String,
        required:true
    },
    location:
    {
        type:String,
        required:true
    },
    roomPic:
    {
        type:String
    },
    timestamp:
    {
        type:Date,
        default: Date.now()
    },
    owner:
    {
        type:String
    }
})

const RoomSchema = mongoose.model('Rooms', NewRoomSchema);

module.exports = RoomSchema;