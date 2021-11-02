import { Redirect, Route } from 'react-router-dom';
import {useUser} from './useUser'
import {useParams} from 'react-router-dom'

export const PrivateRoute = props =>{
    const user = useUser();
    const {uname} = useParams();
    if(!user || (user.uname !== uname && uname !== undefined) ) return <Redirect to='/login' ></Redirect>
    

    return <Route {...props} />
}