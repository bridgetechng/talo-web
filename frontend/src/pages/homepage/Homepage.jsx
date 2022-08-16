import React,{useEffect, useState, useRef} from 'react';
import { useNavigate,useParams,useLocation} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import magGlass from "../../images/search.png"

import "./homepage.css";
import Chartbox from  "../../components/chartbox/Chartbox"
import Balancebox from  "../../components/balancebox/Balancebox"
import Propertyitem from  "../../components/propertyitem/Propertyitem"
import Paginate from '../../components/paginate/Paginate';
import {Link} from "react-router-dom";



import Searchandfilter from '../../components/searchandfilter/Searchandfilter';


import axios from 'axios'  




export default function Homepage() {
   
 
 
  const [searchTerm,setSearchTerm] = useState('');
  /*const [filteredAClone,setFilteredAClone] = useState([])*/

  const [searchDone,setSearchDone] = useState(false);
  const [filteredAddresses,setFilteredAddresses] = useState([]);
  
 
  const [pages,setPages] = useState(1);
  const [page,setPage] = useState(1);
  const [addressList,setAddressList] = useState([]);
  
  const filterRef = useRef();
  const [userInfoStatic,setUserInfoStatic]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo'))) 
  const [userInfo,setUserInfo] = useState('')
  const [userBalance,setUserBalance]  = useState(100000) 
  const navigate = useNavigate()
  const Location = useLocation()
 
  const { pageNumber } = useParams();


   /*I am pushing people to login page if they dont have user info details, i.e they are not logged in */
     useEffect(()=>{
  
 

      if(userInfoStatic === null){
        navigate('/')
       
      }


    },[])

    /*I am pushing people to login page if they dont have user info details, i.e they are not logged in END */


    const prevCountRef = useRef();
    useEffect(() => {
      //assign the ref's current value to the count Hook
      prevCountRef.current = userInfo;
    }, [userInfo]); 

 
  
    /*for my post routes*/
    const config = {
      method:"POST",
      headers:{
        'Content-Type':'application/json'
        
      }
    }
    /*for my post routes END */
   
 
    useEffect(()=>{
 
    

      const fetchUser = async() => {
       
      
      
       const userData = await axios.get(`/api/users/${userInfoStatic.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
      
       console.log("why !")

       setUserInfo(userData.data)
       setUserBalance(userData.data.userBalance)
      


      

     }
 
     fetchUser()
 
    
 
   },[page])






   useEffect(()=>{
 
    

     const fetchProperties = async() => {
      
    
      const {data} = await axios.post(`/api/properties/owned?pageNumber=${pageNumber}`,
          {
            ownedProperties:userInfo!==''?userInfo.userInfo.ownedProperties:userInfoStatic.userInfo.ownedProperties
          },
           config
          )
     

          const userData = await axios.get(`/api/users/${userInfoStatic.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
      
         
      if(userInfo !== prevCountRef.current ){
          setUserInfo(userData.data)
          setUserBalance(userData.data.userBalance)
      }
       
      
      setAddressList(data.properties)
      setPage(data.page)
      setPages(data.pages)
        
     

    
  }

    fetchProperties()

   

  },[pageNumber])
 
 
 
 
 
   useEffect(()=>{

   addressList.forEach((address) => {
   
     

    if (searchTerm && address.address.includes(searchTerm.toUpperCase())){
       setFilteredAddresses([address])
     
    }

    if(searchDone === false){
      setFilteredAddresses([])
    }
 })
  },[searchDone])
  
   
  
   const upMenu = function(){
      filterRef.current.style.opacity = 1
   }

   const downMenu = function(){

      filterRef.current.style.opacity = 0
   }


   const showSearchResult = function(event){
        
     
    if(event.key === 'Enter'){
    setSearchDone(true)
    return
    /*console.log(searchTerm)
    console.log(filteredAddresses)*/
    }
   }

   const updateData = async()=>{
 
    const userData = await axios.get(`/api/users/${userInfoStatic.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
   
    setUserInfo(userData.data)
    setUserBalance(userData.data.userBalance)

    console.log(addressList)

    const {data} = await axios.post(`/api/properties/owned?pageNumber=${pageNumber}`,
    {
      ownedProperties:userInfo.userInfo.ownedProperties
    },
     config
    )

setAddressList(data.properties)
setPage(data.page)
setPages(data.pages)

   }


 


  
  return (

      <> 
       <div className="homeContainer" /*onLoad={()=>{updateData()}}*/> 
        <div className="chartsAndMessages">   
        <Chartbox/> 
        <Balancebox userBalance={userInfo !==''? userInfo.userInfo.userBalance:userInfoStatic.userInfo.userBalance} />
        </div>
       {/*<Searchandfilter className="searchComponent"/>  I am going to connect this to a database and it can work as a component*/}

       <span className="positionAdjuster">
    <div className="searchAndFilterContainer">
         
         {/*properties*/}
        
        <h2 className="propertyLabel"> PROPERTIES </h2>
       
        

       {/*input for searching*/}
         <div className="searchBox">
         <input className="inputBox"type="text"  value={searchTerm} onKeyPress={showSearchResult} onChange={(e)=>{setSearchTerm(e.target.value);setSearchDone(false)}} placeholder="type an address and Enter..."/> 
         </div>
        
         <button type="submit" class="search-button" >
          <img src={magGlass}/>
        </button>
        
        {/*filter and it's icon*/}
         <div className="filterAndLogo" onMouseEnter={upMenu} onMouseLeave={downMenu}>
        <FilterListIcon className="filterIcon" />
         FILTER   
         </div>
    
        <div className="filterOptions" ref={filterRef} onMouseEnter={upMenu} onMouseLeave={downMenu}>
          <div className="optionItem1"> Value {'(Asc)'} <ArrowUpwardIcon className="ArrowIcon"/></div>
          <div className="optionItem2">Value {'(Desc)'}  <ArrowDownwardIcon className="ArrowIcon"/></div>
          <div className="optionItem2">City</div>
        </div>

        
    </div>
</span>


         {/* the property list below will be a forEach , and i will load as many
          components as the database warrants me to, but for now, I will just hard code like 5 items */}
          <h2 className="propertyLabel"> MY PORTFOLIO </h2> 
        <div className="propertyList">
            
       
        
        {addressList.map((item,i)=>{
           
          return (
               
               <Propertyitem imageLink ={item.image} key={i} address={item.address}  purchasePrice={item.purchasePrice} percentage={/*userInfo!== '' ?userInfo.userInfo.ownedProperties[(page?page:1) + (2*((page?page:1)-1) + i - 1)].proportion:*/0}/> 
             
          )
         
            
             })
             }


        { addressList.length === 0  &&
         
             <div className="noPropertyContainer">
             <h2> Welcome <span style={{color:"red"}}> {userInfoStatic.userInfo.firstName}{' '}{ userInfoStatic.userInfo.lastName}! </span> </h2>
             <br/>
              <h2>Properties you own will appear here.</h2>
              <br/>
              <h2>Click "Completed" or "Incomplete" on the menu </h2>
              <br/>
              <h2> to view properties you can buy. </h2>
             </div>
          

        }




       
 
        </div> {/*property list end */}
         
       
    <Paginate page={page} pages={pages}/>
      

          
      </div> {/*home container ending */}
        
      </> 
      
    )
}