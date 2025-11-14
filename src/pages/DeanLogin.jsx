import React, { useState } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input } from "@maxhub/max-ui";
import { useNavigate } from "react-router-dom";
import { authenticateDean } from "../utils/api";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use API function for authentication
            const response = await authenticateDean(loginData.username, loginData.password);
            if (response.success) {
                // Successful login - redirect to dean board
                navigate('/dean/board');
            }
        } catch (error) {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh', padding: '20px' }}>
                    <Container fullWidth={true} style={{ maxWidth: '400px', width: '100%' }}>
                        <Flex direction="column" gap={24} align="center" style={{ width: '100%' }}>
                            <Typography.Headline variant='large-strong' style={{ textAlign: 'center' }}>
                                Вход для деканата
                            </Typography.Headline>
                            
                            {error && (
                                <Typography.Headline variant="medium" style={{ color: 'var(--color-text-negative)', textAlign: 'center' }}>
                                    {error}
                                </Typography.Headline>
                            )}
                            
                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <Flex direction="column" gap={20} align="center" style={{ width: '100%' }}>
                                    <div style={{ 
                                        width: '100%', 
                                        maxWidth: '325px',
                                        minWidth: '280px',
                                        position: 'relative'
                                    }}>
                                        <Input
                                            onChange={handleChange}
                                            name="username"
                                            mode="secondary"
                                            placeholder="Логин"
                                            value={loginData.username}
                                            required
                                            style={{ 
                                                width: '100%', 
                                                height: '48px',
                                                paddingRight: '40px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div style={{ 
                                        width: '100%', 
                                        maxWidth: '325px',
                                        minWidth: '280px',
                                        position: 'relative'
                                    }}>
                                        <Input
                                            onChange={handleChange}
                                            name="password"
                                            mode="secondary"
                                            placeholder="Пароль"
                                            type="password"
                                            value={loginData.password}
                                            required
                                            style={{ 
                                                width: '100%', 
                                                height: '48px',
                                                paddingRight: '40px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div style={{ 
                                        width: '100%', 
                                        maxWidth: '325px',
                                        minWidth: '280px'
                                    }}>
                                        <Button
                                            appearance="themed"
                                            mode="primary"
                                            size="medium"
                                            stretched
                                            type="submit"
                                            style={{ 
                                                width: '100%', 
                                                height: '48px'
                                            }}
                                        >
                                            Войти
                                        </Button>
                                    </div>
                                </Flex>
                            </form>
                            <div style={{ 
                                width: '100%', 
                                maxWidth: '325px',
                                minWidth: '280px'
                            }}>
                                <Button
                                    appearance="neutral"
                                    mode="secondary"
                                    size="medium"
                                    stretched
                                    onClick={() => navigate('/')}
                                    style={{ 
                                        width: '100%', 
                                        height: '48px'
                                    }}
                                >
                                    Назад
                                </Button>
                            </div>
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default DeanLogin;