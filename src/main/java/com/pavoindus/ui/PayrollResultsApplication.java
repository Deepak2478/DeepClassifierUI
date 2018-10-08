package com.pavoindus.ui;

import com.pavoindus.authentication.AuthenticationApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import com.pavoindus.authentication.context.ApplicationContext;

@SpringBootApplication
public class PayrollResultsApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(PayrollResultsApplication.class);
    }

    public static void main(String[] args) throws Exception {
        ApplicationContext.init();
        SpringApplication.run(PayrollResultsApplication.class, args);
        //SpringApplication.run(AuthenticationApplication.class, args);
    }
}
