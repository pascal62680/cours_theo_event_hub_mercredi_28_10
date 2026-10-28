import { useState } from "react";
import { Link, useNavigate } from "react-router";
import authServices from "../Services/authServices";
import "./auth.css";

const LoginPage = () => {
    // VARIABLES
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    // Message global (erreur serveur ou succès)
    const [message, setMessage] = useState({ type: "", text: "" })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // TRAITEMENTS
    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name] : value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        if (!user.username || !user.password) {
            setMessage({ type: "error", text: "Merci de remplir tous les champs" });
            return;
        }

        setLoading(true);
        try {
            const response = await authServices.login(user);
            const token = response.data.token;
            window.localStorage.setItem("token", token);
            setMessage({ type: "success", text: response.data.message });
            setTimeout(() => navigate("/events"), 1000);
        } catch (error) {
            console.error(error);
            const text = error.response?.data?.error || "Impossible de contacter le serveur";
            setMessage({ type: "error", text });
        } finally {
            setLoading(false);
        }
    }


    // Rendu
    return <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
            <h1>Connexion</h1>
            <p className="auth-subtitle">Content de te revoir sur EventHub</p>

            {message.text && <div className={`auth-alert ${message.type}`}>{message.text}</div>}

            <div className="auth-field">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input type="text" name="username" id="username" autoComplete="username"
                    value={user.username} onChange={handleChange}/>
            </div>

            <div className="auth-field">
                <label htmlFor="password">Mot de passe</label>
                <div className="auth-password">
                    <input type={showPassword ? "text" : "password"} id="password" name="password" autoComplete="current-password"
                        value={user.password} onChange={handleChange}/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Masquer" : "Afficher"}
                    </button>
                </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
            </button>

            <p className="auth-footer">
                Pas encore de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </form>
    </div>;
}

export default LoginPage;
