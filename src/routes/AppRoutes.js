import React from 'react';
import {
    Route,
    Router,
    Routes,
} from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import User from '../components/ManageUser/User';
import PrivateRoutes from './PrivateRoutes';
import Roles from '../components/Role/Roles';
import GroupRole from '../components/GroupRole/GroupRole';

const AppRoutes = (props) => {
    return (
        <Routes>
            <Route path="/users" element={<PrivateRoutes component={<User />} />} />
            <Route path="/projects" element={<PrivateRoutes component={<>projects</>} />} />
            <Route path="/roles" element={<PrivateRoutes component={<Roles />} />} />
            <Route path="/group-roles" element={<PrivateRoutes component={<GroupRole />} />} />


            <Route path="/" element={<>Home</>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<>404 not found</>} />
        </Routes>

    );
};

export default AppRoutes;