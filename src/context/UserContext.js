import React, { useEffect, useState } from 'react';
import { getUserAccount } from '../services/userService'

const UserContext = React.createContext(null);


const UserProvider = ({ children }) => {

    const userDefault = {
        isLoading: true,
        isAuthenticated: false,
        token: "",
        account: {}
    }

    const [user, setUser] = useState(userDefault);

    // Login updates the user data with a name parameter
    const loginCT = (userData) => {
        setUser({ ...userData, isLoading: false });
    };

    // Logout updates the user data to default
    const logoutCT = (userData) => {
        setUser({ ...userData, isLoading: false });

    };

    const fetchUser = async () => {
        let res = await getUserAccount();
        if (res && res.EC === 0) {
            let groupwithRole = res.DT.groupwithRole;
            let email = res.DT.email;
            let username = res.DT.username;
            let data = {
                isAuthenticated: true,
                token: res.DT.access_token,
                account: { ...groupwithRole, email, username },
                isLoading: false
            }
            setUser(data);
        } else {
            setUser({ ...userDefault, isLoading: false })
        }

    }

    useEffect(() => {
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
            fetchUser()
        } else {
            setUser({ ...user, isLoading: false })
        }

    }, [])

    return (
        <UserContext.Provider value={{ user, loginCT, logoutCT }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };