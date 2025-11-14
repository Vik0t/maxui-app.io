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
                        <div className="form-wrapper">
                            <Flex direction="column" gap={20} style={{ padding: '20px 0', alignItems: 'center' }}>
                                <Typography.Headline variant='large-strong' style={{ textAlign: 'center' }}>
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
                                        padding: '16px',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--color-background-primary)',
                                        width: '100%',
                                        maxWidth: '100%',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <Flex direction="column" gap={16}>
                                        <Typography.Headline variant="medium-strong" style={{ textAlign: 'center' }}>
                                            Личная информация
                                        </Typography.Headline>
                                        
                                        <Flex direction="column" gap={12}>
                                            <Typography.Body variant="primary" style={{ wordBreak: 'break-word' }}>
                                                <strong>ФИО:</strong> {studentData.name}
                                            </Typography.Body>
                                            <Typography.Body variant="primary" style={{ wordBreak: 'break-word' }}>
                                                <strong>Факультет:</strong> {studentData.faculty}
                                            </Typography.Body>
                                            <Typography.Body variant="primary" style={{ wordBreak: 'break-word' }}>
                                                <strong>Курс и группа:</strong> {studentData.courseWithGroup}
                                            </Typography.Body>
                                            <Typography.Body variant="primary" style={{ wordBreak: 'break-word' }}>
                                                <strong>Телефон:</strong> {studentData.contactPhone}
                                            </Typography.Body>
                                        </Flex>
                                    </Flex>
                                </div>
                            )}
                            
                            {/* Applications Section */}
                            <Flex direction="column" gap={12} style={{ width: '100%', maxWidth: '100%' }}>
                                <Typography.Headline variant='medium-strong' style={{ textAlign: 'center', padding: '0px 0px 0px 16px'}}>
                                    Мои заявления
                                </Typography.Headline>
                                
                                {loading ? (
                                    <Typography.Body variant="primary" style={{ textAlign: 'center' }}>
                                        Загрузка...
                                    </Typography.Body>
                                ) : applications.length === 0 ? (
                                    <Typography.Body variant="primary" style={{ textAlign: 'center' }}>
                                        У вас пока нет поданных заявлений
                                    </Typography.Body>
                                ) : (
                                    <CellList filled mode="island" style={{ width: '100%' }}>
                                        {applications.map((app) => (
                                            <CellSimple
                                                key={app.id}
                                                title={`${getTypeText(app.type)} №${app.id}`}
                                                subtitle={
                                                    <Flex direction="column" gap={4}>
                                                        <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                            <strong>Дата подачи:</strong> {new Date(app.timestamp).toLocaleDateString()}
                                                        </Typography.Body>
                                                        <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                            <strong>Статус:</strong> {getStatusText(app.status)}
                                                        </Typography.Body>
                                                        {app.reason && (
                                                            <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                                <strong>Причина:</strong> {app.reason}
                                                            </Typography.Body>
                                                        )}
                                                        {app.expenses && (
                                                            <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                                <strong>Расходы:</strong> {app.expenses} руб
                                                            </Typography.Body>
                                                        )}
                                                        {app.additional_info && (
                                                            <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                                <strong>Дополнительная информация:</strong> {app.additional_info}
                                                            </Typography.Body>
                                                        )}
                                                        {app.passSerial && (
                                                            <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                                <strong>Паспорт:</strong> {app.passSerial}
                                                            </Typography.Body>
                                                        )}
                                                        {app.passPlace && (
                                                            <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                                <strong>Выдан:</strong> {app.passPlace}
                                                            </Typography.Body>
                                                        )}
                                                        {app.registration && (
                                                            <Typography.Body variant="secondary" style={{ wordBreak: 'break-word' }}>
                                                                <strong>Регистрация:</strong> {app.registration}
                                                            </Typography.Body>
                                                        )}
                                                    </Flex>
                                                }
                                            />
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

export default StudentProfile;