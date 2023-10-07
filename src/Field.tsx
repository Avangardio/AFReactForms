'use client'
import React, { useContext, useEffect } from 'react';
import {FormMethods, FormService} from "./useForm";
import { FormContext} from "./Form";

interface FieldProps {
    name: string;
    type?: string;
    placeholder?: string;
    className?: string;
}

type FormContextService = {
    service: FormService
}

const Field: React.FC<FieldProps> = ({ name, className, ...props }) => {
    const formContext = useContext(FormContext);

    function handleBlurOwn(){
        if(!formContext?.touches[name]) return;
        formContext?.validateSingleField(name, formContext?.values[name]);
    }

    useEffect(() => {
        formContext?.validateField(name, formContext?.values[name]);
    }, [formContext?.values[name]]);

    return (
        <input
            name={name}
            value={formContext?.values[name] || ''}
            onChange={formContext?.handleChange}
            onFocus={formContext?.handleFocus}
            onBlur={handleBlurOwn}
            className={className}
            {...props}
        />
    );
};
export default Field;