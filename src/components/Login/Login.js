import React, { useContext, useEffect, useState } from 'react';
import "./Login.scss"
import { json, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/userService';
import { UserContext } from '../../context/UserContext';

const Login = (props) => {

    const { loginCT } = useContext(UserContext);

    const navigate = useNavigate();

    const [valueLogin, setvalueLogin] = useState("");
    const [password, setpassword] = useState("");

    const defaultValidInput = {
        isValidEmail: true,
        isValidPassword: true,
    }
    const [objCheckvalid, setobjCheckvalid] = useState(defaultValidInput)


    const handleCreateNewAccout = () => {
        navigate("/register")
    }

    const handleLogin = async () => {
        setobjCheckvalid(defaultValidInput)
        if (!valueLogin) {
            setobjCheckvalid({ ...defaultValidInput, isValidEmail: false })
            toast.error("Please enter your email address or phone number");
            return;
        }
        if (!password) {
            setobjCheckvalid({ ...defaultValidInput, isValidPassword: false })
            toast.error("Please enter your password");
            return;
        }

        let res = await loginUser(valueLogin, password);
        if (res && res && +res.EC === 0) {
            let groupwithRole = res.DT.groupwithRole;
            let email = res.DT.email;
            let username = res.DT.username;
            let data = {
                isAuthenticated: true,
                token: res.DT.access_token,
                account: { ...groupwithRole, email, username }
            }
            localStorage.setItem('jwt', res.DT.access_token)
            loginCT(data)
            navigate("/users")
            // window.location.reload();
        }
        if (res && res && +res.EC !== 0) {
            toast.error(res.EM)
        }
    }

    const handlePressEnter = (e) => {
        if (e.charCode === 13 && e.code === "Enter") {
            handleLogin();
        }
    }


    return (
        <div className='login-container'>
            <div className='container'>
                <div className='row'>
                    <div className='content-left col-12 d-none col-sm-7 d-sm-block'>
                        <div className='brand'>
                            Facebook
                        </div>
                        <div className='detail'>
                            Facebook helps you connect and share with the people in your life.
                        </div>
                    </div>
                    <div className='content-right col-sm-5 col-12 green d-flex flex-column gap-3 py-3'>
                        <div className='brand d-sm-none'>
                            Facebook
                        </div>
                        <input type='text' className={objCheckvalid.isValidEmail ? 'form-control' : 'form-control is-invalid'}
                            placeholder='Email address or phone number'
                            value={valueLogin}
                            onChange={(e) => setvalueLogin(e.target.value)}
                        />
                        <input type='password' className={objCheckvalid.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            onKeyPress={(e) => handlePressEnter(e)}
                        />
                        <button className='btn btn-primary'
                            onClick={() => handleLogin()}
                        >Login</button>
                        <span className='text-center'>
                            <a className='forgot-password' href='#'>
                                Forgot your password?
                            </a>
                        </span>
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleCreateNewAccout()}>
                                Create new Accout

                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Login;