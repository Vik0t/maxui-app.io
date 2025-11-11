import React, { useState } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button, Container, Flex, Typography, Grid } from "@maxhub/max-ui";
import { Link } from "react-router-dom";
import "../App.css"

const Login = () => {
    return (
        <div className="general">
        <MaxUI>
            <Panel centeredX centeredY style={{ height: '100vh' }}>
            <Container fullWidth={true}>
                <Grid rows={3} cols={1} gapY={15} className="loginGrid">
                    <Typography.Headline variant='large-strong'>
                        Доброго дня!
                    </Typography.Headline>
                    <Link to="/student" style={{ textDecoration: 'none'}}>
                        <Button
                            appearance="neutral"
                            mode="primary"
                            size="large"
                            stretched
                        >
                            Студент
                        </Button>
                    </Link>
                    <Link to="/dean/login" style={{ textDecoration: 'none'}}>
                        <Button
                            appearance="neutral"
                            mode="secondary"
                            size="large"
                            stretched
                        >
                            Деканат
                        </Button>
                    </Link>
                </Grid>
            </Container>
            </Panel>
        </MaxUI>
        </div>
    );
};

export default Login;