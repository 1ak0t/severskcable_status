import companyLogo from '../../imgs/logo-main.svg';
import AuthForm from "../../components/auth-form/auth-form";

function Autorization () {
    return (
        <div className="auth-page">
            <img src={companyLogo} className="auth-page__img" alt="logo"/>
            <AuthForm />
        </div>
    );
}

export default Autorization;