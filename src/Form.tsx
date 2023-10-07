'use client'
import React, {createContext, ReactNode, FC, useContext} from 'react';
import useForm, {FormMethods, FormService} from './useForm';
import * as yup from 'yup'


type FormProps = {
    children: React.ReactNode;
    onSubmit: Function;
    className?: string;
    serviceProp: FormService;
};

export const FormContext = React.createContext<FormService | null>(null);

export default function Form ({ children, onSubmit, className, serviceProp }: FormProps) {

    const service = serviceProp;

    return (
        <FormContext.Provider value={service}>
            <form onSubmit={service.handleSubmit(onSubmit)} className={className}>
                {children}
            </form>
        </FormContext.Provider>
    );
};
