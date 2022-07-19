
//import Product from '../models/productModel.js' I WILL USE MODEL FILES TO MAKE FIREBASE CALLS FROM ONLY ONE PLACE 
import asyncHandler from 'express-async-handler'
//const Product = require('../models/productModel.js') ES5 VERSION
//const asyncHandler = require('express-async-handler') ES5 VERSION

import { getFirestore, collection, where , query ,getDocs ,addDoc, deleteDoc ,doc, getDoc ,updateDoc,onSnapshot} from 'firebase/firestore';

import { initializeApp } from 'firebase/app'

import {getStorage,ref,uploadBytes,listAll,getDownloadURL} from 'firebase/storage'


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



/*just an experiment to try the other firebase way */
const app = initializeApp(firebaseConfig) 

const storage = getStorage(app)

const dbtest = getFirestore()

const colRef = collection(dbtest , "estate")
const docRef = doc(dbtest, "estate","collection")


/**the arrays i will send in my fetch requests */




/*getDocs(colRef)
 .then((snapshot) => {

    
     snapshot.docs.filter((doc)=>(doc.id === 'collection')).forEach((doc) => {
      

     properties.push({...doc.data(), id:doc.id})
     }) 
    

 })I NEEDED CONTINUOUS FEEDBACK SO I DECIDED TO USE ONSNAPSHOT(below) INSTEAD OF GETDOCS */


 

 
 
 /*  I NEEDED CONTINUOUS FEEDBACK SO I DECIDED TO USE ONSNAPSHOT(below) INSTEAD OF GETDOCS*/

onSnapshot(colRef,(snapshot) => {
  snapshot.docs.filter((doc)=>(doc.id === 'message')).forEach((doc)=>{
   messages.push({...doc.data(),id:doc.id})
  })
  
 
})


 



const getProperties = asyncHandler(async (req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
   
   
    let properties = []
    onSnapshot(colRef,(snapshot) => {
     snapshot.docs.filter((doc)=>(doc.id === 'collection')).forEach((doc)=>{
      properties.push({...doc.data(),id:doc.id})
     })
    
    
   })
   

   
    const pageSize = 3 // 3 per page as dean has asked
       const page = Number(req.query.pageNumber) || 1
  
   
  let count;
  let propertylist;
  
    const keyword = req.query.keyword ? {
     name: {
       $regex: req.query.keyword,
       $options:'i' // it means case insensitive 
     }
   
   }:{}
   
    
   
  count = properties[0].data.length
  propertylist = (array, pageSize, pageNumber) => {
    
    
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  
  }
  
  


  const propertylists = propertylist(properties[0].data,pageSize,page)
  
  


  
    res.json({properties:propertylists, page,pages:Math.ceil(count/pageSize)})
  })



  const getPropertyByAddress = asyncHandler(async(req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
     
 const property = [] 


  property.push( ...properties[0].data.filter((p) => p.address === req.params.address) )
    
  /*console.log(property)*/
    res.json({property})
  })




  const useAddressToFindPosition = asyncHandler(async(req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
     
 
    

    const id =  properties[0].data.findIndex((p) => p.address === req.params.addressalso) 
    
  console.log(id)
    res.json({id:id})
  })


  const addNewProperty = asyncHandler(async(req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
   
    

 /*I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to  */
    let properties = []
    onSnapshot(colRef,(snapshot) => {
     snapshot.docs.filter((doc)=>(doc.id === 'collection')).forEach((doc)=>{
      properties.push({...doc.data(),id:doc.id})
     })
    
    
   })

/* I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to END */


    const propertyAddress = req.body.propertyAddress
    const purchasePrice = req.body.purchasePrice
    const purchaseDate = req.body.purchaseDate
    const yearBuilt = req.body.yearBuilt
    const percentage = req.body.percentage
    const type = req.body.type
    const imageUrl = req.body.imageUrl
    const description = req.body.description
   
 

  
    
   updateDoc(docRef, {
    data:[...properties[0].data,{
      address:propertyAddress,
      amountLeft:"",
      earn:[""],
      image:imageUrl,
      images:[""],
      monthlyIncome:"",
      monthlyReturn:"",
      percentage:percentage,
      percentageReturn:"",
      purchaseDate:purchaseDate,
      purchasePrice:purchasePrice,
      totalReturn:"",
      description:description,
      type:type,
      yearBuilt:yearBuilt




    }]

   

   }).then(
   
     res.json({submitted:true}),
   )



  })


  const editProperty = asyncHandler(async(req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
    
    const propertyAddress = req.body.propertyAddress
    const purchasePrice = req.body.purchasePrice
    const purchaseDate = req.body.purchaseDate
    const yearBuilt = req.body.yearBuilt
    const percentage = req.body.percentage
    const type = req.body.type
    const newImage = req.body.image

    const arrayPosition = req.params.id
    console.log(propertyAddress,purchaseDate,purchaseDate,yearBuilt)

/*dont forget to set the new image, fetch its url then put the URL into the array below */


/*updating the property in the array,so we can reset and submit */
   
const arrayToUpdate = properties[0].data

properties[0].data[arrayPosition] = 
{
  address:propertyAddress,
  amountLeft:"",
  earn:[""],
  image:"https://firebasestorage.googleapis.com/v0/b/catex-54325.appspot.com/o/image%2FHouse1.jpeg?alt=media&token=1532e522-f03d-42da-a9c5-180348572d19",
  images:[""],
  monthlyIncome:"",
  monthlyReturn:"",
  percentage:percentage,
  percentageReturn:"",
  purchaseDate:purchaseDate,
  purchasePrice:purchasePrice,
  totalReturn:"",
  type:type,
  yearBuilt:yearBuilt
}


/*updating the property in the array, so we can reset and submit END*/
   /*remember to change the date property in firebase to have a type of date ! */
   updateDoc(docRef, {
      data:properties[0].data
     }).then(
  
       res.json({submitted:true})
  
     )
   
     
  }
   )


   const updatePropertyBought = asyncHandler(async(req,res)=>{
    /*/*res.header("Access-Control-Allow-Origin","*")*/

    /*I had a problem in which the header above would try and set a header AFTER
      I had sent response to client... why is that so ? does it have to do with my promises ? or 
      does it have to do with how response object works in the backend 
        
      
      */
    
   /*INITIAL SETUP */
    const selectedPercentage = req.body.selectedPercentage
    const addressPosition = req.body.addressPosition
    const userId= req.body.userId
    const currUserBalance = req.body.userBalance
    const address = req.params.address
    const userRef = doc(dbtest,'users',userId)
    let userHouses;
    let spotInArray;


   /*ASSISTANCE CONSTANTS */
   const newAvailablePercentage =  properties[0].data[addressPosition].availablePercentage - (selectedPercentage/100)
   const price = properties[0].data[addressPosition].purchasePrice
   const userSpent = price * (selectedPercentage/100)  /*so you do userBalance - subtractUserBalance, to get the new userBalance */
    
    console.log(newAvailablePercentage)


    /*i need to get all the properties for that position then alter the available percentage */
    properties[0].data[addressPosition] =  {...properties[0].data[addressPosition],availablePercentage:newAvailablePercentage}


/*updating the property in the array, so we can reset and submit END*/
   /*remember to change the date property in firebase to have a type of date ! */
  
   
   
     updateDoc(docRef, {
      data:properties[0].data
     }).then(
    

    /*UNFORTUNATELY I HAVE TO FETCH THE USER IN QUESTION, TO GET ARRAY POSITION FOR WHAT I WANT TO UPDATE AND WHATNOT */
      

    getDoc(userRef)
     .then((doc) => {
    userHouses = doc.data().ownedProperties ? doc.data().ownedProperties  :[]
     
    spotInArray = userHouses.findIndex((item)=>(item.address === address))
    console.log(spotInArray,userHouses)

     /*one small change to the proportion, the user has now */
     if(spotInArray > -1){
    userHouses[spotInArray].proportion = userHouses[spotInArray].proportion + (selectedPercentage/100)
     }else{
      userHouses.push({address:address,proportion:selectedPercentage/100})
     }


    updateDoc(userRef,{
      userBalance:(currUserBalance - userSpent),
      ownedProperties: userHouses /*the entire array of ownedProperties is getting replaced by itself, with one small change, made to the proportion they currently have */

     })
      .then(
        res.json({submitted:true})
        )
 })


   /*FETCHING USER IN QUESTION END */
   

    
  
     )
   

   })


   const updatePropertySold = asyncHandler(async(req,res)=>{
   /* res.header("Access-Control-Allow-Origin","*")*/
    
   /*INITIAL SETUP */
    const selectedPercentage = req.body.selectedPercentage
    const addressPosition = req.body.addressPosition
    const userId= req.body.userId
    const currUserBalance = req.body.userBalance
    const address = req.params.address
    const userRef = doc(dbtest,'users',userId)
    let userHouses;
    let spotInArray;


   /*ASSISTANCE CONSTANTS */
   const newAvailablePercentage =  properties[0].data[addressPosition].availablePercentage + (selectedPercentage/100)
   const price = properties[0].data[addressPosition].purchasePrice
   const userSold = price * (selectedPercentage/100)  /*so you do userBalance + userSold to get the new userBalance */
    
    console.log(newAvailablePercentage)


    /*i need to get all the properties for that position then alter the available percentage */
    properties[0].data[addressPosition] =  {...properties[0].data[addressPosition],availablePercentage:newAvailablePercentage}


/*updating the property in the array, so we can reset and submit END*/
   /*remember to change the date property in firebase to have a type of date ! */
  
   
   
     updateDoc(docRef, {
      data:properties[0].data
     }).then(
    

    /*UNFORTUNATELY I HAVE TO FETCH THE USER IN QUESTION, TO GET ARRAY POSITION FOR WHAT I WANT TO UPDATE AND WHATNOT */
      

    getDoc(userRef)
     .then((doc) => {
    userHouses = doc.data().ownedProperties
     
    spotInArray = userHouses.findIndex((item)=>(item.address === address))
    console.log(spotInArray,userHouses)

     /*change to the proportion the user has */
    userHouses[spotInArray].proportion = userHouses[spotInArray].proportion - (selectedPercentage/100)

    /*if the user has sold everything, delete the property element from the ownedProperties array */
    if(userHouses[spotInArray].proportion === 0){

      userHouses.splice(spotInArray,1)
    }
   
    updateDoc(userRef,{
      userBalance:(currUserBalance + userSold),
      ownedProperties: userHouses /*the entire array of ownedProperties is getting replaced by itself, with one small change, made to the proportion they currently have */

     })
      .then(
        res.json({submitted:true})
        )
 })


   /*FETCHING USER IN QUESTION END */
   

    
  
     )
   

   })




  export {getProperties,getPropertyByAddress,editProperty,addNewProperty,useAddressToFindPosition,updatePropertyBought,updatePropertySold}