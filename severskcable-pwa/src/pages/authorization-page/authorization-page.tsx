import companyLogo from '../../imgs/logo-main.svg';
import AuthForm from "../../components/auth-form/auth-form";
import './authorization-page.scss';
import {Helmet} from "react-helmet-async";

function AuthorizationPage () {
    return (
        <div className="auth-page">
            <Helmet>
                <title>Войти</title>
            </Helmet>
            <img src={companyLogo} className="auth-page__img" alt="logo"/>
            <AuthForm />
        </div>
    );
}

export default AuthorizationPage;