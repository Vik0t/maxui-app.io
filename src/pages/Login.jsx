import React, { useState } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Input } from "@maxhub/max-ui";
import { Link } from "react-router-dom";
import "../App.css"

const Login = () => {
    return (
        <div className="general"> {/* Changed 'class' to 'className' */}
        <MaxUI>
            <Panel centeredX centeredY style={{ height: '100vh' }}>
            <Container fullWidth={true}>
                <Flex direction="column" gap={12}>
                <Typography.Headline variant='large-strong'>
                    Доброго дня!
                </Typography.Headline>
                <Link to="/finance" style={{ textDecoration: 'none'}}>
                    <Button
                        appearance="neutral"
                        mode="primary"
                        size="large"
                        stretched
                    >
                        Пользователь
                    </Button>
                </Link>
                <Link to="/Deanery" style={{ textDecoration: 'none'}}>
                    <Button
                        appearance="neutral"
                        mode="secondary"
                        size="large"
                        stretched
                    >
                        Деканат
                    </Button>
                </Link>
                </Flex>
            </Container>
            </Panel>
        </MaxUI>
        </div>
    );
};

export default Login;