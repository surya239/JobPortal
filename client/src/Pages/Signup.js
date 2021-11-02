import React,{useEffect, useState} from "react";
import Logo from '../Images/Capture.PNG';
import {useFormik} from 'formik';
import {Link} from 'react-router-dom';
import axios from 'axios';
import name from '../Images/name.png';
import user from '../Images/icons8-user-50.png';
import email_i from '../Images/email.png';
import password from '../Images/pass.png'
import c_password from '../Images/password.png';
import google from '../Images/icons8-google-48.png';
import {useToken} from '../Auth/useToken';
import {useHistory} from 'react-router-dom';
import menu from '../Images/icons8-menu-24.png'
import close from '../Images/icons8-delete-50.png'

function Signup(){
    const [openMenu, setOpenMenu] = useState(true);
    const [closeMenu, setCloseMenu] = useState(false);
    const changeMenu = (a,b) =>{
        setOpenMenu(a);
        setCloseMenu(b);
    }
    const history = useHistory();
    const [,setToken] = useToken()
    const [googleOauthurl, setGoogleOauthurl] = useState('');
    const [already, setAlready] = useState(false)

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
            fname: '',
            uname: '',
            email: '',
            pass: '',
            c_pass: ''
        },
        validate: values => {
            let errors = {} ;
            if(!values.fname){
                errors.fname= 'Required';
            }
            else if(values.fname.length <5){
                errors.fname='Enter valid name'
            }
            else if(values.fname.match(/(\d+)/)){
                errors.fname='Invalid Name'
            }
            if(!values.uname){
                errors.uname = 'Required';
            }

            if(!values.email){
                errors.email ='Required';
            }

            if(!values.pass){
                errors.pass = 'Required';
            }

            if(!values.c_pass){
                errors.c_pass = 'Required';
            }

            else if(values.pass !== values.c_pass){
                errors.c_pass='Password Doesn\'t match';
            }

            return errors;
        },
        onSubmit: async values => {
            const fname = values.fname;
            const uname = values.uname;
            const email = values.email;
            const pass = values.pass;
            try {
                const response = axios.post('/sign',{fname, uname, email, pass})
                const {token} = (await response).data;
                setToken(token);
                if((await response).status === 200)
                    history.push(`/profileUpdation/${uname}`);
                if((await response).status === 202){
                setAlready(true);
                }
            } catch (err) {
                console.log(err)
            }
        }
    })


    return(
        <>
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
            <div className = 'back'  >
                        <div className="form_control" onSubmit={formik.handleSubmit} >
                                <form id='form' className='form' onSubmit={formik.handleSubmit} >
                                    <div>
                                        <h3>Create Account</h3>
                                    </div>
                                    <div className= "icon" >
                                        <input autoComplete='off' type="text" name="fname" onBlur={formik.handleBlur} required="required" id="fname" onChange={formik.handleChange} value={formik.values.fname} ></input>
                                        <label className="label" >Firstname</label>
                                        <div className='i' >
                                            <img src={name} alt="name" />
                                        </div>
                                            
                                    </div>
                                    <div className="inp_mar">
                                        {formik.touched.fname && formik.errors.fname ? <div className="error" >{formik.errors.fname}</div> : null }
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
                                        <input autoComplete='off' type="email" name="email" id='email' required='required' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        <label className='label' htmlFor='email' >Email</label>
                                        <div className='i' >
                                            <img src={email_i} alt='email' />
                                        </div>
                                    </div>                                   <div className='inp_mar'>
                                        {formik.touched.email && formik.errors.email ? <div className='error'>{formik.errors.email} </div> : null }
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

                                    <div className='icon'>
                                        <input autoComplete='off' type='Password' required='required' name='c_pass' id='c_pass' value={formik.values.c_pass} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                                        <label className='label' htmlFor='pass' >Confirm Password</label>
                                        <div className='i'>
                                            <img src={c_password} alt='password' />
                                        </div>
                                    </div>
                                    <div className='inp_mar'>
                                        {formik.touched.c_pass && formik.errors.c_pass ? <div className='error'>{formik.errors.c_pass}</div> : null}
                                    </div>
                                    {already ? <div className='allready w_100' ><p >Username or Email Already Exist</p></div>:null }
                                    <div className='submit'>
                                        <input type='submit' value='SignUp' />
                                    </div>
                                    <div className='hr'><hr /></div>
                                    {/* <div className='inp_mar'></div> */}

                                    <div >
                                        <p className='w_100'>Or SignUp with</p>
                                    </div>

                                    <div className='w_100' >
                                        <button disabled={!googleOauthurl} onClick={() => window.location.href = googleOauthurl} className='gb' type='button'>
                                        <img src={google} alt='google' width='30px' />
                                        </button>
                                    </div>
                                    
                                    <div className='a_l'>
                                        <p>Already Have an Account <Link to="/login">LogIn</Link></p>
                                    </div>

                                </form>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default Signup;