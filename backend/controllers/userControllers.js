
//import Product from '../models/productModel.js' I WILL USE MODEL FILES TO MAKE FIREBASE CALLS FROM ONLY ONE PLACE 
import asyncHandler from 'express-async-handler'
//const Product = require('../models/productModel.js') ES5 VERSION
//const asyncHandler = require('express-async-handler') ES5 VERSION

import { getFirestore, collection, where , query ,getDocs ,addDoc, deleteDoc ,doc, getDoc ,updateDoc,onSnapshot,Timestamp} from 'firebase/firestore';
import { initializeApp } from 'firebase/app'
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'

import dotenv from 'dotenv'
//const dotenv = require('dotenv')


dotenv.config()
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};



/*calling all the firebase stuff */
initializeApp(firebaseConfig) 

const dbtest = getFirestore()

const colRef = collection(dbtest , "users")
const auth = getAuth();

/**the arrays i will send in my fetch requests */
let users = []



getDocs(colRef)
 .then((snapshot) => {

    
     snapshot.docs.forEach((doc) => {
      

    users.push({...doc.data(), id:doc.id})
     }) 
     /* console.log(users)*/

 })
 
 
 getDocs(colRef).then((snapshot) =>{

    
  snapshot.docs.filter((doc)=>(doc.id === 'message')).forEach((doc) => {
   

  messages.push({...doc.data(), id:doc.id})
  }) 
   /*console.log(messages)*/

} ) 


 /*calling all the firebase stuff  END */




const authUser = asyncHandler(async (req, res) => {
    /*res.header("Access-Control-Allow-Origin","*")*/
    
    const { email, password } = req.body
    console.log(email)
    //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
    //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
    const user = []
    
    
  try{
 await signInWithEmailAndPassword(auth,email,password).then((document)=>{ 
  const q =  query(colRef, where("email", "==", `${document.user.email}`))
  //you make queries by putting the q (above) into where the colRef(below) used to be 

  getDocs(q/*colRef*/).then((snapshot) => {
     snapshot.docs.forEach((doc)=>{
      user.push({...doc.data(),id:doc.id})
     })
     
     if (user.length > 0){ 
      console.log("your user modification worked!")
       

      
      return res.json({
       userInfo:user[0] /*i am unpeeling the info from the array */
     }) 
   
      }else{
       console.log("WRONG EMAIL OR PASSWORD, this doesn't really do anything")
       res.status(500)
       throw new Error('invalid email or password')
      }
    
  })/*.catch((err)=>{
    console.log("WRONG EMAIL OR PASSWORD 1")
    res.status(401)
    throw new Error(err)  //I REMOVED THE TWO CATCH STATEMENTS BECAUSE MY TRY-CATCH BLOCK COVERS IT ALL
   
  })*/
  
  })/*.catch((err)=>{
    console.log(err)
    res.status(401)
    throw new Error(err)
   
  })*/

 }catch(error){
   
   res.status(500).json({
    message: error.code==='auth/wrong-password'||error.code==='auth/user-not-found'?'Invalid email or password, please try again!':'Please check your network and try again' 
  }) 
   console.log(error)
   
 }
   
  /*if (user.length > 0){ figure out why it jumps straight to else first ? i.e why am I getting 401 error before it parses the array
     
        res.json({
        userInfo:user[0] 
      })
    } else {
      res.status(401)
      throw new Error('invalid email or password')
    } */ 
  
  
  })




  const registerUser = asyncHandler(async (req, res) => {
    /*res.header("Access-Control-Allow-Origin","*")*/
   let registeredId
    
    const { email, password, firstName,lastName,phoneNumber,profileImage} = req.body
    console.log(email)
    const user = []
    let myTimeStamp = Timestamp.fromDate(new Date());

    /*using firebase authentication to securely add the user */
    try{
    await createUserWithEmailAndPassword(auth,email,password).then((document)=>{
         console.log("THIS IS RES!",document.user.uid)
       

         /* 1  adding to firestore */
         addDoc(colRef, { 
          uid: document.user.uid,
          email: email,
          firstName:firstName,
          lastName:lastName,
          phoneNumber:phoneNumber,
          profileImage:profileImage,
          userBalance:100000,/* THE DATA TYPE(BELOW) IS IMPORTANT, FOR THE DATABASE */
          Messages:[{date:myTimeStamp,message:"Welcome to the Talo platform, congrats on registering!"}],
          investmentAmount:0
         }).then((newUser) => {
     
    
          const registeredRef = doc(dbtest,'users',newUser.id)
    
          getDoc(registeredRef)
          .then((doc) => {
         
            console.log("the user has registered successfully")
    
           return  res.json({userInfo:{...doc.data(),id:doc.id}}) 
          }).catch(()=>{

            res.status(401)
            throw new Error('hallo, something went wrong')
          }) 
     
         
      /*NESTING .THENS INSTEAD OF REGULAR SCOPE ON THE SAME LEVEL IS NOT NEAT AT ALL */

      });
     
    }) 
   }catch(error){
   
    res.status(500).json({
     message:error.message.substring(9)/*i am unpeeling the info from the array */
   }) 
    console.log(error)
    
  }
   

  

   

 
  })
  

  const userInfoUpdates = asyncHandler(async (req, res) => {
    /*res.header("Access-Control-Allow-Origin","*")*/
   
    const userId= req.params.id
    
   
    const userRef = doc(dbtest,'users',userId)
  
    getDoc(userRef)
     .then((doc) => {
      
    return  res.json({userInfo:{...doc.data(),id:doc.id}}) /*I got lazy here, and wanted to follow my frontend syntax of userInfo.userInfo, I can do better here */
     }) 

  })


     const getAllUsers = asyncHandler(async (req, res) => {
      /*res.header("Access-Control-Allow-Origin","*")*/
      return  res.json({allUsers:users}) 
  })

  export {authUser,registerUser,userInfoUpdates,getAllUsers}