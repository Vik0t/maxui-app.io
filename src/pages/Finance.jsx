import React, { useState } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input } from "@maxhub/max-ui";
import "../App.css";

const FinanceSchema = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: 'financial_aid',
        name: '',
        faculty: '',
        courseWithGroup: '',
        contactPhone: '',
        
        passSerial: '',
        passPlace: '', // Fixed: was passInfo, should be passPlace
        registration: '',
        
        reason: '',
        documents: '',
        date: ''
    });

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
                ...formData
            };
            
            await addApplication(applicationData);
            
            console.log('Form submitted:', formData);
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
                                <div className="step-number">
                                    1
                                </div>
                            </div>
                            <div className={`progress-step ${step >= 2 ? "active": ""}`}>
                                <div className="step-number">
                                    2
                                </div>
                            </div>
                            <div className={`progress-step ${step >= 3 ? "active": ""}`}>
                                <div className="step-number">
                                    3
                                </div>
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
            <Flex direction="column" gap={12}>
                <Typography.Headline variant="medium-strong">
                    Основная информация
                </Typography.Headline>
                
                <Input
                    onChange={handleChange}
                    name="name"
                    mode="secondary"
                    placeholder="Введите ФИО"
                    required
                />
                <Input
                    onChange={handleChange}
                    name="faculty"
                    mode="secondary"
                    placeholder="Название факультета"
                    required
                />
                <Input
                    onChange={handleChange}
                    name="courseWithGroup"
                    mode="secondary"
                    placeholder="Курс и номер группы через пробел"
                    required
                />
                <Input
                    onChange={handleChange}
                    name="contactPhone"
                    mode="secondary"
                    placeholder="Номер контактного телефона"
                    required
                />
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
            </Flex>
        </div>
    );
};

const Step2 = ({ formData, handleChange, nextStep, prevStep }) => {
    const canProceed = formData.passSerial && formData.passPlace && formData.registration;

    return (
        <div className="step">
            <Flex direction="column" gap={12}>
                <Typography.Headline variant="medium-strong">
                    Данные паспорта
                </Typography.Headline>
                
                <Input
                    onChange={handleChange}
                    name="passSerial"
                    mode="secondary"
                    placeholder="Введите серию и номер паспорта через пробел"
                    required
                />
                <Input
                    onChange={handleChange}
                    name="passPlace"
                    mode="secondary"
                    placeholder="Кем и когда выдан"
                    required
                />
                <Input
                    onChange={handleChange}
                    name="registration"
                    mode="secondary"
                    placeholder="Адрес регистрации"
                    required
                />
                <Flex direction="row" gap={12}>
                    <Button
                        appearance="themed"
                        mode="primary"
                        size="medium"
                        stretched
                        onClick={prevStep}
                    >
                        Назад
                    </Button>
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
                </Flex>
            </Flex>
        </div>
    );
};

const Step3 = ({ formData, handleChange, prevStep, handleSubmit }) => {
    const canProceed = formData.reason && formData.documents;
    const today = new Date();
    formData.date = `${today.getDate}/${today.getMonth + 1}/${today.getFullYear}`;

    return (
        <div className="step">
            <Flex direction="column" gap={12}>
                <Typography.Headline variant="medium-strong">
                    Документы
                </Typography.Headline>
                
                <Input
                    onChange={handleChange}
                    name="reason"
                    mode="secondary"
                    placeholder="Введите причину"
                    required
                />
                <Input
                    onChange={handleChange}
                    name="documents"
                    mode="secondary"
                    placeholder="Прикрепите документы"
                    required
                />
                <Flex direction="row" gap={12}>
                    <Button
                        appearance="themed"
                        mode="primary"
                        size="medium"
                        stretched
                        onClick={prevStep}
                    >
                        Назад
                    </Button>
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
                </Flex>
            </Flex>
        </div>
    );
};

export default FinanceSchema;