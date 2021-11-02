import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from "path";
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
const cors = require('cors');
import pool  from './db.js';
import axios from 'axios';
import bcrypt from 'bcrypt';
import {google} from 'googleapis'
app.use(cors());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"client/build")))

var r = new Date();
    var n = r.getDate();
    var k = r.getMonth()+1;
    var y = r.getFullYear();

    var day = `${n}/${k}/${y}`;
const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_KEY,
    process.env.GOOGLE_SECRET,
    'https://jobxprezportal.herokuapp.com/auth/google/callBack',
);

const getGoogleOauthUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ];

    return oauthClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
    });
}



app.use(express.json())

const PORT = process.env.PORT || 5000;

const getAccessandBearerToken = ( { accessToken }) => `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;

const getGoogleUser = async ({code}) => {
    const { tokens } = await oauthClient.getToken(code);
    const response = await axios.get(
        getAccessandBearerToken({ accessToken: tokens.access_token}),
        { headers: {Authorization: `Bearer ${tokens.id_token}`}},
    );
    return response.data;
}

const updateOrCreate = async({ oauthUserInfo}) => {
    try {
        const uname = oauthUserInfo.email.split('@')[0];
        let get;
        const check = await pool.query("SELECT email FROM signup WHERE email = $1 ",[oauthUserInfo.email])
        if(check.rowCount === 0){
            try {
                const insert = await pool.query("Insert Into signup(uname, fname, email) VALUES ($1, $2, $3) ",[uname,oauthUserInfo.name, oauthUserInfo.email])
                const getvalue = await pool.query("SELECT * FROM signup WHERE uname=$1",[uname]);
                get = getvalue.rows;
            } catch (err) {
                console.log(err)
            }
        }
        else{
            try {
                const getvalue = await pool.query("SELECT * FROM signup WHERE uname = $1",[uname]);
                get= getvalue.rows
            } catch (err) {
                console.log(err)
            }
        }
    return get;
    } catch (err) {
        console.log(err)
    }
}

app.get('/auth/google/callback',async (req,res) => {
    const {code} = req.query;
    const oauthUserInfo = await getGoogleUser({ code });
    const updatedUser = await updateOrCreate({oauthUserInfo});
    if(updatedUser !== undefined){
        const{uname, fname, who, email} = updatedUser[0];
        jwt.sign({
            uname, 
            fname,
            email,
            who
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        },
        (err, token) => {
            if(err) return res.sendStatus(500);
            res.redirect(`/login?token=${token}`)
        }
        )
    }
})

const googleOauthCallbackRoute = {
    path: '/auth/google/callback',
    method: 'get',
    handler: async (req,res) => {
        const {code} = req.query;
        const oauthUserInfo = await getGoogleUser({ code });
        const updatedUser = await updateOrCreate({oauthUserInfo});
        res.sendStatus(404)
    }
}

app.post('/sign',async(req,res) => {
    try {
        let r;
        const { fname, uname, email, pass } = req.body;
        const hashPass = await bcrypt.hash(pass,10)
        const signup = await pool.query("INSERT INTO signup(fname, uname, email, pass) values($1, $2, $3, $4)", [fname, uname, email, hashPass] );
        jwt.sign({
            fname,
            uname,
            email
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: '2d',
        },
        (err, token) => {
            if(err){
                return res.status(500).send(err)
            }
            r = {token}
           res.status(200).json({token})
        }
        )
    } catch (err) {
        console.log(err)
        res.status(202).json('Username or email already exist')
    }
} )

app.post('/api/login', async(req,res) =>{
    try {
        const {uname, pass} = req.body;
        const log = await pool.query("SELECT * FROM signup WHERE uname=$1 ", [uname])
        let r = log.rows;
        let re = r.find(ex => ex.uname===uname)
        if(re === undefined){
            res.sendStatus(202);
        }
        else{
            const a = re.uname;
        const f = re.fname;
        const e = re.email;
        const w = re.who;
        const p = re.ph_no
        const corect = await bcrypt.compare(pass, re.pass)
        if(re.uname === uname && corect )
        {
           jwt.sign({
               fname: f,
               uname: a,
               email: e,
               who: w,
               ph_no: p
           },
           process.env.JWT_SECRET,{
               expiresIn: '5d'
           },
           (err, token) =>{
               if(err){
                   res.sendStatus(500).send(err)
               }
             res.status(200).json({token});
           }
           ) 
        }
        else{
            res.sendStatus(204)
        }
        }
    } catch (err) {
        console.log(err)
    }
})

app.post('/update', async(req, res) => {
    const {ph_no, who, uname} = req.body;
    const update = await pool.query('Update signup SET who= $1 , ph_no = $2 Where uname= $3 ', [who, ph_no, uname])
    const r = await pool.query('Select * from signup where uname = $1', [uname]);
    const re = r.rows;
    const rr = re.find(ex => ex.uname === uname)
    jwt.sign({
        fname: rr.fname,
        uname: rr.uname,
        email: rr.email,
        who: rr.who,
        ph_no: rr.ph_no
    },
    process.env.JWT_SECRET,{
        expiresIn: '7d'
    },
    (err, token) =>{
        if(err){
            res.sendStatus(500)
        }
        res.status(200).json({token})
    }
    )

})

app.post('/api/user/student', async(req, res) =>{
    try{
    const {fname, uname, skill, qualification,linkedin, github, resume} = req.body
    const student = await pool.query("Insert into student_info(fname, uname, skills, github,linkedin, resume, high_q) values ($1, $2, $3,$4, $5, $6, $7)",[fname, uname, skill,github,linkedin,resume,qualification ])
    res.sendStatus(200)
} catch(err){
        console.log(err);
        res.sendStatus(404)
    }
}
)

app.get('/user/jobs/:uname', async(req, res) => {
    try {
        let id=[], i, j=0;
        const {uname} = req.params;
        const jobs = await pool.query("SELECT * FROM jobs Where uname = $1 and j_status=$2", [uname, 'Active']);
        const job = jobs.rows;
        let job_obj = [];
        for(i =job.length ; i > 0; i--)
        {
            try{
            const app_no = await pool.query("SELECT * FROM app_job where j_id = $1",[job[i-1].id_no])
            id[i-1]=app_no.rows.length;
            job_obj[j] = {
                id_no: job[i-1].id_no,
                o_name: job[i-1].o_name,
                uname: job[i-1].uname,
                job_name: job[i-1].job_name,
                j_location: job[i-1].j_location,
                stipend: job[i-1].stipend,
                j_type: job[i-1].j_type,
                r_skills: job[i-1].r_skills,
                post_d: job[i-1].post_d,
                j_status: job[i-1].j_status,
                no_app : id[i-1]
                
            }
            j++;
            }catch(err){
                console.log(err)
            }
           
        }
        
        res.status(200).json(job_obj)
    } catch (error) {
        console.log(error)
    }
})

app.get('/auth/google/url', ( req, res) => {
    const url = getGoogleOauthUrl();
    res.status(200).json({url})
})

app.get('/api/job', async (req, res) => {
    try {
                const job = await pool.query("SELECT * FROM jobs Where j_status=$1",['Active'])
                const j = job.rows;
                let j_list = [],k = 0,i;
                for(i=j.length ; i>0 ; i--){
                    j_list[k] = j[i-1];
                    k++
                }
                res.status(200).json(j_list)

    } catch (error) {
        console.error(err)
    }
})

app.get('/api/user/application/:uname', async (req, res) => {
    try {
        const {uname} = req.params;
        const app = await pool.query("SELECT * FROM app_job WHERE uname = $1 ",[uname]);
        if (app.rowCount === 0){
            res.sendStatus(202)
        }
      
        else res.status(200).json(app.rows)
    } catch (err) {
        console.error(err)
    }
})

app.post('/user/Editstudent', async (req,res) => {
    try {
        const {uname, skill, qualification, linkedin, github, resume} = req.body;
        await pool.query("Update student_info SET skills = $1, high_q = $2, github = $3, linkedin = $4, resume = $5 WHERE uname = $6",[skill,qualification,github,resume, linkedin, uname]);
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
})

app.post('/api/post',async (req,res) => {
    try {
        const {uname, o_name,job_name,j_location,stipend,j_type,re_skills, categorie_li} = req.body;
        await pool.query('Insert into jobs(o_name,uname,job_name,j_location,stipend,j_type,r_skills,post_d,j_status, categorie) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[o_name,uname,job_name,j_location,stipend,j_type,re_skills,day,'Active',categorie_li]);
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
})

app.post('/api/apply',async (req,res) => {
    try {
        const {uname, j_id} = req.body;
        const app_data = await pool.query('SELECT job_name, o_name, j_type, stipend, j_location from jobs WHERE id_no = $1',[j_id]);
        const detail = app_data.rows;
        const job_name = detail[0].job_name
        const o_name = detail[0].o_name;
        const j_type = detail[0].j_type;
        const stipend = detail[0].stipend;
        const location = detail[0].j_location
        const app_fname = await pool.query('SELECT fname, email, ph_no from signup WHERE uname = $1',[uname]);
        const {fname, email, ph_no} = app_fname.rows[0]
        const resume_url = await pool.query('Select resume, skills from student_info WHERE uname=$1',[uname]);
        const {resume, skills} = resume_url.rows[0]
        const insert_val = await pool.query("Insert INTO app_job (job_n, app_date, jobtype, stipent, app_status, uname, j_id, org_name, fname,j_location, email, ph_no, resume, skills) values ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12, $13, $14)",[job_name,day,j_type,stipend,'Under Review',uname,j_id,o_name,fname,location,email,ph_no, resume, skills])
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
    }
})

app.get('/api/status/:id_no', async (req,res) => {
    try {
        const {id_no} = req.params;
        const check = await pool.query("SELECT app_status FROM app_job WHERE id_no=$1",[id_no])
        res.status(200).json(check.rows[0].app_status)
    } catch (err) {
        console.log(err)
    }
})

app.get('/api/Edit/:uname', async (req, res) => {
    try {
        const {uname} = req.params;
        const name=uname;
        const extara_details = await pool.query("Select skills, github,linkedin, resume, high_q from student_info where uname = $1",[name]);
        res.status(200).json(extara_details.rows)
    } catch (err) {
        console.log(err)
    }
})

app.get('/api/viewApplicants/:id_no', async (req, res) => {
    try {
        const {id_no} = req.params;
        const view = await pool.query('SELECT * from app_job Where j_id = $1',[id_no]);
        if(view.rows === 0){
            res.sendStatus(202)
        }
        else{
            res.status(200).json(view.rows);
        }
    } catch (err) {
        console.error(err)
    }
})

app.post('/api/updateStatus', async (req, res) => {
    try {
        const {id_no, status} = req.body;
        await pool.query('UPDATE app_job SET app_status = $1 WHERE id_no = $2',[status,id_no])
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
})

app.get('/api/checkApply/:uname/:id_no', async (req, res) => {
    try{
    const{uname, id_no} = req.params;
    const check = await pool.query("SELECT * FROM app_job WHERE uname=$1 and j_id=$2",[uname, id_no])
    if(check.rowCount === 1){
        res.sendStatus(200)
    }
    else{
        res.sendStatus(202)
    }
}catch(e){
    console.log(e)
}
})

app.put('/api/deleteJob/:id_no', async (req, res) => {
    const {id_no} = req.params;
    try {
        await pool.query("UPDATE jobs SET j_status = $1 WHERE id_no = $2",['Deleted',id_no])
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
} )

app.listen(PORT, () =>{
    console.log("App Listening in ", PORT)
})