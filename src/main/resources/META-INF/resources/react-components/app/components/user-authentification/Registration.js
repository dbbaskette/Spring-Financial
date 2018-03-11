/*jshint esversion: 6 */
import React, {Component} from 'react';

class Registration extends Component {
    constructor() {
        super();
        this.state={
            name: '',
            email: '',
            password: '',
            password2: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value});
    }
    handleSubmit(e){
        e.preventDefault();
        console.log('Account was about to be created!');
    }
    render() {
        return (
            //TODO update inputs to have materialize label animation.
            <div className='verification'>
                <p className='verificationHeader'>Registration </p>
                <form onSubmit={this.handleSubmit} action="/create-account" method="POST">
                    <div>
                        <input value={this.state.name} onChange={this.handleChange}  placeholder='Name' required name='name' id="name" type="text"  />
                    </div>
                    <div>
                        <input value={this.state.email} onChange={this.handleChange} placeholder='Email' required name='email' type='email' id="email"  />
                    </div>
                    <div>
                        <input value={this.state.password} onChange={this.handleChange} placeholder='Password' required name='password' id="password" type="password"/>
                    </div>
                    <div>
                        <input value={this.state.password2} onChange={this.handleChange} placeholder='Password' required name='password2' id="password2" type="password"/>
                    </div>
                    <br/>
                    <input value='Sign Up' className="btn-large btn-signup verificationBtn" type="button" />
                </form>
            </div>
        )
    }
}

export default Registration;
