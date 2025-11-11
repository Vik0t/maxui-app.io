import React from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography } from "@maxhub/max-ui";
import { Link } from "react-router-dom";
import "../App.css";

const StudentBoard = () => {
    return (
        <div className="general">
            <MaxUI>
                <Panel centeredX centeredY style={{ height: '100vh' }}>
                    <Container fullWidth={true}>
                        <Flex direction="column" gap={20}>
                            <Typography.Headline variant='large-strong'>
                                Панель студента
                            </Typography.Headline>
                            
                            <Flex direction="column" gap={16} wrap="wrap">
                                <Link to="/finance" style={{ textDecoration: 'none'}}>
                                    <Button
                                        appearance="neutral"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                        className="studentBoardButton"
                                    >
                                        Подать заявление на матпомощь
                                    </Button>
                                </Link>
                                
                                <Link to="/certificate" style={{ textDecoration: 'none'}}>
                                    <Button
                                        appearance="neutral"
                                        mode="secondary"
                                        size="large"
                                        stretched
                                        className="studentBoardButton"
                                    >
                                        Заявление на справку об обучении
                                    </Button>
                                </Link>
                            </Flex>
                        </Flex>
                    </Container>
                </Panel>
            </MaxUI>
        </div>
    );
};

export default StudentBoard;
