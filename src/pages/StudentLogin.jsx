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
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20}>
                            <Typography.Headline variant='large-strong'>
                                Вход для студентов
                            </Typography.Headline>
                            
                            {error && (
                                <Typography.Body variant="error">
                                    {error}
                                </Typography.Body>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <Flex direction="column" gap={16}>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name="email"
                                        mode="secondary"
                                        placeholder="Университетская почта (@g.nsu.ru)"
                                        required
                                        type="email"
                                        className="financeInput"
                                    />
                                    <Input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        name="password"
                                        mode="secondary"
                                        placeholder="Пароль"
                                        required
                                        type="password"
                                        className="financeInput"
                                    />
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="medium"
                                        stretched
                                        type="submit"
                                        disabled={loading}
                                        style={{ width: '325px' }}
                                    >
                                        {loading ? 'Вход...' : 'Войти'}
                                    </Button>
                                </Flex>
                            </form>
                            
                            <Button
                                appearance="neutral"
                                mode="secondary"
                                size="medium"
                                stretched
                                onClick={() => navigate('/')}
                                style={{ width: '325px' }}
                            >
                                Назад
                            </Button>
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default StudentLogin;