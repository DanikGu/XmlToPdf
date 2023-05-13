interface LoginPageFormsProps {
    switchPageState: () => void,
    setToken: (userToken: { token: string; expiration: Date; }) => void
}
export default LoginPageFormsProps;