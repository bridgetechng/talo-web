import React,{useEffect, useState} from 'react';

import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";

import Homepage from "./pages/homepage/Homepage";
import Loginpage from "./pages/loginpage/Loginpage";
import Registerpage from "./pages/registerpage/Registerpage";


import OffplanPropertylist from "./pages/offplanpropertylist/OffplanPropertylist";
import BuiltPropertylist from "./pages/builtpropertylist/BuiltPropertylist";

import PropertyView from "./pages/propertyview/Propertyview";
import PropertyBuy from "./pages/propertybuy/Propertybuy";
import PropertySell from "./pages/propertysell/Propertysell";

import Usertable from "./pages/usertable/Usertable";
import Propertytable from "./pages/propertytable/Propertytable";
import AddProperty from "./pages/addproperty/Addproperty";
import EditProperty from "./pages/editproperty/Editproperty";

import MessagePage from "./pages/messagepage/MessagePage";

import "./app.css";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";



function App() {

    const [loggedOut,setLoggedOut] = useState(true)
    let {pathname} =useLocation();

    useEffect(()=>{

    
   },[])

  return (
     <>
     {!(pathname === "/"|| pathname === "/register") && <Topbar/>}
     {!(pathname === "/"|| pathname === "/register")  && <Sidebar/>}
      
  
       <div className={ !(pathname === "/"|| pathname === "/register") && "container"}> {/*making this flexbox conditional for the login screen to be centred ...very crude , i know */}
     
      
      {/*Note that router used to wrap sidebar and routes ,
       now it wraps App, revert if need be ,but i did it so I can use the useLocation hook and 
        do a faux login page, so I wouldnt have to start placing sidebar in all my components*/}
     
      
         <Routes>
         <Route  path="/" element={<Loginpage/>} />
         <Route  path="/register" element={<Registerpage/>} />
          
           
           <Route  path="/home/:pageNumber"  element={<Homepage/>} />
           <Route  path="/home/" exact element={<Homepage/>} />


           <Route  path="/properties/offplan/:pageNumber"  element={<OffplanPropertylist/>} />

           <Route  path="/properties/offplan/" exact element={<OffplanPropertylist/>} />

           <Route  path="/properties/built/:pageNumber" element={<BuiltPropertylist/>} />
          <Route  path="/properties/built/" exact element={<BuiltPropertylist/>} />
          
          
           <Route  path="/admin/addproperty" element={<AddProperty/>} />
           <Route  path="/admin/editproperty/:id" element={<EditProperty/>} />
           
           
           <Route  path="/messages/" element={<MessagePage/>} />
           
           <Route  path= "/propertyview/:address" element ={<PropertyView/>} />

           <Route  path= "/propertybuy/:address" element ={<PropertyBuy/>} />
           <Route  path= "/propertysell/:address" element ={<PropertySell/>} />

           <Route  path= "/admin/userlist/:pageNumber" element ={<Usertable/>} />
           <Route  path= "/admin/userlist/" element ={<Usertable/>} />

           <Route  path= "/admin/propertylist/:pageNumber"  element ={<Propertytable/>} />
           <Route  path= "/admin/propertylist/" exact element ={<Propertytable/>} />

           
         </Routes>
      
       </div> 


     
    

    </>
  );
}

export default App;
