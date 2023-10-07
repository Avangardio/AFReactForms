'use client'
import React, {ChangeEventHandler, FocusEventHandler, FormEvent, FormEventHandler, useState} from 'react';
import * as yup from 'yup';
import Field from "@/Field";

export interface UseFormProps {
    initialValues: Record<string, any>,
    validationSchema: yup.AnySchema
}

export type FormService = {
    values: Record<string, any>;
    errors: Record<string, string | null>;
    touches: Record<string, boolean>;
    serverError: string | null;
    handleFocus: FocusEventHandler<HTMLInputElement>;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    validateField: Function;
    handleSubmit: Function;
    validateSingleField: Function;
}

export type FormMethods = {
    values: Record<string, any>;
    errors: Record<string, string | null>;
    touches: Record<string, boolean>;
    serverError: string | null;
    service: FormService
    setServerError: React.Dispatch<React.SetStateAction<string>>;
};
export default function useForm({initialValues, validationSchema}: UseFormProps): FormMethods {
    const [values, setValues] = useState(initialValues);
    const [touches, setTouches] = useState({});
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouches({
            ...touches,
            [name]: true
        })
    }

    const handleSubmit = (callback: <T>(args?: T) => void) => {
        return (event: React.FormEvent) => {
            event.preventDefault();

            const currentErrors = validateObject(values);
            if (Object.values(currentErrors).length > 0) {
                return;
            }

            callback();
        };
    };



    const validateObject = <T extends typeof initialValues>(obj: T) => {
        const newErrors: Record<string, string> = {};

        Object.entries(obj).forEach(([fieldName, fieldValue]) => {
            const error = validateField(fieldName, fieldValue);
            if (error) {
                newErrors[fieldName] = error;
            }
        });

        setErrors(newErrors);
        return newErrors;
    };

    const validateField = (field: keyof typeof initialValues, value: any): string | null => {
        const fieldSchema = yup.reach(validationSchema, field) as yup.AnySchema;
        try {
            fieldSchema.validateSync(value);
            return null;
        } catch (err) {
            return (err as yup.ValidationError).message;
        }
    };

    const validateSingleField = (field: keyof typeof initialValues, value: any): void => {
        const fieldSchema = yup.reach(validationSchema, field) as yup.AnySchema;
        try {
            fieldSchema.validateSync(value);
            setErrors(prevErrors => {
                const updatedErrors: Record<string, string> = { ...prevErrors };
                delete updatedErrors[field];
                return updatedErrors;
            });
        } catch (err) {
            const errorMessage = (err as yup.ValidationError).message;
            setErrors(prevErrors => ({ ...prevErrors, [field]: errorMessage }));
        }
    };

    return {
        values,
        errors,
        serverError,
        setServerError,
        touches,
        service: {
            values,
            errors,
            serverError,
            touches,
            handleFocus,
            handleChange,
            validateField,
            handleSubmit,
            validateSingleField
        }
    };
}
