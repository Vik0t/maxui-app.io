import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography } from "@maxhub/max-ui";
import { useNavigate } from "react-router-dom";
import { getFinancialAidPayments } from "../utils/api";
import "../App.css";

const PaymentsList = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            setLoading(true);
            const paymentsData = await getFinancialAidPayments();
            setPayments(paymentsData.payments || []);
            setTotal(paymentsData.total || 0);
            setLoading(false);
        } catch (error) {
            console.error('Error loading payments:', error);
            setLoading(false);
        }
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20}>
                            <Flex direction="row" justify="space-between" align="center">
                                <Typography.Headline variant='large-strong'>
                                    Расчет выплат по матпомощи
                                </Typography.Headline>
                                <Button
                                    appearance="neutral"
                                    mode="secondary"
                                    size="medium"
                                    onClick={() => navigate('/dean/board')}
                                >
                                    Назад
                                </Button>
                            </Flex>
                            
                            {loading ? (
                                <Typography.Headline variant="medium">
                                    Загрузка...
                                </Typography.Headline>
                            ) : payments.length === 0 ? (
                                <Typography.Headline variant="medium">
                                    Нет заявок на матпомощь
                                </Typography.Headline>
                            ) : (
                                <Flex direction="column" gap={16}>
                                    {payments.map((payment) => (
                                        <Flex 
                                            key={payment.id} 
                                            direction="column" 
                                            gap={12} 
                                            style={{ 
                                                padding: '16px', 
                                                border: '1px solid var(--color-border-primary)', 
                                                borderRadius: '8px' 
                                            }}
                                        >
                                            <Typography.Headline variant="medium-strong">
                                                {payment.name}
                                            </Typography.Headline>
                                            
                                            <Flex direction="column" gap={8}>
                                                <Typography.Headline variant="small">
                                                    Причина: {payment.reason}
                                                </Typography.Headline>
                                                <Typography.Headline variant="small">
                                                    Сумма выплаты: {payment.amount} руб
                                                </Typography.Headline>
                                            </Flex>
                                        </Flex>
                                    ))}
                                    
                                    <Flex 
                                        direction="column" 
                                        gap={12} 
                                        style={{ 
                                            padding: '16px', 
                                            border: '1px solid var(--color-border-primary)', 
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--color-background-secondary)'
                                        }}
                                    >
                                        <Typography.Headline variant="medium-strong">
                                            Общая сумма выплат: {total} руб
                                        </Typography.Headline>
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default PaymentsList;