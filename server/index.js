import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRoutes);

app.get('/', (req, res)=>{
    res.send('hEllo to the memories api');
})

const connection_url='mongodb+srv://anushkadubey:anushka123456@cluster0.i8gx1.mongodb.net/?retryWrites=true&w=majority'
const PORT=process.env.PORT || 10000;

mongoose.connect(connection_url).then(
    () => app.listen(PORT, ()=>console.log(`server running at port: ${PORT}`))).catch(
        (error)=>console.log(error.message));

