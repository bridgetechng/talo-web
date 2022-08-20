import React,{useEffect, useState, useRef} from 'react';
import Grid from '@mui/material/Grid';
import "./propertyview.css";
import {Link} from "react-router-dom";
import axios from 'axios'  
import { useParams, useNavigate } from 'react-router-dom';




function PropertyView() {
   
  /*I am pushing people to login page if they dont have user info details, i.e they are not in */
  const navigate = useNavigate()
  const [userInfo,setUserInfo]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo'))) 
  const [ownedPercentage,setOwnedPercentage] = useState(0)
  const [addressPosition,setAddressPosition] = useState('')
  const [property,setProperty] = useState({}); /*this is where the  database information will reside */ 
   
  const { address } = useParams();


     
   useEffect(()=>{
   
    const fetchPropertyAndUser = async() => {
      
      const {data} = await axios.get(`/api/properties/${address}`) 
      const position = await axios.get(`/api/properties/propertypos/${address}`)
      const userData = await axios.get(`/api/users/${userInfo.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
     
       setUserInfo(userData.data)
       
      setAddressPosition(position.data.id)
      
       setProperty(data.property[0]) /*i AM GOING OFF THE ASSUMPTION THAT I ONLY GET ONE VALUE , CUZ ADDRESSES ARE UNIQUE AFTER ALL */
      
  
       console.log(property.availablePercentage)
      
      
     }
      
 
     fetchPropertyAndUser()
     console.log("hello I am here")


 },[])







     useEffect(()=>{
  
      if(userInfo === null){
        navigate('/')
      }else{
        console.log("whas the issue ?")
        const fetchUserForUpdates = async() => {
      const userData = await axios.get(`/api/users/${userInfo.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
     
       setUserInfo(userData.data)
        
        }

        fetchUserForUpdates()
        
       

      }
  
    },[address])



   useEffect(()=>{

     /*logic to see if a user actually already has a share of this property */
     const hasAddress = userInfo.userInfo.ownedProperties ? userInfo.userInfo.ownedProperties.filter((property)=>(property.address === address)) : []
     console.log(hasAddress)
     const userHas =  hasAddress.length !== 0 ? (hasAddress[0].proportion):(0)
     setOwnedPercentage(userHas)
    
 
 /*logic to see if a user actually already has a share of this property END*/

    },[userInfo])

  
  
  
  
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
           <div className='moneyValue'>${((property.purchasePrice *(property.availablePercentage/100))).toLocaleString()}</div>
           <br/> {/*you can  use css-margin, or css-display flex gap instead of this if you like */}
           
           <div>Percentage Owned:</div>
           <div className="percentageValue">{ownedPercentage}%</div>
         </div>

        </div>
      

         {/* the property list below will be a forEach , and i will load as many
          components as the database warrants me to, but for now, I will just hard code like 5 items */}
           
        <div className="propertyDesc">
           
          <div className='descriptionAndControls'>
             <div className="description">
               <p className ="fontAdjust" >
                 {property.description}
               </p>

               <br />

               <ul className="featuresList">
                 <li className ="fontAdjust">PURCHASE DATE:<strong>{property.purchaseDate}</strong></li>
                 <li className ="fontAdjust">PURPOSE: <strong>{property.type} </strong></li>
                 <li className ="fontAdjust">PROPERTY MGMT: <strong>{'$350'} </strong></li>
                 <li className ="fontAdjust">PURCHASE PRICE: <strong>$ {property.purchasePrice ?property.purchasePrice.toLocaleString():"Loading..."}</strong> </li>
                 <li className ="fontAdjust">CURRENT PRICE: <strong>$ {property.currentPrice? property.currentPrice.toLocaleString():"Loading..."} </strong></li>
               </ul>
             </div>
            
             <div className="controls">
              <Link to={`/propertybuy/${address}`}><button className="button">BUY</button> </Link> 
              <Link to ={`/propertysell/${address}`}><button className="button">SELL</button> </Link> 
               <button className="button">OFFER</button>
               <button className="button">VOTE</button>
             </div>
            
          </div>
        

          <div className= "purchaseDate">
          <h3> PURCHASED ON {property.purchaseDate} </h3>
          </div>

            

        </div> {/*property list end */}
         
          
      </div>
        
      </> 
      
    )
}

export default PropertyView