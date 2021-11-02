import React,{useState, useEffect} from 'react';
import axios from 'axios'

function SelectReject(params){
    const id_no = params.name;
    const [selectStatus,setSelectStatus] = useState(false)
    const [rejectStatus,setRejectStatus] =useState(false)
    const [select,setSelect] = useState('Select');
    const [reject, setReject] = useState('Reject');
    useEffect(() => {
        check();
    },[id_no])
    const check = async () => {
        try {
            const response = await axios.get(`/api/status/${id_no}`);
            if(response.data === 'Under Review'){
                setSelectStatus(false);
                setRejectStatus(false);
                setSelect('Select');
                setReject('Reject');
            }
            else if(response.data === 'Selected'){
                setSelectStatus(true);
                setRejectStatus(false);
                setSelect('Selected');
                setReject('Reject');
            }
            else if(response.data === 'Rejected'){
                setSelectStatus(false)
                setRejectStatus(true);
                setSelect('Select');
                setReject('Rejected');
            }
        } catch (err) {
            console.log(err)
        }
    }

    const change = async (status) => {
        try {
            const response = await axios.post('/api/updateStatus',{id_no, status})
            if(response.status === 200){
                if(status === 'Selected'){
                    setSelectStatus(true);
                    setRejectStatus(false);
                    setSelect(status);
                    setReject('Reject')
                }
                else if(status === 'Rejected'){
                    setSelectStatus(false);
                    setRejectStatus(true);
                    setSelect('Select');
                    setReject(status)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    return(
        <>
            <div className="f_f">
                <button className={"se "+selectStatus} disabled={selectStatus} type="button" onClick = {() => change('Selected')}>{select}</button>
                <button className={"re "+rejectStatus} disabled={rejectStatus} type="button" onClick = {() => change('Rejected')}>{reject}</button>
            </div>
        </>
    )
}

export default SelectReject