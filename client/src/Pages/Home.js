import {Link} from 'react-router-dom'
import Logo from '../Images/Capture.PNG';
import {useHistory} from 'react-router-dom'
import menu from '../Images/icons8-menu-24.png'
import {useState} from 'react';
import {useUser} from '../Auth/useUser';
import close from '../Images/icons8-delete-50.png';

function Home() {
    const history = useHistory();
    const user =  useUser();
    
    if(user !== null){
        const { who , uname} = user
    if(uname !== undefined || who !== undefined){
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
    }
    
    const [openMenu, setOpenMenu] = useState(true);
    const [closeMenu, setCloseMenu] = useState(false);
    const changeMenu = (a,b) =>{
        setOpenMenu(a);
        setCloseMenu(b);
    }
    return(
        <>
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
            <div className="all">
                <div className="all_b">
            <div className="home" >
                <div className="div">
                    <p>Join Our Community</p>
                    <p>Find Your Dream Job,</p>
                    <p>Hire Skilled People</p>
                    <p>For Your Work</p>
                    <div className="link"> 
                        <Link className="a" to="/signup">Signup</Link>
                    </div>
                </div>
                <div className="div">
                    <p>Apply Full Time, Part Time,</p>
                    <p>Jobs and Internships,</p>
                    <p>Post Your Jobs Here</p>
                    <p>Choose Your Employee</p>
                    <div className="link">
                        <Link className="b" to='/login'>LogIn</Link>
                    </div>
                </div>
            </div>
            </div>
            </div>
        </>
    )
}

export default Home;