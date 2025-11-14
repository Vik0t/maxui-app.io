import React, { useState, useEffect, useRef } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input, Grid } from "@maxhub/max-ui";
import { addApplication, getStudentById } from "../utils/api";
import "../App.css";
import CustomDropdown from "./FinanceDropdown";

const FinanceSchema = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: 'financial_aid',
        name: '',
        faculty: '',
        courseWithGroup: '',
        contactPhone: '',
        
        passSerial: '',
        passPlace: '',
        registration: '',
        
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
                type: 'financial_aid',
                name: formData.name,
                reason: formData.reason,
                documents: formData.documents,
                expenses: formData.expenses,
                additional_info: `Паспорт: ${formData.passSerial}, Выдан: ${formData.passPlace}, Регистрация: ${formData.registration}, Документы: ${formData.documents}`,
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
                            <div className={`progress-step ${step >= 1 ? "active": ""}`}/>
                            <div className={`progress-step ${step >= 2 ? "active": ""}`}/>
                            <div className={`progress-step ${step >= 3 ? "active": ""}`}/>
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
                                    nextStep={nextStep}
                                    prevStep={prevStep}
                                />
                            )}

                            {step === 3 && (
                                <Step3
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
                <Flex direction="column" gap={12} align="center">
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
                            className="financeInput"
                        />
                    </div>
                    <div className="button-wrapper">
                        <Button
                            appearance="themed"
                            mode="primary"
                            size="medium"
                            className="financeButton"
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

const Step2 = ({ formData, handleChange, nextStep, prevStep }) => {
    const canProceed = formData.passSerial && formData.passPlace && formData.registration;

    return (
        <div className="step">
            <div className="form-wrapper">
                <Flex direction="column" gap={12} align="center">
                    <Typography.Headline variant="medium-strong">
                        Данные паспорта
                    </Typography.Headline>
                    
                    <div className="input-wrapper">
                        <Input
                            value={formData.passSerial}
                            onChange={handleChange}
                            name="passSerial"
                            mode="secondary"
                            placeholder="Введите серию и номер паспорта через пробел"
                            required
                            className="financeInput"
                        />
                    </div>
                    <div className="input-wrapper">
                        <Input
                            value={formData.passPlace}
                            onChange={handleChange}
                            name="passPlace"
                            mode="secondary"
                            placeholder="Кем и когда выдан"
                            required
                            className="financeInput"
                        />
                    </div>
                    <div className="input-wrapper">
                        <Input
                            value={formData.registration}
                            onChange={handleChange}
                            name="registration"
                            mode="secondary"
                            placeholder="Адрес регистрации"
                            required
                            className="financeInput"
                        />
                    </div>
                    <div className="button-grid">
                        <Button
                            appearance="neutral"
                            mode="secondary"
                            className="financeButton"
                            onClick={prevStep}
                        >
                            Назад
                        </Button>
                        <Button
                            appearance="themed"
                            mode="primary"
                            className="financeButton"
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

const Step3 = ({ formData, handleChange, prevStep, handleSubmit}) => {
    const canProceed = formData.reason && formData.documents;

    return (
        <div className="step">
            <div className="form-wrapper">
                <Flex direction="column" gap={12} align="center">
                    <Typography.Headline variant="medium-strong">
                        Документы
                    </Typography.Headline>
                    
                    <div className="input-wrapper">
                        <CustomDropdown
                            onChange={handleChange}
                            name="reason"
                            initialSelectedOption={formData.reason}
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

                    <div className="button-grid">
                        <Button
                            appearance="neutral"
                            mode="secondary"
                            size="medium"
                            className="financeButton"
                            onClick={prevStep}
                        >
                            Назад
                        </Button>
                        <Button
                            appearance="themed"
                            mode="primary"
                            size="medium"
                            className="financeButton"
                            onClick={handleSubmit}
                            disabled={!canProceed}
                        >
                            Отправить
                        </Button>
                    </div>
                </Flex>
            </div>
        </div>
    );
};

export default FinanceSchema;