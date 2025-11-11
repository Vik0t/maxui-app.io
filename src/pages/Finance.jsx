import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input, Grid } from "@maxhub/max-ui";
import { addApplication } from "../utils/api";
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
            <Flex direction="column" gap={12}>
                <Typography.Headline variant="medium-strong">
                    Основная информация
                </Typography.Headline>
                
                <Input
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    mode="secondary"
                    placeholder="Введите ФИО"
                    required
                    className="financeInput"
                />
                <Input
                    value={formData.faculty}
                    onChange={handleChange}
                    name="faculty"
                    mode="secondary"
                    placeholder="Название факультета"
                    required
                    className="financeInput"
                />
                <Input
                    value={formData.courseWithGroup}
                    onChange={handleChange}
                    name="courseWithGroup"
                    mode="secondary"
                    placeholder="Курс и номер группы через пробел"
                    required
                    className="financeInput"
                />
                <Input
                    value={formData.contactPhone}
                    onChange={handleChange}
                    name="contactPhone"
                    mode="secondary"
                    placeholder="Номер контактного телефона"
                    required
                    className="financeInput"
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
                    value={formData.passSerial}
                    onChange={handleChange}
                    name="passSerial"
                    mode="secondary"
                    placeholder="Введите серию и номер паспорта через пробел"
                    required
                    className="financeInput"
                />
                <Input
                    value={formData.passPlace}
                    onChange={handleChange}
                    name="passPlace"
                    mode="secondary"
                    placeholder="Кем и когда выдан"
                    required
                    className="financeInput"
                />
                <Input
                    value={formData.registration}
                    onChange={handleChange}
                    name="registration"
                    mode="secondary"
                    placeholder="Адрес регистрации"
                    required
                    className="financeInput"
                />
                <Grid rows={1} cols={2} gapX={15} className="financeGrid">
                    <Button
                        appearance="themed"
                        mode="primary"
                        stretched
                        onClick={prevStep}
                    >
                        Назад
                    </Button>
                    <Button
                        appearance="themed"
                        mode="primary"
                        stretched
                        onClick={nextStep}
                        disabled={!canProceed}
                    >
                        Далее
                    </Button>
                </Grid>
            </Flex>
        </div>
    );
};

const Step3 = ({ formData, handleChange, prevStep, handleSubmit}) => {
    const canProceed = formData.reason && formData.documents;
    const today = new Date();
    formData.date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    return (
        <div className="step">
            <Flex direction="column" gap={12}>
                <Typography.Headline variant="medium-strong">
                    Документы
                </Typography.Headline>
                
                <CustomDropdown 
                    onChange={handleChange} 
                    name="reason" 
                    initialSelectedOption={formData.reason} 
                />
        
                <Input
                    value={formData.expenses}
                    onChange={handleChange}
                    name="expenses"
                    mode="secondary"
                    placeholder="Введите сумму расходов (если применимо)"
                    type="number"
                    className="financeInput"
                />

                <Input
                    onChange={handleChange}
                    name="documents"
                    mode="secondary"
                    placeholder="Прикрепите документы"
                    required
                    className="financeInput"
                />

                <Grid rows={1} cols={2} gapX={15} className="financeGrid">
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
                </Grid>
            </Flex>
        </div>
    );
};

export default FinanceSchema;