<img src="https://i.ibb.co/sK9t2gk/template.png">


Библиотека для упрощенного управления формами в React, основанная на концепциях упрощения управления.
<b>Работает с React(18.0.0+) и  Next.js(12, 13.0+)</b>

[English](https://github.com/Avangardio/AFReactForms/blob/main/README.en.md) | [Русский](https://github.com/Avangardio/AFReactForms/blob/main/README.ru.md)

## Причины создания и смысл библиотеки
Работая над очередной разработки формы, пользуя Formik или React-Hook-Forms,
я так и не нашел удобного инструмента, который, к тому же, будет элегантен и прост в использовании.

Для этого и был создан **afreacforms**, который стремится к решению данных проблем.
<p>Для валидации использует **yup**.</p>

## Установка
Обычная установка библиотеки через npm
```bash
npm install afreactforms
```
Импорт выглядит так:
```javascript
import {useForm, Form, Field, FieldError} from "afreactforms";
```

## Использование
Настройка и использование крайне просты.
Допустим, у нас есть форма с имейлом и паролем.

Нам нужно использовать хук useForm, который принимает объект следующего вида:
```typescript jsx
{ 
    initialValues: {
        [имяИнпута]: строка либо пустая "", либо "какой-то текст"
    }
    validationSchema: схема валидации из yup
}
```
Получаем следующий вид:
````typescript jsx
const SignupSchema = Yup.object().shape({Здесь объект инструкций валидации});

const {values, errors, serverError, touches, setServerError, service} = 
    useForm({initialValues: {email: '', password: ''}, validationSchema: SignupSchema});
````


<table>На выходе получим Данные:
<tbody>
<th>Название</th><th>Описание</th>
<tr>
<td><b>values</b><td>объект с инпутами {[имя]: строка инпута}
</tr>
<tr>
<td><b>errors</b><td>объект с ошибками {[имя]: строка ошибки}
</tr>
<tr>
<td><b>serverError</b><td>строка с ошибкой от сервера, см. [Перейти к разделу ошибок]
</tr>
<tr>
<td><b>touches</b><td>объект с индикатором фокуса на инпуте {[имя]: булево значение}
</tr>
<tr>
<td><b>setServerError</b><td>функция обновления стейта серверной ошибки
</tr>
<tr>
<td><b>service</b><td>объект для работы формы библиотеки. НЕ ИСПОЛЬЗОВАТЬ ВНЕ <Form>
</tr>
</tbody>
</table>

### Использование формы
Далее, нужно получить форму следующего вида

```typescript jsx
import {useForm, Form, Field, FieldError} from "afreactforms";

function Компонент(){
    //используем хук useForm
    const {values, errors, serverError, touches, setServerError, service} = useForm({
        initialValues: {
            email: '',
            password: '',
            name: '',
        }, validationSchema: SignupSchema
    });

    //отрисовываем элемент
    return (
        <Form
            //Можно передать класс
            className={'flex flex-col gap-1'}
            //Нужно передать функцию сабмита
            onSubmit={() => {
                fetch('Запрос на сервер с формой').then(
                    result => ...,
                    error  => setServerError("Какая-то ошибка!")
                )
            }}
            //ОБЯЗАТЕЛЬНО ПЕРЕДАВАТЬ ЭТОТ ПРОП
            serviceProp={service}
        >
            //Наполняется любыми нодами
            <p>Регистрация</p>
            //!Для полей инпута из библиотеки нужно передать name - из initialValues
            <Field 
                   //Обязательно - name из initialValues
                   name={'email'} 
                   //Обязательно - Тип инпута
                   type={'email'} 
                   //Необязательно - классы
                   className={'bg-red'} 
                   //Необязательно - плейсхолдер
                   placeholder={'Имейл'}
            />
            //Необязательный компонент для вывода ошибок валидации
            //Передать name - из initialValues
            <FieldError name={'email'}>
                //Можно использовать таким видом, с функцией (errorMsg: string) => ReactNode;
                {errorMsg => {
                    return <a>{errorMsg}</a>
                }}
            </FieldError>

            <Field name={'password'} type={'password'}/>
            //Либо просто передать элемент один, который имеет пропс errorMsg внутри
            <FieldError name={'password'}>
                //function MyErrorComponent({className, errorMsg}) {...}
                <MyErrorComponent />
            </FieldError>
            
            //Так же, можно получить ошибку от сервера*, передав name - serverError
            //Без передачи компонента вернет <p>Сообщение</p>
            <FieldError name={'serverError'} 
                        //можно определить классы
                        className={'blue'}
            />
            //И обычная кнопка, которая отправит форму
            <button type={"submit"}>Отправить</button>
        </Form>
    )
}
```
Всё, теперь у нас будет форма, которая будет изменяться, отображать ошибки, валидацию и автоматическую работу.


# Основные компоненты
## Form
Обертывающий компонент для вашей формы, который предоставляет контекст для дочерних компонентов.

<table> Пропсы компонента:
<tbody>
<th>Название</th><th>Обязательность</th><th>Описание</th>
<tr>
<td><b>children</b> <td>(обязательно) <td>Дочерние элементы формы.
</tr>

<tr>
<td><b>onSubmit</b><td> (обязательно) <td>Обработчик отправки формы.
</tr>

<tr>
<td><b>className</b> <td>(необязательно) <td>Имя класса для стилизации.
</tr>

<tr>
<td><b>serviceProp</b><td>(обязательно)<td> Свойства сервиса формы.
</tr>
</tbody>
</table>

Использование:
```typescript jsx
<Form onSubmit={handleOnSubmit} serviceProp={service}>
    // дочерние элементы
</Form>

```
## Field
Компонент поля ввода, который автоматически синхронизируется с контекстом формы.

<table> Пропсы компонента:
<tbody>
<th>Название</th><th>Обязательность</th><th>Описание</th>
<tr>
<td><b>name</b> <td>(обязательно) <td>Имя поля.
</tr>

<tr>
<td><b>type</b><td> (необязательно) <td>Тип поля ввода, например "text", "email" и так далее.
</tr>

<tr>
<td><b>placeholder</b> <td>(необязательно) <td>Подсказка для поля ввода.
</tr>

<tr>
<td><b>className</b><td>(необязательно)<td> Имя класса для стилизации.
</tr>
</tbody>
</table>

Использование:
```jsx
<Field name="email" type="email" placeholder="Введите ваш email" />
```
# FieldError
Компонент для отображения ошибок поля.

<table> Пропсы компонента:
<tbody>
<th>Название</th><th>Обязательность</th><th>Описание</th>
<tr>
<td><b>name</b> <td>(обязательно) <td>Имя поля, для которого необходимо отобразить ошибку.
<p>"serverError" - для серверных ошибок. получает serverError, устанавливается setServerError("")
</tr>
<tr>
<td><b>children</b><td> (необязательно) <td>Кастомный компонент для отображения ошибки или функция для рендеринга ошибки.
</tr>
<tr>
<td><b>className</b> <td>(необязательно) <td>Имя класса для стилизации.
</tr>
</tbody>
</table>

Использование:
```jsx
//Без ноды
<FieldError name="email" />
//С функцией
<FieldError name="email">
    {(errorMsg) => <span style={{color: 'red'}}>{errorMsg}</span>}
</FieldError>
//С компонентом
//function MyErrorComponent({className, errorMsg}) {...}
<FieldError name="email">
    <CustomErrorComponent />
</FieldError>
```

# хук useForm
Хук для управления логикой формы.

<table>Параметры:
<tbody>
<th>Название</th><th>Обязательность</th><th>Описание</th>
<tr>
<td><b>initialValues</b> <td>(обязательно) <td>Начальные значения для полей формы.
</tr>
<tr>
<td><b>validationSchema</b><td> (обязательно) <td>Схема валидации для полей с помощью yup.
</tr>
</tbody>
</table>

Использование:
```jsx
const { values, errors, service } = useForm({ initialValues, validationSchema });
```
<table>Возвращает:
<tbody>
<th>Название</th><th>Описание</th>
<tr>
<td><b>values</b><td>объект с инпутами {[имя]: строка инпута}
</tr>
<tr>
<td><b>errors</b><td>объект с ошибками {[имя]: строка ошибки}
</tr>
<tr>
<td><b>serverError</b><td>строка с ошибкой от сервера, см. [Перейти к разделу ошибок]
</tr>
<tr>
<td><b>touches</b><td>объект с индикатором фокуса на инпуте {[имя]: булево значение}
</tr>
<tr>
<td><b>setServerError</b><td>функция обновления стейта серверной ошибки
</tr>
<tr>
<td><b>service</b><td>объект для работы формы библиотеки. НЕ ИСПОЛЬЗОВАТЬ ВНЕ <Form>
</tr>
</tbody>
</table>

## Лицензия
MIT

## Контакты
При проблемах или предложениях - используйте [GitHub](https://github.com/Avangardio/AFReactForms)
