import {useParams, useHistory} from 'react-router-dom'
import Logo from '../Images/Capture.PNG';
import {useEffect, useState} from 'react';
import axios from 'axios';
import ViewJobs from './ViewJobs';
import search_i from '../Images/icons8-search-50.png';
import location from "../Images/map-location.png";
import money from '../Images/hand.png';
import time_l from '../Images/time-left.png';
import userProfile from '../Images/user.png'
import down from '../Images/download.png';

function StudentDashboard(){
    const {uname} = useParams();
    const [search, setSearch] = useState('');
    const [isno, setIsno] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [openNav,setOpenNav] = useState(false)
    const history = useHistory()
    const [close, setClose] = useState(false)
    const myjobs = async () =>{
        try {
            const response = await axios.get(`/api/user/application/${uname}`);
            const job_list = response.data;
            if(response.status === 202){
                setIsno(true)
            }
            else {
                setIsno(false);
                
                setJobs(job_list)
            }
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        myjobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() =>{
        if(search !== ''){
            setClose(true)
        }
        else{
            setClose(false)
        }
    },[search])
    const logout = () => {
        localStorage.removeItem('token');
        history.push('/')
    }
    return(
        <>
            <header className="head" >
                        <img src={Logo} width="180px" alt="logo" />
                        <button className="btn" type="button"><img width="30px" src={userProfile} alt='user' onClick={() => setOpenNav(!openNav)} /></button>
            </header>
            <div className={'edit '+openNav} >
                <div></div>
                <div className="div">
                <div>
                <button onClick={() => history.push(`/EditProfile/Student/${uname}`)} >Edit Profile</button>
                </div>
                <div>
                <button type="button" onClick={() => logout()}>LogOut</button>
                </div>
                </div>
            </div>
            <div className='ex' >
                <div className='search' >
                    <input type='text' id='searchValue' name='searchValue' placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button type='button'  ><img src={search_i} alt='serch' /></button>
                </div>
                </div >
            <div>
                <div className={"dfc "+close} >
                    <button type="button" onClick={() => setClose(false)}>My Applications  <img src={down} width="18px" alt="down" /></button>
                </div>
                <div  className={'table '+close}><div>
                
                <div className='list' >
                <h3>My application</h3>
                    <ul className="list_u"  >
                        <li className='type_o'>Organization Name</li>
                        <li className="type" >Job Title</li>
                        <li className="j_type" >Job Type</li>
                        <li className="j_type" >Stipend</li>
                        <li className="type">Location</li>
                        <li className="type" >Applied on</li>
                        <li className="type" >Application Status</li>
                    </ul>
                    {jobs.map(job_li => (
                        <ul key={job_li.id_no} className="list_c" >
                        <li className='type_o'>{job_li.org_name}</li>
                        <li className='type'>{job_li.job_n}</li>
                        <li className="j_type">{job_li.jobtype}</li>
                        <li className="j_type" >{job_li.stipent}</li>
                        <li className="type">{job_li.j_location}</li>
                        <li className="type">{job_li.app_date}</li>
                        <li className= 'type '>{job_li.app_status}</li>
                        </ul>
                    ))}
                {isno ? <div className="ta-c"> No Jobs Applied </div>:null}
                </div>
                </div>
                </div>
            </div>
            <div className={'small '+close} >
                <h3>My Applications</h3>
                    <div className="cards" >
                        {jobs.map(job_li => (
                            <div className="card" key={ job_li.id_no} >
                                <div className="card_b" >
                                    <div className ='span_r' >
                                <span className={job_li.app_status} >{job_li.app_status}</span>
                                </div>
                                <div className='d_f' >
                                    <h4>{job_li.job_n}</h4>
                                </div>
                                <div>
                                    <h5>{job_li.org_name}</h5>
                                </div>
                                <div className="d_l" >
                                    <img src={location} alt="location" width="20px" />
                                    <p>{job_li.j_location}</p>
                                </div>
                                <div className='f_f' >
                                    <div >
                                        <img src={money} alt="money" width="20px" />
                                        <div className='sp' >
                                            <span>Stipend</span>
                                            <span>{job_li.stipent}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src={time_l} alt='time' width="20px"  />
                                        <div className="sp" >
                                            <span>Applied on</span>
                                            <span>{job_li.app_date}</span>
                                        </div>
                                    </div>
                                    <span className="work" >{job_li.jobtype}</span>
                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
                {isno ? <div className="ta-cb"> No Jobs Applied </div>:null}
                </div>

               < ViewJobs id='search' name={search} />
        </>
    )
}

export default StudentDashboard