import Logo from '../Images/Capture.PNG';
import {useHistory, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react'
import axios from 'axios';
import location from "../Images/map-location.png";
import money from '../Images/hand.png';
import time_l from '../Images/time-left.png'
import userProfile from '../Images/user.png'

function Alumini(){
    const {uname} = useParams();
    const history = useHistory();
    const [openNav,setOpenNav] = useState(false);
    const [isNo, setIsNo] = useState(false)
    const [jobs, setJobs] = useState([])
    const job = async () =>{
        try {
            const response = axios.get(`/user/jobs/${uname}`);
            const jsondata = (await response).data;
            setJobs(jsondata);
            if(jsondata.length === 0){
                setIsNo(true)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const logout = () => {
        localStorage.removeItem('token');
        history.push('/')
    }
    useEffect(() => {
        job()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uname])

    function go_view(id_no, job_name){
        history.push(`/viewApplicants/recruiterAccount/${uname}/${id_no}/${job_name}`)
    }
    function redirect(){
        history.push(`/post/recruiterAccount/${uname}`);
    }

    const delet= async (id_no,) => {
        try {
           const response = await axios.put(`/api/deleteJob/${id_no}`)
            if(response.status === 200){
                window.location.reload(false)
            }
        } catch (err) {
            console.error(err)
        }
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
                    <button type="button" onClick={() => logout()} >LogOut</button>
                </div>
                </div>
            </div>
            <div className="post" >
                <button type='button'  onClick={() => redirect()} > Post Job </button>
            </div>
            <div className="job_list">
                <h3>My Jobs</h3>
                {isNo === true ? <div className="divh"><h3>No Jobs Posted</h3></div> : null}
                <div className="cards">
                    {jobs.map(job_li => (
                        <div className="card" key={ job_li.id_no}>
                            <div className="card_b">
                                <div className='d_f'>
                                    <h4>{job_li.job_name}</h4>
                                </div>
                                <div>
                                    <h5>{job_li.o_name}</h5>
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
                                            <span>{job_li.stipend}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src={time_l} alt='time' width="15px"  />
                                        <div className="sp" >
                                            <span>Posted on</span>
                                            <span>{job_li.post_d}</span>
                                        </div>
                                    </div>
                                    <span className="work" >{job_li.j_type}</span>
                                    
                                </div>
                                <div className="n_f">
                                    <h4>No.of Appications: </h4>
                                    <p>{job_li.no_app}</p>
                                </div>
                                <div className="v_d" >
                                        <button className="a" type="button" onClick={() => go_view(job_li.id_no, job_li.job_name)} >View Applicants</button>
                                        <button className="c" type="button" onClick={() => delet(job_li.id_no)}>Delete</button>
                                    </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Alumini;