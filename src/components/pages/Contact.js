import Dropdown from "../Dropdown";
import States from "../objects/States";
import telephoneCheck from "../functions/TelephoneValidator";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


const options = [
    {
    label: 'Yes'
    },
    {
    label: 'No',
    }
];

const Contact = ({ loaderToggle }) => {
    const ref = useRef();
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        City: '',
        state: '',
        New: '',
        message: ''

    });

    const onCityChange = (e) => {
        setValues(values =>({
            ...values,
            City: e.target.value
        })
            );
    };
    const onStateChange = (e) => {
        setValues(values =>({
            ...values,
            state: e.target.value
        })
            );
    };

    const onPhoneChange = (e) => {
        setValues(values =>({
            ...values,
            phone: e.target.value
        })
            );
    };

    const onNameChange = (e) => {
        setValues(values =>({
            ...values,
            name: e.target.value
        })
            );
    };
    const onEmailChange = (e) => {
        setValues(values =>({
            ...values,
            email: e.target.value
        })
            );
    };

    const onPrevClientChange = (e) => {
        setValues(values =>({
            ...values,
            New: e.target.value
        })
            );
    };

    const onMessageChange = (e) => {
        setValues(values =>({
            ...values,
            message: e.target.value
        })
            );
    };
 

    const errorMessage = 'ERROR: You must use a valid phone number'
    
    const geoLocation = () => {
        const error = async () => {
            loaderToggle(false)
        }

        const success = async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const baseURL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
           
            await axios.get(baseURL).then((response)=> {
                const state =  response.data.principalSubdivision
                const city = response.data.city
                setValues(values =>({
                    ...values,
                    City: city}))
                setValues(values =>({
                    ...values,
                    State: state}))
                loaderToggle(false)

        });
        }
        loaderToggle(true)

        window.navigator.geolocation.getCurrentPosition(success, error)
    }

    const encode = (data) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
      }
    const onSubmit = (e) => {
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ "form-name": "contact", ...values })
            })
           
    }
    

    useEffect(()=> {
        geoLocation()
    }, []);

    return (
        <form 
        className='ui form submit segment' 
        onSubmit={onSubmit}
        data-netlify='true'
        action="/submission"
        >
            <input type='hidden' name='form-name' value='contact'></input>
            <h2 className="ui center aligned container">Contact Us</h2>

            <div className="ui field segment required">
                <label>Name</label>
                <input 
                name="name"
                value={values.name} 
                placeholder={'John Jackson'}
                onChange={onNameChange}
                ></input>
            </div>

            <div className="ui field segment required">
                <label >Email</label>
                <input value={values.email} 
                name="email"
                placeholder={'email@email.org'}
                onChange={onEmailChange}
                ></input>
            </div>

            <div className={`ui field segment required ${values.phone.length ===0 || telephoneCheck(values.phone) ? '' :'error'}`}>
                <label>Phone</label>
                <input 
                    className="ui input"
                    placeholder={'555-555-5555'}
                    name="phone"
                    value={values.phone}
                    onChange={onPhoneChange}
                    />
                <span className="ui field error">
                    {`${values.phone.length ===0 || telephoneCheck(values.phone)? '' : errorMessage}`}
                </span>
            </div>
           
            <div className="ui field segment">
                <label>City</label>
                <input 
                placeholder={' Seattle'} 
                value={values.City} 
                onChange={onCityChange}
                name="City"
                ></input>
            </div>

            <div className="ui field segment">
                <div ref={ref} className="field ui form">
                    <label>
                        State</label>
                        <select name="State"
                            value={values.State}
                            onChange={onStateChange}>   
                                <option>Select a State</option>                 
                                {States.map((state) => (
                                <option className="item" 
                                    key ={state.label}>
                                        {state.label} 
                                </option>
                                ))}
                        </select>
                    
                 </div>
            </div>

            <div className="ui field segment">
                <div ref={ref} className="field ui form">
                <label>
                    Are you a new Client?
                    <select name="New"
                        value={values.New}
                        onChange={onPrevClientChange}>   
                            <option>Select</option>                 
                            {options.map((option) => (
                            <option className="item" 
                                key ={option.label}>
                                    {option.label} 
                            </option>
                            ))}
                    </select>
                </label>
                 </div>
            </div>

            <div className="ui field segment">
                <label>Please Describe your Case:</label>
                <textarea 
                 value={values.message} 
                 name="message"
                 onChange={onMessageChange} 
                placeholder={'It all started...'}
                ></textarea>
            </div>

            <div>
                <button 
                disabled={!telephoneCheck(values.phone)} 
                className="ui submit button primary"
                >Submit
                </button>
            </div>
        </form>

    );
};

export default Contact;