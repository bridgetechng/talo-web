import React,{useEffect, useState, useRef} from 'react';
import Grid from '@mui/material/Grid';
import "./propertybuy.css";

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import DoneIcon from '@mui/icons-material/Done';
import ReplayIcon from '@mui/icons-material/Replay';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import {Link} from "react-router-dom";

import axios from 'axios'  
import { useParams, useNavigate } from 'react-router-dom';




function PropertyBuy() {
  const { address } = useParams();
  /*I am pushing people to login page if they dont have user info details, i.e they are not in */
  const navigate = useNavigate()
  const [userInfo,setUserInfo]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo'))) 
  
  const [addressPosition,setAddressPosition] = useState('')
  console.log(userInfo)
  const [selectedPercentage,setSelectedPercentage] = useState(0)
  const [submitted,setSubmitted] = useState(" ") 
  const [ownedPercentage,setOwnedPercentage] = useState(0)
  const [property,setProperty] = useState({});  /*this is where the  database information for property will reside */ 
  
  
  const marks = [ /*these are the values for our slider */
    {
      value: 0,
      label: '0%',
    },
    {
      value: 10,
      label: '10%',
    },
    {
      value: 20,
      label: '20%',
    },
    {
      value: 30,
      label: '30%',
    },
    {
      value: 40,
      label: '40%',
    },{
      value: 50,
      label: '50%',
    },
    {
      value: 60,
      label: '60%',
    },
    {
      value: 70,
      label: '70%',
    },
    {
      value: 80,
      label: '80%',
    },
    {
      value: 90,
      label: '90%',
    },
    {
      value: 100,
      label: '100%',
    }
  ]


     /*for my post routes*/
   const config = {
    method:"POST",
    headers:{
      'Content-Type':'application/json'
      
    }
  }
  /*for my post routes END */


     useEffect(()=>{
      
      if(userInfo === null){
        navigate('/')
      }
      else{
       
       
       /*logic to see if a user actually already has a share of this property */
       const hasAddress = userInfo.userInfo.ownedProperties ? userInfo.userInfo.ownedProperties.filter((property)=>(property.address === address)) : []
       const userHas =  hasAddress.length !== 0 ? (hasAddress[0].proportion):(0)
        setOwnedPercentage(userHas)
       
    
    /*logic to see if a user actually already has a share of this property END*/
        
      
      }
  
    },[address,submitted,userInfo])

    /*I am pushing people to login page if they dont have user info details, i.e they are not in END */

  
   

   useEffect(()=>{

    const fetchPropertyAndUser = async() => {
     
    const {data} = await axios.get(`/api/properties/${address}`) 
    const position = await axios.get(`/api/properties/propertypos/${address}`)
    const userData = await axios.get(`/api/users/${userInfo.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
   
     setUserInfo(userData.data)
     
    setAddressPosition(position.data.id)
    
     setProperty(data.property[0]) /*i AM GOING OFF THE ASSUMPTION THAT I ONLY GET ONE VALUE , CUZ ADDRESSES ARE UNIQUE AFTER ALL */
    

  
    
   }

   fetchPropertyAndUser()


 },[submitted,address])


 const buyProperty = async() => {
  if(selectedPercentage === 0 ){
   window.alert('Please choose an amount to buy, you must select a percentage with the slider!') 
    }
  else if(userInfo.userInfo.userBalance < (selectedPercentage/100 * property.purchasePrice * property.availablePercentage/100)){
     
    window.alert('Insufficient balance, please select a lower percent!') 
  }
  else { 
     
   const {data} = await axios.post(`/api/properties/buy/${address}`, {
     selectedPercentage:selectedPercentage,
     addressPosition:addressPosition,
     userId:userInfo.userInfo.id,
     userBalance:userInfo.userInfo.userBalance,
     userBalance:userInfo.userInfo.investmentAmount
   }
     , config)
     
     setSubmitted(data.submitted)

  }
} 

  
  
  
  
  return (

      <> 
      

       <div className="propertyViewContainer"> 
       <hr className="randomLine"/>

        <div className="imageAndDetails">   
        
         <div className="subjectHouseContainer">
           <img src={property.image} alt="property picture" className="subjectHousePic" />  
         </div>
         
         
         <div className="propertyPricingDetails">

          <div>Investment:</div>
           <div className='moneyValue'>${(property.purchasePrice * property.availablePercentage/100).toLocaleString()}</div>
           <br/> {/*you can  use css-margin, or css-display flex gap instead of this if you like */}
           
           <div>Percentage Owned:</div>
           <div className="percentageValue">
            {userInfo ? (ownedPercentage).toFixed(1) : 0 } %
            </div>

           <br/>
           <div>Current Balance:</div>
           <div className="percentageValue">${userInfo && (userInfo.userInfo.userBalance).toLocaleString()}</div>

         </div>

        </div>
         <hr className = "smallMargin"/>
        <div className="propertyDescShort">
        <p className ="fontAdjust" >
             <strong className="fontAdjust"> DESCRIPTION</strong>
              <br/>
                 {property.description}{'...'}
               </p>
        </div>
      

         {/* the property list below will be a forEach , and i will load as many
          components as the database warrants me to, but for now, I will just hard code like 5 items */}
           
        <div className="propertyDesc">
           
          <div className='descriptionAndControls'>
             <div className="description">
              
             


               <p >
                <strong className="fontAdjust"> SELECT PURCHASE AMOUNT</strong>
                 <br/>
                 (select by moving the slider below, then click "make buy" to purchase)
               </p>
                
              < Box sx={{ borderRadius:2, border:1,borderColor:'green', padding:5, margin:1}}>
                <div classname="sliderLabel">SLIDER</div>
               <Slider defaultValue={0} step={10} marks={marks} min={0} max={property.availablePercentage} color="success" onChange={(e)=>{setSelectedPercentage(e.target.value)}}  />
               </Box>
               <br />

                <div className="displayAndConfirm">
                  <div className="display">
                  <ul className="featuresList">
                 <li >Portion Selected:<strong className="fontAdjust" style={{color:'red'}}>${(property.purchasePrice*selectedPercentage/100).toFixed(2)}{' '}{' '}</strong>{`(${selectedPercentage.toFixed(1)}%)`}</li>
                 <br/>
                 <li >Available for Purchase: <strong className="fontAdjust">${(property.purchasePrice * (property.availablePercentage/100)).toLocaleString()} </strong></li>
                 </ul>
                  </div>


                  <div className="confirm"><button onClick={buyProperty} className="button">MAKE BUY!</button></div>
                </div>



             </div>
            
             <div className="controls">
             <Link to={`/home`}><button className="button">BACK</button> </Link> 
              <Link to ={`/propertysell/${address}`}><button className="button">SELL</button> </Link> 
             <button className="button">OFFER</button>
               {/*  <button className="button">VOTE</button>*/}
             </div>
            
          </div>
        

          <div className= "purchaseDate">
         
          {submitted===" " &&
        
        <p id="description" className="pendingBuy text-center">
          <PendingActionsIcon className="doneIcon"/> BUY STATUS: PENDING
        </p> 
        }
         
         
          {submitted===true &&
        
        <p id="description" className="successBuy text-center">
          <DoneIcon className="doneIcon"/> BUY STATUS: BOUGHT SUCCESSFULLY! 
        </p> 
        }
 
        {submitted===false &&
          <p id="description" className="failureBuy text-center">
         <ReplayIcon className="doneIcon"/> BUY STATUS: SOMETHING WENT WRONG, PLEASE TRY AGAIN 
       </p>
        }
          </div>

            

        </div> {/*property list end */}
         
          
      </div>
        
      </> 
      
    )
}

export default PropertyBuy