import React, { useContext, useEffect } from 'react';
import {
    Route,
    Router,
    Routes,
    useNavigate,
    redirect,
    Navigate
} from "react-router-dom";
import { UserContext } from '../context/UserContext';

const PrivateRoutes = (props) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);


    if (user && user.isAuthenticated === true) {
        return (
            <Routes>
                <Route path={"/"} element={props.component} />
            </Routes>
        );
    } else {
        return <Navigate to="/login" replace />;
    }


};

export default PrivateRoutes;