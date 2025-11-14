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
        clearAuthToken();
        navigate('/');
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh', padding: '20px' }}>
                    <Container fullWidth={true} style={{ maxWidth: '600px', width: '100%' }}>
                        <Flex direction="column" gap={40} align="center" style={{ width: '100%' }}>
                            <Flex direction="row" justify="space-between" align="center" style={{ width: '100%', maxWidth: '500px' }}>
                                <Typography.Headline variant='large-strong' style={{ textAlign: 'center', flex: 1 }}>
                                    Панель деканата
                                </Typography.Headline>
                                <Button
                                    appearance="neutral"
                                    mode="secondary"
                                    size="medium"
                                    onClick={handleLogout}
                                    style={{ minWidth: '100px' }}
                                >
                                    Выйти
                                </Button>
                            </Flex>
                        
                        <Flex direction="column" gap={16} align="center" style={{ width: '100%' }}>
                            <Typography.Headline variant="medium-strong" style={{ textAlign: 'center', width: '100%' }}>
                                Заявки студентов
                            </Typography.Headline>
                            
                            <Flex direction="column" gap={15} align="center" style={{ width: '100%' }}>
                                <div style={{ width: '100%', maxWidth: '500px' }}>
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="large"
                                        stretched
                                        onClick={() => navigate('/dean/applications/financial_aid')}
                                        style={{ width: '100%', height: '60px' }}
                                    >
                                        <Flex direction="row" justify="space-between" align="center" style={{ width: '100%' }}>
                                            <Typography.Headline variant="medium-strong">
                                                Заявки на матпомощь: {stats.financialAid}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </div>
                                
                                <div style={{ width: '100%', maxWidth: '500px' }}>
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="large"
                                        stretched
                                        onClick={() => navigate('/dean/applications/certificate')}
                                        style={{ width: '100%', height: '60px' }}
                                    >
                                        <Flex direction="row" justify="space-between" align="center" style={{ width: '100%' }}>
                                            <Typography.Headline variant="medium-strong">
                                                Заявки на справки: {stats.certificates}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </div>
                            </Flex>
                        </Flex>
                        
                        <Flex direction="column" gap={16} align="center" style={{ width: '100%' }}>
                            <Typography.Headline variant="medium-strong" style={{ textAlign: 'center', width: '100%' }}>
                                Статистика
                            </Typography.Headline>
                            
                            <Flex direction="column" gap={12} align="center" style={{ width: '100%' }}>
                                <div style={{ width: '100%', maxWidth: '500px' }}>
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                        style={{ width: '100%', height: '60px', pointerEvents: 'none' }}
                                    >
                                        <Flex direction="row" justify="space-between" align="center" style={{ width: '100%' }}>
                                            <Typography.Headline variant="medium">
                                                Всего студентов: {stats.studentCount}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </div>
                                
                                <div style={{ width: '100%', maxWidth: '500px' }}>
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                        style={{ width: '100%', height: '60px', pointerEvents: 'none' }}
                                    >
                                        <Flex direction="row" justify="space-between" align="center" style={{ width: '100%' }}>
                                            <Typography.Headline variant="medium">
                                                Обработано заявок: {stats.approved + stats.rejected}
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </div>
                            </Flex>
                        </Flex>
                        
                        <Flex direction="column" gap={16} align="center" style={{ width: '100%' }}>
                            <Typography.Headline variant="medium-strong" style={{ textAlign: 'center', width: '100%' }}>
                                Финансовая помощь
                            </Typography.Headline>
                            
                            <Flex direction="column" gap={12} align="center" style={{ width: '100%' }}>
                                <div style={{ width: '100%', maxWidth: '500px' }}>
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                        onClick={() => navigate('/dean/payments')}
                                        style={{ width: '100%', height: '60px' }}
                                    >
                                        <Flex direction="row" justify="space-between" align="center" style={{ width: '100%' }}>
                                            <Typography.Headline variant="medium">
                                                Сумма выплат: {payments.total} руб
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </div>
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