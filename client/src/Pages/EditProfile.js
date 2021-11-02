import react,{useState, useEffect} from 'react';
import Select from 'react-select'
import axios from 'axios';
import {useParams, useHistory} from 'react-router-dom'
import userProfile from '../Images/user.png'
import Logo from '../Images/Capture.PNG';
import {useUser} from '../Auth/useUser';
import Modal from 'react-modal'
import { useFormik } from 'formik';

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

function EditProfile(){
    let skill;
    const user = useUser();
    const [openNav,setOpenNav] = useState(false)
    const history = useHistory()
    const [modalOpen, setModalOpen] = useState(false)
    const {uname} = useParams()
    const [qualification, setQualification] = useState('')
    const [skillList, setSkillList] = useState([]);
    const [linkedin, setLinkedin] = useState('');
    const [skills, setSkills] = useState('');
    const [resume, setResume] = useState('');
    const [github, setGithub] = useState('');
    const logout = () => {
        localStorage.removeItem('token');
        history.push('/')
    }
    const details = async() => {
        try {
            const response = await axios.get(`/api/Edit/${uname}`);
            const data = response.data
            const {linkedin, resume, github, skills, high_q} = data[0];
            setLinkedin(linkedin);
            setGithub(github)
            setResume(resume)
            setSkills(skills)
            setQualification(high_q);
        } catch (err) {
            console.error(err)
        }
    }
    useEffect(() =>{
        details()
    },[uname]);
    var qual = [
        {
            value:1,
            label:'10th/Below'
        },
        {
            value:2,
            label:'12th'
        },
        {
            value:3,
            label:'Diplomo'
        },
        {
            value:4,
            label:'Under Gratuate'
        },
        {
            value:5,
            label:'Post Gratuate'
        },
        {
            value:6,
            label:'Phd'
        }
    ]
    var skill_li= [
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
            label:'Amazon Web Server'
        },
        {
            value:18,
            label:'Statistics'
        },
        {
            value:19,
            label:'TypeScript'
        },
        {
            value:20,
            label:'Adobe Photoshop'
        },
        {
            value:21,
            label:'Adobe Illustrator'
        },
        {
            value:22,
            label:'Ms-Excel'
        },
        {
            value:23,
            label:"Ms -Word"
        },
        {
            value: 24,
            label:'Machine Learning'
        },
        {
            value: 25,
            label: 'Deep Learning'
        },
        {
            value: 26,
            label: 'Django'
        },
        {
            value: 27,
            label: "Java"
        }
    ]

    var skills_li = (e) => {
        setSkillList(Array.isArray(e) ? e.map(x => x.label) : [])
    }
    for(var i=0; i < skillList.length; i++){
        if(skill ===undefined) skill = `${skillList[i]}`
        
        else skill = `${skill}, ${skillList[i]}`
    }
    if(skillList.length === 0){
        skill = skills;
    }

    const formik = useFormik({
        initialValues:{
            ph_no:''
        },
        onSubmit: async value => {
            console.log(value)
            try {
                const resposnse = await axios.post('/user/Editstudent',{uname, skill, qualification, linkedin, github, resume});
                if(resposnse.status === 200){
                    setModalOpen(true)
                }
            } catch (err) {
                console.log(err)
            }
        }
    })
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
                <button onClick={() => history.push(`/account/${user.who}/${user.uname}`)} >Dashboard</button>
                </div>
                <div>
                <button type="button" onClick={() => logout()}>LogOut</button>
                </div>
                </div>
                </div>
            <div className="flex">
                <form onSubmit={formik.handleSubmit} >
                    <div>
                        <h3>Edit Your Profile</h3>
                    </div>
                    
                    <div className="p_flex">
                        <label>Full Name</label>
                        <input disabled type="text" value={user.fname} />
                    </div>
                    <div className="p_flex">
                        <label>Email</label>
                        <input disabled type="text" value={user.email} />
                    </div>
                    <div className="p_flex">
                        <label>Phone</label>
                        <input disabled type="text" value={user.ph_no} />
                    </div>
                    <div className="p_flex">
                        <label>Add Your Skills</label>
                        <Select className="expand" options={skill_li}  isMulti onChange={skills_li} />
                    </div>
                    <div className="p_flex">
                        <label>Higher Qualification</label>
                        <Select className="expand" options={qual} onChange={(e) => setQualification(e.label)} />
                    </div>
                    <div className="p_flex">
                        <label>GitHub</label>
                        <input value={github} onChange={(e) => setGithub(e.target.value)} type="url" id="github" name="github" />
                    </div>
                    <div className="p_flex">
                        <label>LinkedIn</label>
                        <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} type="url" id="linkedin" name="linkedin"  />
                    </div>
                    <div className="p_flex">
                        <label>Resume</label>
                        <input value={resume} onChange={(e) => setResume(e.target.value)} type="url" id="resume" name="resume"  />
                    </div>
                    <div className="pflex">
                        <button className="button" type="submit">Save</button>
                    </div>
                </form>
                <Modal style={customStyles} ariaHideApp={false} isOpen={modalOpen}>
                    <div className="h_c" >
                        <h3 className="center">Your Profile Successfully Updated</h3>
                    </div>
                    <div className="m_flex" >
                        <button type="button" onClick={() => setModalOpen(false)} >Stay hear</button>
                        <button type="button" onClick={() => history.push(`/account/${user.who}/${user.uname}`)} >Go to Dashboard</button>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default EditProfile;