import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, CellList, CellSimple } from "@maxhub/max-ui";
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

    const loadApplications = async () => {
        try {
            setLoading(true);
            const apps = await getApplicationsByType(type);
            setApplications(apps);
            setLoading(false);
        } catch (error) {
            console.error('Error loading applications:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateApplicationStatus(id, status);
            loadApplications();
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Error updating application status: ' + error.message);
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
                <Panel style={{ height: '100vh', overflowY: 'auto' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20} style={{ padding: '20px 0', alignItems: 'center' }}>
                            <Flex direction="row" justify="space-between" align="center" style={{ width: '100%', maxWidth: '800px' }}>
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
                                <CellList filled mode="island" style={{ width: '100%', maxWidth: '800px' }}>
                                    {applications.map((app) => (
                                        <CellSimple
                                            key={app.id}
                                            onClick={() => navigate(`/dean/applications/${type}/${app.id}`)}
                                            showChevron
                                            title={app.name}
                                            subtitle={
                                                <Flex direction="column" gap={4}>
                                                    <Typography.Body variant="secondary">
                                                        Факультет: {app.faculty}
                                                    </Typography.Body>
                                                    <Typography.Body variant="secondary">
                                                        Курс и группа: {app.courseWithGroup}
                                                    </Typography.Body>
                                                    <Typography.Body variant="secondary">
                                                        {getTypeDescription(app)}
                                                    </Typography.Body>
                                                    <Typography.Body variant="secondary">
                                                        Статус: {app.status === 'pending' ? 'Ожидает' :
                                                                 app.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                                                    </Typography.Body>
                                                </Flex>
                                            }
                                        />
                                    ))}
                                </CellList>
                            )}
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default ApplicationsList;