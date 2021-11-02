import {useParams, Redirect} from "react-router-dom";
import React,{useState, useEffect} from "react";
import axios from 'axios'
function Apply(props){
    const {uname,who} = useParams();
    const [status, setStatus] = useState('Apply');
    const id_no = props.name
    const [enable, setEnable] = useState(false)

    const check = async () =>{
        try {
            const response = axios.get(`/api/checkApply/${uname}/${id_no}`)
            if((await response).status === 200){
                setEnable(true);
                setStatus('Applied')
            }
            else{
                setEnable(false)
            }
        } catch (err) {
            console.error(err);
        }
    }

    const Apply_job = async (j_id) => {
        try {
            const response = await axios.post('/api/apply',{uname, j_id})
            setStatus('Applied');
            setEnable(true);
            window.location.reload(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        check();
    }, [id_no])

    return(
        <>
            {enable ? <div className="f"> 
                <button className='dis' disabled>{status}</button>
            </div>:
            <div className="f">
                <button className="ena" type="button" onClick={() => Apply_job(id_no)} >{status}</button>
            </div> }
        </>
    )
}

export default Apply;