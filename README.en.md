<img src="https://i.ibb.co/sK9t2gk/template.png">

A library for simplified form management in React, built upon concepts of easy handling.
<b>Works with React(18.0.0+) and Next.js(12, 13.0+)</b>

[English](https://github.com/Avangardio/AFReactForms/blob/main/README.en.md) | [Русский](https://github.com/Avangardio/AFReactForms/blob/main/README.ru.md)

## Motivation and Purpose of the Library
While working on yet another form development, using Formik or React-Hook-Forms,
I couldn't find a convenient tool that was also elegant and simple to use.

This led to the creation of afreactforms, which aims to address these issues.

<p>For validation, it uses **yup**.</p>

## Installation
Regular library installation via npm:
```bash
npm install afreactforms
```
Import is as follows:
```javascript
import {useForm, Form, Field, FieldError} from "afreactforms";
```

## Usage
Setting up and using is extremely simple.
Let's say we have a form with email and password.

We need to use the useForm hook, which takes an object as follows:
```typescript jsx
{ 
    initialValues: {
        [inputName]: either an empty string "", or "some text"
    }
    validationSchema: yup validation schema
}
```
This gives:
````typescript jsx
const SignupSchema = Yup.object().shape({your validation});

const {values, errors, serverError, touches, setServerError, service} = 
    useForm({initialValues: {email: '', password: ''}, validationSchema: SignupSchema});
````
<table>Outputs are:
<tbody>
<th>Name</th><th>Description</th>
<tr>
<td><b>values</b><td>Object with inputs {[name]: input string}
</tr>
<tr>
<td><b>errors</b><td>Object with errors {[name]: error string}
</tr>
<tr>
<td><b>serverError</b><td>String with server error, see [Go to the errors section]
</tr>
<tr>
<td><b>touches</b><td>Object with input focus indicator {[name]: boolean value}
</tr>
<tr>
<td><b>setServerError</b><td>Function to update the server error state
</tr>
<tr>
<td><b>service</b><td>Object for library form functionality. DO NOT USE OUTSIDE < Form /></td>
</tr>
</tbody>
</table>

### Using the Form
Next, you need a form as follows:

```typescript jsx
import {useForm, Form, Field, FieldError} from "afreactforms";

function Component(){
    //use the useForm hook
    const {values, errors, serverError, touches, setServerError, service} = useForm({
        initialValues: {
            email: '',
            password: '',
            name: '',
        }, validationSchema: SignupSchema
    });

    //render the element
    return (
        <Form
            //You can provide a class
            className={'flex flex-col gap-1'}
            //You must provide a submit function
            onSubmit={() => {
                fetch('Server request with form').then(
                    result => ...,
                error  => setServerError("Some error!")
            )
            }}
            //MUST PASS THIS PROP
            serviceProp={service}
        >
            //Fill with any nodes
            <p>Registration</p>
            //!For library input fields, you need to provide the name - from initialValues
            <Field
                //Mandatory - name from initialValues
                name={'email'}
                //Mandatory - input type
                type={'email'}
                //Optional - classes
                className={'bg-red'}
                //Optional - placeholder
                placeholder={'Enter email'}
            />
            //Optional component for displaying validation errors
            //Provide name - from initialValues
            <FieldError name={'email'}>
                //You can use like this, with a function (errorMsg: string) => ReactNode;
                {errorMsg => {
                    return <a>{errorMsg}</a>
                }}
            </FieldError>

            <Field name={'password'} type={'password'}/>
            //Or simply provide an element that has an errorMsg prop inside
            <FieldError name={'password'}>
                //function MyErrorComponent({className, errorMsg}) {...}
                <MyErrorComponent />
            </FieldError>

            //Similarly, you can get server error*, by passing name - serverError
            //Without providing a component, it will return <p>Message</p>
            <FieldError name={'serverError'}
                //you can specify classes
                        className={'blue'}
            />
            //Regular button to submit the form
            <button type={"submit"}>Submit</button>
        </Form>
    )
}
```
That's it, now you have a form that will change, display errors, validation, and has automated functionality.

# Main Components
## Form
A wrapper component for your form, providing context for its children.

<table> Component Props:
<tbody>
<th>Name</th><th>Mandatory</th><th>Description</th>
<tr>
<td><b>children</b> <td>Yes <td>Form's child elements.
</tr>
<tr>
<td><b>onSubmit</b><td> Yes <td>Form submit handler.
</tr>
<tr>
<td><b>className</b> <td>No <td>Class name for styling.
</tr>
<tr>
<td><b>serviceProp</b><td>Yes<td> Form's service properties.
</tr>
</tbody>
</table>

Usage:
```typescript jsx
<Form onSubmit={handleOnSubmit} serviceProp={service}>
    // child elements
</Form>

```
## Field
Input field component that automatically synchronizes with the form context.

<table> Component Props:
<tbody>
<th>Name</th><th>Mandatory</th><th>Description</th>
<tr>
<td><b>name</b> <td>Yes <td>Field's name.
</tr>
<tr>
<td><b>type</b><td> No <td>Input field type, e.g., "text", "email", etc.
</tr>
<tr>
<td><b>placeholder</b> <td>No <td>Input field placeholder.
</tr>
<tr>
<td><b>className</b><td>No<td> Class name for styling.
</tr>
</tbody>

</table>
Usage:

```jsx
<Field name="email" type="email" placeholder="Insert your email" />
```
# FieldError
Component to display field errors.

<table> Component Props:
<tbody>
<th>Name</th><th>Mandatory</th><th>Description</th>
<tr>
<td><b>name</b> <td>Yes <td>Name of the field to display error for.
<p>"serverError" - for server errors. gets serverError, set by setServerError("")
</tr>
<tr>
<td><b>children</b><td> No <td>Custom component to display error or a function to render the error.
</tr>
<tr>
<td><b>className</b> <td>No <td>Class name for styling.
</tr>
</tbody>
</table>

Usage:
```jsx
//Без ноды
//Without a node
<FieldError name="email" />
//With a function
<FieldError name="email">
    {(errorMsg) => <span style={{color: 'red'}}>{errorMsg}</span>}
</FieldError>
//With a component
//function MyErrorComponent({className, errorMsg}) {...}
<FieldError name="email">
    <CustomErrorComponent />
</FieldError>
```

# useForm Hook
A hook to manage the form logic.

<table> Hook Properties:
<tbody>
<th>Name</th><th>Mandatory</th><th>Description</th>
<tr>
<td><b>initialValues</b> <td>Yes <td>Initial values for the form fields.
</tr>
<tr>
<td><b>validationSchema</b><td> Yes <td>Validation schema for the fields using yup.
</tr>
</tbody>
</table>

Usage:
```jsx
const { values, errors, service } = useForm({ initialValues, validationSchema });
```
<table>Return:
<tbody>
<th>Name</th><th>Description</th>
<tr>
<td><b>values</b><td>Object with inputs {[name]: input string}
</tr>
<tr>
<td><b>errors</b><td>Object with errors {[name]: error string}
</tr>
<tr>
<td><b>serverError</b><td>String with server error, see [Go to the errors section]
</tr>
<tr>
<td><b>touches</b><td>Object with input focus indicator {[name]: boolean value}
</tr>
<tr>
<td><b>setServerError</b><td>Function to update the server error state
</tr>
<tr>
<td><b>service</b><td>Object for library form functionality. DO NOT USE OUTSIDE < Form /></td>
</tr>
</tbody>
</table>

## License
MIT

## Contacts
For issues or suggestions, use [GitHub](https://github.com/Avangardio/AFReactForms)
