import Logo from '../Images/Capture.PNG';
import { useParams,useHistory } from 'react-router-dom'
import { useFormik} from 'formik'
import { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import tick from '../Images/icons8-double-tick-48.png';
import Modal from 'react-modal';
import userProfile from '../Images/user.png'

const customStyles = {
    content: {
        top:'50%',
        left:'50%',
        right:'auto',
        bottom:'auto',
        marginRight: '-50%',
        transform:'translate(-50%, -50%)',
    },
};

function PostJob(){
    const [openNav,setOpenNav] = useState(false)
    const [job,setJob] = useState('');
    const [rskills, setRskills] = useState([]);
    const [categoriesList, setCategoriesList] = useState([])
    const [openmodel, setOpenmodel] = useState(false)
    let re_skills, categorie_li ;
    const history = useHistory();
    const {who,uname} = useParams();
    const logout = () => {
        localStorage.removeItem('token');
        history.push('/')
    }
    const val = [{
        value: 1,
        label: 'Fulltime'
    },
    {
        value: 2,
        label: 'Parttime'
    },
    {
        value: 3,
        label: 'Internship'
    }
]

const cate = [
       
    {
        value: 1,
        label: 'Accoundant'
    },
    {
        value: 2,
        label: 'Back End Developer'
    },
    {
        value: 3,
        label: 'Cloud Architect'
    },
    {
        value: 4,
        label: 'Computer Scientist'
    },
    {
        value: 5,
        label: 'Data Entry'
    },
    {
        value: 6,
        label: 'Data Scientist'
    },  
    {
        value: 7,
        label: 'Front End Developer'
    },
    {
        value: 8,
        label: 'Full Stack Developer'
    },
    {
        value: 9,
        label: 'Graphic Designer'
    },
    {
        value: 10,
        label: 'Android Developer'
    },
    {
        value: 11,
        label: 'Ios Developer'
    },
    {
        value: 12,
        label: 'UI/UX Designer'
    },
    {
        value: 13,
        label:'Web Developer'
    }
]
    var skill = [
        {
            value: 1,
            label: 'React Js'
        },
        {
            value: 2,
            label: 'HTML'
        },
        {
            value: 3,
            label: 'CSS'
        },
        {
            value: 4,
            label: 'MongoDb'
        },
        {
            value: 5,
            label: 'SQL'
        },
        {
            value: 6,
            label: 'Python'
        },
        {
            value: 7,
            label: 'C++'
        },
        {
            value: 8,
            label: 'PHP'
        },
        {
            value: 9,
            label: 'JavaScript'
        },
        {
            value: 10,
            label: 'Node Js'
        },
        {
            value:11,
            label:'Angular'
        },
        {
            value:12,
            label:'Next Js'
        },
        {
            value:13,
            label:'Flutter'
        },
        {
            value:14,
            label:'React Native'
        },
        {
            value:15,
            label:'Vue Js'
        },
        {
            value:16,
            label:'Google Cloud'
        },
        {
            value:17,
            label:'Amazon Web Service'
        },
        {
            value:18,
            label:'Statistics'
        },
        {
            value:19,
            label:'TypeScript'
        },
    ]
    var handle = (e) =>{
        setRskills(Array.isArray(e)? e.map (x => x.label):[])
    }
    var categorie = (e) =>{
        setCategoriesList(Array.isArray(e) ? e.map (x => x.label):[])
    }

    for(var i=0; i<categoriesList.length; i++){
        if(categorie_li === undefined) categorie_li = `${categoriesList[i]}`
        else categorie_li = `${categorie_li}, ${categoriesList[i]}`
    }

    for(var j = 0; j<rskills.length; j++){
        if(re_skills === undefined) re_skills= `${rskills[j]}`
        else re_skills = `${re_skills}, ${rskills[j]}`;
    }
    const formik = useFormik({
        initialValues:{
            o_name:'',
            job_name:'',
            j_location:'',
            stipend:''
        },
        onSubmit: async value => {
            const o_name = value.o_name;
            const job_name = value.job_name;
            const j_location = value.j_location;
            const stipend = value.stipend
            const j_type= job;
            try {
                const response = axios.post('/api/post',{o_name,job_name,j_location, stipend,re_skills,j_type,uname, categorie_li})
            } catch (err) {
                console.log(err)
            }
        }
    })

    function redirect(){
        history.push(`/recruiterAccount/${uname}`)
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
            <div className="flex" >
                <form onSubmit ={formik.handleSubmit} >
                    <h3>Enter Job Details </h3>
                    <div className="p_flex">
                        <label>Orgtanization Name</label>
                        <input autoComplete="off" type='text' value={formik.values.o_name} onChange={formik.handleChange} id='o_name' name='o_name' required />
                    </div>
                    <div className="p_flex" >
                        <label>Job Title</label>
                        <input autoComplete="off" type='text' value={formik.values.job_name} onChange={formik.handleChange} id='job_name' name='job_name' required />
                    </div>
                    <div className="p_flex" >
                        <label>Job Location</label>
                        <input autoComplete="off" type='text' id='j_location' name='j_location' value={formik.values.j_location} onChange={formik.handleChange} required />
                    </div>
                    <div className="p_flex" >
                        <label>Stipend</label>
                        <input autoComplete="off" type='text' id='stipend' name='stipend' value={formik.values.stipend} onChange={formik.handleChange} required />
                    </div>
                    <div className="p_flex" >
                        <label>Job Type</label>
                        <Select className="expand" options={val} onChange={(e) => setJob(e.label)} />
                    </div>
                    <div className="p_flex" >
                        <label>Job Categorie</label>
                        <Select className="expand" isMulti options={cate} onChange={categorie} />
                    </div>
                    <div className="p_flex" >
                        <label>Required Skill</label>
                        <Select className="expand" isMulti options={skill} onChange={handle} />
                    </div>
                    <div className="s_input" >
                        <input type='submit' value="Post Job" onClick={() => {setOpenmodel(true)}} />
                    </div>
                    
                </form>
                <Modal style={customStyles} ariaHideApp={false} isOpen={openmodel}>
                        <div className="m_f">
                            <div className="m_f">
                            <img src={tick} alt='tick' />
                            </div>
                            <div>
                                <h3>Your Job Posted Successfully</h3>
                                <p>You Can Track the Responses on your dashboard</p>
                            </div>
                        </div>
                        <div className="f_c">
                        <button type='button' onClick={() => redirect()}  >Go to Dashboard</button>
                        </div>
                </Modal>
            </div>
        </>
    )
}

export default PostJob;