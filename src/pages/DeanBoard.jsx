import React from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography } from "@maxhub/max-ui";
import { useNavigate } from "react-router-dom";
import "../App.css";

const DeanBoard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app, you would clear the user session here
        navigate('/');
    };

    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20}>
                            <Flex direction="row" justify="space-between" align="center">
                                <Typography.Headline variant='large-strong'>
                                    Панель деканата
                                </Typography.Headline>
                                <Button
                                    appearance="neutral"
                                    mode="secondary"
                                    size="medium"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </Button>
                            </Flex>
                            
                            <Flex direction="column" gap={16}>
                                <Typography.Headline variant="medium-strong">
                                    Заявки студентов
                                </Typography.Headline>
                                
                                <Flex direction="column" gap={12}>
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="large"
                                        stretched
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium-strong">
                                                Заявки на матпомощь
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                5
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                    
                                    <Button
                                        appearance="themed"
                                        mode="primary"
                                        size="large"
                                        stretched
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium-strong">
                                                Заявки на справки
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                12
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </Flex>
                            </Flex>
                            
                            <Flex direction="column" gap={16}>
                                <Typography.Headline variant="medium-strong">
                                    Статистика
                                </Typography.Headline>
                                
                                <Flex direction="column" gap={12}>
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium">
                                                Всего студентов
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                1,247
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                    
                                    <Button
                                        appearance="themed"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                    >
                                        <Flex direction="row" justify="space-between" align="center">
                                            <Typography.Headline variant="medium">
                                                Обработано заявок
                                            </Typography.Headline>
                                            <Typography.Headline variant="medium-strong">
                                                42
                                            </Typography.Headline>
                                        </Flex>
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default DeanBoard;