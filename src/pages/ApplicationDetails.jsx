import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography } from "@maxhub/max-ui";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationsByType, updateApplicationStatus } from "../utils/api";

const ApplicationDetails = () => {
    const navigate = useNavigate();
    const { id, type } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplication();
    }, [id, type]);

    const loadApplication = async () => {
        try {
            setLoading(true);
            const apps = await getApplicationsByType(type);
            const app = apps.find(a => a.id === parseInt(id));
            setApplication(app || null);
            setLoading(false);
        } catch (error) {
            console.error('Error loading application:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (status) => {
        try {
            await updateApplicationStatus(id, status);
            loadApplication(); // Reload to show updated status
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Error updating application status: ' + error.message);
        }
    };

    const getTypeDescription = (app) => {
        if (!app) return '';
        
        switch (type) {
            case 'financial_aid':
                return `Причина: ${app.reason}`;
            case 'certificate':
                return `Причина: ${app.reason}`;
            default:
                return '';
        }
    };

    const getTypeTitle = (app) => {
        if (!app) return 'Заявка';
        
        switch (type) {
            case 'financial_aid':
                return 'Заявка на матпомощь';
            case 'certificate':
                return 'Заявка на справку';
            default:
                return 'Заявка';
        }
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel style={{ height: '100vh', overflowY: 'auto' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20} style={{ padding: '20px 0', alignItems: 'center' }}>
                            <Flex direction="row" justify="space-between" align="center" style={{ width: '100%', maxWidth: '800px' }}>
                                <Typography.Headline variant='large-strong'>
                                    {application ? getTypeTitle(application) : 'Заявка'}
                                </Typography.Headline>
                                <Button
                                    appearance="neutral"
                                    mode="secondary"
                                    size="medium"
                                    onClick={() => navigate(-1)}
                                >
                                    Назад
                                </Button>
                            </Flex>
                            
                            {loading ? (
                                <Typography.Headline variant="medium">
                                    Загрузка...
                                </Typography.Headline>
                            ) : !application ? (
                                <Typography.Headline variant="medium">
                                    Заявка не найдена
                                </Typography.Headline>
                            ) : (
                                <Flex direction="column" gap={16} style={{ width: '100%', maxWidth: '800px' }}>
                                    <div
                                        style={{
                                            padding: '24px',
                                            border: '1px solid var(--color-border-primary)',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--color-background-primary)',
                                            width: '100%'
                                        }}
                                    >
                                        <Flex direction="column" gap={16}>
                                            <Typography.Headline variant="large-strong">
                                                {application.name}
                                            </Typography.Headline>
                                            
                                            <Flex direction="column" gap={12}>
                                                <Typography.Headline variant="medium">
                                                    Факультет: {application.faculty}
                                                </Typography.Headline>
                                                <Typography.Headline variant="medium">
                                                    Курс и группа: {application.courseWithGroup}
                                                </Typography.Headline>
                                                <Typography.Headline variant="medium">
                                                    Телефон: {application.contactPhone}
                                                </Typography.Headline>
                                                <Typography.Headline variant="medium">
                                                    {getTypeDescription(application)}
                                                </Typography.Headline>
                                                {application.expenses && (
                                                    <Typography.Headline variant="medium">
                                                        Расходы: {application.expenses} руб
                                                    </Typography.Headline>
                                                )}
                                                <Typography.Headline variant="medium">
                                                    Дата подачи: {new Date(application.timestamp).toLocaleString()}
                                                </Typography.Headline>
                                                <Typography.Headline variant="medium">
                                                    Статус: {application.status === 'pending' ? 'Ожидает' :
                                                             application.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                                                </Typography.Headline>
                                            </Flex>
                                            
                                            {application.status === 'pending' && (
                                                <Flex direction="row" gap={12}>
                                                    <Button
                                                        appearance="themed"
                                                        mode="positive"
                                                        size="medium"
                                                        onClick={() => handleStatusChange('approved')}
                                                    >
                                                        Одобрить
                                                    </Button>
                                                    <Button
                                                        appearance="themed"
                                                        mode="negative"
                                                        size="medium"
                                                        onClick={() => handleStatusChange('rejected')}
                                                    >
                                                        Отклонить
                                                    </Button>
                                                </Flex>
                                            )}
                                        </Flex>
                                    </div>
                                </Flex>
                            )}
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default ApplicationDetails;