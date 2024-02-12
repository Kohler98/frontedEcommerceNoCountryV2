import React, { useState } from 'react';

const CRMContext = React.createContext([{},()=>{}])

const CRMProvider = props =>{
    // definir el state inicial
    const [auth, setAuth] = useState({
        token: "",
        isAuthenticated: false,
        userRole:"",
        idUsuario: ""
    });
 
    return(
        <CRMContext.Provider value={[auth, setAuth]}>
            {props.children}
        </CRMContext.Provider>
    )
}

export{
    CRMContext,
    CRMProvider
}