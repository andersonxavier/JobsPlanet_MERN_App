import React, {Component} from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';



class AppList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userdetails: [],
            users: [],
            jobs: [],
            applications: [],
            rating: 0,
            sortbyname:true,
            sortbydateofapply:true,
            sortbyrating:true
        };
        this.renderNameIcon = this.renderNameIcon.bind(this);
        this.renderDateOfApplyIcon = this.renderDateOfApplyIcon.bind(this);
        this.renderRatingIcon = this.renderRatingIcon.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortByDateOfApply = this.sortByDateOfApply.bind(this);
        this.sortByRating = this.sortByRating.bind(this);
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    componentDidMount() {
        const { user } = this.props.auth;
        axios.get('http://localhost:4000/user/'+ user.id)
                .then(response => {
                    this.setState({userdetails: response.data});
                })
                .catch(function(error) {
                    console.log(error);
                })
        axios.get('http://localhost:4000/job/get_jobs')
            .then(response => {
                this.setState({jobs: response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/user/')
            .then(response => {
                this.setState({users: response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/application/get_applications')
            .then(response => {
                this.setState({applications: response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
            errors: nextProps.errors
            });
        }
    }

    getjob(jobId)
    {
        let job = this.state.jobs.filter(item => item._id === jobId)[0];
        return job;
    }

    getapplicant(applicantId)
    {
        let applicant = this.state.users.filter(item => item._id === applicantId)[0];
        // console.log(applicant);
        return applicant;
    }

    sortByName(){
        var array = this.state.applications;
        var flag = this.state.sortbyname;
        let uusers = this.state.users;
        function getapplicant(applicantId)
        {
            let applicant = uusers.filter(item => item._id === applicantId)[0];
            return applicant;
        }
        array.sort(function(a, b) {
            console.log(a.applicantId);
            let aapp = getapplicant(a.applicantId);
            let bapp = getapplicant(b.applicantId);
            if(aapp.name !== undefined && bapp.name !== undefined){
                return (1 - +flag*2) * aapp.name.localeCompare(bapp.name);
            }
            else{
                return 1;
            }
          });
        this.setState({
            applications:array,
            sortbyname:!this.state.sortbyname,
        })
    }

    sortByDateOfApply(){
        var array = this.state.applications;
        var flag = this.state.sortbydateofapply;
        array.sort(function(a, b) {
            if(a.dateOfApply !== undefined && b.dateOfApply !== undefined){
                return (1 - +flag*2) * (new Date(a.dateOfApply) - new Date(b.dateOfApply));
            }
            else{
                return 1;
            }
          });
        this.setState({
            applications:array,
            sortbydateofapply:!this.state.sortbydateofapply,
        })
    }

    sortByRating(){
        var array = this.state.applications;
        var flag = this.state.sortbyrating;
        let uusers = this.state.users;
        function getapplicant(applicantId)
        {
            let applicant = uusers.filter(item => item._id === applicantId)[0];
            return applicant;
        }
        array.sort(function(a, b) {
            let aapp = getapplicant(a.applicantId);
            let bapp = getapplicant(b.applicantId);
            // console.log(aapp);
            // console.log(bapp);
            if(aapp.rating !== undefined && bapp.rating !== undefined){
                return (1 - +flag*2) * (+aapp.rating - +bapp.rating);
            }
            else{
                return 1;
            }
          });
        this.setState({
            applications:array,
            sortbyrating:!this.state.sortbyrating,
        })
    }

    renderNameIcon(){
        if(this.state.sortbyname){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    renderDateOfApplyIcon(){
        if(this.state.sortbydateofapply){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    renderRatingIcon(){
        if(this.state.sortbyrating){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    shortlist(application) {
        const editApplication = {
            status: "Shortlisted"
        };

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })
        window.location.reload();
    }

    accept(application) {
        let job = this.getjob(application.jobId);
        let nnumpos = job.numpos + 1;

        const editApplicant = {
            working: true,
            numapp: 0
        };

        const editJob = {
            numpos: nnumpos
        };

        const editApplication = {
            status: "Accepted",
            doj: new Date()
        };

        axios
            .put('http://localhost:4000/job/edit_job/' + job._id, editJob)
            .then(response => {
                console.log(editJob);
            })
            .catch(function(error) {
                console.log(error);
            })

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })
        
        axios
            .put('http://localhost:4000/user/edit_profile/' + application.applicantId, editApplicant)
            .then(response => {
                console.log(editApplicant);
            })
            .catch(function(error) {
                console.log(error);
            })
        this.state.applications.filter(item => item.applicantId === application.applicantId && item._id !== application._id).map((appli,ind) => 
        {
            const editAppli = {
                status: "Rejected"
            }
            axios
                .put('http://localhost:4000/application/edit_application/' + appli._id, editAppli)
                .then(response => {
                    console.log(editAppli);
                })
                .catch(function(error) {
                    console.log(error);
                })
        })

        window.location.reload();
    }

    reject(application) {
        // const { user } = this.props.auth;
        // let job = this.getjob(application.jobId);
        let applicant = this.getapplicant(application.applicantId);
        let nnumapp = +applicant.numapp - 1;

        const editApplicant = {
            numapp: nnumapp
        };

        const editApplication = {
            status: "Rejected"
        };

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })
        
        axios
            .put('http://localhost:4000/user/edit_profile/' + application.applicantId, editApplicant)
            .then(response => {
                console.log(editApplicant);
            })
            .catch(function(error) {
                console.log(error);
            })

        window.location.reload();
       
    }

    render() 
    {
        const { user } = this.props.auth;
        const userRole = this.state.userdetails.role;
        let Applications;
        if(userRole === "recruiter") {
            Applications =
            <div>
                <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h3>Applications</h3>
                        </ListItem>
                    </List>
                </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={2} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Applicant <Button onClick={this.sortByName}>{this.renderNameIcon()}</Button></TableCell>
                                            <TableCell>Appl. Rating <Button onClick={this.sortByRating}>{this.renderRatingIcon()}</Button></TableCell>
                                            <TableCell>Appl. Skills</TableCell>
                                            <TableCell><ul><li>Education</li></ul></TableCell>
                                            <TableCell>SOP</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Date of Application <Button onClick={this.sortByDateOfApply}>{this.renderDateOfApplyIcon()}</Button></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.applications.filter(item => item.status !== "Rejected" && item.recruiterId == user.id && item.jobId == this.props.location.state).map((application,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{application.title}</TableCell>
                                            {this.state.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.name}</TableCell>
                                            ))}
                                            {this.state.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.rating ? applicant.rating.toFixed(1): ""}<i className="material-icons"><h6> star</h6></i></TableCell>
                                            ))}
                                            {this.state.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.skills.join(", ")}</TableCell>
                                            ))}
                                            {this.state.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>
                                                    {
                                                        applicant.education.map(ed => (
                                                            <ul>
                                                                <li>School: {ed.school}</li>
                                                                <li>Degree: {ed.degree}</li>
                                                                <li>Start date: {ed.startdate ? ed.startdate.toString().substring(0, 10): "NA"}</li>
                                                                <li>End date: {ed.enddate ? ed.enddate.toString().substring(0, 10):"NA"}</li>
                                                            </ul>
                                                        ))
                                                    }
                                                </TableCell>
                                            ))}
                                            <TableCell>{application.sop}</TableCell>
                                            <TableCell>{application.status}</TableCell>
                                            <TableCell>{application.dateOfApplication.substring(0, 10)}</TableCell>
                                           
                                            {application.status === "Applied"?
                                            
                                            <TableCell>
                                                <Tooltip title="Shortlist Candidate" aria-label="apply">
                                                    <button
                                                        className="btn btn-primary btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.shortlist(application)}>
                                                        Shortlist
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <div></div>

                                            }
                                            {application.status === "Shortlisted"?
                                            
                                            <TableCell>
                                                <Tooltip title="Accept Candidate" aria-label="apply">
                                                    <button
                                                        className="btn btn-success btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.accept(application)}>
                                                        Accept
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <div></div>

                                            }
                                            {application.status === "Accepted"?
                                            
                                            <TableCell>
                                                <Tooltip title="Reject Candidate" aria-label="apply">
                                                    <button
                                                        className="btn btn-secondary btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        >
                                                        Accepted
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <TableCell>
                                                <Tooltip title="Rate this job" aria-label="apply">
                                                    <button
                                                        className="btn btn-danger btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.reject(application)}>
                                                        Reject
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            }
                                            
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>               
                    </Grid>    
                </Grid>            
            </div>
        }
        return (
            <div style={{ height: "75vh" }} className="container valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Text>
                                    {Applications}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

AppList.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
)(AppList);