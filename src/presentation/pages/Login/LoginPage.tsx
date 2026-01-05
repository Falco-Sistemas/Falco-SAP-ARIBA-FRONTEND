import LoginForm from '../../components/LoginForm'
import WelcomeBanner from '../../components/LoginForm/WelcomeBanner'
import './LoginPage.css'

function LoginPage() {
    return (
        <div className="login-page">
            <div className="login-left">
                <LoginForm />
            </div>

            <div className="login-right">
                <WelcomeBanner />
            </div>
        </div>
    )
}

export default LoginPage

