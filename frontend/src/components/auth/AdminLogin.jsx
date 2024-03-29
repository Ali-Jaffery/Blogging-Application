import React, { useEffect, useState } from 'react';
import { BsAt } from 'react-icons/bs';
import { FaLock, FaFacebook, FaGoogle } from 'react-icons/fa';
import Navbar from '../home/Navbar';
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { admin_login } from "../../store/actions/authAction";
import { Helmet } from 'react-helmet';

const AdminLogin = ({history}) => {
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage, authenticate } = useSelector(state => state.adminReducer);
    const [state, setState] = useState({
        email: '',
        password: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const adminLogin = (e) => {
        console.log("state"+state);
        e.preventDefault();
        dispatch(admin_login(state));
    }

    useEffect(()=>{
        if(authenticate){
            history.push('/dashborad');
        }
    },[dispatch,successMessage])

    useEffect(() => {
        if (errorMessage.error) {
            toast.error(errorMessage.error);
        }
        dispatch({type : "LOGIN_ERROR_CLEAR"})
    }, [errorMessage.error])

    return <>
    <Helmet>
    <title>Admin Login - BlogifyBlog</title>
    <meta name='description' content='Login to the admin panel of BlogifyBlog. Secure access to manage your blog and settings.' />
    <meta name='robots' content='noindex, nofollow' />
    <meta name='keywords' content='admin login, secure login, blog administration, authentication' />
    <meta name='author' content='BlogifyBlog' />
    <meta property='og:title' content='Admin Login - BlogifyBlog' />
    <meta property='og:description' content='Login to the admin panel of BlogifyBlog. Secure access to manage your blog and settings.' />
    <meta property='og:type' content='website' />
    <meta property='og:url' content='https://www.blogifyblog.com/admin/login' />
    <meta property='og:image' content='https://www.yourblog.com/app-image.png' />
</Helmet>

        <Navbar />
        <div className="admin_login">
            <Toaster position={'bottom-center'}
                reverseOrder={false}
                toastOptions={
                    {
                        style: {
                            fontSize: '15px'
                        }
                    }
                }
            />
            <div className="card admin-card">
                <div className="auth">
                    <h3>Admin login</h3>
                    <form onSubmit={adminLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="icon-input">
                                <div className="icon"><BsAt /></div>
                                <input onChange={inputHandle} value={state.email} type="email" name='email' id='email' placeholder='email' className="form-control" />
                            </div>
                            <p>{errorMessage?.email}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="icon-input">
                                <div className="icon"><FaLock /></div>
                                <input onChange={inputHandle} value={state.password} type="password" name='password' id='password' placeholder='password' className="form-control" />
                            </div>
                            <p>{errorMessage?.password}</p>
                        </div>
                        <div className="form-group">
                            {
                                loader ? <button className="btn btn-block">
                                    <div className="spinner">
                                        <div className="spinner1"></div>
                                        <div className="spinner2"></div>
                                        <div className="spinner3"></div>
                                    </div>
                                </button> : <button className="btn btn-block">
                                    Login
                                </button>
                            }
                        </div>
                    </form>
                </div>
              
            </div>
        </div>
    </>
};

export default AdminLogin;