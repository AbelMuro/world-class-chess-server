const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},    			//remember to set the unique property here to true
    profileImage: {type: ObjectId},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    resetPasswordToken: {type: String},			   			            //you will need this property for reseting passwords
    resetPasswordExpires: {type: Date}
});

userSchema.pre('save', async function (next) {              			//pre() is a middleware that will execute a function that will hash a password BEFORE the save method is called
    if(!this.isModified('password'))                        		        //if the password has NOT been modified
        return next();                                      			//will execute the next middleware, if there are no more middlewares, then save() will be called

    const salt = await bcrypt.genSalt(10);                  			//generates a salt 
    this.password = await bcrypt.hash(this.password, salt); 			//we hash the password
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) { 		//this will check the user's password to see if its correct
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.createPasswordResetToken = function() {       
    const resetToken = crypto.randomBytes(32).toString('hex'); 			// we generate 32 bytes of random binary data and return it as a 'buffer', then the buffer is converted into a HEX string
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');  // We hash the token with the sha256 algorithm and convert the token into a HEX string
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;                	// Token expires in 10 minutes
    return resetToken;
}  

const User = mongoose.model('user', userSchema, 'accounts')        		//create a model that will be used to create documents

module.exports = User;