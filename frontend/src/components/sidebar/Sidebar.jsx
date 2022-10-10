
import React,{useEffect, useState, useRef} from 'react';
import "./sidebar.css"
import {LineStyle, Timeline ,TrendingUp} from '@mui/icons-material/';

import PersonIcon from '@mui/icons-material/Person';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import NearMeIcon from '@mui/icons-material/NearMe';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import urbanlogo from '../../images/talo.png';

import {Button} from 'react-bootstrap'

import {BrowserRouter as Router ,Link} from "react-router-dom";


export default function Sidebar() {


    const [admin,setAdmin] = useState(false);

    const changeMode = ()=>{
        setAdmin(!admin)
    }

    return (
        
        <div className="sidebar">
  
              <div className="imageCenter">
              <img src={urbanlogo} alt="urban hive logo" className="sidebarLogo"  />
              </div>
               
               
              { /* I MAY NEED THIS admin and user sidebar switch LATER BUT I AM BLOCKING THIS OUT BECAUSE MR DEAN SAID TO SEPARATE ADMIN AND USERS
              
                <div  className = "buttonSidebar" onClick = {changeMode}>   
                  <WifiProtectedSetupIcon className = "iconNB"/> {admin ?"Admin Mode":"User Mode"}
                </div>
             */}
                
            <div className="sidebarWrapper">
               
               
                <div className="sidebarMenu">
                <Link to ={'/home'} className="linkref">
                    <h3 className="sidebarTitle clickable"><PersonIcon className="sidebarListItemIcon"/>DASHBOARD</h3>
                </Link> 
                </div> {/*sidebar menu closing */}
             
                <br/>

                <div className="sidebarMenu">
                <Link  className="linkref" to={"/properties/offplan/"}><h3 className="sidebarTitle  clickable"><HomeIcon className="sidebarListItemIcon"/>PROPERTIES</h3></Link> 
                    {/*<ul className="sidebarList">
                     
                      
                     
                    
                 I COMMENTED THE SUBMENU'S OUT
               
               <Link to ={'/properties/built/'} className="linkref">
                     <li className="sidebarListItem">
                         <AccountBalanceIcon  className="sidebarListItemIcon"/>
                        Completed 
                         
                     </li>
                     </Link> 



                     <Link  className="linkref" to={"/properties/offplan/"}>
                     <li className="sidebarListItem">
                       
                         <NearMeIcon className="sidebarListItemIcon"/>
                            Incomplete
                   
                     </li>
            </Link> 

                     


                    </ul> */}
                </div> {/*sidebar menu closing */}
            
                <br/>

          { !admin && 
                 <>
                 <Link  className="linkref" to={"/messages/"}>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle clickable"><EmailIcon className="sidebarListItemIcon"/> MESSAGES </h3>
                   
                </div> 
                </Link>

                   <br/>


                   <div className="sidebarMenu">
                    <h3 className="sidebarTitle"><SettingsIcon className="sidebarListItemIcon"/>SETTINGS </h3>
                  
                </div>
                </>
             }
               
                <br/>
                   <br/>
                   <br/> {/**maybe later i will use CSS margins to create spaces between options, not margins */}
                   
               { admin &&
               
               <div className="sidebarMenu">
                    <h3 className="sidebarTitle">ADMIN</h3>
                   <ul className="sidebarList">
                     
                      {/*I had to assign each emoji component a classname here, to enforce background color*/ }
                     
                    
                 <Link to ={"/admin/propertylist/"} className="linkref">
                     <li className="sidebarListItem">
                         <MapsHomeWorkIcon  className="sidebarListItemIcon"/>
                         Manage Properties 
                         
                     </li>
                </Link> 



                     <Link  className="linkref" to={"/admin/userlist/"}>
                     <li className="sidebarListItem">
                       
                         <SupervisedUserCircleIcon className="sidebarListItemIcon"/>
                            Manage Users 
                   
                     </li>
                    </Link> 

                     


                    </ul> 
                </div> 
                 }


                 {/*sidebar menu closing */}



                





               
            </div>
             {/*end of sidebar(below)*/}
        </div>
        
    )
}