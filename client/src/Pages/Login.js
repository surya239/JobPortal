import React,{useEffect, useState} from "react";
import Logo from '../Images/Capture.PNG';
import {useFormik} from 'formik';
import user from '../Images/icons8-user-50.png';
import password from '../Images/pass.png'
import google from '../Images/icons8-google-48.png';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom'
import {useToken} from '../Auth/useToken';
import { useQueryParams } from "./Components/useQueryParams";
import menu from '../Images/icons8-menu-24.png'
import close from '../Images/icons8-delete-50.png'

function Login(){
    const [openMenu, setOpenMenu] = useState(true);
    const [closeMenu, setCloseMenu] = useState(false);
    const changeMenu = (a,b) =>{
        setOpenMenu(a);
        setCloseMenu(b);
    }
    const [,setToken] = useToken()
    const [googleOauthurl, setGoogleOauthurl] = useState('');
    const [err, setErr] = useState('');
    const [iserr, setIserr] = useState(false);
    const history = useHistory();
    const { token: oauthToken } = useQueryParams();

    useEffect(() => {
        if(oauthToken){
            setToken(oauthToken)
            const encodedPayload = oauthToken.split('.')[1];
            const decode = JSON.parse(atob(encodedPayload));
            const { who, uname } = decode;
            if(who === null){
                history.push(`/profileUpdation/${uname}`)
            }
            if(who === 'Alumini'){
                history.push(`/recruiterAccount/${uname}`)
            }
            if(who === 'Student'){
                history.push(`/account/${who}/${uname}`)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() =>{
        const loadOauthurl = async () =>{
            try{
                const response = await axios.get('/auth/google/url');
                const { url } = response.data;
                setGoogleOauthurl(url);
            }catch(e){
                console.log(e)
            }
        }
        loadOauthurl();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

   const formik = useFormik({
        initialValues:{
            uname: '',
            pass: '',
        },
        validate: values => {
            let errors = {} 
            if(!values.uname){
                errors.uname = 'Required';
            }

            if(!values.pass){
                errors.pass = 'Required';
            }

            return errors;
        },
        onSubmit: async values => {
            const uname = values.uname;
            const pass = values.pass;
            try {
                const response = axios.post('/api/login',{ uname, pass})
                if((await response).status === 202){
                    setIserr(true);
                    setErr('User name is wrong')
                }
                if((await response).status === 204){
                    setIserr(true);
                    setErr('Password is Incorrect')
                }
                const {token} = (await response).data;
                setToken(token);
                const encodedPayload = token.split('.')[1];
                const decode = JSON.parse(atob(encodedPayload));
                const {who} = decode;
                if(who === null){
                    history.push(`/profileUpdation/${uname}`)
                }
                if(who === 'Alumini'){
                    history.push(`/recruiterAccount/${uname}`)
                }
                if(who === 'Student'){
                    history.push(`/account/${who}/${uname}`)
                }
               
            } catch (err) {
                console.log(err)
            }
        }
    })

    return(
        <>
            <div>
                <div>
                <div className="head_c">
             <header className="head" >
                        <img src={Logo} width="180px" alt="logo" />
                        <div>
                        <button className={'menu '+openMenu} onClick={() => changeMenu(false,true)}><img src={menu} alt="menu" /></button>
                        <button className={"menu "+closeMenu} onClick={() => changeMenu(true, false)}><img src={close} width="30px" alt="menu" /></button>
                        </div>

            </header>
            <div className={"btns "+closeMenu}>
                        <button id="x" onClick={() => history.push('/signup')}>SignUp</button>
                            <button id="y" onClick={() => history.push('/login')}>LogIn</button>
                        </div>
            </div>
                    <div className='back' >
                        <div className="form_control" onSubmit={formik.handleSubmit} >
                                <form id='form' className='form' onSubmit={formik.handleSubmit} >
                                    <div className='w_100' >
                                        <h3>LogIn</h3>
                                    </div>

                                    <div className="icon" >
                                        <input autoComplete='off' type="text" name="uname" id="uname" required="required" value={formik.values.uname} onBlur={formik.handleBlur} onChange={formik.handleChange} ></input>
                                        <label className="label">User Name</label>
                                        <div className='i'>
                                            <img src={user} alt='name' />
                                        </div>
                                    </div>
                                        
                                    <div className='inp_mar' >
                                        {formik.touched.uname && formik.errors.uname ? <div className="error" >{formik.errors.uname}</div>:null}
                                    </div>

                                    <div className='icon'>
                                        <input autoComplete='off' type='Password' required='required' name='pass' id='pass' value={formik.values.pass} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                                        <label className='label' htmlFor='pass' >Password</label>
                                        <div className='i'>
                                            <img src={password} alt='password' />
                                        </div>
                                    </div>
                                    <div className='inp_mar'>
                                        {formik.touched.pass && formik.errors.pass ? <div className='error'>{formik.errors.pass}</div> : null}
                                    </div>
                                    {iserr ? <div className='allready w_100' ><p >{err}</p></div>:null }
                                    <div className='submit'>
                                        <input type='submit' value='Login' />
                                    </div>
                                    <div className='hr'><hr /></div>
                                    {/* <div className='inp_mar'></div> */}

                                    <div >
                                        <p className='w_100'>Or LogIn with</p>
                                    </div>

                                    <div className='w_100' >
                                        <button disabled={!googleOauthurl} onClick={() => window.location.href = googleOauthurl} className='gb' type='button'>
                                        <img src={google} alt='google' width='30px' />
                                        </button>
                                    </div>
                                    
                                    <div className='a_l'>
                                        <p>Don't Have an Account <Link to='/signup'>SignUp</Link></p>
                                    </div>

                                </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;