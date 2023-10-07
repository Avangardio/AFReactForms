'use client'
import React, {ReactElement, ReactNode, useContext} from "react";
import {FormContext} from "./Form";

interface FieldErrorProps {
    name: string;
    className?: string;
    children?: ReactNode | ((errorMsg: string) => ReactNode);
}
const FieldError: React.FC<FieldErrorProps> = ({ name, children, className }) => {
    const formContext = useContext(FormContext)

    const errorMessage = name === "serverError" ? formContext?.serverError : formContext?.errors[name];

    if (!errorMessage) return null;

    if (typeof children === "function") {
        return children(errorMessage as string) as ReactElement;
    }
    if (React.isValidElement(children)) {
        return React.cloneElement(children, { className, errorMessage } as React.ComponentProps<any>);
    }

    return <p className={className}>{errorMessage}</p>;
};

export default FieldError;