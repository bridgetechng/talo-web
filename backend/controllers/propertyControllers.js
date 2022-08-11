
//import Product from '../models/productModel.js' I WILL USE MODEL FILES TO MAKE FIREBASE CALLS FROM ONLY ONE PLACE 
import asyncHandler from 'express-async-handler'
//const Product = require('../models/productModel.js') ES5 VERSION
//const asyncHandler = require('express-async-handler') ES5 VERSION

import { getFirestore, collection, where , query ,getDocs ,addDoc, deleteDoc ,doc, getDoc ,updateDoc,onSnapshot,Timestamp} from 'firebase/firestore';

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




 
let messages =[]
 
 /*  I NEEDED CONTINUOUS FEEDBACK SO I DECIDED TO USE ONSNAPSHOT(below) INSTEAD OF GETDOCS*/

onSnapshot(colRef,(snapshot) => {
  snapshot.docs.filter((doc)=>(doc.id === 'message')).forEach((doc)=>{
   messages.push({...doc.data(),id:doc.id})
  })
  
 
})


 



const getProperties = asyncHandler(async (req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
   
   
    let properties = []
    let count;

    getDocs(colRef)
    .then((snapshot) => {
   
       
        snapshot.docs.forEach((doc) => {
         
   
       properties.push({...doc.data(), id:doc.id})
        })

        count = properties[0].data.length

   //FROM HERE
    const pageSize = 3 // 3 per page as dean has asked
    const page = Number(req.query.pageNumber) || 1



let propertylistfunction;

 const keyword = req.query.keyword ? {
  name: {
    $regex: req.query.keyword,
    $options:'i' // it means case insensitive 
  }

}:{}

 


propertylistfunction = (array, pageSize, pageNumber) => {
 
 
 return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

}


console.log("count is now",count)


const propertylist = propertylistfunction(properties[0].data,pageSize,page)





 return res.json({properties:propertylist, page,pages:Math.ceil(count/pageSize)})
      }
    )

  })



const getOwnedProperties = asyncHandler(async (req,res)=>{
  /*res.header("Access-Control-Allow-Origin","*")*/
 
 const userOwns =  req.body.ownedProperties;
console.log(userOwns, "owned properties here")
 
let allProperties = []
let userProperties = []
let count;

  getDocs(colRef)
  .then((snapshot) => {
 
     
      snapshot.docs.forEach((doc) => {
       
 
     allProperties.push({...doc.data(), id:doc.id})
      })


      userOwns.forEach((item)=>(

        allProperties[0].data.forEach((house)=>{
          
         if(item.address === house.address){
            userProperties.push(house)
          }
     /*double loop here, try and refactor this to better code */

      })

      ))



      count = userProperties.length

 //FROM HERE
  const pageSize = 3 // 3 per page as dean has asked
  const page = Number(req.query.pageNumber) || 1



let propertylistfunction;

const keyword = req.query.keyword ? {
name: {
  $regex: req.query.keyword,
  $options:'i' // it means case insensitive 
}

}:{}




propertylistfunction = (array, pageSize, pageNumber) => {


return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

}


console.log("count is now",count)


const propertylist = propertylistfunction(userProperties,pageSize,page)





return res.json({properties:propertylist, page,pages:Math.ceil(count/pageSize)})
    }
  )

})




const getCompletedProperties = asyncHandler(async (req,res)=>{
  /*res.header("Access-Control-Allow-Origin","*")*/
 
 
  let properties = []
  let completedProperties;
  let count;
  let propertylistfunction;

  getDocs(colRef)
  .then((snapshot) => {
 
     
      snapshot.docs.forEach((doc) => {
       
 
     properties.push({...doc.data(), id:doc.id})
     
    
    })

     console.log(properties[0].data.filter((item)=>(item.type === "Completed")))

    completedProperties =  properties[0].data.filter((item)=>(item.type === "Completed"))

      count = completedProperties.length

 //FROM HERE
  const pageSize = 3 // 3 per page as dean has asked
  const page = Number(req.query.pageNumber) || 1





const keyword = req.query.keyword ? {
name: {
  $regex: req.query.keyword,
  $options:'i' // it means case insensitive 
}

}:{}




propertylistfunction = (array, pageSize, pageNumber) => {


return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

}


console.log("count is now",count)



const propertylist = propertylistfunction(completedProperties,pageSize,page)





return res.json({properties:propertylist, page,pages:Math.ceil(count/pageSize)})
    }
  )

})



const getIncompleteProperties = asyncHandler(async (req,res)=>{
  /*res.header("Access-Control-Allow-Origin","*")*/
 
 
  let properties = []
  let count;
  let incompleteProperties =[]
  let propertylistfunction;

  getDocs(colRef)
  .then((snapshot) => {
 
     
      snapshot.docs.forEach((doc) => {
       
 
     properties.push({...doc.data(), id:doc.id})
      })

    incompleteProperties = properties[0].data.filter((item)=>(item.type == "Incomplete"))


      count = incompleteProperties.length

 //FROM HERE
  const pageSize = 3 // 3 per page as dean has asked
  const page = Number(req.query.pageNumber) || 1





const keyword = req.query.keyword ? {
name: {
  $regex: req.query.keyword,
  $options:'i' // it means case insensitive 
}

}:{}




propertylistfunction = (array, pageSize, pageNumber) => {


return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

}



console.log(incompleteProperties)
console.log("count is now",count)


const propertylist = propertylistfunction(incompleteProperties,pageSize,page)





return res.json({properties:propertylist, page,pages:Math.ceil(count/pageSize)})
    }
  )

})


  const getPropertyByAddress = asyncHandler(async(req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
     
 const property = [] 
 /*I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to  */
 let properties = []
   
 getDocs(colRef)
 .then((snapshot) => {

    
     snapshot.docs.forEach((doc) => {
      

    properties.push({...doc.data(), id:doc.id})
     }) 
      console.log("property length is",properties.length)

   /*  FROM HERE I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to END */

  property.push( ...properties[0].data.filter((p) => p.address === req.params.address) )
    
  /*console.log(property)*/
   return res.json({property})
  })


   }
 )






  const useAddressToFindPosition = asyncHandler(async(req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
     
  /*I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to  */
  let properties = []
   
  getDocs(colRef)
  .then((snapshot) => {
 
     
      snapshot.docs.forEach((doc) => {
       
 
     properties.push({...doc.data(), id:doc.id})
      }) 
       console.log("property length is",properties.length)

       const id =  properties[0].data.findIndex((p) => p.address === req.params.addressalso) 
    
     return  res.json({id:id})
    }

   
  )

/* I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to END */
    

   
  })


  const addNewProperty = asyncHandler(async(req,res)=>{
    /*res.header("Access-Control-Allow-Origin","*")*/
   
    

 /*I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to  */
    let properties = []
   
    getDocs(colRef)
    .then((snapshot) => {
   
       
        snapshot.docs.forEach((doc) => {
         
   
       properties.push({...doc.data(), id:doc.id})
        }) 
         console.log("property length is",properties.length)


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
      images:[{image:imageUrl}],
      monthlyIncome:"",
      monthlyReturn:"",
      availablePercentage:percentage/100,
      percentageReturn:"",
      percentage:percentage.toString()+" %",
      purchaseDate:purchaseDate,
      purchasePrice:purchasePrice,
      totalReturn:"",
      description:description,
      type:type,
      yearBuilt:yearBuilt




    }]

   

   }).then(
   
   ()=>{return res.json({submitted:true})}
   )

      }
    )

/* I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to END */




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
  
 /*I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to  */
 let properties = []
   
 getDocs(colRef)
 .then((snapshot) => {

    
     snapshot.docs.forEach((doc) => {
      

    properties.push({...doc.data(), id:doc.id})
     }) 
      console.log("property length is",properties.length)
   
   
   

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
  
     () =>{ return res.json({submitted:true})}
  
     )
   
   
   
   
   
    }
 )

/* I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to END */


     
  }
   )


   const updatePropertyBought = asyncHandler(async(req,res)=>{
    /*/*res.header("Access-Control-Allow-Origin","*")*/

    /*I had a problem in which the header above would try and set a header AFTER
      I had sent response to client... why is that so ? does it have to do with my promises ? or 
      does it have to do with how response object works in the backend 
        */
    
   /*I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to  */
   let properties = []
   
   getDocs(colRef)
   .then((snapshot) => {
  
      
       snapshot.docs.forEach((doc) => {
        
  
      properties.push({...doc.data(), id:doc.id})
       }) 
        console.log("property length is",properties.length)

   /*INITIAL SETUP */
    const selectedPercentage = req.body.selectedPercentage
    const addressPosition = req.body.addressPosition
    const userId= req.body.userId
    const currUserBalance = req.body.userBalance
    const address = req.params.address
    const userRef = doc(dbtest,'users',userId)
    let userHouses;
    let spotInArray;
    let messagesArray;
    let myTimeStamp = Timestamp.fromDate(new Date());

   /*ASSISTANCE CONSTANTS */
   const newAvailablePercentage =  (properties[0].data[addressPosition].availablePercentage - (selectedPercentage)) > 0 ?
                                    properties[0].data[addressPosition].availablePercentage - (selectedPercentage): 0

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
    messagesArray = Array.isArray(doc.data().Messages) ? doc.data().Messages  :[]
    

    spotInArray = userHouses.findIndex((item)=>(item.address === address))
    console.log(spotInArray,userHouses)

     /*one small change to the proportion, the user has now */
     if(spotInArray > -1){
    userHouses[spotInArray].proportion = userHouses[spotInArray].proportion + (selectedPercentage)
     }else{
      userHouses.push({address:address,proportion:selectedPercentage})
     }

     messagesArray.push({date:myTimeStamp, message:"Congratulations, you have successfully purchased" + selectedPercentage + "% of the property at" +  address }) /*consider making a messages collection and fetching from the list of generic message in that collection */

    updateDoc(userRef,{
      userBalance:(currUserBalance - userSpent),
      ownedProperties: userHouses, /*the entire array of ownedProperties is getting replaced by itself, with one small change, made to the proportion they currently have */
      Messages:[...messagesArray]
     })
      .then(
      ()=>{console.log("i have updated the database for bought")/*return res.json({submitted:true})*/}
        )
 })


   /*FETCHING USER IN QUESTION END */
   

    
  
     )
     }
   )

/* I HAVE TO SEND THE JSON IN THE SAME SCOPE AS THE RES, NOT IN THE GEN SCOPE */


return res.json({submitted:true})

   })


   const updatePropertySold = asyncHandler(async(req,res)=>{
   /* res.header("Access-Control-Allow-Origin","*")*/
    
    /*I have to fetch the properties afresh because the onSnapshot is not constantly refreshing like it's meant to  */
    let properties = []
   
    getDocs(colRef)
    .then((snapshot) => {
   
       
        snapshot.docs.forEach((doc) => {
         
   
       properties.push({...doc.data(), id:doc.id})
        }) 
         console.log("property length is",properties.length)



   /*INITIAL SETUP */
    const selectedPercentage = req.body.selectedPercentage
    const addressPosition = req.body.addressPosition
    const userId= req.body.userId
    const currUserBalance = req.body.userBalance
    const address = req.params.address
    const userRef = doc(dbtest,'users',userId)
    let userHouses;
    let spotInArray;
    let messagesArray;
    let myTimeStamp = Timestamp.fromDate(new Date());

   /*ASSISTANCE CONSTANTS */
   const newAvailablePercentage =  properties[0].data[addressPosition].availablePercentage + (selectedPercentage)
   const price = properties[0].data[addressPosition].purchasePrice
   const userSold = price * (selectedPercentage/100)  /*so you do userBalance + userSold to get the new userBalance */
    
    console.log(newAvailablePercentage)


    /*i need to get all the properties for that position then alter the available percentage */
    properties[0].data[addressPosition] =  {...properties[0].data[addressPosition],availablePercentage:newAvailablePercentage}


/*updating the property in the array, so we can reset and submit END*/
   
  
   
   
     updateDoc(docRef, {
      data:properties[0].data
     }).then(
    
      

    /*FETCH USER AND UPDATE THEIR BALANCE AND MESSAGES */
      

    getDoc(userRef)
     .then((doc) => {
    userHouses = doc.data().ownedProperties
    messagesArray = doc.data().Messages ? doc.data().Messages  :[]
    
    spotInArray = userHouses.findIndex((item)=>(item.address === address))
    console.log(spotInArray,userHouses)

     /*change to the proportion the user has */
    userHouses[spotInArray].proportion = (userHouses[spotInArray].proportion - (selectedPercentage)) >= 0 ? (userHouses[spotInArray].proportion - (selectedPercentage)) : 0 
    messagesArray.push({date:myTimeStamp, message:"You have just sold" + selectedPercentage + "% of the property at" +  address }) /*consider making a messages collection and fetching from the list of generic message in that collection */
     

    /*if the user has sold everything, delete the property element from the ownedProperties array */
    if(userHouses[spotInArray].proportion === 0){

      userHouses.splice(spotInArray,1)
    }
   
    updateDoc(userRef,{
      userBalance:(currUserBalance + userSold),
      ownedProperties: userHouses, /*the entire array of ownedProperties is getting replaced by itself, with one small change, made to the proportion they currently have */
      Message:[...messagesArray],
     })
      .then(
      ()=>{console.log("I have updated database for bought")/*return res.json({submitted:true})*/}
        )
 })


   /*FETCH USER AND UPDATE THEIR BALANCE AND MESSAGES END */
   

    
  
        )
      }
    )

/* I have to return resjson AT THE VERY END, TO AVOID SCOPE ISSUES IN MY CONTROLLER, HENCE I AM SENDING IT BELOW  */
   return res.json({submitted:true})

   })




  export {getProperties,getCompletedProperties,getIncompleteProperties,getOwnedProperties,getPropertyByAddress,editProperty,addNewProperty,useAddressToFindPosition,updatePropertyBought,updatePropertySold}