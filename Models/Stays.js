//**********Stays Model**********//
const mongoose =  require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema =  mongoose.Schema;

const newStaySchema =  new Schema
({
    destination:
    {
        type:String
    },
    price:
    {
        type:Number
    },
    location:
    {
        type:String
    },
    date:
    {
        start:
        {
            type:String
        },
        end:
        {
            type:String
        }
    },
    guests:
    {
        type:Number
    },
    owner:
    {
        type:String
    },
    timestamp:
    {
        type:Date,
        default: Date.now()
    }
})

const StaySchema = mongoose.model('Stays', newStaySchema);
module.exports = StaySchema;