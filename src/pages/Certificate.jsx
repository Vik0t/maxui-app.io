import React, { useState, useEffect } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input, Grid } from "@maxhub/max-ui";
import { addApplication, getStudentById } from "../utils/api";
import "../App.css";

const CertificateSchema = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: 'certificate',
        name: '',
        faculty: '',
        courseWithGroup: '',
        contactPhone: '',
        
        reason: '',
        documents: '',
        expenses: '',
        date: '',
        student_id: null // Will be set from authenticated student
    });
    
    // Load student data on component mount
    useEffect(() => {
        loadStudentData();
    }, []);
    
    const loadStudentData = async () => {
        try {
            // Get student ID from localStorage (set during login)
            const studentId = localStorage.getItem('studentId');
            if (studentId) {
                const student = await getStudentById(studentId);
                if (student) {
                    setFormData(prev => ({
                        ...prev,
                        name: student.name,
                        faculty: student.faculty,
                        courseWithGroup: student.course_with_group,
                        contactPhone: student.contact_phone,
                        student_id: student.id.toString()
                    }));
                }
            }
        } catch (error) {
            console.error('Error loading student data:', error);
        }
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Save application to server
            const applicationData = {
                type: 'certificate',
                name: formData.name,
                reason: formData.reason,
                documents: formData.documents,
                expenses: formData.expenses,
                additional_info: formData.documents, // Using documents as additional_info
                student_id: formData.student_id,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            await addApplication(applicationData);
            
            console.log('Form submitted:', applicationData);
            alert('Заявление успешно отправлено!');
        } catch (error) {
            console.error('Error saving application:', error);
            alert('Ошибка при отправке заявления: ' + error.message);
        }
    };
    
    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                        <div className="progress-bar">
                            <div className={`progress-step ${step >= 1 ? "active": ""}`}>
                                <div className="step-number"/>
                            </div>
                            <div className={`progress-step ${step >= 2 ? "active": ""}`}>
                                <div className="step-number"/>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <Step1
                                    formData={formData}
                                    handleChange={handleChange}
                                    nextStep={nextStep}
                                />
                            )}

                            {step === 2 && (
                                <Step2
                                    formData={formData}
                                    handleChange={handleChange}
                                    prevStep={prevStep}
                                    handleSubmit={handleSubmit}
                                />
                            )}
                        </form>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

const Step1 = ({ formData, handleChange, nextStep }) => {
    const canProceed = formData.name && formData.faculty && formData.courseWithGroup && formData.contactPhone;

    return (
        <div className="step">
            <div className="form-wrapper">
                <Flex direction="column" gap={12}>
                    <Typography.Headline variant="medium-strong">
                        Основная информация
                    </Typography.Headline>
                    
                    <div className="input-wrapper">
                        <Input
                            value={formData.name}
                            onChange={handleChange}
                            name="name"
                            mode="secondary"
                            placeholder="Введите ФИО"
                            required
                            readOnly
                            className="financeInput"
                        />
                    </div>
                    <div className="input-wrapper">
                        <Input
                            value={formData.faculty}
                            onChange={handleChange}
                            name="faculty"
                            mode="secondary"
                            placeholder="Название факультета"
                            required
                            readOnly
                            className="financeInput"
                        />
                    </div>
                    <div className="input-wrapper">
                        <Input
                            value={formData.courseWithGroup}
                            onChange={handleChange}
                            name="courseWithGroup"
                            mode="secondary"
                            placeholder="Курс и номер группы через пробел"
                            required
                            readOnly
                            className="financeInput"
                        />
                    </div>
                    <div className="input-wrapper">
                        <Input
                            value={formData.contactPhone}
                            onChange={handleChange}
                            name="contactPhone"
                            mode="secondary"
                            placeholder="Номер контактного телефона"
                            required
                            readOnly
                            className="financeInput"
                        />
                    </div>
                    <div className="button-wrapper">
                        <Button
                            appearance="themed"
                            mode="primary"
                            size="medium"
                            stretched
                            onClick={nextStep}
                            disabled={!canProceed}
                        >
                            Далее
                        </Button>
                    </div>
                </Flex>
            </div>
        </div>
    );
};

const Step2 = ({ formData, handleChange, prevStep, handleSubmit }) => {
    const canProceed = formData.reason && formData.documents;

    return (
        <div className="step">
            <div className="form-wrapper">
                <Flex direction="column" gap={12}>
                    <Typography.Headline variant="medium-strong">
                        Документы
                    </Typography.Headline>
                    
                    <div className="input-wrapper">
                        <Input
                            value={formData.reason}
                            onChange={handleChange}
                            name="reason"
                            mode="secondary"
                            placeholder="Введите причину"
                            required
                            className="financeInput"
                        />
                    </div>
                    <div className="input-wrapper">
                        <Input
                            value={formData.expenses}
                            onChange={handleChange}
                            name="expenses"
                            mode="secondary"
                            placeholder="Введите сумму расходов (если применимо)"
                            type="number"
                            className="financeInput"
                        />
                    </div>
                    <div className="input-wrapper">
                        <Input
                            value={formData.documents}
                            onChange={handleChange}
                            name="documents"
                            mode="secondary"
                            placeholder="Прикрепите документы"
                            required
                            className="financeInput"
                        />
                    </div>
                    <Grid rows={1} cols={2} gapX={15} className="financeGrid">
                        <div className="button-wrapper">
                            <Button
                                appearance="themed"
                                mode="primary"
                                size="medium"
                                stretched
                                onClick={prevStep}
                            >
                                Назад
                            </Button>
                        </div>
                        <div className="button-wrapper">
                            <Button
                                appearance="themed"
                                mode="primary"
                                size="medium"
                                stretched
                                onClick={handleSubmit}
                                disabled={!canProceed}
                            >
                                Отправить
                            </Button>
                        </div>
                    </Grid>
                </Flex>
            </div>
        </div>
    );
};

export default CertificateSchema;