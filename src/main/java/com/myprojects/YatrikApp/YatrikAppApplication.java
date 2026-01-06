package com.myprojects.YatrikApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.myprojects.YatrikApp")
@EnableScheduling
public class YatrikAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(YatrikAppApplication.class, args);
	}

}
