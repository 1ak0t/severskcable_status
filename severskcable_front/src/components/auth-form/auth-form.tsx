function AuthForm () {
    return (
        <form className="auth-form">
            <input className="auth-form__input" type="text" placeholder="Имя пользователя" autoFocus={true}/>
            <input className="auth-form__input" type="text" placeholder="Пароль"/>
            <button className="auth-form__button">Войти</button>
        </form>
    );
}

export default AuthForm;