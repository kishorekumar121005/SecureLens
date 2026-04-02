package com.securelens.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class SecureLensApplication {

    private static final Logger logger = LoggerFactory.getLogger(SecureLensApplication.class);

    public static void main(String[] args) {

        // Run the Spring Boot application and capture environment
        var app = SpringApplication.run(SecureLensApplication.class, args);

        // 🆕 Get environment to read active port and profile
        Environment env = app.getEnvironment();
        String port = env.getProperty("server.port", "8080");
        String profile = env.getProperty("spring.profiles.active", "default");

        // ✅ Log startup banner using proper logger (not System.out.println)
        logger.info("""
                
                ╔══════════════════════════════════════════╗
                ║     SecureLens Backend Started 🔐        ║
                ║                                          ║
                ║   URL  : http://localhost:{}           ║
                ║   Profile : {}                      ║
                ╚══════════════════════════════════════════╝
                """, port, profile);
    }
}