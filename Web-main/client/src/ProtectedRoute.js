import React, { Component } from 'react'
import { Route, Redirect} from "react-router-dom";
import HomePage from './components/home-page/home-page';
import { roleA } from './constants/listItem';

function ProtectedRoute({isAuth: isAuth, ...rest}) {
    
    return (<Route 
        {...rest}
        render={(props)=> {
            if (isAuth) {
                return <HomePage listItems={roleA} />
            } else {
                return (
                    <Redirect to= {{pathname: "/login", state: {from: props.location}}} />
                );
            }
        }}
    />
    );
}
export default ProtectedRoute