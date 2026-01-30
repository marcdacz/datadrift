package com.datadrift;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class DataDriftApplication {

    private static final Logger LOG = LoggerFactory.getLogger(DataDriftApplication.class);

    public static void main(final String[] args) {
        SpringApplication.run(DataDriftApplication.class, args);
    }

    @Bean
    ApplicationRunner startupLogger(final Environment env) {
        return args -> {
            String port = env.getProperty("server.port", "8080");
            LOG.info("DataDrift backend started on port {}", port);
        };
    }
}
