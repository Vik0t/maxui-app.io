import React, { useState } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input } from "@maxhub/max-ui";
import { useNavigate } from "react-router-dom";
import { authenticateStudent } from "../utils/api";
import "../App.css";

const StudentLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            // Validate email format
            if (!email.endsWith('@g.nsu.ru')) {
                throw new Error('Пожалуйста, используйте университетскую почту (@g.nsu.ru)');
            }
            
            const response = await authenticateStudent(email, password);
            // Store student ID in localStorage
            if (response.student && response.student.id) {
                localStorage.setItem('studentId', response.student.id.toString());
            }
            navigate('/student');
        } catch (error) {
            setError(error.message || 'Ошибка аутентификации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh', padding: '20px' }}>
                    <Container fullWidth={true} style={{ maxWidth: '400px', width: '100%' }}>
                        <Flex direction="column" gap={24} align="center" style={{ width: '100%' }}>
                            <Typography.Headline variant='large-strong' style={{ textAlign: 'center' }}>
                                Вход для студентов
                            </Typography.Headline>
                            
                            {error && (
                                <Typography.Body variant="error" style={{ textAlign: 'center' }}>
                                    {error}
                                </Typography.Body>
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            name="email"
                                            mode="secondary"
                                            placeholder="Университетская почта (@g.nsu.ru)"
                                            required
                                            type="email"
                                            style={{ 
                                                width: '100%', 
                                                height: '48px',
                                                paddingRight: '40px', // Space for clear button
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
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            name="password"
                                            mode="secondary"
                                            placeholder="Пароль"
                                            required
                                            type="password"
                                            style={{ 
                                                width: '100%', 
                                                height: '48px',
                                                paddingRight: '40px', // Space for clear button
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
                                            disabled={loading}
                                            style={{ 
                                                width: '100%', 
                                                height: '48px'
                                            }}
                                        >
                                            {loading ? 'Вход...' : 'Войти'}
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

export default StudentLogin;