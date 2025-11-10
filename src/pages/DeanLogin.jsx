import React, { useState } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input } from "@maxhub/max-ui";
import { useNavigate } from "react-router-dom";
import "../App.css";

const DeanLogin = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple validation - in a real app, this would be a server-side check
        if (loginData.username === 'admin' && loginData.password === 'admin') {
            // Successful login - redirect to dean board
            navigate('/dean/board');
        } else {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20}>
                            <Typography.Headline variant='large-strong'>
                                Вход для деканата
                            </Typography.Headline>
                            
                            {error && (
                                <Typography.Headline variant="medium" style={{ color: 'var(--color-text-negative)' }}>
                                    {error}
                                </Typography.Headline>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <Flex direction="column" gap={16}>
                                    <Input
                                        onChange={handleChange}
                                        name="username"
                                        mode="secondary"
                                        placeholder="Логин"
                                        value={loginData.username}
                                        required
                                    />
                                    <Input
                                        onChange={handleChange}
                                        name="password"
                                        mode="secondary"
                                        placeholder="Пароль"
                                        type="password"
                                        value={loginData.password}
                                        required
                                    />
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="large"
                                        stretched
                                        type="submit"
                                    >
                                        Войти
                                    </Button>
                                </Flex>
                            </form>
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default DeanLogin;