import React,{useEffect, useState, useRef} from 'react';
import Grid from '@mui/material/Grid';
import "./propertylist.css";

import Propertyitem from  "../../components/propertyitem/Propertyitem"
import Paginate from '../../components/paginate/Paginate';
import {useNavigate,useParams} from "react-router-dom";
import Searchandfilter from '../../components/searchandfilter/Searchandfilter';
import axios from 'axios'  

import Offplan1 from '../../images/offplan-1.JPG';
import Offplan2 from '../../images/offplan-2.JPG';
import Offplan3 from '../../images/offplan-3.jpg';
import Offplan4 from '../../images/offplan-4.jpg';
import Offplan5 from '../../images/offplan-5.jpg';

export default function OffplanPropertyList() {   /*to fetch info from a url . it is props.match ,cuz match is inside props by default */
  /*I am pushing people to login page if they dont have user info details, i.e they are not in */
  
  const navigate = useNavigate()
  const { pageNumber } = useParams();
  const [userInfo,setUserInfo]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo'))) 
   
     useEffect(()=>{
  
      if(userInfo === null){
        navigate('/')
      }
  
    },[userInfo])

    /*I am pushing people to login page if they dont have user info details, i.e they are not in END */
   
   const [tempPics , setTempPics] =  useState([Offplan1,Offplan2,Offplan3,Offplan4,Offplan5]);
  
  
   const [pages,setPages] = useState(1);
   const [page,setPage] = useState(1);
   const [addressList,setAddressList] = useState([]);


   useEffect(()=>{

    const fetchProperties = async() => {
     
    const {data} = await axios.get(`/api/properties/incomplete?pageNumber=${pageNumber}`) //{data} is object destructuring from what we get back from axios , i totally forgot about object destructuring
   
    
     setAddressList(data.properties)
     console.log(data.properties)
     setPage(data.page)
     setPages(data.pages)

   }

   fetchProperties()

/*no need to put any dependencies in use effect just yet, I want the fetch to happen only when the page is loaded */
 },[pageNumber])
   
  
  
  
  return (

      <> 
       <div className="propertyListContainer"> 
       
       <Searchandfilter className="searchComponent"/> 

         {/* the property list below will be from the off-plan properites,when that distinguishment is made,
          but for now, I am loading all properties from the database and using my personal hardcoded pics of offplan properties in place of the pics that come from the database*/}
       
                   
{   addressList.map((item,i)=>{
  
  return (
      
       <Propertyitem imageLink ={item.image} key={i} address={item.address}  purchasePrice={item.purchasePrice} percentage={item.availablePercentage}/> 
      
  )
 

     })
        }
        
        <Paginate page={page} pages={pages}/> 
          
      </div> {/* propertyListcontainer END */}
        
      </> 
      
    )
}