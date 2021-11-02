import React,{useState} from 'react';
import Logo from '../Images/Capture.PNG';
import { useParams } from 'react-router-dom'
import { useUser } from '../Auth/useUser';
import {useFormik} from 'formik';
import axios from 'axios'
import {useToken} from '../Auth/useToken';
import { useHistory } from 'react-router-dom';

function ProfileUpdation(){
    const user = useParams();
    const use = useUser();
    const [who,setWho] = useState('')
    const {fname, uname, email} = use;
    const [,setToken] = useToken();
    const history = useHistory();
    const formik = useFormik({
        initialValues:{
            phno:'',
        },
        onSubmit: async value => {
            const ph_no = value.phno;
            try {
                const response = axios.post('/update',{uname, ph_no, who});
            const {token} = (await response).data;
            setToken(token);
            if(who === 'Student')
            history.push(`/studentProfileUpdation/Student/${uname}`)
            if(who === 'Alumini')
            history.push(`/recruiterAccount/${uname}`)
            } catch (err) {
                console.log(err)
            }
            
        }
    })
    return(
        <>
            <div>
            <header className="head" >
                        <img className="logo" src={Logo} alt="logo" width="180px" />
            </header>
            </div>
                <div className = 'form_control' >
                    <form onSubmit = {formik.handleSubmit} className='up_form' >
                        <h3 className='h' >Update Your Profile</h3>
                        <div>
                            <label>Full Name</label>
                            <input type = 'text' value={fname} disabled className='input' ></input>
                        </div>
                        <div>
                            <label>User Name</label>
                            <input type='text' value={uname} disabled className='input'></input>
                        </div>
                        <div>
                            <label>Email</label>
                            <input type='email' value={email} disabled className='input' ></input>
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <input className='input' type='text' value={formik.values.phno} id='phno' name='phno' onChange={formik.handleChange} ></input>
                        </div>
                        <div>
                            <label>Who am I?</label>
                            <div className='separate' >
                                <div>
                                    <input type ='radio' name='who' id='who' value='Student' onChange = {(e) => setWho(e.target.value)}></input>
                                    <p>Student</p>
                                </div>
                                <div className='space' >
                                    <input type="radio" name='who' id='who' value='Alumini' onChange = {(e) => setWho(e.target.value)}></input>
                                    <p>Recruiter</p>
                                </div>
                            </div>
                        </div>
                        <div className='submit_up' >
                            <input  type='submit' value='Next' />
                        </div>
                    </form>
                </div>
        </>
    )
}

export default ProfileUpdation;