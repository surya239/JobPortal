
import {useParams, useHistory} from 'react-router-dom';
import Logo from '../Images/Capture.PNG';
import axios from 'axios';
import { useFormik } from 'formik';
import {useUser} from '../Auth/useUser';
import Select from 'react-select';
import react,{ useState } from 'react';
function Studentupdate(){
    const user = useParams();
    let skill;
    const {uname, fname, who} = useUser();
    const [qualification, setQualification] = useState('')
    const [skillList, setSkillList] = useState([])
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
    var skill_li = [
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

    var skills_li = (e) => {
        setSkillList(Array.isArray(e) ? e.map(x => x.label) : [])
    }
    for(var i=0; i < skillList.length; i++){
        if(skill ===undefined) skill = `${skillList[i]}`
        
        else skill = `${skill}, ${skillList[i]}`
    }
    const history = useHistory()
    const formik = useFormik({
        initialValues:{
            linkedin:'',
            github:'',
            resume:''
        },

        onSubmit: async values => {
            const {linkedin, github, resume} = values;
        try {
                const resposnse = axios.post('/api/user/student',{uname, fname, skill, qualification, linkedin, github, resume});
                history.push(`/account/${who}/${uname}`)
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
            <div className='flex' >
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <h3>Update your profile</h3>
                    </div>
                    <div className="p_flex">
                        <label>Add Your Skills</label>
                        <Select className='expand' isMulti options={skill_li} onChange={skills_li} />
                    </div>
                    <div className="p_flex">
                        <label>Higher qualification</label>
                        <Select className='expand' options={qual} onChange={(e) => setQualification(e.label) } />
                    </div>
                    <div className="p_flex">
                        <label>Linkedin</label>
                        <input autoComplete='off' type='url' id='linkedin' name='linkedin' className='input' onChange={formik.handleChange} value={formik.values.linkedin} required='Required' />
                    </div>
                    <div className="p_flex">
                        <label>GitHub</label>
                        <input autoComplete='off' type='url' id='github' name='github' className='input' onChange={formik.handleChange} value={formik.values.github} required='Required' />
                    </div>
                    <div className="p_flex">
                        <label>Resume Link</label>
                        <input autoComplete='off' type='url' id='resume' name='resume' className='input' onChange={formik.handleChange} value={formik.values.resume} required ></input>
                    </div>
                    <div className='submit_up' >
                        <input type='submit' value='Save' />
                    </div>
                </form>
            </div>
            </div>
        </>
    )
}

export default Studentupdate;