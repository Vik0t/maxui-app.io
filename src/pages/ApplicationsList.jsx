import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, CellList, CellSimple } from "@maxhub/max-ui";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationsByType, updateApplicationStatus, deleteApplication } from "../utils/api";
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

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
            try {
                await deleteApplication(id);
                loadApplications(); // Refresh the list
            } catch (error) {
                console.error('Error deleting application:', error);
                alert('Error deleting application: ' + error.message);
            }
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
                    <div className="form-wrapper">
                        <Flex direction="column" gap={20} style={{ padding: '20px 0', alignItems: 'center' }}>
                            <Flex direction="row" justify="space-between" align="center" style={{ width: '100%' }}>
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
                                <CellList filled mode="island" style={{ width: '100%' }}>
                                    {applications.map((app) => (
                                        <div key={app.id} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <div style={{ flex: 1 }}>
                                                <CellSimple
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
                                                            {app.expenses && (
                                                                <Typography.Body variant="secondary">
                                                                    Расходы: {app.expenses} руб
                                                                </Typography.Body>
                                                            )}
                                                            {app.additional_info && (
                                                                <Typography.Body variant="secondary">
                                                                    Дополнительная информация: {app.additional_info}
                                                                </Typography.Body>
                                                            )}
                                                            <Typography.Body variant="secondary">
                                                                Статус: {app.status === 'pending' ? 'Ожидает' :
                                                                         app.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                                                            </Typography.Body>
                                                            <Typography.Body variant="secondary">
                                                                Дата подачи: {new Date(app.timestamp).toLocaleString()}
                                                            </Typography.Body>
                                                        </Flex>
                                                    }
                                                />
                                            </div>
                                            <div style={{ marginLeft: '10px' }}>
                                                <Button
                                                    appearance="negative"
                                                    mode="secondary"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(app.id);
                                                    }}
                                                >
                                                    Удалить
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CellList>
                            )}
                        </Flex>
                    </div>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default ApplicationsList;