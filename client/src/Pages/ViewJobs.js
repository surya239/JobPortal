import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {useParams, useHistory} from 'react-router-dom'
import location from "../Images/map-location.png";
import money from '../Images/hand.png';
import time_l from '../Images/time-left.png';
import Apply from './Apply'
import menu from '../Images/icons8-menu-24.png'
import exit from '../Images/icons8-delete-50.png'

function ViewJobs(props){
    const {uname, who, categories} = useParams();
    const history = useHistory()
    const use = useParams()
    const searchValue = props.name;
    const [expantmenu, setExpantmenu] =useState('on');
    const [closeMenu, setCloseMenu] = useState('off');
    const [show, setShow] = useState('')
    // const [searchTerms, setSearchTerms] = useState('');
    const [getjob, setGetjob] = useState([]);
    const cate = [
       
        {
            id: 1,
            value: 'Accoundant'
        },
        {
            id: 2,
            value: 'Back End Developer'
        },
        {
            id: 3,
            value: 'Cloud Architect'
        },
        {
            id: 4,
            value: 'Computer Scientist'
        },
        {
            id: 5,
            value: 'Data Entry'
        },
        {
            id: 6,
            value: 'Data Scientist'
        },  
        {
            id: 7,
            value: 'Front End Developer'
        },
        {
            id: 8,
            value: 'Full Stack Developer'
        },
        {
            id: 9,
            value: 'Graphic Designer'
        },
        {
            id: 10,
            value: 'Android Developer'
        },
        {
            id: 11,
            value: 'Ios Developer'
        },
        {
            id: 12,
            value: 'UI/UX Designer'
        },
        {
            id: 13,
            value:'Web Developer'
        }
    ]

    const getJobs = async () => {
        try {
            const response = await axios.get('/api/job')
            let job_list = [];
            job_list = response.data;
            if(searchValue !== ''){
                const newJobList = job_list.filter((jobs) => {
                    return Object.values(jobs).join(" ").toLowerCase().includes(searchValue.toLowerCase())
                })
                setGetjob(newJobList)
            }
            else{
                setGetjob(job_list);
            }
            
            
        } catch (err) {
            console.log(err)
        }
    }

    useEffect( () => {
        getJobs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchValue, use])

    const cateJoblist = async () =>{
        try {
            const response = await axios.get('/api/job')
            let job_list = [];
            job_list = response.data;
            if(categories !== undefined){
                const newJobList = job_list.filter((jobs) => {
                    return Object.values(jobs).join(" ").toLowerCase().includes(categories.toLowerCase())
                })
                setGetjob(newJobList);
            }


        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        cateJoblist();
    }, [categories])
  

    const changeMenu = (a, b, c) =>{
        setExpantmenu(b);
        setCloseMenu(a)
        setShow(c)
    }
    
    

    return(
        <>
        
             <div className="Grid-container " >
                    <div className = {'categories '+show}>
                        <div className="d_n" >
                        <h3 className="b-m0" > Job Categories</h3>
                        <button className={'close '+closeMenu} onClick={() => changeMenu('off', 'on', 'off',)} type="button" > 
                     <img  width="30px" src={exit} alt="exit" />
                    </button>
                        </div>
                    <p className='bor' />
                    <div className='cate' >
                        {cate.map(ca => (
                            <button id={ca.value === categories ? "scate" : "ncate"} key={ca.id} className='cate_li' onClick={() => history.push(`/${ca.value}/account/${who}/${uname}`)} >
                                {ca.value}
                            </button>
                        ))}
                        <button id={categories === undefined ? "scate" : 'ncate'} className='cate_li' onClick={() => history.push(`/account/${who}/${uname}`)} >All Jobs</button>
                    </div>
                    </div>
                    <div className="jobs" >
                    <div className="d_n">
                    <div>
                    <h3 className="b-m0" >Recent Jobs</h3>
                        <p className='bor' />
                    </div>
                     <button className={expantmenu} onClick={() => changeMenu('on', 'off', 'on')} type="button" >
                     <img  width="30px" src={menu} alt="menu" />
                     </button>
                </div>
                        <div className="card_job">
                            {getjob.map(job_li => (
                                <div className="card_a" key={job_li.id_no} >
                                    <div className ='span_r' >
                                        <span>{job_li.j_type}</span>
                                    </div>
                                    <div className='d_f' >
                                    <h4>{job_li.job_name}</h4>
                                </div>
                                <div>
                                    <h5>{job_li.o_name}</h5>
                                </div>
                                <div className="f_b" >
                                    <div className="s_1">
                                        <img src={location} alt="location" width="20px" />
                                        <div className='sp_l sl' >
                                            <span className='d-n' >Location</span>
                                            <span>{job_li.j_location}</span>
                                        </div>
                                    </div>
                                    <div className="s_2" >
                                        <img src={money} alt="money" width="20px" />
                                        <div className='sp_l sl' >
                                            <span >Stipend</span>
                                            <span>{job_li.stipend}</span>
                                        </div>
                                    </div>
                                    <div className="s_3">
                                        <img src={time_l} alt="time" width="20px" />
                                        <div className="sp_l sl">
                                            <span>Posted On</span>
                                            <span>{job_li.post_d}</span>
                                        </div>
                                    </div>
                                </div >
                                <div className="r_s">
                                <h4 className="m_0">Required Skills: </h4>
                                    <span>{job_li.r_skills}</span>
                                </div>
                                <div>
                                    <Apply name={job_li.id_no}/>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            
        </>
    )
}

export default ViewJobs;