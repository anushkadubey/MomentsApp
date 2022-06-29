import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModal from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne( {email} );

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  console.log(req.body.password);
  
  try {
    const oldUser = await UserModal.findOne( {'email': req.body.email} );
    console.log(oldUser);
    if (!oldUser) return res.status(400).json({ message: "User already exists" });

    
    //const salt = await bcrypt.genSalt(10);
    //password = await bcrypt.hashSync(password, salt);
    //console.log(hashedPassword);
    /*const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      
      console.log(hash);
    });*/
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(hash);

    const result = await UserModal.create({ 
      email: req.body.email,
      password: hash,
      name: `${req.body.firstName} ${req.body.lastName}` 
    });
    console.log(result);

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );
    console.log(token);

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};