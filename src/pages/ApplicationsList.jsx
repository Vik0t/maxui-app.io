import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input } from "@maxhub/max-ui";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationsByType, updateApplicationStatus } from "../utils/api";
import "../App.css";

const ApplicationsList = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, [type]);

    const loadApplications = () => {
        try {
            const apps = getApplicationsByType(type);
            setApplications(apps);
            setLoading(false);
        } catch (error) {
            console.error('Error loading applications:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = (id, status) => {
        try {
            updateApplicationStatus(id, status);
            loadApplications(); // Reload applications to reflect changes
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    const getTypeTitle = () => {
        switch (type) {
            case 'financial_aid':
                return 'Заявки на матпомощь';
            case 'certificate':
                return 'Заявки на справки';
            default:
                return 'Заявки';
        }
    };

    const getTypeDescription = (app) => {
        switch (type) {
            case 'financial_aid':
                return `Причина: ${app.reason}`;
            case 'certificate':
                return `Причина: ${app.reason}`;
            default:
                return '';
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
                                    {getTypeTitle()}
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
                            ) : applications.length === 0 ? (
                                <Typography.Headline variant="medium">
                                    Нет заявок
                                </Typography.Headline>
                            ) : (
                                <Flex direction="column" gap={16}>
                                    {applications.map((app) => (
                                        <Flex 
                                            key={app.id} 
                                            direction="column" 
                                            gap={12} 
                                            style={{ 
                                                padding: '16px', 
                                                border: '1px solid var(--color-border-primary)', 
                                                borderRadius: '8px' 
                                            }}
                                        >
                                            <Typography.Headline variant="medium-strong">
                                                {app.name}
                                            </Typography.Headline>
                                            
                                            <Flex direction="column" gap={8}>
                                                <Typography.Headline variant="small">
                                                    Факультет: {app.faculty}
                                                </Typography.Headline>
                                                <Typography.Headline variant="small">
                                                    Курс и группа: {app.courseWithGroup}
                                                </Typography.Headline>
                                                <Typography.Headline variant="small">
                                                    Телефон: {app.contactPhone}
                                                </Typography.Headline>
                                                <Typography.Headline variant="small">
                                                    {getTypeDescription(app)}
                                                </Typography.Headline>
                                                <Typography.Headline variant="small">
                                                    Дата подачи: {new Date(app.timestamp).toLocaleString()}
                                                </Typography.Headline>
                                                <Typography.Headline variant="small">
                                                    Статус: {app.status === 'pending' ? 'Ожидает' : 
                                                             app.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                                                </Typography.Headline>
                                            </Flex>
                                            
                                            {app.status === 'pending' && (
                                                <Flex direction="row" gap={12}>
                                                    <Button
                                                        appearance="themed"
                                                        mode="positive"
                                                        size="medium"
                                                        onClick={() => handleStatusChange(app.id, 'approved')}
                                                    >
                                                        Одобрить
                                                    </Button>
                                                    <Button
                                                        appearance="themed"
                                                        mode="negative"
                                                        size="medium"
                                                        onClick={() => handleStatusChange(app.id, 'rejected')}
                                                    >
                                                        Отклонить
                                                    </Button>
                                                </Flex>
                                            )}
                                        </Flex>
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default ApplicationsList;