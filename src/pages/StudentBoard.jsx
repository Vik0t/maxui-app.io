import React, { useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography } from "@maxhub/max-ui";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../utils/api";
import "../App.css";

const StudentBoard = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if student is authenticated
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            // Redirect to login if not authenticated
            navigate('/student/login');
        }
    }, [navigate]);
    
    const handleLogout = () => {
        // Clear student ID from localStorage
        localStorage.removeItem('studentId');
        // Clear auth token
        clearAuthToken();
        // Redirect to login page
        navigate('/student/login');
    };
    
    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                    <div className="form-wrapper">
                        <Flex direction="column" gap={10}>
                            <Flex direction="row" justify="space-between" align="center" gap={70}>
                                <Typography.Headline variant='large-strong'>
                                    Панель студента
                                </Typography.Headline>
                                <Button
                                    appearance="neutral"
                                    mode="secondary"
                                    size="medium"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </Button>
                            </Flex>
                            
                            <Flex direction="column" gap={20} align="center">
                                <Link to="/student/profile" style={{ textDecoration: 'none', width: '100%', maxWidth: '350px' }}>
                                    <Button
                                        appearance="neutral"
                                        mode="secondary"
                                        size="large"
                                        className="studentBoardButton"
                                        style={{ width: '100%' }}
                                    >
                                        Мой профиль
                                    </Button>
                                </Link>
                                
                                <Link to="/finance" style={{ textDecoration: 'none', width: '100%', maxWidth: '350px' }}>
                                    <Button
                                        appearance="neutral"
                                        mode="secondary"
                                        size="large"
                                        className="studentBoardButton"
                                        style={{ width: '100%' }}
                                    >
                                        Подать заявление на матпомощь
                                    </Button>
                                </Link>
                                
                                <Link to="/certificate" style={{ textDecoration: 'none', width: '100%', maxWidth: '350px' }}>
                                    <Button
                                        appearance="neutral"
                                        mode="secondary"
                                        size="large"
                                        className="studentBoardButton"
                                        style={{ width: '100%' }}
                                    >
                                        Заявление на справку об обучении
                                    </Button>
                                </Link>
                            </Flex>
                        </Flex>
                    </div>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default StudentBoard;
