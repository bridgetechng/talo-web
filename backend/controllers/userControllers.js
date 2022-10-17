
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
const docRef = doc(dbtest, "users","Cu6GjKbFOCOT4Jx7j8Q7IMQTetm1") /*the jibberish to the left is for id's change it to any id in the database that you want */ 
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
    const q =  query(colRef, where("email", "==", `${email}`))
    

 signInWithEmailAndPassword(auth,email,password).then((document)=>{ 
    getDocs(colRef).then((snapshot) => {
     snapshot.docs.forEach((doc)=>{
      user.push({...doc.data(),id:doc.id})
     })
     
     if (user.length > 0){ 
      console.log("your user modification worked!")
       
     const chosenUser = user.filter((item)=>(item.uid === document.user.uid )) //think about something that doesnt involve filtering the WHOLE DOCUMENT, the filter condition is pretty decent as well, but is that the only reason I am going through this sign in method ?
      
      return res.json({
       userInfo:chosenUser[0] /*i am unpeeling the info from the array */
     }) 
   
      }else{
       console.log("your user modification did not work o")
      }
    
  })
  
  })
   
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
    
    const { email, password, firstName,lastName,phoneNumber} = req.body
    console.log(email)
    const user = []
    let myTimeStamp = Timestamp.fromDate(new Date());

    /*using firebase authentication to securely add the user */
      createUserWithEmailAndPassword(auth,email,password).then((document)=>{
         console.log("THIS IS RES!",document.user.uid)
       

         /* 1  adding to firestore */
         addDoc(colRef, { 
          uid: document.user.uid,
          email: email,
          firstName:firstName,
          lastName:lastName,
          phoneNumber:phoneNumber,
          userBalance:100000,/* THE DATA TYPE(BELOW) IS IMPORTANT, FOR THE DATABASE */
          Messages:[{date:myTimeStamp,message:"Welcome to the Talo platform, congrats on registering!"}],
          investmentAmount:0
         }).then((newUser) => {
     
    
          const registeredRef = doc(dbtest,'users',newUser.id)
    
          getDoc(registeredRef)
          .then((doc) => {
         
            console.log("the user has registered successfully")
    
           return  res.json({userInfo:{...doc.data(),id:doc.id}}) 
          }) 
     
         
      /*NESTING .THENS INSTEAD OF REGULAR SCOPE ON THE SAME LEVEL IS NOT NEAT AT ALL */

      });
     
    })
   

   
   /* addDoc(colRef,{ 
      email: email,
      firstName:firstName,
      lastName:lastName,
      phoneNumber:phoneNumber,
      userBalance:100000,
      Messages:[{date:myTimeStamp,message:"Welcome to the Talo platform, congrats on registering!"}],
      investmentAmount:0

    }).then((document) => {
     
    
      const registeredRef = doc(dbtest,'users',document.id)

      getDoc(registeredRef)
      .then((doc) => {
     
        console.log("the user has registered successfully")

       return  res.json({userInfo:{...doc.data(),id:doc.id}}) 
      }) 
 
    
    })*/

   

 
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