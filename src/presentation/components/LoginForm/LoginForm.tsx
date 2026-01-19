import './LoginForm.css'

function LoginForm() {
    return ( <div className="login-form">
        <h1>Bem Vindo</h1>
        <p className="subtitle">Entre com suas credencias</p>

        <form>
            <div className="field">
                <label htmlFor="login">Usuário</label>
                <input type="text" id="login" name="login" />
            </div>

            <div className="field">
                <label htmlFor="password">Senha</label>
                <input type="password" id="password" name="password" /> 
            </div>

            <button type="submit">Entrar</button>

            <a href="#" className="forgot-password">Esqueci a senha</a>
        </form>
    </div>
  )
}

export default LoginForm
