import {FormEvent, useRef} from "react";
import {useAppDispatch} from "../../hooks";
import {loginAction} from "../../store/api-actions";

function AuthForm () {
    const loginRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const dispatch = useAppDispatch();
    const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (loginRef.current !== null && passwordRef.current !== null) {
            dispatch(loginAction({
                email: loginRef.current.value,
                password: passwordRef.current.value
            }));
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input ref={loginRef} className="auth-form__input" type="text" placeholder="Имя пользователя" autoFocus={true}/>
            <input ref={passwordRef} className="auth-form__input" type="password" placeholder="Пароль"/>
            <button className="auth-form__button">Войти</button>
        </form>
    );
}

export default AuthForm;