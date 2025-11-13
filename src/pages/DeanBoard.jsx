import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography } from "@maxhub/max-ui";
import { useNavigate } from "react-router-dom";
import { getApplicationsStats, getApplicationsByType, clearAuthToken, getFinancialAidPayments } from "../utils/api";
import "../App.css";

const DeanBoard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        financialAid: 0,
        certificates: 0,
        total: 0,
        studentCount: 1000,
        approved: 0,
        rejected: 0,
        pending: 0
    });
    
    const [payments, setPayments] = useState({
        total: 0
    });

    useEffect(() => {
        // Fetch statistics and payments when component mounts
        loadStats();
        loadPayments();
    }, []);

    const loadStats = async () => {
        try {
            const stats = await getApplicationsStats();
            setStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadPayments = async () => {
        try {
            const paymentsData = await getFinancialAidPayments();
            setPayments({
                total: paymentsData.total || 0
            });
        } catch (error) {
            console.error('Error loading payments:', error);
        }
    };

    const handleLogout = () => {
        // Clear the authentication token
        clearAuthToken();
        // Navigate to login page
        navigate('/');
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20}>
                            <Flex direction="row" justify="space-between" align="center">
                                <Typography.Headline variant='large-strong'>
                                    Панель деканата
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
                            
                            <Flex direction="column" gap={16}>
                                <Typography.Headline variant="medium-strong">
                                    Заявки студентов
                                </Typography.Headline>
                                
                                <Flex direction="column" gap={12}>
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="large"
                                        stretched
                                        onClick={() => navigate('/dean/applications/financial_aid')}
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium-strong">
                                                Заявки на матпомощь
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                {stats.financialAid}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                    
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="large"
                                        stretched
                                        onClick={() => navigate('/dean/applications/certificate')}
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium-strong">
                                                Заявки на справки
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                {stats.certificates}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </Flex>
                            </Flex>
                            
                            <Flex direction="column" gap={16}>
                                <Typography.Headline variant="medium-strong">
                                    Статистика
                                </Typography.Headline>
                                
                                <Flex direction="column" gap={12}>
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium">
                                                Всего студентов
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                {stats.studentCount}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                    
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium">
                                                Обработано заявок
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                {stats.approved + stats.rejected}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </Flex>
                            </Flex>
                            
                            <Flex direction="column" gap={16}>
                                <Typography.Headline variant="medium-strong">
                                    Финансовая помощь
                                </Typography.Headline>
                                
                                <Flex direction="column" gap={12}>
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                        onClick={() => navigate('/dean/payments')}
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium">
                                                Общая сумма выплат
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                {payments.total} руб
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default DeanBoard;