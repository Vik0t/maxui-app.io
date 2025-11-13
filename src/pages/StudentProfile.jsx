import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, CellList, CellSimple } from "@maxhub/max-ui";
import { useNavigate } from "react-router-dom";
import { getApplicationsByStudentId, getStudentById, getApplications, clearAuthToken } from "../utils/api";
import "../App.css";

const StudentProfile = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudentData();
        loadStudentApplications();
    }, []);

    const loadStudentData = async () => {
        try {
            // Get student ID from localStorage (set during login)
            const studentId = localStorage.getItem('studentId');
            if (studentId) {
                const student = await getStudentById(studentId);
                if (student) {
                    setStudentData({
                        name: student.name,
                        faculty: student.faculty,
                        courseWithGroup: student.course_with_group,
                        contactPhone: student.contact_phone
                    });
                } else {
                    // Fallback to default data if student not found
                    setStudentData({
                        name: "Иванов Иван Иванович",
                        faculty: "Факультет информационных технологий",
                        courseWithGroup: "2 курс, группа ИТ-201",
                        contactPhone: "+7 (999) 123-45-67"
                    });
                }
            }
        } catch (error) {
            console.error('Error loading student data:', error);
            // Fallback to default data if error occurs
            setStudentData({
                name: "Иванов Иван Иванович",
                faculty: "Факультет информационных технологий",
                courseWithGroup: "2 курс, группа ИТ-201",
                contactPhone: "+7 (999) 123-45-67"
            });
        }
    };

    const loadStudentApplications = async () => {
        try {
            setLoading(true);
            // Get student ID from localStorage (set during login)
            const studentId = localStorage.getItem('studentId');
            if (studentId) {
                const apps = await getApplicationsByStudentId(studentId);
                setApplications(apps);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading applications:', error);
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Ожидает';
            case 'approved':
                return 'Одобрено';
            case 'rejected':
                return 'Отклонено';
            default:
                return status;
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'financial_aid':
                return 'Матпомощь';
            case 'certificate':
                return 'Справка об обучении';
            default:
                return type;
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
                                    Профиль студента
                                </Typography.Headline>
                                <Flex direction="row" gap={10}>
                                    <Button
                                        appearance="neutral"
                                        mode="secondary"
                                        size="medium"
                                        onClick={() => navigate('/student')}
                                    >
                                        Назад
                                    </Button>
                                    <Button
                                        appearance="neutral"
                                        mode="secondary"
                                        size="medium"
                                        onClick={() => {
                                            // Clear student ID from localStorage
                                            localStorage.removeItem('studentId');
                                            // Clear auth token
                                            clearAuthToken();
                                            // Redirect to login page
                                            navigate('/student/login');
                                        }}
                                    >
                                        Выйти
                                    </Button>
                                </Flex>
                            </Flex>
                            
                            {/* Student Info Card */}
                            {studentData && (
                                <div
                                    style={{
                                        padding: '24px',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--color-background-primary)',
                                        width: '100%',
                                        maxWidth: '800px'
                                    }}
                                >
                                    <Flex direction="column" gap={16}>
                                        <Typography.Headline variant="large-strong">
                                            Личная информация
                                        </Typography.Headline>
                                        
                                        <Flex direction="column" gap={12}>
                                            <Typography.Headline variant="medium">
                                                ФИО: {studentData.name}
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium">
                                                Факультет: {studentData.faculty}
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium">
                                                Курс и группа: {studentData.courseWithGroup}
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium">
                                                Телефон: {studentData.contactPhone}
                                            </Typography.Headline>
                                        </Flex>
                                    </Flex>
                                </div>
                            )}
                            
                            {/* Applications Section */}
                            <Flex direction="column" gap={12} style={{ width: '100%', maxWidth: '800px' }}>
                                <Typography.Headline variant='large-strong'>
                                    Мои заявления
                                </Typography.Headline>
                                
                                {loading ? (
                                    <Typography.Headline variant="medium">
                                        Загрузка...
                                    </Typography.Headline>
                                ) : applications.length === 0 ? (
                                    <Typography.Headline variant="medium">
                                        У вас пока нет поданных заявлений
                                    </Typography.Headline>
                                ) : (
                                    <CellList filled mode="island" style={{ width: '100%' }}>
                                        {applications.map((app) => (
                                            <CellSimple
                                                key={app.id}
                                                title={`${getTypeText(app.type)} №${app.id}`}
                                                subtitle={
                                                    <Flex direction="column" gap={4}>
                                                        <Typography.Body variant="secondary">
                                                            Дата подачи: {new Date(app.timestamp).toLocaleDateString()}
                                                        </Typography.Body>
                                                        <Typography.Body variant="secondary">
                                                            Статус: {getStatusText(app.status)}
                                                        </Typography.Body>
                                                        {app.reason && (
                                                            <Typography.Body variant="secondary">
                                                                Причина: {app.reason}
                                                            </Typography.Body>
                                                        )}
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
                                                        {app.passSerial && (
                                                            <Typography.Body variant="secondary">
                                                                Паспорт: {app.passSerial}
                                                            </Typography.Body>
                                                        )}
                                                        {app.passPlace && (
                                                            <Typography.Body variant="secondary">
                                                                Выдан: {app.passPlace}
                                                            </Typography.Body>
                                                        )}
                                                        {app.registration && (
                                                            <Typography.Body variant="secondary">
                                                                Регистрация: {app.registration}
                                                            </Typography.Body>
                                                        )}
                                                    </Flex>
                                                }
                                            />
                                        ))}
                                    </CellList>
                                )}
                            </Flex>
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default StudentProfile;