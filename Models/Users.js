//*******User Model**********//
const mongoose =  require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.set('useFindAndModify', false);
const Schema =  mongoose.Schema;


const validateEmail = (email) =>{
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const validatePass = (pass) =>{
    let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return re.test(pass);
}

const NewUserSchema = new Schema
({

    email:
    {     
        type: String,     
        Required:  'Email address cannot be left blank.',            
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: {unique: true, dropDups: true}            
    },
    first: String,
    last:   String,
    dob:String,
    password: 
    {
        type: String,
        required: 'Must Contain a valid Password',
        validate: [validatePass, 'Please Follow password protocols'],
        match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, 'Please Follow password protocols']
    },
    timestamp :
    {
        type:Date,
        default: Date.now()
    },
    host :
    {
    type: Boolean,
    default:false
    },
    location :
    {
        country:
        {
            type: String,
            default: 'Canada'
        },
        city:
        {
        type: String,
        default: "Toronto"
        }
    },
    proPic:
    {
        type:String,
        default: "adventures.jpg"
    }


});


NewUserSchema.pre("save",function(next)
{
    bcrypt.genSalt(10)
        .then(salt =>
            {
                bcrypt.hash(this.password,salt)
                    .then(hash=>
                        {       
                            this.password=hash

                            next();
                        })
            })
})

const UsersSchema = mongoose.model('Users', NewUserSchema);


module.exports =  UsersSchema;