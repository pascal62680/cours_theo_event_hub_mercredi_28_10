import { useState } from "react";
import { Link, useNavigate } from "react-router";
import authServices from "../Services/authServices";
import "./auth.css";

const RegisterPage = () => {
// Variables
const navigate = useNavigate();
const [user, setUser] = useState({
    username : "",
    email : "",
    password: "",
    confirm_password : ""
})
// Erreurs affichées sous chaque champ
const [errors, setErrors] = useState({})
// Message global (erreur serveur ou succès)
const [message, setMessage] = useState({ type: "", text: "" })
const [loading, setLoading] = useState(false)
const [showPassword, setShowPassword] = useState(false)



// Traitements
const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value })
    // On efface l'erreur du champ dès que l'utilisateur le modifie
    setErrors({ ...errors, [name]: "" })
}

const validate = () => {
    const newErrors = {};
    if (user.username.trim().length < 3) {
        newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        newErrors.email = "Adresse email invalide";
    }
    if (user.password.length < 8) {
        newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (user.password !== user.confirm_password) {
        newErrors.confirm_password = "Les mots de passe ne correspondent pas";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}

const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!validate()) return;

    setLoading(true);
    try {
        // On n'envoie pas confirm_password au serveur
        const data = { username: user.username, email: user.email, password: user.password };
        const response = await authServices.register(data);
        setMessage({ type: "success", text: response.data.message + " ! Redirection..." });
        setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
        console.error(error);
        const text = error.response?.data?.error || "Impossible de contacter le serveur";
        setMessage({ type: "error", text });
    } finally {
        setLoading(false);
    }
}

//  rendu
  return <div className="auth-container">
    <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Créer un compte</h1>
        <p className="auth-subtitle">Rejoins EventHub pour participer aux événements</p>

        {message.text && <div className={`auth-alert ${message.type}`}>{message.text}</div>}

        <div className="auth-field">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input type="text" id="username" name="username" autoComplete="username"
                className={errors.username ? "invalid" : ""}
                onChange={handleChange} value={user.username}/>
            {errors.username && <span className="auth-error">{errors.username}</span>}
        </div>

        <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" autoComplete="email"
                className={errors.email ? "invalid" : ""}
                onChange={handleChange} value={user.email}/>
            {errors.email && <span className="auth-error">{errors.email}</span>}
        </div>

        <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <div className="auth-password">
                <input type={showPassword ? "text" : "password"} name="password" id="password" autoComplete="new-password"
                    className={errors.password ? "invalid" : ""}
                    onChange={handleChange} value={user.password}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Masquer" : "Afficher"}
                </button>
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
        </div>

        <div className="auth-field">
            <label htmlFor="confirm_password">Confirmer le mot de passe</label>
            <input type={showPassword ? "text" : "password"} name="confirm_password" id="confirm_password" autoComplete="new-password"
                className={errors.confirm_password ? "invalid" : ""}
                onChange={handleChange} value={user.confirm_password}/>
            {errors.confirm_password && <span className="auth-error">{errors.confirm_password}</span>}
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <p className="auth-footer">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
    </form>
  </div>
}

export default RegisterPage;
