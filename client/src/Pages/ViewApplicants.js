import React,{useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import axios from 'axios';
import Logo from '../Images/Capture.PNG';
import email from '../Images/email.png'
import phno from '../Images/icons8-phone-24.png'
import time from '../Images/time-left.png'
import SelectReject from './SelectReject'
import userProfile from '../Images/user.png'

function ViewApplication(){
    const history = useHistory()
    const [openNav,setOpenNav] = useState(false)
    const {id_no,uname, job_name} = useParams();
    const [applist, setList] = useState([])


    const applications = async () => {
        try {
            const response = await axios.get(`/api/viewApplicants/${id_no}`);
            const data = response.data;
            setList(data)
        } catch (err) {
            console.log(err)
        }
    }

    

    useEffect(() => {
        applications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const logout = () => {
        localStorage.removeItem('token');
        history.push('/')
    }
    return(
        <>
            <div>
            <header className="head" >
                        <img src={Logo} width="180px" alt="logo" />
                        <button className="btn" type="button"><img width="30px" src={userProfile} alt='user' onClick={() => setOpenNav(!openNav)} /></button>
            </header>
            <div className={'edit '+openNav} >
                <div></div>
                <div className="div">
                <div>
                <button onClick={() => history.push(`/recruiterAccount/${uname}`)} >Dashboard</button>
                </div>
                <div>
                <button type="button" onClick={() => logout()}>LogOut</button>
                </div>
                </div>
                </div>
            </div>
            <div>
                <h2>{job_name}</h2>
                 <div className ="cards">
                    {applist.map(app_li => (
                        <div className="card" key={app_li.id_no}>
                            <div className="card_b">
                                <div className="f_e">
                                    <div></div>
                                    <a href={app_li.resume} target="_blank" >Resume</a>
                                </div>
                                <div className="d_f " >
                                    <h3>{app_li.fname}</h3>
                                </div>
                                <div className="f_f m_10">
                                    <div>
                                        <img src={email} alt="email" width="18px" />
                                        <div className='sp'>
                                            <span>{app_li.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="f_f m_10">
                                    <div>
                                        <img src={phno} alt="phone" width="20px" />
                                        <div className='sp' >
                                            <span>{app_li.ph_no}</span>
                                        </div>
                                    </div>
                                    <div>
                                         <img src={time} alt="time" width="15px" />
                                         <div className='sp'>
                                             <span>Applied on</span>
                                             <span>{app_li.app_date}</span>
                                         </div>
                                    </div>
                                </div>
                                <div className="r_s">
                                    <h4 className="m_0">Skills:</h4>
                                    <span>{app_li.skills}</span>
                                </div>
                                <SelectReject name={app_li.id_no} />
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ViewApplication;
