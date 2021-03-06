import React from 'react';
import { connect } from 'react-redux';
import { signUp } from '../../actions/auth';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Alert } from 'reactstrap';
import { Badge } from 'reactstrap';
import Recaptcha from 'react-recaptcha';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export class SignUpPage extends React.Component {
    constructor(props){
        super(props)

        this.handleSubscribe = this.handleSubscribe.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);

        this.state = {
            email: '',
            password: '',
            isVerified: false
        };
    }


    
    handleSubscribe = (e) => {
        e.preventDefault();
        if (this.state.isVerified) {
            Cookies.set('emailRemember', this.state.email , { expires: 3});
            this.props.signUp(this.state);
        } else {
            toast('Please verify that you are human', { type: 'warning', position: "top-center"});
        }
    }

    verifyCallback(response) {
        if(response) {
            this.setState({
                isVerified: true
            })
        }
    }

    handleChange = (e) => {
        this.setState({
           [e.target.id]: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.authcheck){
            if (this.props.authError === null) {
                Cookies.set('emailRemember', {email: this.state.email}, { expires: 3});
                this.props.signUp(this.state);
            }
        }
    }

    recaptchaLoaded(){
        //console.log('')
    }

    render() {
        const { authError } = this.props;
        return (
            <div className="container">
                <Form onSubmit={this.handleSubscribe}>
                    <h1><Badge color="primary">Create an Account</Badge></h1>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input className="form-control form-control-lg" type="email" name="email" id="email" placeholder="Enter Your Email" onChange={this.handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input className="form-control form-control-lg" type="password" name="password" id="password" placeholder="Choose a Password" onChange={this.handleChange}/>
                    </FormGroup>
                    <div>
                        { authError ? <Alert color="danger"><p>{ authError }</p></Alert> : <Alert color="info"><p>Please Verify Your Email After Signup! </p></Alert>}
                    </div>
                    <Button color="success" className="authentication_signup btn-block btn-lg">Sign Up</Button>
                </Form>
                <div className="authentication_captcha">
                    <Recaptcha 
                        sitekey="6LezdvAUAAAAAAWmg5D43zI9BJBHSgE18JfZpvEn"
                        render="explicit"
                        verifyCallback={this.verifyCallback}
                        onloadCallback={this.recaptchaLoaded}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError
    }
};

const mapDispatchToProps = (dispatch) => ({
    signUp: (newUser) => dispatch(signUp(newUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
