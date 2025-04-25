const PrivateRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.token) return <Navigate to="/" />;
    if (allowedRoles && !allowedRoles.includes(auth.user?.role)) {
        return <h2>Unauthorized</h2>;
    }

    return children;
};
