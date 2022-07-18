
//import Product from '../models/productModel.js' I WILL USE MODEL FILES TO MAKE FIREBASE CALLS FROM ONLY ONE PLACE 
import asyncHandler from 'express-async-handler'
//const Product = require('../models/productModel.js') ES5 VERSION
//const asyncHandler = require('express-async-handler') ES5 VERSION

import { getFirestore, collection, where , query ,getDocs ,addDoc, deleteDoc ,doc, getDoc ,updateDoc,onSnapshot} from 'firebase/firestore';
import { initializeApp } from 'firebase/app'

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
    
   onSnapshot(q,(snapshot) => {
     snapshot.docs.forEach((doc)=>{
      user.push({...doc.data(),id:doc.id})
     })
     console.log(user.length)
     if (user.length > 0){ 
      res.json({
      userInfo:user[0] /*i am unpeeling the info from the array */
    }) 
  
     }
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
    
    const { email, password, firstName,lastName,phoneNumber} = req.body
    console.log(email)

    /* 1  adding to firestore */
     
    addDoc(colRef,{
      email: email,
      firstName:firstName,
      lastName:lastName,
      phoneNumber:phoneNumber,

    } )

    /*adding to firestore END */


   /*2  sending from firestore,  i did a query cuz i didnt have the
    id and i believe you can only search for an individual document
     by id, not be email, or some other category */

    const user = []
    const q =  query(colRef, where("email", "==", `${email}`))
    
   onSnapshot(q,(snapshot) => {
     snapshot.docs.forEach((doc)=>{
      user.push({...doc.data(),id:doc.id})
     })
     console.log(user.length)
     if (user.length > 0){ 
      res.json({
      userInfo:user[0] /*i am unpeeling the info from the array */
    }) 
  }
   })
 
  })
  

  const userInfoUpdates = asyncHandler(async (req, res) => {
    /*res.header("Access-Control-Allow-Origin","*")*/
   
    const userId= req.params.id
    
   
    const userRef = doc(dbtest,'users',userId)
  
    getDoc(userRef)
     .then((doc) => {
      
      res.json({userInfo:{...doc.data(),id:doc.id}}) /*I got lazy here, and wanted to follow my frontend syntax, I can do better here */
     }) 

  })


     const getAllUsers = asyncHandler(async (req, res) => {
      /*res.header("Access-Control-Allow-Origin","*")*/
        res.json({allUsers:users}) 
  })

  export {authUser,registerUser,userInfoUpdates,getAllUsers}