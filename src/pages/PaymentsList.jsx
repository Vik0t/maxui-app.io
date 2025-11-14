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
                <Panel style={{ height: '100vh', overflowY: 'auto' }}>
                    <Container fullWidth={true}>
                    <div className="form-wrapper">
                        <Flex direction="column" gap={20} style={{ padding: '20px 0', alignItems: 'center' }}>
                            <Flex direction="row" justify="space-between" align="center" style={{ width: '100%', maxWidth: '800px', flexWrap: 'wrap', gap: '10px' }}>
                                <Typography.Headline variant='large-strong' style={{ wordBreak: 'break-word', textAlign: 'left', flex: 1, minWidth: '200px', padding: '0px 0px 0px 5px'}}>
                                    Расчет выплат по матпомощи
                                </Typography.Headline>
                                <Button
                                    appearance="neutral"
                                    mode="secondary"
                                    size="medium"
                                    onClick={() => navigate('/dean/board')}
                                    style={{ flexShrink: 0 }}
                                >
                                    Назад
                                </Button>
                            </Flex>
                            
                            {loading ? (
                                <Typography.Headline variant="medium" style={{ textAlign: 'center' }}>
                                    Загрузка...
                                </Typography.Headline>
                            ) : (
                                <Flex direction="column" gap={16} style={{ width: '100%', maxWidth: '800px' }}>
                                    <Typography.Headline variant="small" style={{ wordBreak: 'break-word', textAlign: 'center' }}>
                                        * Рассчитываются только одобренные заявки на матпомощь
                                    </Typography.Headline>
                                    
                                    {payments.length === 0 ? (
                                        <Typography.Headline variant="medium" style={{ textAlign: 'center', wordBreak: 'break-word' }}>
                                            Нет одобренных заявок на матпомощь
                                        </Typography.Headline>
                                    ) : (
                                        <Flex direction="column" gap={16}>
                                            {payments.map((payment) => (
                                                <div
                                                    key={payment.id}
                                                    style={{
                                                        padding: '16px',
                                                        border: '1px solid var(--color-border-primary)',
                                                        borderRadius: '8px',
                                                        backgroundColor: 'var(--color-background-primary)',
                                                        width: '100%',
                                                        boxSizing: 'border-box'
                                                    }}
                                                >
                                                    <Flex direction="column" gap={12}>
                                                        <Typography.Headline variant="medium-strong" style={{ wordBreak: 'break-word' }}>
                                                            {payment.name}
                                                        </Typography.Headline>
                                                        
                                                        <Flex direction="column" gap={8}>
                                                            <Typography.Headline variant="small" style={{ wordBreak: 'break-word' }}>
                                                                Причина: {payment.reason}
                                                            </Typography.Headline>
                                                            <Typography.Headline variant="small" style={{ wordBreak: 'break-word' }}>
                                                                Сумма выплаты: {payment.amount} руб
                                                            </Typography.Headline>
                                                        </Flex>
                                                    </Flex>
                                                </div>
                                            ))}
                                        </Flex>
                                    )}
                                    
                                    <Flex
                                        direction="column"
                                        gap={12}
                                        style={{
                                            padding: '16px',
                                            border: '1px solid var(--color-border-primary)',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--color-background-secondary)',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <Typography.Headline variant="medium-strong" style={{ wordBreak: 'break-word' }}>
                                            Общая сумма выплат: {total} руб
                                        </Typography.Headline>
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    </div>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default PaymentsList;