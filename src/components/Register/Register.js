import React, { useEffect, useState } from 'react';
import "./Register.scss"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { registerNewUser } from '../../services/userService';


const Register = (props) => {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [phone, setphone] = useState("");
    const [username, setusername] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidconfirmPassword: true
    }
    const [objCheckvalid, setobjCheckvalid] = useState(defaultValidInput)

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login")
    }

    const handleRegister = async () => {
        let check = isValidInputs();
        if (check) {
            let response = await registerNewUser(email, username, phone, password);
            if (+response.EC === 0) {
                toast.success(response.EM)
                navigate("/login")
            } else {
                toast.error(response.EM)
            }
        }


    }

    const isValidInputs = () => {
        setobjCheckvalid(defaultValidInput)
        if (!email) {
            toast.error("email is required");
            setobjCheckvalid({ ...defaultValidInput, isValidEmail: false })
            return false;
        }

        let re = /\S+@\S+\.\S+/;
        if (!re.test(email)) {
            toast.error("Please enter a valid email address");
            setobjCheckvalid({ ...defaultValidInput, isValidEmail: false })
            return false;
        }

        if (!phone) {
            toast.error("phone is required");
            setobjCheckvalid({ ...defaultValidInput, isValidPhone: false })
            return false;
        }
        if (!password) {
            toast.error("password is required");
            setobjCheckvalid({ ...defaultValidInput, isValidPassword: false })
            return false;
        }

        if (password !== confirmpassword) {
            toast.error("Your password is not the same");
            setobjCheckvalid({ ...defaultValidInput, isValidconfirmPassword: false })
            return false;
        }



        return true;
    }

    // useEffect(() => {
    //     axios.get("http://localhost:8080/api/test-api").then(data => {
    //         console.log('>>> check data axios:', data)
    //     })
    // }, []);

    return (
        <div className='register-container'>
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
                        <div className='form-group'>
                            <label className='col-form-label'>Email:</label>
                            <input type='email' className={objCheckvalid.isValidEmail ? 'form-control' : 'form-control is-invalid'} placeholder='Email address'
                                value={email} onChange={(e) => setemail(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className='col-form-label'>Username:</label>
                            <input type='text' className='form-control' placeholder='Username'
                                value={username} onChange={(e) => setusername(e.target.value)}

                            />
                        </div>
                        <div className='form-group'>
                            <label className='col-form-label'>Phone number:</label>
                            <input type='text' className={objCheckvalid.isValidPhone ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Phone number'
                                value={phone} onChange={(e) => setphone(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className='col-form-label'>Password:</label>
                            <input type='password' className={objCheckvalid.isValidPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Password'
                                value={password} onChange={(e) => setpassword(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className='col-form-label'>Re-enter Password:</label>
                            <input type='password' className={objCheckvalid.isValidconfirmPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Re-enter Password'
                                value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)}
                            />
                        </div>
                        <button className='btn btn-primary' onClick={() => handleRegister()}>Register</button>

                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleLogin()}>
                                Already're an accout. Login

                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Register;